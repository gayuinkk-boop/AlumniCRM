"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { Save, User, GraduationCap, FileText, CheckCircle } from "lucide-react";
import LinkedInSyncWizard from "@/app/components/LinkedInSyncWizard";

export default function StudentSettingsPage() {
  const { profile, updateProfile } = useAuth();
  
  // Local state for profile form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [bio, setBio] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync form inputs when profile loads or updates
  useEffect(() => {
    if (profile) {
      const names = (profile.full_name || "").split(" ");
      const timer = setTimeout(() => {
        setFirstName(names[0] || "");
        setLastName(names.slice(1).join(" ") || "");
        setMajor(profile.stream || "Computer Science");
        setGraduationYear(profile.graduation_year || "2026");
        setLinkedinUrl(profile.linkedin_url || "");
        setBio(profile.bio || "");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    
    const updates = {
      full_name: `${firstName} ${lastName}`.trim(),
      stream: major,
      graduation_year: graduationYear,
      linkedin_url: linkedinUrl,
      bio: bio,
      headline: `${major} Student '` + graduationYear.slice(-2)
    };

    const { error } = await updateProfile(updates);
    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert("Failed to save profile: " + error.message);
    }
  };

  const handleSyncComplete = (scrapedData) => {
    // When LinkedInSyncWizard completes, it returns the scraped properties
    // We update local state to reflect it instantly in the forms!
    const names = (scrapedData.full_name || "").split(" ");
    setFirstName(names[0] || "");
    setLastName(names.slice(1).join(" ") || "");
    setMajor(scrapedData.stream || "");
    setGraduationYear(scrapedData.graduation_year || "2026");
    setLinkedinUrl(scrapedData.linkedin_url || "");
    setBio(scrapedData.bio || "");
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
        Profile Settings
      </h1>
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Update your personal information and sync your professional career nodes.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "start" }}>
        
        {/* Profile Editor Form */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <form onSubmit={handleSave} style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F3F4F6", paddingBottom: 12, marginBottom: 8 }}>
              <User size={18} color="#D32F2F" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Personal Details</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>University Email (Read-only)</label>
              <input
                type="email"
                value={profile?.id ? `${profile.role}@vsit.edu.in` : "student@vsit.edu.in"}
                disabled
                style={{ width: "100%", padding: "12px", background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 8, color: "#6B7280", outline: "none", cursor: "not-allowed" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F3F4F6", paddingBottom: 12, marginTop: 12, marginBottom: 8 }}>
              <GraduationCap size={18} color="#D32F2F" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Academic Parameters</h2>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Major / Field of Study</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Graduation Year</label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F3F4F6", paddingBottom: 12, marginTop: 12, marginBottom: 8 }}>
              <FileText size={18} color="#D32F2F" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Profile Bio</h2>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Bio / Summary</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your career goals, research interests or achievements..."
                style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", resize: "vertical", transition: "all 0.2s", fontFamily: "inherit" }}
                onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E5E7EB", paddingTop: 20, marginTop: 8 }}>
              {saveSuccess ? (
                <div style={{ color: "#10B981", fontSize: 13, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                  <CheckCircle size={16} /> Changes saved successfully!
                </div>
              ) : <div />}
              
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #D32F2F, #B71C1C)", border: "none", color: "#fff",
                  padding: "12px 32px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
                }}
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* LinkedIn sync tool */}
        <div>
          <LinkedInSyncWizard onSyncComplete={handleSyncComplete} />
        </div>

      </div>
    </div>
  );
}
