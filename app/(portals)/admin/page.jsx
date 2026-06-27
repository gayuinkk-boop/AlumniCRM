"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { pendingVerifications, fetchPendingVerifications, verifyAlumni, jobs, fetchJobs } = useStore();
  const { profile, isMock } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (isMock) return;
      if (profile?.organization_id) {
        setLoading(true);
        await Promise.all([
          fetchPendingVerifications(profile.organization_id),
          fetchJobs(profile.organization_id)
        ]);
        setLoading(false);
      }
    }
    loadData();
  }, [profile, fetchPendingVerifications, fetchJobs, isMock]);

  const handleVerify = async (alumniId, status) => {
    const orgId = profile?.organization_id || "mock-org-id";
    const actionLabel = status ? "verified" : "rejected";
    
    const { error } = await verifyAlumni(alumniId, status, orgId);
    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert(`Alumni successfully ${actionLabel}!`);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#D32F2F", marginBottom: 8 }}>
        Admin Dashboard
      </h1>
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Manage users, verify profiles, and monitor platform health.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 32 }}>
        {[
          { label: "Total Users", value: "2,405", color: "#D32F2F" },
          { label: "Pending Verifications", value: pendingVerifications.length, color: "#F87171" },
          { label: "Active Jobs", value: isMock ? jobs.length : jobs.length, color: "#A78BFA" },
          { label: "Platform Revenue", value: "₹45k", color: "#34D399" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24,
            borderTop: `4px solid ${stat.color}`, boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
          }}>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Pending Alumni Verifications</h2>
        
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 150 }}>
            <Loader2 size={32} color="#D32F2F" className="animate-spin" />
          </div>
        ) : pendingVerifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#6B7280", fontWeight: 500 }}>
            No pending alumni verifications in queue.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #E5E7EB", textAlign: "left", color: "#6B7280", fontSize: 13, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 0", fontWeight: 700 }}>Name</th>
                <th style={{ padding: "12px 0", fontWeight: 700 }}>Graduation Year</th>
                <th style={{ padding: "12px 0", fontWeight: 700 }}>Headline / Role</th>
                <th style={{ padding: "12px 0", fontWeight: 700, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingVerifications.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <td style={{ padding: "16px 0", color: "#111827", fontWeight: 700 }}>{p.full_name}</td>
                  <td style={{ padding: "16px 0", color: "#4B5563", fontWeight: 500 }}>{p.graduation_year}</td>
                  <td style={{ padding: "16px 0", color: "#4B5563", fontWeight: 500 }}>{p.headline}</td>
                  <td style={{ padding: "16px 0", textAlign: "right" }}>
                    <button 
                      onClick={() => handleVerify(p.id, false)}
                      style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", marginRight: 8, transition: "all 0.2s" }} 
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'} 
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleVerify(p.id, true)}
                      style={{ background: "linear-gradient(135deg, #10B981, #059669)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} 
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
