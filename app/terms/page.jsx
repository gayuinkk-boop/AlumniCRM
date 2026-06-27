"use client";

import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle, FileText, Lock, Sparkles } from "lucide-react";
import { useState } from "react";

export default function TermsPage() {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "radial-gradient(circle at 0% 0%, #1e1b4b 0%, #0f172a 100%)",
      color: "#f8fafc",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .glass-panel {
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
          border-radius: 28px;
          padding: 48px;
          width: 100%;
          max-width: 800px;
          position: relative;
          z-index: 10;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .back-btn {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .back-btn:hover {
          transform: translateX(-4px);
          color: #f43f5e !important;
        }

        .term-section {
          margin-bottom: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 24px;
        }
        .term-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Webkit scrollbar for terms container */
        .scrollable-content::-webkit-scrollbar {
          width: 6px;
        }
        .scrollable-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollable-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .scrollable-content::-webkit-scrollbar-thumb:hover {
          background: #f43f5e88;
        }
      `}</style>

      {/* Background Decorative Elements */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(244,63,94,0.1) 0%, rgba(0,0,0,0) 80%)", borderRadius: "50%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(0,0,0,0) 80%)", borderRadius: "50%", zIndex: 0 }} />

      <div className="glass-panel">
        
        {/* Navigation Back */}
        <Link href="/login" style={{ textDecoration: "none", color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, marginBottom: 32 }} className="back-btn">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ background: "rgba(244, 63, 94, 0.15)", borderRadius: 12, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", color: "#f43f5e" }}>
              <FileText size={22} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#f43f5e" }}>
              Terms of Agreement
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Platform Terms & Conditions
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, marginTop: 8, fontWeight: 500 }}>
            Last modified: June 27, 2026 • Please read these guidelines carefully before using the portal.
          </p>
        </div>

        {/* Scrollable Terms Text */}
        <div className="scrollable-content" style={{ maxHeight: "400px", overflowY: "auto", paddingRight: 16, marginBottom: 32 }}>
          
          <div className="term-section">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle size={18} color="#f43f5e" /> 1. Acceptance of Terms
            </h3>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, fontWeight: 400 }}>
              By logging into and using the VSIT Alumni CRM Portal, you agree to comply with and be bound by these terms. This portal is created solely for the active students, alumni, faculty, and authorized mentors of Vidyalankar School of Information Technology (VSIT). Access by unauthorized personnel is strictly prohibited.
            </p>
          </div>

          <div className="term-section">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={18} color="#f43f5e" /> 2. Community Code of Conduct
            </h3>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 10 }}>
              To maintain a supportive, growth-oriented environment, all members must adhere to the following code:
            </p>
            <ul style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Professionalism:</strong> All interactions (including mentorship requests, chat messages, and forum topics) must remain strictly professional, respectful, and career-focused.</li>
              <li><strong>Zero Tolerance for Spam:</strong> Students may not send bulk requests, solicitations, or irrelevant personal communications to alumni.</li>
              <li><strong>Mentorship Ethics:</strong> Mentors offer advice on career guidance, resume feedback, and industry trends. They are not obligated to provide jobs or referrals.</li>
            </ul>
          </div>

          <div className="term-section">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={18} color="#f43f5e" /> 3. Data Privacy and Multi-Tenant Isolation
            </h3>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 }}>
              Your profile data is protected by Supabase Row Level Security (RLS) and is isolated to your organization. LinkedIn sync data parsed via our tools is used strictly to build your professional profile within this network. We do not sell, share, or expose your data to outside entities.
            </p>
          </div>

          <div className="term-section">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={18} color="#6366f1" /> 4. AI Services & Google Gemini Attribution
            </h3>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 10 }}>
              This platform integrates advanced semantic querying and intelligent analysis capabilities.
            </p>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 }}>
              The natural language filter, chatbot directory guide, and LinkedIn profile parsing services are powered by **Google Gemini API** (using models such as `gemini-2.5-flash` and `gemini-2.0-flash`). All AI-generated search filters, replies, and summaries are provided as assistance tools; users should verify critical information independently.
            </p>
          </div>

          <div className="term-section">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={18} color="#f43f5e" /> 5. Account Suspension
            </h3>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 }}>
              VSIT Administration reserves the right to audit network activity and suspend accounts found violating these terms (e.g., fraudulent profiles, harassment, or platform abuse). Unverified alumni will remain in the verification queue until reviewed and approved by an administrator.
            </p>
          </div>

        </div>

        {/* Footer info & button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: 32, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>
            <span>Powered by</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#818cf8", fontWeight: 700 }}>
              <Sparkles size={14} /> Google Gemini
            </span>
            <span>&</span>
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>Supabase</span>
          </div>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button 
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                background: hovered ? "linear-gradient(135deg, #f43f5e, #e11d48)" : "linear-gradient(135deg, #e11d48, #be123c)",
                border: "none",
                borderRadius: 12,
                color: "#ffffff",
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(225, 29, 72, 0.25)",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              Acknowledge & Exit
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
