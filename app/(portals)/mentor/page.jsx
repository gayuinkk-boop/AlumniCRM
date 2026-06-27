"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";
import { Search, MapPin, Building, GraduationCap, X, ChevronRight, Briefcase, Calendar, Award, Sparkles, MessageSquare } from "lucide-react";

export default function MentorDashboard() {
  const { verifiedAlumni, fetchVerifiedAlumni } = useStore();
  const { profile, isMock } = useAuth();
  
  // Search and filter states
  const [search, setSearch] = useState("");
  const [selectedStream, setSelectedStream] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  
  // Slide-over drawer state
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isMock && profile?.organization_id) {
      fetchVerifiedAlumni(profile.organization_id);
    }
  }, [profile, fetchVerifiedAlumni, isMock]);

  // Extract unique streams and companies for filter dropdowns
  const streams = ["All", ...new Set(verifiedAlumni.map(a => a.stream).filter(Boolean))];
  const companies = ["All", ...new Set(verifiedAlumni.map(a => a.current_company).filter(Boolean))];

  // Filtered alumni list
  const filteredAlumni = verifiedAlumni.filter(a => {
    // Exclude self from listing
    if (a.id === profile?.id) return false;
    
    const matchesSearch = 
      a.full_name.toLowerCase().includes(search.toLowerCase()) || 
      (a.current_role && a.current_role.toLowerCase().includes(search.toLowerCase())) ||
      (a.current_company && a.current_company.toLowerCase().includes(search.toLowerCase()));
      
    const matchesStream = selectedStream === "All" || a.stream === selectedStream;
    const matchesCompany = selectedCompany === "All" || a.current_company === selectedCompany;

    return matchesSearch && matchesStream && matchesCompany;
  });

  const openProfileMirror = (alumni) => {
    setSelectedAlumni(alumni);
    setIsDrawerOpen(true);
  };

  const closeProfileMirror = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedAlumni(null), 300); // Wait for transition
  };

  return (
    <div style={{ position: "relative", minHeight: "100%" }}>
      <style>{`
        .alumni-card { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .alumni-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); border-color: rgba(16, 185, 129, 0.2); }
        .drawer-overlay { transition: opacity 0.3s ease; opacity: 0; pointer-events: none; }
        .drawer-overlay.open { opacity: 1; pointer-events: auto; }
        .drawer-content { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform: translateX(100%); }
        .drawer-content.open { transform: translateX(0); }
        .timeline-badge { position: relative; }
        .timeline-badge::after { content: ''; position: absolute; top: 24px; bottom: -24px; left: 11px; width: 2px; background: #E5E7EB; }
        .timeline-item:last-child .timeline-badge::after { display: none; }
      `}</style>

      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Welcome back, <span style={{ color: "#10B981" }}>{profile?.full_name?.split(' ')[0] || "Mentor"}</span>
          </h1>
          <p style={{ color: "#4B5563", fontWeight: 500 }}>Guide graduates, match placement requirements, and browse full student-alumni profiles.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
        {[
          { label: "Verified Network Base", value: `${verifiedAlumni.length} Profiles`, color: "#10B981", subtitle: "Active alumni, mentors & faculty" },
          { label: "Your Active Mentees", value: "2 Students", color: "#3B82F6", subtitle: "1-on-1 counseling active" },
          { label: "Last Profile Sync", value: "Today, 12:45 PM", color: "#F59E0B", subtitle: "LinkedIn Scraper synchronized" },
        ].map((stat, i) => (
          <div key={i} style={{
            background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24,
            borderLeft: `4px solid ${stat.color}`, boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
          }}>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Filter and Directory Section */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={20} color="#10B981" /> Alumni Directory & Insights
          </h2>
          <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Showing {filteredAlumni.length} of {verifiedAlumni.length - 1} records</span>
        </div>

        {/* Directory Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <Search size={18} color="#6B7280" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text" placeholder="Search by name, role or enterprise..." 
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 12px 12px 42px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, color: "#111827", fontSize: 13, outline: "none", transition: "all 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#10B981"}
              onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
            />
          </div>

          {/* Stream Filter */}
          <div>
            <select
              value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, color: "#111827", fontSize: 13, outline: "none", transition: "all 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#10B981"}
              onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
            >
              <option value="All">Filter by Stream (All)</option>
              {streams.filter(s => s !== "All").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <select
              value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, color: "#111827", fontSize: 13, outline: "none", transition: "all 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#10B981"}
              onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
            >
              <option value="All">Filter by Company (All)</option>
              {companies.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        {filteredAlumni.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280", fontWeight: 500 }}>
            No alumni matching your selected search parameters were found.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filteredAlumni.map(alumni => (
              <div key={alumni.id} className="alumni-card" style={{
                background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 20,
                display: "flex", flexDirection: "column", cursor: "pointer", position: "relative"
              }} onClick={() => openProfileMirror(alumni)}>
                
                {/* Profile Meta */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: alumni.role === "faculty" ? "rgba(0,119,181,0.08)" : alumni.role === "mentor" ? "rgba(16,185,129,0.08)" : "rgba(211,47,47,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: alumni.role === "faculty" ? "#0077B5" : alumni.role === "mentor" ? "#10B981" : "#D32F2F", fontWeight: 800, fontSize: 15 }}>
                    {alumni.full_name.charAt(0)}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{alumni.full_name}</h3>
                    <span style={{ fontSize: 11, background: alumni.role === "faculty" ? "rgba(0,119,181,0.08)" : alumni.role === "mentor" ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)", color: alumni.role === "faculty" ? "#0077B5" : alumni.role === "mentor" ? "#10B981" : "#D97706", fontWeight: 700, padding: "2px 6px", borderRadius: 4, textTransform: "uppercase", display: "inline-block", marginTop: 2 }}>
                      {alumni.alumni_category || alumni.role}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#4B5563", fontWeight: 500, flex: 1, marginBottom: 16 }}>
                  {alumni.current_role && alumni.current_company && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Building size={14} color="#9CA3AF" />
                      <span style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{alumni.current_role} @ <strong>{alumni.current_company}</strong></span>
                    </div>
                  )}
                  {alumni.stream && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <GraduationCap size={14} color="#9CA3AF" />
                      <span>{alumni.stream} {alumni.graduation_year ? `'${alumni.graduation_year.slice(-2)}` : ""}</span>
                    </div>
                  )}
                </div>

                <button style={{
                  width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", background: "#F9FAFB", borderRadius: 8,
                  fontSize: 12, fontWeight: 700, color: "#4B5563", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", pointerEvents: "none"
                }}>
                  View LinkedIn Mirror <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── LINKEDIN MIRROR SIDE-OVER DRAWER ── */}
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
          boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {selectedAlumni && (
          <>
            {/* Drawer Header */}
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F9FAFB" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={8} color="#FFF" />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0A66C2", textTransform: "uppercase", letterSpacing: "0.1em" }}>LinkedIn Mirror Feed</span>
              </div>
              <button 
                onClick={closeProfileMirror}
                style={{ background: "#E5E7EB", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4B5563" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: 28, display: "flex", flexDirection: "column", gap: 28 }}>
              
              {/* Profile Card Banner */}
              <div style={{ display: "flex", gap: 20, alignItems: "start", borderBottom: "1px solid #F3F4F6", paddingBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(10, 102, 194, 0.08)", border: "1px solid rgba(10, 102, 194, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0A66C2", fontWeight: 800, fontSize: 24 }}>
                  {selectedAlumni.full_name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{selectedAlumni.full_name}</h2>
                  <p style={{ fontSize: 13, color: "#0A66C2", fontWeight: 700, marginBottom: 8 }}>{selectedAlumni.headline || "VSIT Alumni"}</p>
                  
                  <div style={{ display: "flex", flexDirection: "wrap", gap: 12, fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
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

              {/* Bio Summary Section */}
              {selectedAlumni.bio && (
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>About Summary</h3>
                  <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, background: "#F9FAFB", padding: 16, borderRadius: 12, border: "1px solid #E5E7EB", fontWeight: 500 }}>
                    {selectedAlumni.bio}
                  </div>
                </div>
              )}

              {/* Work Experience Timeline */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Work Experience</h3>
                {(!selectedAlumni.experience || selectedAlumni.experience.length === 0) ? (
                  <div style={{ fontSize: 13, color: "#9CA3AF", padding: "10px 0" }}>No work experience listed. Click settings to sync details.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {selectedAlumni.experience.map((exp, idx) => (
                      <div key={idx} className="timeline-item" style={{ display: "flex", gap: 16, paddingBottom: 24 }}>
                        <div className="timeline-badge" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(10,102,194,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0A66C2" }}>
                            <Briefcase size={10} color="#0A66C2" />
                          </div>
                        </div>
                        <div style={{ flex: 1, marginTop: 2 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{exp.title}</h4>
                          <div style={{ fontSize: 12, color: "#4B5563", fontWeight: 700, marginBottom: 4 }}>{exp.company}</div>
                          <span style={{ fontSize: 11, color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>{exp.duration}</span>
                          <p style={{ fontSize: 12, color: "#4B5563", marginTop: 8, lineHeight: 1.5, fontWeight: 500 }}>{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Education Timeline */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Education History</h3>
                {(!selectedAlumni.education || selectedAlumni.education.length === 0) ? (
                  <div style={{ fontSize: 13, color: "#9CA3AF", padding: "10px 0" }}>No academic records listed.</div>
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
                          <span style={{ fontSize: 11, color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>{edu.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills Tag Cloud */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Scraped Skill Metrics</h3>
                {(!selectedAlumni.skills || selectedAlumni.skills.length === 0) ? (
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>No custom skills keywords synchronized.</div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedAlumni.skills.map((skill, idx) => (
                      <span key={idx} style={{
                        fontSize: 12, background: "rgba(10, 102, 194, 0.04)", border: "1px solid rgba(10, 102, 194, 0.15)",
                        color: "#0A66C2", padding: "6px 12px", borderRadius: 8, fontWeight: 600
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects */}
              {selectedAlumni.projects && selectedAlumni.projects.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Projects & Accomplishments</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {selectedAlumni.projects.map((proj, idx) => (
                      <div key={idx} style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 12, background: "#F9FAFB" }}>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                          <Award size={14} color="#10B981" /> {proj.title}
                        </h4>
                        <p style={{ fontSize: 12, color: "#4B5563", marginTop: 6, lineHeight: 1.5, fontWeight: 500 }}>{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer Actions */}
            <div style={{ padding: "20px 28px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 12, background: "#F9FAFB" }}>
              <a 
                href={selectedAlumni.linkedin_url ? (selectedAlumni.linkedin_url.startsWith("http") ? selectedAlumni.linkedin_url : `https://${selectedAlumni.linkedin_url}`) : "https://linkedin.com"} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  flex: 1, padding: "12px", background: "linear-gradient(135deg, #0A66C2, #0077B5)", border: "none", color: "#FFF",
                  borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none"
                }}
              >
                <Sparkles size={16} /> Open Real LinkedIn
              </a>
              <button 
                onClick={() => alert(`Opening mentorship query channel with ${selectedAlumni.full_name}...`)}
                style={{
                  padding: "12px 24px", background: "#FFFFFF", border: "1px solid #E5E7EB", color: "#4B5563",
                  borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}
              >
                <MessageSquare size={16} /> Chat
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
