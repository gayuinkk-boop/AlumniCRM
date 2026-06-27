"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Building, GraduationCap, Send, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";
import { supabase } from "@/utils/supabase/client";
import WebScraperFinder from "@/app/components/WebScraperFinder";

export default function StudentNetworkPage() {
  const [search, setSearch] = useState("");
  const { addMentorshipRequest, verifiedAlumni } = useStore();
  const { profile, isMock } = useAuth();
  
  const [alumniList, setAlumniList] = useState([]);
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [activeTab, setActiveTab] = useState("directory"); // directory, scrape

  // AI query states
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiFilters, setAiFilters] = useState(null);

  useEffect(() => {
    async function loadAlumni() {
      if (isMock) {
        const formatted = verifiedAlumni.map(p => {
          const headlineStr = p.headline || "Alumni";
          const parts = headlineStr.split('@');
          const roleName = parts[0]?.trim() || p.current_role || "Alumni";
          const companyName = parts[1]?.trim() || p.current_company || p.industry || "Tech Partner";
          return {
            id: p.id,
            name: p.full_name,
            role: roleName,
            company: companyName,
            location: "Virtual / Hybrid",
            major: p.stream || p.industry || "Tech",
            year: p.graduation_year || "2022",
            skills: p.skills || [],
            category: p.alumni_category || "Alumni"
          };
        });
        setAlumniList(formatted);
        return;
      }
      if (!profile?.organization_id) return;
      setLoadingAlumni(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('organization_id', profile.organization_id)
          .eq('role', 'alumni')
          .eq('is_verified', true);
        if (!error && data) {
          const formatted = data.map(p => {
            // headline e.g. "Senior Engineer @ Google" or "UX Designer"
            const headlineStr = p.headline || "Alumni";
            const parts = headlineStr.split('@');
            const roleName = parts[0]?.trim() || "Alumni";
            const companyName = parts[1]?.trim() || p.industry || "Tech Partner";
            return {
              id: p.id,
              name: p.full_name,
              role: roleName,
              company: companyName,
              location: "Virtual / Hybrid",
              major: p.industry || "Tech",
              year: p.graduation_year || "2022",
              skills: p.skills || [],
              category: p.alumni_category || "Alumni"
            };
          });
          setAlumniList(formatted);
        }
      } catch (e) {
        console.error("Failed to fetch alumni directory:", e);
      } finally {
        setLoadingAlumni(false);
      }
    }
    loadAlumni();
  }, [profile, isMock, verifiedAlumni]);

  const handleRequestMentorship = async (alumniPerson) => {
    const defaultMsg = `Hi ${alumniPerson.name.split(' ')[0]}, I'd love to connect and learn about your experience at ${alumniPerson.company}!`;
    
    if (isMock) {
      await addMentorshipRequest({
        organization_id: profile?.organization_id || "mock-org-id",
        student_id: profile?.id || "mock-student-id",
        alumni_id: alumniPerson.id,
        name: profile?.full_name || "Jane Student",
        major: profile?.headline || "Computer Science '25",
        message: defaultMsg,
      });
      alert(`Mentorship request successfully sent to ${alumniPerson.name}!`);
      return;
    }

    const { error } = await addMentorshipRequest({
      organization_id: profile.organization_id,
      student_id: profile.id,
      alumni_id: alumniPerson.id,
      message: defaultMsg,
    });

    if (!error) {
      alert(`Mentorship request successfully sent to ${alumniPerson.name}!`);
    } else {
      alert(`Failed to send request: ${error.message}`);
    }
  };

  const handleAIQuery = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiFeedback("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "filter", query: aiQuery })
      });
      const data = await res.json();
      if (data.filters) {
        setAiFilters(data.filters);
        setAiFeedback(data.explanation || "AI search filters applied!");
      } else {
        setAiFilters(null);
        setAiFeedback("No filters could be identified. Try refining your request.");
      }
    } catch (err) {
      console.error(err);
      setAiFeedback("Failed to process request with AI.");
    } finally {
      setAiLoading(false);
    }
  };

  const filtered = alumniList.filter(a => {
    const matchesSearch = !search ? true : (
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.company.toLowerCase().includes(search.toLowerCase()) || 
      a.role.toLowerCase().includes(search.toLowerCase())
    );

    if (!matchesSearch) return false;

    if (aiFilters) {
      const { company, stream, category, startYear, endYear, skills, role } = aiFilters;

      if (company && !a.company.toLowerCase().includes(company.toLowerCase())) {
        return false;
      }
      if (category && (!a.category || !a.category.toLowerCase().includes(category.toLowerCase()))) {
        return false;
      }
      if (stream && (!a.major || !a.major.toLowerCase().includes(stream.toLowerCase()))) {
        return false;
      }
      if (role && (!a.role || !a.role.toLowerCase().includes(role.toLowerCase()))) {
        return false;
      }
      if (startYear) {
        const y = parseInt(a.year);
        if (isNaN(y) || y < parseInt(startYear)) return false;
      }
      if (endYear) {
        const y = parseInt(a.year);
        if (isNaN(y) || y > parseInt(endYear)) return false;
      }
      if (skills && skills.length > 0) {
        const profileSkillsLower = (a.skills || []).map(s => s.toLowerCase());
        const hasSkill = skills.some(s => profileSkillsLower.includes(s.toLowerCase()));
        if (!hasSkill) return false;
      }
    }

    return true;
  });

  return (
    <div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
        Alumni Directory
      </h1>
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Search and connect with alumni for mentorship and guidance.</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid #E5E7EB" }}>
        <button 
          onClick={() => setActiveTab("directory")}
          style={{ 
            background: "transparent", border: "none", padding: "12px 24px", cursor: "pointer",
            color: activeTab === "directory" ? "#D32F2F" : "#6B7280",
            borderBottom: activeTab === "directory" ? "2px solid #D32F2F" : "2px solid transparent",
            fontWeight: activeTab === "directory" ? 700 : 500, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "all 0.2s"
          }}
        >
          Alumni Directory
        </button>
        <button 
          onClick={() => setActiveTab("scrape")}
          style={{ 
            background: "transparent", border: "none", padding: "12px 24px", cursor: "pointer",
            color: activeTab === "scrape" ? "#D32F2F" : "#6B7280",
            borderBottom: activeTab === "scrape" ? "2px solid #D32F2F" : "2px solid transparent",
            fontWeight: activeTab === "scrape" ? 700 : 500, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
            display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s"
          }}
        >
          <Sparkles size={14} />
          Web Scraper & Finder
        </button>
      </div>

      {activeTab === "directory" ? (
        <>
          {/* AI Assistant Search Bar */}
          <div style={{
            background: "linear-gradient(135deg, rgba(211, 47, 47, 0.03), rgba(183, 28, 28, 0.05))",
            border: "1px solid rgba(211, 47, 47, 0.15)",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 4px 16px rgba(211, 47, 47, 0.03)",
            marginBottom: 24
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  background: "rgba(211, 47, 47, 0.08)",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#D32F2F"
                }}>
                  <Sparkles size={14} />
                </div>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>AI Natural Language Query Search</h3>
                  <p style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>
                    Search for companies, graduation years, streams, mentorship status, or skills in plain English.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.12)", padding: "4px 10px", borderRadius: 8, fontSize: 10, color: "#4f46e5", fontWeight: 700 }}>
                <Sparkles size={10} /> Powered by Google Gemini
              </div>
            </div>

            <form onSubmit={handleAIQuery} style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  placeholder="e.g., 'Show NVIDIA mentors who know CUDA' or 'Find Amazon developers'"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "10px 14px",
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    color: "#111827",
                    fontSize: 13,
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>
              <button
                type="submit"
                disabled={aiLoading}
                style={{
                  background: "linear-gradient(135deg, #D32F2F, #B71C1C)",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "0 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s"
                }}
              >
                {aiLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                Search
              </button>
            </form>

            {aiFeedback && (
              <div style={{
                marginTop: 12,
                padding: "8px 12px",
                borderRadius: 6,
                background: "rgba(211, 47, 47, 0.05)",
                border: "1px solid rgba(211, 47, 47, 0.1)",
                fontSize: 12,
                color: "#C62828",
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{aiFeedback}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAiFeedback("");
                    setAiQuery("");
                    setAiFilters(null);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#D32F2F",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={18} color="#6B7280" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" placeholder="Search by name, company, or role..." 
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "14px 16px 14px 44px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, color: "#111827", fontSize: 14, outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>
          </div>

          {loadingAlumni ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
              <Loader2 size={36} color="#D32F2F" className="animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#6B7280", fontWeight: 500 }}>
              No alumni profiles found matching your query.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
              {filtered.map(person => (
                <div key={person.id} className="glass-widget" style={{ borderRadius: 20, padding: 24, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(211, 47, 47, 0.08)", border: "1px solid rgba(211, 47, 47, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#D32F2F", fontWeight: 800 }}>
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{person.name}</h3>
                      <div style={{ fontSize: 13, color: "#D32F2F", fontWeight: 600 }}>{person.role}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4B5563", fontSize: 13, fontWeight: 500 }}>
                      <Building size={16} color="#6B7280" /> {person.company}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4B5563", fontSize: 13, fontWeight: 500 }}>
                      <MapPin size={16} color="#6B7280" /> {person.location}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4B5563", fontSize: 13, fontWeight: 500 }}>
                      <GraduationCap size={16} color="#6B7280" /> {person.major} &apos;{person.year.slice(-2)}
                    </div>
                    {person.skills && person.skills.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {person.skills.map((s, idx) => (
                          <span key={idx} style={{ fontSize: 10, background: "#F3F4F6", color: "#4B5563", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button onClick={() => handleRequestMentorship(person)} style={{ 
                    width: "100%", background: "linear-gradient(135deg, #D32F2F, #B71C1C)", border: "none", color: "#fff", 
                    padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Send size={16} />
                    Request Mentorship
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <WebScraperFinder 
          onImportComplete={async () => {
            setActiveTab("directory");
          }} 
          allowedRole="alumni" 
        />
      )}
    </div>
  );
}
