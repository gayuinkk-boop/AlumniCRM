"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck, MessageSquare, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("requests");
  const { mentorshipRequests, fetchMentorshipRequests, updateMentorshipStatus } = useStore();
  const { profile, isMock } = useAuth();
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    async function loadRequests() {
      if (isMock) return;
      if (profile?.id) {
        setLoadingRequests(true);
        await fetchMentorshipRequests(profile.id, 'alumni');
        setLoadingRequests(false);
      }
    }
    loadRequests();
  }, [profile, fetchMentorshipRequests, isMock]);

  const handleUpdateStatus = async (id, status) => {
    const activeProfileId = profile?.id || "mock-alumni-id";
    const { error } = await updateMentorshipStatus(id, status, activeProfileId, 'alumni');
    if (error) {
      alert(`Error updating request: ${error.message}`);
    } else {
      alert(`Mentorship request successfully ${status}!`);
    }
  };

  const requests = mentorshipRequests.filter(r => r.status === "pending");
  const mentees = mentorshipRequests.filter(r => r.status === "accepted");

  return (
    <div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
        Mentorship Network
      </h1>
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Manage your mentorship connections and give back to the community.</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid #E5E7EB" }}>
        <button 
          onClick={() => setActiveTab("requests")}
          style={{ 
            background: "transparent", border: "none", padding: "12px 24px", cursor: "pointer",
            color: activeTab === "requests" ? "#D32F2F" : "#6B7280",
            borderBottom: activeTab === "requests" ? "2px solid #D32F2F" : "2px solid transparent",
            fontWeight: activeTab === "requests" ? 700 : 500, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "all 0.2s"
          }}
        >
          Incoming Requests <span style={{ background: "rgba(211, 47, 47, 0.08)", color: "#D32F2F", padding: "2px 8px", borderRadius: 100, fontSize: 11, marginLeft: 8, fontWeight: 700 }}>{requests.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab("mentees")}
          style={{ 
            background: "transparent", border: "none", padding: "12px 24px", cursor: "pointer",
            color: activeTab === "mentees" ? "#D32F2F" : "#6B7280",
            borderBottom: activeTab === "mentees" ? "2px solid #D32F2F" : "2px solid transparent",
            fontWeight: activeTab === "mentees" ? 700 : 500, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "all 0.2s"
          }}
        >
          My Mentees
        </button>
      </div>

      {loadingRequests ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <Loader2 size={36} color="#D32F2F" className="animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === "requests" && (
            <div style={{ display: "grid", gap: 16 }}>
              {requests.map(req => (
                <div key={req.id} style={{ padding: 24, background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(211, 47, 47, 0.08)", border: "1px solid rgba(211, 47, 47, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <UserPlus size={20} color="#D32F2F" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{req.name}</h3>
                        <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{req.major}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleUpdateStatus(req.id, 'declined')} style={{ background: "transparent", border: "1px solid #E5E7EB", color: "#4B5563", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = '#F3F4F6'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>Decline</button>
                      <button onClick={() => handleUpdateStatus(req.id, 'accepted')} style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>Accept Request</button>
                    </div>
                  </div>
                  <div style={{ background: "#F9FAFB", padding: 16, borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 13, color: "#4B5563", lineHeight: 1.6, fontStyle: "italic" }}>
                    &quot;{req.message}&quot;
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, color: "#6B7280", fontWeight: 500 }}>No pending mentorship requests.</div>
              )}
            </div>
          )}

          {activeTab === "mentees" && (
            <div style={{ display: "grid", gap: 16 }}>
              {mentees.length === 0 ? (
                <div style={{ textAlign: "center", padding: 64, background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                  <UserCheck size={48} color="#D32F2F" style={{ marginBottom: 16, opacity: 0.3 }} />
                  <h3 style={{ fontSize: 16, color: "#111827", marginBottom: 8, fontWeight: 700 }}>No active mentees yet</h3>
                  <p style={{ color: "#6B7280", fontSize: 14, fontWeight: 500 }}>When you accept mentorship requests, they will appear here.</p>
                </div>
              ) : (
                mentees.map(mentee => (
                  <div key={mentee.id} style={{ padding: 24, background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(211, 47, 47, 0.08)", border: "1px solid rgba(211, 47, 47, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D32F2F", fontWeight: 800 }}>
                        {mentee.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{mentee.name}</h3>
                        <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{mentee.major}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Start chat session with ${mentee.name}!`)}
                      style={{ background: "transparent", border: "1px solid #E5E7EB", color: "#4B5563", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", gap: 8, alignItems: "center", transition: "all 0.2s" }} 
                      onMouseOver={(e) => e.currentTarget.style.background = '#F3F4F6'} 
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <MessageSquare size={16} color="#6B7280" /> Message
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
