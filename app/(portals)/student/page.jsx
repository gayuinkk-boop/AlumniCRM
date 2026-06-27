"use client";

import Link from "next/link";
import { Sparkles, Calendar, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

export default function StudentDashboard() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
            Student Dashboard
          </h1>
          <p style={{ color: "#4B5563", fontWeight: 500 }}>Welcome back! Connect with alumni and accelerate your career growth.</p>
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
            <span style={{ fontWeight: 700, color: "#1e1b4b" }}>AI Search Active</span>
            <span style={{ color: "#64748b", display: "block", fontSize: 10, fontWeight: 500 }}>Powered by Google Gemini</span>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32, marginTop: 24 }}>
        {[
          { label: "Mentorship Matches", value: "3 Active", color: "#D32F2F", subtitle: "Connect 1-on-1 with mentors" },
          { label: "Job Applications", value: "2 Submitted", color: "#B71C1C", subtitle: "Track your referrals" },
          { label: "Upcoming Events", value: "1 This Week", color: "#F59E0B", subtitle: "Join networking panels" },
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
        
        {/* Recent Jobs */}
        <div className="glass-widget" style={{ borderRadius: 20, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
              <Briefcase size={20} color="#D32F2F" /> Recent Job Postings
            </h2>
            <Link href="/student/jobs" style={{ textDecoration: "none", fontSize: 13, fontWeight: 700, color: "#D32F2F", display: "flex", alignItems: "center", gap: 4 }}>
              Explore Jobs <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { role: "Software Engineer Intern", company: "Google", type: "Remote", posted: "2d ago" },
              { role: "Junior Data Analyst", company: "Spotify", type: "Hybrid", posted: "5h ago" },
              { role: "Product Marketing Associate", company: "Stripe", type: "Remote", posted: "1w ago" }
            ].map((job, idx) => (
              <div key={idx} style={{ 
                padding: 18, border: "1px solid rgba(0,0,0,0.04)", borderRadius: 16, background: "rgba(255,255,255,0.4)", 
                display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" 
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#111827", marginBottom: 4 }}>{job.role}</div>
                  <div style={{ fontSize: 13, color: "#4B5563", fontWeight: 500 }}>{job.company} • {job.type}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>{job.posted}</span>
                  <Link href="/student/jobs" style={{ textDecoration: "none" }}>
                    <button style={{
                      background: "linear-gradient(135deg, #D32F2F, #B71C1C)", border: "none", color: "#fff",
                      padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                    }}>Apply</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links / Guide */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass-widget" style={{ borderRadius: 20, padding: 24, background: "linear-gradient(135deg, rgba(211,47,47,0.02) 0%, rgba(211,47,47,0.06) 100%)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldCheck size={16} color="#D32F2F" /> Mentorship Code
            </h3>
            <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5, marginBottom: 12 }}>
              Be professional, respect your mentor&apos;s time, and always research their profile before starting conversations.
            </p>
            <Link href="/terms" style={{ fontSize: 12, fontWeight: 700, color: "#D32F2F", textDecoration: "none" }}>
              Read Conduct Guidelines
            </Link>
          </div>

          <div className="glass-widget" style={{ borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={16} color="#D32F2F" /> Next Network Event
            </h3>
            <div style={{ background: "rgba(211, 47, 47, 0.04)", borderRadius: 12, padding: 12, border: "1px solid rgba(211, 47, 47, 0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#D32F2F", textTransform: "uppercase" }}>Networking Mixer</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "4px 0" }}>Tech Industry Mixer</div>
              <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>Oct 15, 2026 at 6:00 PM</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
