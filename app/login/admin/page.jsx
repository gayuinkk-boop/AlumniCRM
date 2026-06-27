"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { Sparkles, ArrowLeft, ShieldAlert, Key, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (isMock) {
      // Direct mock bypass if credentials are submitted in mock mode
      loginAsMock('admin');
      router.push('/admin');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setMessage(`Authorization failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f172a 100%)",
      color: "#f8fafc",
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .glass-card {
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(245, 158, 11, 0.15);
          border-radius: 28px;
          padding: 44px;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
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
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25); 
        }

        .input-dark {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f8fafc;
          transition: all 0.2s;
        }
        .input-dark:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.15);
          outline: none;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Admin Highlight blob */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(0,0,0,0) 70%)", borderRadius: "50%", zIndex: 0, pointerEvents: "none" }} />

      <div className="glass-card">
        {/* Navigation Back */}
        <Link href="/login" style={{ textDecoration: "none", color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, marginBottom: 28 }} className="auth-btn">
          <ArrowLeft size={14} /> Back to User Login
        </Link>

        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <img src="/logo.png" alt="VSIT Logo" width={220} height={60} style={{ objectFit: "contain" }} />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 100, padding: "4px 12px", marginBottom: 12 }}>
            <ShieldAlert size={14} color="#F59E0B" />
            <span style={{ fontSize: 10, fontWeight: 800, color: "#F59E0B", letterSpacing: "1px", textTransform: "uppercase" }}>Administrator clearance required</span>
          </div>

          <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, textAlign: "center" }}>Enter credentials to access verified databases, verification queues, and CSV exports.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {message && <div style={{ color: "#f87171", fontSize: 12, textAlign: "center", fontWeight: 500 }}>{message}</div>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Admin Email</label>
            <input 
              type="email" placeholder="admin@vsit.edu.in" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-dark"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Passcode / Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} placeholder="••••••••" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-dark"
                style={{ width: "100%", padding: "12px 40px 12px 16px", borderRadius: 12, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-btn" style={{
            width: "100%", padding: "14px", background: "linear-gradient(135deg, #F59E0B, #D97706)",
            border: "none", borderRadius: 12, color: "#0f172a", fontSize: 13, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 4px 14px rgba(245, 158, 11, 0.2)"
          }}>
            <Key size={16} />
            {loading ? "Decrypting..." : "Authorize Administrative Session"}
          </button>
        </form>

        {/* Demo Bypass Option */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button 
            onClick={() => { loginAsMock('admin'); router.push('/admin'); }}
            className="auth-btn"
            style={{
              background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)",
              color: "#F59E0B", borderRadius: 10, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%"
            }}
          >
            Demo Admin Bypass (No Passcode)
          </button>
        </div>

        {/* Gemini Credits */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 28, fontSize: 11, color: "#64748b", fontWeight: 500 }}>
          <span>AI core capabilities powered by</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#818cf8", fontWeight: 700 }}>
            <Sparkles size={12} /> Google Gemini
          </span>
        </div>
      </div>
    </div>
  );
}
