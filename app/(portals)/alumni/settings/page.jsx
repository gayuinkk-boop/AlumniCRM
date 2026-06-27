"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { Save, User, Briefcase, GraduationCap, CheckCircle } from "lucide-react";
import LinkedInSyncWizard from "@/app/components/LinkedInSyncWizard";

export default function AlumniSettingsPage() {
  const { profile, updateProfile } = useAuth();
  
  // Local state for profile form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [graduationYear, setGraduationYear] = useState("2021");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [alumniCategory, setAlumniCategory] = useState("Working Professional");
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
        setMajor(profile.stream || "Information Technology");
        setGraduationYear(profile.graduation_year || "2021");
        setCurrentCompany(profile.current_company || "");
        setCurrentRole(profile.current_role || "");
        setAlumniCategory(profile.alumni_category || "Working Professional");
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
      current_company: currentCompany,
      current_role: currentRole,
      alumni_category: alumniCategory,
      linkedin_url: linkedinUrl,
      bio: bio,
      headline: `${currentRole} @ ${currentCompany}`
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
    const names = (scrapedData.full_name || "").split(" ");
    setFirstName(names[0] || "");
    setLastName(names.slice(1).join(" ") || "");
    setMajor(scrapedData.stream || "");
    setGraduationYear(scrapedData.graduation_year || "2021");
    setCurrentCompany(scrapedData.current_company || "");
    setCurrentRole(scrapedData.current_role || "");
    setAlumniCategory(scrapedData.alumni_category || "Working Professional");
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
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Update your corporate status, academic parameters, and sync your LinkedIn details.</p>

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

            <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F3F4F6", paddingBottom: 12, marginTop: 12, marginBottom: 8 }}>
              <Briefcase size={18} color="#D32F2F" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Corporate & Career Status</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Current Company</label>
                <input
                  type="text"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  placeholder="e.g. Google"
                  style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Current Job Role</label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Alumni Category</label>
              <select
                value={alumniCategory}
                onChange={(e) => setAlumniCategory(e.target.value)}
                style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              >
                <option value="Working Professional">Working Professional</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Faculty">Faculty member</option>
                <option value="Higher Studies">Higher Studies / Researcher</option>
                <option value="Mentor">Dedicated Industry Mentor</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F3F4F6", paddingBottom: 12, marginTop: 12, marginBottom: 8 }}>
              <GraduationCap size={18} color="#D32F2F" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Academic & Social links</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Graduation Year</label>
                <input
                  type="text"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Stream / Major</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>LinkedIn URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Profile Bio</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Give a summary of your career progression or startup objectives..."
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
