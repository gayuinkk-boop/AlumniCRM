"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle, Users } from "lucide-react";

export default function LoginPage() {
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
          provider: provider === 'LinkedIn' ? 'linkedin_oidc' : provider.toLowerCase(),
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
      background: "radial-gradient(circle at 10% 20%, rgba(211, 47, 47, 0.04) 0%, rgba(43, 58, 103, 0.05) 90%), #F9FAFB",
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
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(211, 47, 47, 0.08);
          border-radius: 28px;
          padding: 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.03);
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
          box-shadow: 0 8px 20px rgba(211, 47, 47, 0.15); 
        }

        .secondary-link-card {
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .secondary-link-card:hover {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(211, 47, 47, 0.2);
          transform: translateY(-2px);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: "absolute", top: -150, right: -150, width: 500, height: 500, background: "radial-gradient(circle, rgba(211,47,47,0.06) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -150, left: -150, width: 500, height: 500, background: "radial-gradient(circle, rgba(43,58,103,0.04) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />

      {/* Main card */}
      <div className="glass-card">
        {/* Logo Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <img src="/logo.png" alt="VSIT Logo" width={220} height={60} style={{ objectFit: "contain" }} />
          </div>
          
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#111827", marginBottom: 4 }}>
            Student & Alumni <span style={{ color: "#D32F2F" }}>Portal</span>
          </h1>
          <p style={{ color: "#4B5563", fontSize: 13, fontWeight: 500, textAlign: "center" }}>Connect, mentor, and grow our collective careers.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* LinkedIn Button */}
          <button 
            className="auth-btn"
            onMouseEnter={() => setIsHovered('linkedin')} onMouseLeave={() => setIsHovered(null)}
            onClick={() => handleLogin('LinkedIn')}
            style={{
              width: "100%", padding: "14px 12px", background: "linear-gradient(135deg, #0A66C2, #0077B5)", border: "none",
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              color: "#FFFFFF", fontSize: 14, fontWeight: 700, cursor: "pointer", position: "relative",
              boxShadow: "0 4px 14px rgba(10, 102, 194, 0.2)"
            }}>
            <i className="ti ti-brand-linkedin" style={{ fontSize: 18, color: "#FFFFFF" }} />
            <span>Continue with LinkedIn</span>
            <span style={{ position: "absolute", right: 8, top: -8, background: "#EA4335", color: "#FFFFFF", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 10, textTransform: "uppercase", border: "2px solid #FFFFFF" }}>Recommended</span>
          </button>

          {/* Google Button */}
          <button 
            className="auth-btn"
            onMouseEnter={() => setIsHovered('google')} onMouseLeave={() => setIsHovered(null)}
            onClick={() => handleLogin('Google')}
            style={{
              width: "100%", padding: "12px", background: "#FFFFFF", border: `1px solid ${isHovered === 'google' ? '#EA433588' : '#E5E7EB'}`,
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              color: "#111827", fontSize: 14, fontWeight: 600, cursor: "pointer"
            }}>
            <i className="ti ti-brand-google" style={{ fontSize: 18, color: "#EA4335" }} />
            <span>Continue with Google</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          {/* Email Magic Link */}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin('Email'); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {message && <div style={{ color: message.startsWith("Error") ? "#EF4444" : "#10B981", fontSize: 12, textAlign: "center", fontWeight: 500 }}>{message}</div>}
            <input 
              type="email" placeholder="Work or University Email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, color: "#111827", fontSize: 13, outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
              onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
            />
            <button type="submit" disabled={loading} className="auth-btn" style={{
              width: "100%", padding: "12px", background: "linear-gradient(135deg, #D32F2F, #B71C1C)",
              border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? "Sending Magic Link..." : "Send Magic Link"}
            </button>
          </form>
          
          {/* Demo Logins */}
          <div style={{ marginTop: 16, padding: 16, background: "rgba(211, 47, 47, 0.02)", border: "1px dashed rgba(211, 47, 47, 0.15)", borderRadius: 16 }}>
            <div style={{ fontSize: 10, color: "#4B5563", marginBottom: 10, textAlign: "center", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Demo Accounts (Bypass Auth)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button onClick={() => { loginAsMock('student'); router.push('/student'); }} className="auth-btn" style={{ padding: "10px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#D32F2F", fontSize: 12, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Student Demo</button>
              <button onClick={() => { loginAsMock('alumni'); router.push('/alumni'); }} className="auth-btn" style={{ padding: "10px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#B71C1C", fontSize: 12, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Alumni Demo</button>
            </div>
          </div>
        </div>

        {/* Links to alternative portals */}
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/login/staff" style={{ textDecoration: "none" }}>
            <div className="secondary-link-card" style={{ padding: "12px 16px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Users size={16} color="#0077B5" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Are you Faculty or Mentor?</span>
              </div>
              <ArrowRight size={14} color="#9CA3AF" />
            </div>
          </Link>
          
          <Link href="/login/admin" style={{ textDecoration: "none" }}>
            <div className="secondary-link-card" style={{ padding: "12px 16px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShieldCheck size={16} color="#F59E0B" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Administrator Portal</span>
              </div>
              <ArrowRight size={14} color="#9CA3AF" />
            </div>
          </Link>
        </div>

        {/* Gemini credits */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 28, fontSize: 11, color: "#6B7280", fontWeight: 500 }}>
          <span>AI queries powered by</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#6366f1", fontWeight: 700 }}>
            <Sparkles size={12} /> Google Gemini
          </span>
        </div>

        {/* Legal links */}
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>
          By continuing, you agree to our <Link href="/terms" style={{ color: "#D32F2F", textDecoration: "none", fontWeight: 600 }}>Terms of Service</Link>.
        </div>
      </div>
    </div>
  );
}
