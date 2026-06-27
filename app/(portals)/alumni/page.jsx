"use client";

import Link from "next/link";
import { Sparkles, Users, MessageSquare, ArrowRight, ShieldCheck, Mail } from "lucide-react";

export default function AlumniDashboard() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
            Alumni Dashboard
          </h1>
          <p style={{ color: "#4B5563", fontWeight: 500 }}>Your insights and leadership empower the next generation of graduates.</p>
        </div>
        
        {/* Gemini AI banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(244, 63, 94, 0.08))",
          border: "1px solid rgba(99, 102, 241, 0.15)",
          borderRadius: 14,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 4px 16px rgba(99, 102, 241, 0.03)"
        }}>
          <Sparkles size={16} color="#6366f1" />
          <div style={{ fontSize: 12 }}>
            <span style={{ fontWeight: 700, color: "#1e1b4b" }}>AI Integration Active</span>
            <span style={{ color: "#64748b", display: "block", fontSize: 10, fontWeight: 500 }}>Powered by Google Gemini</span>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32, marginTop: 24 }}>
        {[
          { label: "Mentorship Requests", value: "2 Pending", color: "#F59E0B", subtitle: "Review student connection cards" },
          { label: "Profile Views", value: "128 Views", color: "#D32F2F", subtitle: "Total reach inside organization" },
          { label: "Jobs Posted", value: "1 Active", color: "#B71C1C", subtitle: "Post new openings for referrals" },
        ].map(stat => (
          <div key={stat.label} className="glass-widget" style={{
            borderRadius: 20, padding: 24, position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: stat.color }} />
            <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>{stat.subtitle}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        
        {/* Pending requests panel */}
        <div className="glass-widget" style={{ borderRadius: 20, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={20} color="#D32F2F" /> Pending Mentorship Requests
            </h2>
            <Link href="/alumni/network" style={{ textDecoration: "none", fontSize: 13, fontWeight: 700, color: "#D32F2F", display: "flex", alignItems: "center", gap: 4 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { name: "Sarah Jenkins", major: "Computer Science '25", msg: "Hi! I saw your profile and I am very interested in learning about your transition from college to a FAANG company." },
              { name: "Michael Chen", major: "Data Science '26", msg: "I am looking for guidance on building a portfolio for data engineering roles. Your experience at Spotify seems super relevant." }
            ].map((req, idx) => (
              <div key={idx} style={{ 
                padding: 20, border: "1px solid rgba(0,0,0,0.04)", borderRadius: 16, background: "rgba(255, 255, 255, 0.4)", 
                display: "flex", flexDirection: "column", gap: 12
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(211, 47, 47, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D32F2F", fontWeight: 700 }}>
                      {req.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#111827" }}>{req.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{req.major}</div>
                    </div>
                  </div>
                  <Link href="/alumni/network" style={{ textDecoration: "none" }}>
                    <button style={{
                      background: "linear-gradient(135deg, #D32F2F, #B71C1C)", border: "none", color: "#fff",
                      padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                    }}>
                      <MessageSquare size={13} /> Respond
                    </button>
                  </Link>
                </div>
                <div style={{ background: "rgba(0,0,0,0.02)", padding: 12, borderRadius: 10, fontSize: 12, color: "#4B5563", fontStyle: "italic", border: "1px solid rgba(0,0,0,0.02)" }}>
                  &quot;{req.msg}&quot;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code of conduct & tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass-widget" style={{ borderRadius: 20, padding: 24, background: "linear-gradient(135deg, rgba(16,185,129,0.02) 0%, rgba(16,185,129,0.06) 100%)", borderColor: "rgba(16,185,129,0.15)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldCheck size={16} color="#10B981" /> Mentor Guidelines
            </h3>
            <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5, marginBottom: 12 }}>
              Guide students on resume design, mock interviews, and career paths. Let them know if their queries violate our code of conduct.
            </p>
            <Link href="/terms" style={{ fontSize: 12, fontWeight: 700, color: "#10B981", textDecoration: "none" }}>
              Read Conduct Guidelines
            </Link>
          </div>

          <div className="glass-widget" style={{ borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Mail size={16} color="#D32F2F" /> Quick Action
            </h3>
            <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4, marginBottom: 12 }}>
              Have an open vacancy in your current company? Post it on the internal board to source highly qualified candidates from VSIT.
            </p>
            <Link href="/alumni/jobs" style={{ textDecoration: "none" }}>
              <button style={{
                width: "100%", background: "transparent", border: "1px solid #D32F2F", color: "#D32F2F",
                padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(211,47,47,0.04)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >Post Internship / Job</button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
