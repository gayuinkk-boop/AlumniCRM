"use client";

import { useState } from "react";
import { Save, Link2, Key, Shield, HelpCircle, FileText, CheckCircle, ArrowUpRight, Copy } from "lucide-react";

export default function AdminSettingsPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const redirectUri = "https://cjbknnnqxniamznhixkt.supabase.co/auth/v1/callback";

  return (
    <div>
      <style>{`
        .oauth-step { display: flex; gap: 16px; margin-bottom: 20px; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 119, 181, 0.08); color: #0077B5; display: flex; alignItems: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
        .step-content { flex: 1; }
        .copy-btn { background: transparent; border: none; color: #6B7280; cursor: pointer; display: flex; alignItems: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; transition: all 0.2s; }
        .copy-btn:hover { background: #F3F4F6; color: #0077B5; }
      `}</style>

      {/* Page Title */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#D32F2F", marginBottom: 8 }}>
          Platform Settings
        </h1>
        <p style={{ color: "#4B5563", fontWeight: 500 }}>Configure organization credentials and external authentication integrations.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.5fr", gap: 32, alignItems: "start" }}>
        
        {/* Left Column: Organization settings */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <form onSubmit={handleSave} style={{ display: "grid", gap: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", borderBottom: "1px solid #F3F4F6", paddingBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={18} color="#D32F2F" /> Organization Configuration
            </h2>
            
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Institution Name</label>
              <input 
                type="text" 
                defaultValue="Vidyalankar School of Information Technology" 
                style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }} 
                onFocus={(e) => e.target.style.borderColor = "#D32F2F"} 
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} 
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Approved Student Domain</label>
              <input 
                type="text" 
                defaultValue="@vsit.edu.in" 
                style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }} 
                onFocus={(e) => e.target.style.borderColor = "#D32F2F"} 
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} 
              />
              <p style={{ fontSize: 11, color: "#6B7280", marginTop: 6, fontWeight: 500 }}>Only users with this email domain will be automatically approved as students.</p>
            </div>

            <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", borderTop: "1px solid #E5E7EB", paddingTop: 20, marginTop: 8 }}>
              {saveSuccess ? (
                <span style={{ color: "#10B981", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle size={14} /> Updated successfully!
                </span>
              ) : <span />}
              
              <button 
                type="submit" 
                style={{ 
                  background: "linear-gradient(135deg, #D32F2F, #B71C1C)", border: "none", color: "#fff", 
                  padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", 
                  display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", marginLeft: "auto" 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: LinkedIn OAuth Integration Steps */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", borderBottom: "1px solid #F3F4F6", paddingBottom: 12, display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Link2 size={18} color="#0077B5" /> LinkedIn OAuth Integration Guide
          </h2>

          <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5, marginBottom: 24, fontWeight: 500 }}>
            Follow these steps to connect your custom Supabase database with LinkedIn OAuth and permit graduates to log in with their LinkedIn accounts.
          </p>

          <div className="oauth-step">
            <div className="step-num">1</div>
            <div className="step-content">
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Create LinkedIn Developer App</h4>
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                Go to the <a href="https://developer.linkedin.com/" target="_blank" rel="noreferrer" style={{ color: "#0077B5", textDecoration: "none", fontWeight: 700 }}>LinkedIn Developer Portal <ArrowUpRight size={12} style={{ display: "inline" }} /></a> and click <strong>Create App</strong>. Enter name, page link, and logo.
              </p>
            </div>
          </div>

          <div className="oauth-step">
            <div className="step-num">2</div>
            <div className="step-content">
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Request Sign-In Product</h4>
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                Under the <strong>Products</strong> tab, request the <strong>&quot;Sign In with LinkedIn using OpenID Connect&quot;</strong> product. Wait for instant provisioning.
              </p>
            </div>
          </div>

          <div className="oauth-step">
            <div className="step-num">3</div>
            <div className="step-content">
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Configure Authorized Redirect URL</h4>
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                Under the <strong>Auth</strong> tab, find <strong>Authorized Redirect URLs</strong>. Copy and paste your project redirect callback URL:
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", border: "1px solid #E5E7EB", padding: "8px 12px", borderRadius: 8, marginTop: 8 }}>
                <code style={{ fontSize: 10, fontFamily: "monospace", color: "#1F2937", wordBreak: "break-all", flex: 1 }}>
                  {redirectUri}
                </code>
                <button 
                  onClick={() => copyToClipboard(redirectUri, 1)}
                  className="copy-btn"
                >
                  <Copy size={12} /> {copiedIndex === 1 ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div className="oauth-step">
            <div className="step-num">4</div>
            <div className="step-content">
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Enable Provider in Supabase Console</h4>
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                From LinkedIn Auth tab, copy your <strong>Client ID</strong> and <strong>Client Secret</strong>. Paste them in your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: "#0077B5", textDecoration: "none", fontWeight: 700 }}>Supabase Console <ArrowUpRight size={12} style={{ display: "inline" }} /></a> under <strong>Auth</strong> &gt; <strong>Providers</strong> &gt; <strong>LinkedIn</strong> and click Save.
              </p>
            </div>
          </div>

          <div className="oauth-step">
            <div className="step-num">5</div>
            <div className="step-content">
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Test Login Portal</h4>
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                Ensure your <code>.env.local</code> has correct <code>NEXT_PUBLIC_SUPABASE_URL</code>. Users can now click the &quot;Continue with LinkedIn&quot; button on the login screen to sign in.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
