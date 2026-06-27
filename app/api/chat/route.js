import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client (requires GEMINI_API_KEY in .env.local)
const ai = new GoogleGenAI({});

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, query, messages = [], availableFilters } = body;
    
    // Check if the API key is configured
    if (!process.env.GEMINI_API_KEY) {
      if (type === "filter") {
        return NextResponse.json({ 
          filters: {}, 
          explanation: "GEMINI_API_KEY is not configured in .env.local. Please add it to use the AI filter." 
        });
      }
      return NextResponse.json({ 
        reply: "Error: GEMINI_API_KEY is not configured in `.env.local`. Please add your Google Gemini API key to enable the AI assistant." 
      });
    }

    // ── 1. FILTER EXTRACTION (Structured Output) ──
    if (type === "filter") {
      const queryText = query || messages[messages.length - 1]?.content || "";
      
      let availableContext = "";
      if (availableFilters) {
        availableContext = `
Available values in the database for mapping:
- Companies: ${JSON.stringify(availableFilters.companies || [])}
- Streams: ${JSON.stringify(availableFilters.streams || [])}
- Categories: ${JSON.stringify(availableFilters.categories || [])}

When extracting the filters, try to map the user's input to the closest matching string from these available lists.
For example:
- If the user says "CS" or "IT" and there is a matching stream in the Streams list (e.g. "Computer Science" or "Information Technology"), select that EXACT value.
- If the user says "Google" or "Amazon" and "Google" or "Amazon" is in the Companies list, map to that value.
- If the user specifies a category like "Mentor" or "working", map to the closest value in the Categories list (e.g. "Mentor" or "Working Professional").
- If no close match is found in the list, you can still extract the raw term from the query.
`;
      }
      
      const prompt = `
You are an AI assistant that extracts structured filters from natural language queries for an Alumni CRM.
Extract the following fields if present in the user's query:
- company: string (e.g. "Google", "Amazon")
- stream: string (e.g. "Computer Science", "Information Technology", "Electronics")
- category: string (e.g. "Working Professional", "Higher Studies", "Mentor", "Entrepreneur", "Faculty")
- startYear: string (e.g. "2020")
- endYear: string (e.g. "2024")
- role: string (e.g. "Software Engineer", "Product Manager")
- search: string (Any other general search term, keyword, name, or role that does not map directly to the categories above)

${availableContext}

If the user query is very short (e.g., a single word or abbreviation like "Google", "CS", "2021", "Mentor"), classify and extract it into the most appropriate field.
If you cannot find a field, omit it. Return the output as JSON.

User Query: "${queryText}"
`;

      const requestOptions = {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              filters: {
                type: "OBJECT",
                properties: {
                  company: { type: "STRING" },
                  stream: { type: "STRING" },
                  category: { type: "STRING" },
                  startYear: { type: "STRING" },
                  endYear: { type: "STRING" },
                  role: { type: "STRING" },
                  search: { type: "STRING" }
                }
              },
              explanation: {
                type: "STRING",
                description: "A short, friendly sentence explaining what filters were extracted."
              }
            },
            required: ["filters", "explanation"]
          }
        }
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          ...requestOptions
        });
      } catch (err) {
        console.warn("gemini-2.5-flash failed, trying fallback gemini-2.0-flash...", err);
        try {
          response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            ...requestOptions
          });
        } catch (err2) {
          console.warn("gemini-2.0-flash failed, trying fallback gemini-1.5-flash...", err2);
          response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            ...requestOptions
          });
        }
      }

      const result = JSON.parse(response.text);
      return NextResponse.json(result);
    }

    // ── 2. GENERAL CHATBOT ──
    const systemInstruction = `
You are the AlumniCRM AI Assistant. You help users navigate the platform, understand its features, and answer questions about the system architecture.
Be helpful, concise, and professional. Use markdown formatting.

Key Platform Info:
- Tech Stack: Next.js, Vercel, Supabase (PostgreSQL, Auth, Edge Functions), Cloudflare WAF.
- Security: Multi-tenant isolation via Row Level Security (RLS) using organization_id.
- Portals: Student, Alumni, and Admin (separated by subdomain).
- Features: LinkedIn Auto-Sync (via Proxycurl), Semantic Directory Search, Mentorship Requests, and Job Postings.
`;

    // Convert messages array to Gemini format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // If no messages were passed but there's a query, format it as a user message
    if (formattedMessages.length === 0 && query) {
      formattedMessages.push({ role: "user", parts: [{ text: query }] });
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedMessages,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });
    } catch (err) {
      console.warn("gemini-2.5-flash failed, trying fallback gemini-2.0-flash...", err);
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: formattedMessages,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
          }
        });
      } catch (err2) {
        console.warn("gemini-2.0-flash failed, trying fallback gemini-1.5-flash...", err2);
        response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: formattedMessages,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
          }
        });
      }
    }

    return NextResponse.json({ reply: response.text });

  } catch (error) {
    console.error("LLM Error:", error);
    return NextResponse.json({ error: "Failed to process chat request." }, { status: 500 });
  }
}
