"use client";

import { Calendar, Plus } from "lucide-react";

export default function AlumniEventsPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Networking Events
          </h1>
          <p style={{ color: "#4B5563", fontWeight: 500 }}>Host or participate in events with the student community.</p>
        </div>
        <button style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", border: "none", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={18} /> Host Event
        </button>
      </div>

      <div style={{ textAlign: "center", padding: 64, background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <Calendar size={48} color="#D32F2F" style={{ marginBottom: 16, opacity: 0.3 }} />
        <h3 style={{ fontSize: 16, color: "#111827", marginBottom: 8, fontWeight: 700 }}>No Upcoming Events</h3>
        <p style={{ color: "#6B7280", fontSize: 14, fontWeight: 500 }}>You are not hosting or attending any upcoming events.</p>
      </div>
    </div>
  );
}
