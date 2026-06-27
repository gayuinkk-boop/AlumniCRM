"use client";

import { Calendar, MapPin, Clock, Users } from "lucide-react";

export default function EventsPage() {
  const events = [
    { id: 1, title: "Tech Industry Mixer", date: "Oct 15, 2026", time: "6:00 PM EST", location: "Virtual (Zoom)", attendees: 124, type: "Networking", color: "#D32F2F" },
    { id: 2, title: "Mock Interview Workshop", date: "Oct 18, 2026", time: "2:00 PM EST", location: "Student Center, Room 204", attendees: 45, type: "Career Growth", color: "#B71C1C" },
    { id: 3, title: "Alumni Panel: Life at Startups vs FAANG", date: "Nov 02, 2026", time: "5:30 PM EST", location: "Main Auditorium", attendees: 310, type: "Panel Discussion", color: "#F59E0B" },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
        Events
      </h1>
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Discover upcoming networking events, workshops, and panels.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {events.map(event => (
          <div key={event.id} style={{ 
            background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden",
            display: "flex", flexDirection: "column", boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
          }}>
            <div style={{ height: 6, background: event.color }} />
            <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ 
                background: `${event.color}10`, color: event.color, border: `1px solid ${event.color}20`, 
                padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, alignSelf: "flex-start", marginBottom: 16
              }}>
                {event.type}
              </span>
              
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16, lineHeight: 1.4 }}>{event.title}</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4B5563", fontSize: 13, fontWeight: 500 }}>
                  <Calendar size={16} color="#6B7280" /> {event.date}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4B5563", fontSize: 13, fontWeight: 500 }}>
                  <Clock size={16} color="#6B7280" /> {event.time}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4B5563", fontSize: 13, fontWeight: 500 }}>
                  <MapPin size={16} color="#6B7280" /> {event.location}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4B5563", fontSize: 13, fontWeight: 500 }}>
                  <Users size={16} color="#6B7280" /> {event.attendees} Attending
                </div>
              </div>

              <button style={{ 
                width: "100%", background: "transparent", border: `1px solid ${event.color}`, color: event.color, 
                padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = `${event.color}08`; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                RSVP Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
