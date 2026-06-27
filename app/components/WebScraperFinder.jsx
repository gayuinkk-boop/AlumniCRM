"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";
import { 
  Globe, Sparkles, CheckCircle, RefreshCw, AlertCircle, 
  ChevronDown, ChevronUp, Briefcase, GraduationCap, Award, Import, Info
} from "lucide-react";

export default function WebScraperFinder({ onImportComplete, allowedRole = "alumni" }) {
  const { importAlumniFromCSV } = useStore();
  const { profile } = useAuth();
  
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("Extract all professional, career, education, and skills details of the person.");
  const [showOptions, setShowOptions] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [phase, setPhase] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [scrapedData, setScrapedData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const phases = [
    { text: "Spawning ScrapeGraphAI pipeline runner...", speed: 3000 },
    { text: "Loading target page in headless Playwright browser...", speed: 5000 },
    { text: "Extracting DOM and converting page HTML to clean text...", speed: 4000 },
    { text: "Gemini analyzing content and mapping structured profile...", speed: 6000 },
    { text: "Validating output against schema requirements...", speed: 3000 }
  ];

  const examples = [
    { name: "Author Projects Portfolio", url: "https://perinim.github.io/projects/" },
    { name: "Public Bio Page", url: "https://www.linkedin.com/in/williamhgates" }
  ];

  const runSimulation = (currentPhase) => {
    if (currentPhase >= phases.length) return;
    setPhase(currentPhase);
    const timeout = setTimeout(() => {
      runSimulation(currentPhase + 1);
    }, phases[currentPhase].speed);
    return timeout;
  };

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage("Please enter a valid URL.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");
    setScrapedData(null);
    setPhase(0);

    // Start simulated progress steps
    const simulationIntervals = [];
    let currentPhase = 0;
    
    const advancePhase = () => {
      if (currentPhase < phases.length - 1) {
        currentPhase++;
        setPhase(currentPhase);
        const timer = setTimeout(advancePhase, phases[currentPhase].speed);
        simulationIntervals.push(timer);
      }
    };
    const initialTimer = setTimeout(advancePhase, phases[0].speed);
    simulationIntervals.push(initialTimer);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, prompt })
      });

      // Clear all phase timers
      simulationIntervals.forEach(clearTimeout);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract web details.");
      }

      setScrapedData(data.profile);
      setStatus("success");
    } catch (err) {
      simulationIntervals.forEach(clearTimeout);
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred during scraping.");
    }
  };

  const handleImport = async () => {
    if (!scrapedData) return;
    setIsImporting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Map extracted profile from python to CRM import model
      const profileToImport = {
        full_name: scrapedData.full_name || "Discovered Professional",
        role: allowedRole,
        current_role: scrapedData.current_role || "Professional",
        current_company: scrapedData.current_company || "Company",
        headline: scrapedData.headline || `${scrapedData.current_role} @ ${scrapedData.current_company}`,
        industry: scrapedData.industry || "Tech",
        linkedin_url: url,
        stream: scrapedData.stream || "Computer Science",
        alumni_category: "Working Professional",
        graduation_year: scrapedData.graduation_year || new Date().getFullYear().toString(),
        bio: scrapedData.bio || "Extracted via ScrapeGraphAI web-scrape tool.",
        skills: scrapedData.skills || [],
        experience: scrapedData.experience || [],
        education: scrapedData.education || []
      };

      const organizationId = profile?.organization_id || "mock-org-id";
      // Import as verified directly
      const result = await importAlumniFromCSV([profileToImport], organizationId, true);

      if (result.error) {
        throw result.error;
      }

      setSuccessMessage(`Successfully imported ${profileToImport.full_name} into the CRM database!`);
      if (onImportComplete) {
        onImportComplete(profileToImport);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to import profile to the database.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E5E7EB",
      borderRadius: 24,
      padding: 32,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        .spin-loader { animation: spin 2s linear infinite; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .example-badge:hover {
          background-color: rgba(211, 47, 47, 0.08) !important;
          color: #B71C1C !important;
          border-color: #B71C1C !important;
        }
      `}</style>

      {/* Decorative Blur Blob */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, background: "radial-gradient(circle, rgba(211,47,47,0.03) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(211, 47, 47, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={20} color="#D32F2F" />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>ScrapeGraphAI Web Finder</h3>
            <p style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Search, scrape, and import professional pages directly using AI Graph pipelines</p>
          </div>
        </div>

        {status !== "loading" && (
          <form onSubmit={handleScrape} style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Webpage URL to Scrape</label>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                  <Globe size={16} color="#9CA3AF" style={{ position: "absolute", left: 12 }} />
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/profile or public bio page..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      background: "#F9FAFB",
                      border: "1px solid #D1D5DB",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#111827",
                      outline: "none"
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #D32F2F, #B71C1C)",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "0 20px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <Sparkles size={14} />
                  Scrape & Finder
                </button>
              </div>
            </div>

            {/* Examples */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>Test Examples:</span>
              {examples.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrl(ex.url)}
                  className="example-badge"
                  style={{
                    background: "#F3F4F6",
                    border: "1px solid #E5E7EB",
                    color: "#4B5563",
                    padding: "4px 10px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {ex.name}
                </button>
              ))}
            </div>

            {/* Prompt Customization Dropdown */}
            <div style={{ border: "1px solid #F3F4F6", borderRadius: 10, overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#F9FAFB",
                  border: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4B5563",
                  cursor: "pointer"
                }}
              >
                <span>Advanced Extraction Instructions</span>
                {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showOptions && (
                <div style={{ padding: 12, borderTop: "1px solid #F3F4F6" }}>
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 8,
                      fontSize: 12,
                      color: "#111827",
                      border: "1px solid #D1D5DB",
                      borderRadius: 6,
                      outline: "none",
                      resize: "none"
                    }}
                  />
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <Info size={10} /> Customize instructions to guide Gemini on specific fields or details to pay extra attention to.
                  </div>
                </div>
              )}
            </div>
          </form>
        )}

        {/* Loading / Scraping Phase */}
        {status === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", gap: 16 }}>
            <div style={{ position: "relative", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="spin-loader" style={{
                position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
                border: "4px solid rgba(211, 47, 47, 0.08)", borderTop: "4px solid #D32F2F"
              }} />
              <RefreshCw size={24} color="#D32F2F" className="spin-loader" />
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#D32F2F", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                Graph Execution Phase {phase + 1} of {phases.length}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", minHeight: 20 }}>
                {phases[phase].text}
              </div>
            </div>

            <div style={{ width: "100%", height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "linear-gradient(90deg, #D32F2F, #B71C1C)", borderRadius: 3,
                width: `${((phase + 1) / phases.length) * 100}%`, transition: "width 0.5s ease"
              }} />
            </div>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div style={{
            background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.15)",
            padding: 16, borderRadius: 12, color: "#EF4444", fontSize: 13, fontWeight: 500,
            display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20
          }}>
            <AlertCircle size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Extraction Failed</div>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Success / Result State */}
        {status === "success" && scrapedData && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {successMessage && (
              <div style={{
                background: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.15)",
                padding: 16, borderRadius: 12, color: "#10B981", fontSize: 13, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 8
              }}>
                <CheckCircle size={16} /> {successMessage}
              </div>
            )}

            {/* Extracted Profile Preview Card */}
            <div style={{
              background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 16, padding: 20
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                <div>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{scrapedData.full_name}</h4>
                  <p style={{ fontSize: 14, color: "#D32F2F", fontWeight: 600, marginTop: 2 }}>{scrapedData.headline || "No Headline Found"}</p>
                  <p style={{ fontSize: 12, color: "#6B7280", fontWeight: 500, marginTop: 4 }}>Industry: {scrapedData.industry || "Tech"}</p>
                </div>
                {!successMessage && (
                  <button
                    onClick={handleImport}
                    disabled={isImporting}
                    style={{
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: isImporting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    {isImporting ? <RefreshCw size={14} className="spin-loader" /> : <Import size={14} />}
                    Import to CRM
                  </button>
                )}
              </div>

              {scrapedData.bio && (
                <div style={{ marginBottom: 16 }}>
                  <h5 style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 4 }}>Bio</h5>
                  <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.5 }}>{scrapedData.bio}</p>
                </div>
              )}

              {scrapedData.skills && scrapedData.skills.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h5 style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 6 }}>Skills</h5>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {scrapedData.skills.map((skill, idx) => (
                      <span key={idx} style={{ fontSize: 10, background: "rgba(211, 47, 47, 0.04)", border: "1px solid rgba(211, 47, 47, 0.1)", color: "#D32F2F", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid for Experience & Education */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                {/* Experience */}
                {scrapedData.experience && scrapedData.experience.length > 0 && (
                  <div>
                    <h5 style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      <Briefcase size={12} /> Work Experience
                    </h5>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {scrapedData.experience.slice(0, 3).map((exp, idx) => (
                        <div key={idx} style={{ padding: "8px 12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8 }}>
                          <div style={{ fontWeight: 700, fontSize: 12, color: "#111827" }}>{exp.title}</div>
                          <div style={{ fontSize: 11, color: "#4B5563", fontWeight: 500 }}>{exp.company}</div>
                          <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{exp.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {scrapedData.education && scrapedData.education.length > 0 && (
                  <div>
                    <h5 style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      <GraduationCap size={12} /> Education
                    </h5>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {scrapedData.education.slice(0, 2).map((edu, idx) => (
                        <div key={idx} style={{ padding: "8px 12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8 }}>
                          <div style={{ fontWeight: 700, fontSize: 12, color: "#111827" }}>{edu.school}</div>
                          <div style={{ fontSize: 11, color: "#4B5563", fontWeight: 500 }}>{edu.degree} - {edu.stream}</div>
                          <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{edu.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setStatus("idle");
                setScrapedData(null);
                setSuccessMessage("");
              }}
              style={{
                background: "transparent", border: "1px solid #E5E7EB", color: "#4B5563",
                padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", alignSelf: "center"
              }}
            >
              Scrape Another Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
