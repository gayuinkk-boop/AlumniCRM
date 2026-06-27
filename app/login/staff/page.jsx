"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { Sparkles, ArrowLeft, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

export default function StaffLoginPage() {
  const [isHovered, setIsHovered] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  
  const { isMock, loginAsMock, initialize, user, profile } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user && profile) {
      router.push(`/${profile.role}`);
    }
  }, [user, profile, router]);

  const handleLogin = async (provider) => {
    if (isMock) {
      setMessage("Error: Supabase environment variables not configured. Please use Demo Accounts or update .env.local.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      if (provider === 'Email') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("Check your email for the magic link!");
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider === 'Google' ? 'google' : 'linkedin_oidc',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "radial-gradient(circle at 90% 10%, rgba(10, 102, 194, 0.04) 0%, rgba(0, 119, 181, 0.05) 90%), #F3F4F6",
      color: "#111827",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.0.0/dist/tabler-icons.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(10, 102, 194, 0.1);
          border-radius: 28px;
          padding: 40px;
          box-shadow: 0 24px 60px rgba(10, 102, 194, 0.05);
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 10;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .auth-btn { 
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        .auth-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 20px rgba(10, 102, 194, 0.15); 
        }

        .role-btn {
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .role-btn:hover {
          border-color: #0A66C2;
          transform: translateY(-2px);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -100, left: -100, width: 450, height: 450, background: "radial-gradient(circle, rgba(10,102,194,0.05) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -100, right: -100, width: 450, height: 450, background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />

      <div className="glass-card">
        {/* Navigation Back */}
        <Link href="/login" style={{ textDecoration: "none", color: "#6B7280", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, marginBottom: 24 }} className="auth-btn">
          <ArrowLeft size={14} /> Back to Student / Alumni Login
        </Link>

        {/* Logo Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <img src="/logo.png" alt="VSIT Logo" width={220} height={60} style={{ objectFit: "contain" }} />
          </div>
          
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#111827", marginBottom: 4 }}>
            Faculty & Mentor <span style={{ color: "#0A66C2" }}>Portal</span>
          </h1>
          <p style={{ color: "#4B5563", fontSize: 13, fontWeight: 500, textAlign: "center" }}>Access coordinates, mentor students, and supervise network outcomes.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Google SSO */}
          <button 
            className="auth-btn"
            onMouseEnter={() => setIsHovered('google')} onMouseLeave={() => setIsHovered(null)}
            onClick={() => handleLogin('Google')}
            style={{
              width: "100%", padding: "14px 12px", background: "#FFFFFF", border: `1px solid ${isHovered === 'google' ? '#0A66C2aa' : '#E5E7EB'}`,
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              color: "#111827", fontSize: 14, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)"
            }}>
            <i className="ti ti-brand-google" style={{ fontSize: 18, color: "#EA4335" }} />
            <span>Continue with Google Workspace</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px" }}>OR LOGIN WITH EMAIL</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          {/* Email form */}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin('Email'); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {message && <div style={{ color: message.startsWith("Error") ? "#EF4444" : "#10B981", fontSize: 12, textAlign: "center", fontWeight: 500 }}>{message}</div>}
            <input 
              type="email" placeholder="Institutional Email (e.g. name@vsit.edu.in)" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, color: "#111827", fontSize: 13, outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#0A66C2"}
              onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
            />
            <button type="submit" disabled={loading} className="auth-btn" style={{
              width: "100%", padding: "12px", background: "linear-gradient(135deg, #0A66C2, #0077B5)",
              border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? "Authorizing..." : "Request Staff Access Link"}
            </button>
          </form>

          {/* Demo Login Bypasses */}
          <div style={{ marginTop: 20, padding: 18, background: "rgba(10, 102, 194, 0.02)", border: "1px dashed rgba(10, 102, 194, 0.15)", borderRadius: 16 }}>
            <div style={{ fontSize: 10, color: "#4B5563", marginBottom: 12, textAlign: "center", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Staff Demo Access</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button 
                onClick={() => { loginAsMock('faculty'); router.push('/faculty'); }}
                className="role-btn"
                style={{
                  width: "100%", padding: "12px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700, color: "#1e293b"
                }}
              >
                <div style={{ background: "rgba(10, 102, 194, 0.1)", color: "#0A66C2", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap size={16} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Faculty Profile</div>
                  <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>Access reports & network metrics</div>
                </div>
                <ArrowRight size={14} style={{ marginLeft: "auto" }} color="#94a3b8" />
              </button>

              <button 
                onClick={() => { loginAsMock('mentor'); router.push('/mentor'); }}
                className="role-btn"
                style={{
                  width: "100%", padding: "12px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700, color: "#1e293b"
                }}
              >
                <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase size={16} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Mentor Profile</div>
                  <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>Advise students & check requests</div>
                </div>
                <ArrowRight size={14} style={{ marginLeft: "auto" }} color="#94a3b8" />
              </button>
            </div>
          </div>
        </div>

        {/* Gemini credits */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 28, fontSize: 11, color: "#6B7280", fontWeight: 500 }}>
          <span>Intelligence systems powered by</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#6366f1", fontWeight: 700 }}>
            <Sparkles size={12} /> Google Gemini
          </span>
        </div>
      </div>
    </div>
  );
}
