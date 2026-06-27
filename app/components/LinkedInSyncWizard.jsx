"use client";

import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { FileText, Sparkles, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";

export default function LinkedInSyncWizard({ onSyncComplete }) {
  const { updateProfile } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [syncPhase, setSyncPhase] = useState(-1); // -1: idle, 0-5: phases, 6: success
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const phases = [
    { text: "Uploading PDF to secure parsing engine...", speed: 1200 },
    { text: "Extracting raw text from LinkedIn export...", speed: 1500 },
    { text: "AI processing and mapping job experiences...", speed: 1800 },
    { text: "Extracting academic institutions & stream credentials...", speed: 1400 },
    { text: "Syncing skill endorsements & certifications...", speed: 1600 },
    { text: "Finalizing career profile & saving to database...", speed: 1200 }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setErrorMsg("");
    } else {
      setSelectedFile(null);
      setErrorMsg("Please upload a valid PDF file.");
    }
  };

  const simulateScraping = async () => {
    if (!selectedFile) {
      setErrorMsg("Please upload your LinkedIn Profile PDF first.");
      return;
    }

    setErrorMsg("");
    setSyncPhase(0);
    setStatusMessage("Uploading PDF securely...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/linkedin-sync", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse LinkedIn profile");
      }

      setSyncPhase(3);
      setStatusMessage("AI extracting and mapping credentials...");

      const scrapedUpdates = data.profile;

      // Save changes to Zustand and Supabase
      await updateProfile(scrapedUpdates);
      setSyncPhase(6);
      setStatusMessage("Profile fully synchronized with LinkedIn!");
      
      if (onSyncComplete) {
        onSyncComplete(scrapedUpdates);
      }
    } catch (err) {
      console.error("Parsing error:", err);
      setSyncPhase(-1);
      setErrorMsg(err.message || "An unexpected error occurred during sync.");
    }
  };

  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E5E7EB",
      borderRadius: 24,
      padding: 32,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        .spin-loader { animation: spin 2s linear infinite; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .file-input-wrapper:hover {
          border-color: #0A66C2 !important;
          background-color: rgba(10, 102, 194, 0.02) !important;
        }
      `}</style>
      
      {/* Decorative Blob */}
      <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: "radial-gradient(circle, rgba(10,102,194,0.04) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(10, 102, 194, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={20} color="#0A66C2" />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>LinkedIn Synchronizer</h3>
            <p style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Sync your professional career history instantly</p>
          </div>
        </div>

        {syncPhase === -1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.5, fontWeight: 500, background: "#F3F4F6", padding: 16, borderRadius: 12 }}>
              <p style={{ marginBottom: 8, fontWeight: 600, color: "#111827" }}>How to sync your profile:</p>
              <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                <li>Go to your <a href="https://linkedin.com/in/me" target="_blank" rel="noreferrer" style={{ color: "#0A66C2", textDecoration: "underline" }}>LinkedIn Profile</a>.</li>
                <li>Click the <strong>More</strong> button below your name.</li>
                <li>Select <strong>Save to PDF</strong>.</li>
                <li>Upload the downloaded PDF below.</li>
              </ol>
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>LinkedIn Profile PDF</label>
              <div style={{ display: "flex", gap: 10 }}>
                <div 
                  className="file-input-wrapper"
                  style={{ 
                    flex: 1, position: "relative", border: "1px dashed #D1D5DB", borderRadius: 10, 
                    display: "flex", alignItems: "center", padding: "8px 12px", background: "#F9FAFB", cursor: "pointer", transition: "all 0.2s" 
                  }}
                  onClick={() => document.getElementById("pdf-upload").click()}
                >
                  <FileText size={16} color={selectedFile ? "#0A66C2" : "#9CA3AF"} style={{ marginRight: 10 }} />
                  <span style={{ fontSize: 13, color: selectedFile ? "#111827" : "#6B7280", fontWeight: selectedFile ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {selectedFile ? selectedFile.name : "Click to select or drag and drop"}
                  </span>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
                <button
                  onClick={simulateScraping}
                  disabled={!selectedFile}
                  style={{
                    background: selectedFile ? "linear-gradient(135deg, #0A66C2, #0077B5)" : "#E5E7EB", 
                    border: "none", color: selectedFile ? "#FFFFFF" : "#9CA3AF",
                    padding: "0 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, 
                    cursor: selectedFile ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s"
                  }}
                >
                  Sync Profile
                </button>
              </div>
              {errorMsg && (
                <div style={{ color: "#EF4444", fontSize: 12, marginTop: 8, display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                  <AlertCircle size={14} /> {errorMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {syncPhase >= 0 && syncPhase <= 5 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", gap: 16 }}>
            <div style={{ position: "relative", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="spin-loader" style={{
                position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
                border: "4px solid rgba(10, 102, 194, 0.08)", borderTop: "4px solid #0A66C2"
              }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RefreshCw size={24} color="#0A66C2" className="spin-loader" />
              </div>
            </div>
            
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#0A66C2", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                Phase {syncPhase + 1} of {phases.length}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", transition: "all 0.3s" }}>
                {statusMessage}
              </div>
            </div>

            {/* Simulated Progress bar */}
            <div style={{ width: "100%", height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "linear-gradient(90deg, #0A66C2, #00D4FF)", borderRadius: 3,
                width: `${((syncPhase + 1) / phases.length) * 100}%`, transition: "width 0.5s ease"
              }} />
            </div>
          </div>
        )}

        {syncPhase === 6 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16, 185, 129, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={32} color="#10B981" />
            </div>
            <div style={{ textAlign: "center" }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Sync Complete!</h4>
              <p style={{ fontSize: 13, color: "#4B5563", fontWeight: 500 }}>
                All work experiences, education degrees, and skills tags have been successfully scraping-mapped and saved to your profile!
              </p>
            </div>
            <button
              onClick={() => {
                setSyncPhase(-1);
                setSelectedFile(null);
              }}
              style={{
                background: "transparent", border: "1px solid #E5E7EB", color: "#4B5563",
                padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}
            >
              Sync Another Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
