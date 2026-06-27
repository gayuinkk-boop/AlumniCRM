"use client";

import { Calendar } from "lucide-react";

export default function AdminEventsPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#D32F2F", marginBottom: 8 }}>
        Global Events
      </h1>
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Monitor and moderate all events on the platform.</p>

      <div style={{ textAlign: "center", padding: 64, background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <Calendar size={48} color="#D32F2F" style={{ marginBottom: 16, opacity: 0.3 }} />
        <h3 style={{ fontSize: 16, color: "#111827", marginBottom: 8, fontWeight: 700 }}>No Events Pending Review</h3>
      </div>
    </div>
  );
}
