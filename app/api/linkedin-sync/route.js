import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { PDFParse } from "pdf-parse";

// Initialize Gemini client
const ai = new GoogleGenAI({});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: "GEMINI_API_KEY is not configured in .env.local. Please add your Google Gemini API key to enable LinkedIn parsing." 
      }, { status: 500 });
    }

    // Convert the File object to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF text
    let pdfData;
    try {
      const parser = new PDFParse({ data: buffer });
      pdfData = await parser.getText();
    } catch (err) {
      console.error("PDF parsing error:", err);
      return NextResponse.json({ error: "Failed to parse the PDF file. Ensure it is a valid LinkedIn export." }, { status: 400 });
    }

    const extractedText = pdfData.text;

    // Use Gemini to extract the structured Profile schema
    const prompt = `
You are an expert data extractor. The following text is an export from a LinkedIn profile PDF.
Extract the user's professional information and map it EXACTLY to this JSON schema.
If a field cannot be determined, use an empty string or empty array.
If the profile shows multiple jobs or education entries, include them in the arrays, ordered from newest to oldest.

Schema requirements:
- "headline": The professional headline.
- "industry": Try to infer the industry (e.g. "Tech", "Education", "Healthcare").
- "bio": The "About" or Summary section text.
- "skills": An array of string skill names.
- "current_company": The company name of their most recent or current job.
- "current_role": The job title of their most recent or current job.
- "experience": Array of objects { "title": "", "company": "", "duration": "", "description": "" }
- "education": Array of objects { "school": "", "degree": "", "stream": "", "duration": "" }
- "stream": The major/field of study of their most recent education (e.g. "Computer Science").
- "graduation_year": The end year of their most recent education (e.g. "2024").

LinkedIn Profile Text:
======================
${extractedText}
======================
`;

    let response;
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                headline: { type: "STRING" },
                industry: { type: "STRING" },
                bio: { type: "STRING" },
                skills: { type: "ARRAY", items: { type: "STRING" } },
                current_company: { type: "STRING" },
                current_role: { type: "STRING" },
                experience: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING" },
                      company: { type: "STRING" },
                      duration: { type: "STRING" },
                      description: { type: "STRING" }
                    }
                  }
                },
                education: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      school: { type: "STRING" },
                      degree: { type: "STRING" },
                      stream: { type: "STRING" },
                      duration: { type: "STRING" }
                    }
                  }
                },
                stream: { type: "STRING" },
                graduation_year: { type: "STRING" }
              },
              required: ["headline", "industry", "bio", "skills", "current_company", "current_role", "experience", "education", "stream", "graduation_year"]
            }
          }
        });
        break;
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        console.warn(`Gemini generation failed, retrying in ${delay}ms... (Error: ${err.message})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }

    const parsedData = JSON.parse(response.text);

    // Map extracted data to our final Profile schema updates
    const mappedProfile = {
      is_verified: true,
      headline: parsedData.headline || "",
      industry: parsedData.industry || "Tech",
      bio: parsedData.bio || "",
      skills: parsedData.skills || [],
      current_company: parsedData.current_company || "",
      current_role: parsedData.current_role || "",
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      stream: parsedData.stream || "",
      graduation_year: parsedData.graduation_year || ""
    };

    return NextResponse.json({ profile: mappedProfile });

  } catch (error) {
    console.error("LinkedIn PDF Parse Error:", error);
    return NextResponse.json({ error: error.message || "An error occurred while analyzing the LinkedIn PDF." }, { status: 500 });
  }
}
