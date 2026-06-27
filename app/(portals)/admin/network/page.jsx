"use client";

import { Search, ShieldAlert, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import WebScraperFinder from "@/app/components/WebScraperFinder";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("directory"); // directory, scrape

  const users = [
    { id: 1, name: "Priya Sharma", email: "priya@google.com", role: "Alumni", status: "Verified", joined: "Oct 2025" },
    { id: 2, name: "David Kim", email: "davidk@netflix.com", role: "Alumni", status: "Verified", joined: "Nov 2025" },
    { id: 3, name: "Sarah Jenkins", email: "s.jenkins@student.edu", role: "Student", status: "Active", joined: "Jan 2026" },
    { id: 4, name: "Suspicious User", email: "spammer@tempmail.com", role: "Student", status: "Suspended", joined: "Today" },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#D32F2F", marginBottom: 8 }}>
        User Management
      </h1>
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Manage access, roles, and security across the platform.</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid #E5E7EB" }}>
        <button 
          onClick={() => setActiveTab("directory")}
          style={{ 
            background: "transparent", border: "none", padding: "12px 24px", cursor: "pointer",
            color: activeTab === "directory" ? "#D32F2F" : "#6B7280",
            borderBottom: activeTab === "directory" ? "2px solid #D32F2F" : "2px solid transparent",
            fontWeight: activeTab === "directory" ? 700 : 500, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "all 0.2s"
          }}
        >
          Active Directory
        </button>
        <button 
          onClick={() => setActiveTab("scrape")}
          style={{ 
            background: "transparent", border: "none", padding: "12px 24px", cursor: "pointer",
            color: activeTab === "scrape" ? "#D32F2F" : "#6B7280",
            borderBottom: activeTab === "scrape" ? "2px solid #D32F2F" : "2px solid transparent",
            fontWeight: activeTab === "scrape" ? 700 : 500, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
            display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s"
          }}
        >
          <Sparkles size={14} />
          Web Scraper & Finder
        </button>
      </div>

      {activeTab === "directory" ? (
        <>
          {/* Search Bar */}
          <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={18} color="#6B7280" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" placeholder="Search users by name or email..." 
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "14px 16px 14px 44px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, color: "#111827", fontSize: 14, outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "2px solid #E5E7EB", textAlign: "left", color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "16px 24px", fontWeight: 700 }}>User</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700 }}>Role</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700 }}>Status</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700 }}>Joined</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #E5E7EB", transition: "all 0.2s" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ fontWeight: 700, color: "#111827", marginBottom: 4 }}>{user.name}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{user.email}</div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ 
                        background: user.role === 'Alumni' ? "rgba(211, 47, 47, 0.08)" : "rgba(183, 28, 28, 0.08)", 
                        color: user.role === 'Alumni' ? "#D32F2F" : "#B71C1C", 
                        border: `1px solid ${user.role === 'Alumni' ? "rgba(211, 47, 47, 0.15)" : "rgba(183, 28, 28, 0.15)"}`,
                        padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 
                      }}>{user.role}</span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: user.status === 'Suspended' ? "#EF4444" : "#10B981", fontWeight: 600 }}>
                        {user.status === 'Suspended' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                        {user.status}
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#4B5563", fontSize: 13, fontWeight: 500 }}>{user.joined}</td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      {user.status !== 'Suspended' ? (
                        <button style={{ background: "transparent", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#EF4444", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                          <ShieldAlert size={14} /> Suspend
                        </button>
                      ) : (
                        <button style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", color: "#4B5563", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = '#FFFFFF'} onMouseOut={(e) => e.currentTarget.style.background = '#F3F4F6'}>
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <WebScraperFinder onImportComplete={() => setActiveTab("directory")} allowedRole="alumni" />
      )}
    </div>
  );
}
