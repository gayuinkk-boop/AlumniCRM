"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";
import { Search, MapPin, Building, GraduationCap, X, Briefcase, ChevronRight, Award, Sparkles } from "lucide-react";

export default function FacultyNetworkPage() {
  const { verifiedAlumni, fetchVerifiedAlumni } = useStore();
  const { profile, isMock } = useAuth();
  
  // Search and filter states
  const [search, setSearch] = useState("");
  const [selectedStream, setSelectedStream] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Slide-over drawer state
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isMock && profile?.organization_id) {
      fetchVerifiedAlumni(profile.organization_id);
    }
  }, [profile, fetchVerifiedAlumni, isMock]);

  // Extract unique streams and categories for filters
  const streams = ["All", ...new Set(verifiedAlumni.map(a => a.stream).filter(Boolean))];
  const categories = ["All", ...new Set(verifiedAlumni.map(a => a.alumni_category).filter(Boolean))];

  // Filtered list
  const filtered = verifiedAlumni.filter(a => {
    const matchesSearch = 
      a.full_name.toLowerCase().includes(search.toLowerCase()) || 
      (a.current_role && a.current_role.toLowerCase().includes(search.toLowerCase())) ||
      (a.current_company && a.current_company.toLowerCase().includes(search.toLowerCase()));
      
    const matchesStream = selectedStream === "All" || a.stream === selectedStream;
    const matchesCategory = selectedCategory === "All" || a.alumni_category === selectedCategory;

    return matchesSearch && matchesStream && matchesCategory;
  });

  const openProfileMirror = (alumni) => {
    setSelectedAlumni(alumni);
    setIsDrawerOpen(true);
  };

  const closeProfileMirror = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedAlumni(null), 300);
  };

  return (
    <div style={{ position: "relative", minHeight: "100%" }}>
      <style>{`
        .alumni-card { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .alumni-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); border-color: rgba(0, 119, 181, 0.2); }
        .drawer-overlay { transition: opacity 0.3s ease; opacity: 0; pointer-events: none; }
        .drawer-overlay.open { opacity: 1; pointer-events: auto; }
        .drawer-content { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform: translateX(100%); }
        .drawer-content.open { transform: translateX(0); }
        .timeline-badge { position: relative; }
        .timeline-badge::after { content: ''; position: absolute; top: 24px; bottom: -24px; left: 11px; width: 2px; background: #E5E7EB; }
        .timeline-item:last-child .timeline-badge::after { display: none; }
      `}</style>

      {/* Header */}
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
        VSIT Department Directory
      </h1>
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Audit graduate careers, inspect verified student-alumni timelines, and facilitate research alignments.</p>

      {/* Main Container */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        
        {/* Filters */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
          <div style={{ position: "relative" }}>
            <Search size={18} color="#6B7280" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text" placeholder="Search by graduate name, company, role..." 
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 12px 12px 42px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, color: "#111827", fontSize: 13, outline: "none", transition: "all 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#0077B5"}
              onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
            />
          </div>

          <div>
            <select
              value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, color: "#111827", fontSize: 13, outline: "none" }}
            >
              <option value="All">Filter by Stream (All)</option>
              {streams.filter(s => s !== "All").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, color: "#111827", fontSize: 13, outline: "none" }}
            >
              <option value="All">Filter by Category (All)</option>
              {categories.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280", fontWeight: 500 }}>
            No directory profiles matched your queries.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filtered.map(person => (
              <div key={person.id} className="alumni-card" style={{
                background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 20,
                display: "flex", flexDirection: "column", cursor: "pointer"
              }} onClick={() => openProfileMirror(person)}>
                
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,119,181,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0077B5", fontWeight: 800, fontSize: 16 }}>
                    {person.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{person.full_name}</h3>
                    <span style={{ fontSize: 10, background: "rgba(0,119,181,0.08)", color: "#0077B5", fontWeight: 700, padding: "2px 6px", borderRadius: 4, textTransform: "uppercase", display: "inline-block", marginTop: 2 }}>
                      {person.alumni_category || "Alumni"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#4B5563", fontWeight: 500, flex: 1, marginBottom: 16 }}>
                  {person.current_role && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Building size={14} color="#9CA3AF" />
                      <span>{person.current_role} @ <strong>{person.current_company}</strong></span>
                    </div>
                  )}
                  {person.stream && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <GraduationCap size={14} color="#9CA3AF" />
                      <span>{person.stream} {person.graduation_year ? `'${person.graduation_year.slice(-2)}` : ""}</span>
                    </div>
                  )}
                </div>

                <button style={{
                  width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", background: "#F9FAFB", borderRadius: 8,
                  fontSize: 12, fontWeight: 700, color: "#4B5563", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", pointerEvents: "none"
                }}>
                  Inspect Timeline <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── PROFILE TIMELINE DRAWER ── */}
      <div 
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          zIndex: 9990
        }}
        onClick={closeProfileMirror}
      />

      <div 
        className={`drawer-content ${isDrawerOpen ? 'open' : ''}`}
        style={{
          position: "fixed", top: 0, right: 0, width: "100%", maxWidth: 640, height: "100vh",
          background: "#FFFFFF", borderLeft: "1px solid #E5E7EB", zIndex: 9999,
          boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column"
        }}
      >
        {selectedAlumni && (
          <>
            {/* Header */}
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F9FAFB" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0077B5", textTransform: "uppercase", letterSpacing: "0.1em" }}>LinkedIn Mirror Timeline</span>
              </div>
              <button 
                onClick={closeProfileMirror}
                style={{ background: "#E5E7EB", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4B5563" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Scroll Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: 28, display: "flex", flexDirection: "column", gap: 28 }}>
              
              <div style={{ display: "flex", gap: 20, alignItems: "start", borderBottom: "1px solid #F3F4F6", paddingBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0, 119, 181, 0.08)", border: "1px solid rgba(0, 119, 181, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0077B5", fontWeight: 800, fontSize: 24 }}>
                  {selectedAlumni.full_name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{selectedAlumni.full_name}</h2>
                  <p style={{ fontSize: 13, color: "#0077B5", fontWeight: 700, marginBottom: 8 }}>{selectedAlumni.headline || "VSIT Alumni"}</p>
                  
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
                    {selectedAlumni.current_company && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Building size={13} /> {selectedAlumni.current_company}
                      </div>
                    )}
                    {selectedAlumni.stream && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <GraduationCap size={13} /> {selectedAlumni.stream}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedAlumni.bio && (
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Summary</h3>
                  <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, background: "#F9FAFB", padding: 16, borderRadius: 12, border: "1px solid #E5E7EB" }}>
                    {selectedAlumni.bio}
                  </div>
                </div>
              )}

              {/* Work History */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Scraped Work History</h3>
                {(!selectedAlumni.experience || selectedAlumni.experience.length === 0) ? (
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>No work history synced.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {selectedAlumni.experience.map((exp, idx) => (
                      <div key={idx} className="timeline-item" style={{ display: "flex", gap: 16, paddingBottom: 24 }}>
                        <div className="timeline-badge" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0,119,181,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0077B5" }}>
                            <Briefcase size={10} color="#0077B5" />
                          </div>
                        </div>
                        <div style={{ flex: 1, marginTop: 2 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{exp.title}</h4>
                          <div style={{ fontSize: 12, color: "#4B5563", fontWeight: 700, marginBottom: 4 }}>{exp.company}</div>
                          <span style={{ fontSize: 11, color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: 4 }}>{exp.duration}</span>
                          <p style={{ fontSize: 12, color: "#4B5563", marginTop: 8, lineHeight: 1.5 }}>{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Education */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Academic Track</h3>
                {(!selectedAlumni.education || selectedAlumni.education.length === 0) ? (
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>No academic records listed.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {selectedAlumni.education.map((edu, idx) => (
                      <div key={idx} className="timeline-item" style={{ display: "flex", gap: 16, paddingBottom: 16 }}>
                        <div className="timeline-badge" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #F59E0B" }}>
                            <GraduationCap size={10} color="#F59E0B" />
                          </div>
                        </div>
                        <div style={{ flex: 1, marginTop: 2 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{edu.degree || edu.school}</h4>
                          <div style={{ fontSize: 12, color: "#4B5563", fontWeight: 700, marginBottom: 4 }}>{edu.school}</div>
                          <span style={{ fontSize: 11, color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: 4 }}>{edu.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills Tags */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Synchronized Skills</h3>
                {(!selectedAlumni.skills || selectedAlumni.skills.length === 0) ? (
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>No skills synchronized.</div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedAlumni.skills.map((skill, idx) => (
                      <span key={idx} style={{
                        fontSize: 12, background: "rgba(0, 119, 181, 0.04)", border: "1px solid rgba(0, 119, 181, 0.15)",
                        color: "#0077B5", padding: "6px 12px", borderRadius: 8, fontWeight: 600
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Actions */}
            <div style={{ padding: "20px 28px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 12, background: "#F9FAFB" }}>
              <a 
                href={selectedAlumni.linkedin_url ? (selectedAlumni.linkedin_url.startsWith("http") ? selectedAlumni.linkedin_url : `https://${selectedAlumni.linkedin_url}`) : "https://linkedin.com"} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  flex: 1, padding: "12px", background: "linear-gradient(135deg, #0077B5, #005987)", border: "none", color: "#FFF",
                  borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none"
                }}
              >
                <Sparkles size={16} /> Open Verified Profile
              </a>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
