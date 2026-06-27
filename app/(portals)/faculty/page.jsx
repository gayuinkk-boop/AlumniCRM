"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";
import { GraduationCap, Briefcase, Award, TrendingUp, Users, Compass, BookOpen } from "lucide-react";

export default function FacultyDashboard() {
  const { verifiedAlumni, fetchVerifiedAlumni } = useStore();
  const { profile, isMock } = useAuth();

  useEffect(() => {
    if (!isMock && profile?.organization_id) {
      fetchVerifiedAlumni(profile.organization_id);
    }
  }, [profile, fetchVerifiedAlumni, isMock]);

  // Compute stats from alumni database
  const totalGraduates = verifiedAlumni.filter(a => a.role === "alumni").length;
  const totalMentors = verifiedAlumni.filter(a => a.role === "mentor" || a.alumni_category === "Mentor").length;
  const totalEntrepreneurs = verifiedAlumni.filter(a => a.alumni_category === "Entrepreneur").length;

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Academic Command Center
          </h1>
          <p style={{ color: "#4B5563", fontWeight: 500 }}>
            Welcome back, <span style={{ color: "#0077B5" }}>{profile?.full_name || "Professor"}</span>. Monitor department graduate placements and mentor collaborations.
          </p>
        </div>
      </div>

      {/* Stats Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        {[
          { label: "Graduated Alumni Tracker", value: `${totalGraduates + 120} Students`, color: "#0077B5", icon: GraduationCap, trend: "+12% vs last batch" },
          { label: "Registered Industry Mentors", value: `${totalMentors + 8} Advisors`, color: "#10B981", icon: Users, trend: "4 new this month" },
          { label: "Graduate Placement Rate", value: "94.2%", color: "#A78BFA", icon: TrendingUp, trend: "Target reached (HOD)" },
          { label: "Active Startups (CTOs)", value: `${totalEntrepreneurs + 2} Founders`, color: "#F59E0B", icon: Compass, trend: "Incubator active" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} style={{
              background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `rgba(0,119,181,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
                  <Icon size={16} />
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 6 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>{stat.trend}</div>
            </div>
          );
        })}
      </div>

      {/* Main Insights Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, marginBottom: 32 }}>
        
        {/* Placement Metrics (Custom Bar Charts) */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Award size={18} color="#0077B5" /> Placement Statistics & Stream Analysis
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { stream: "Information Technology (IT)", graduates: 48, rate: 96, color: "#0077B5" },
              { stream: "Computer Science (CS)", graduates: 52, rate: 94, color: "#10B981" },
              { stream: "Electronics Engineering (EXTC)", graduates: 18, rate: 89, color: "#A78BFA" },
              { stream: "Business Management (BMS)", graduates: 24, rate: 91, color: "#F59E0B" }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 6 }}>
                  <span>{item.stream}</span>
                  <span style={{ color: item.color }}>{item.rate}% Placed ({item.graduates} Alumni)</span>
                </div>
                <div style={{ width: "100%", height: 10, background: "#F3F4F6", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", background: item.color, borderRadius: 5,
                    width: `${item.rate}%`, transition: "width 1s ease"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Pipelines */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Briefcase size={18} color="#0077B5" /> Active Corporate Pipelines
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20, fontWeight: 500 }}>Top tier organizations where our graduates have synced active career placements.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { company: "Google", count: 8, color: "#EA4335", logo: "ti ti-brand-google" },
              { company: "NVIDIA", count: 3, color: "#76B900", logo: "ti ti-brand-nvidia" },
              { company: "Amazon", count: 12, color: "#FF9900", logo: "ti ti-brand-amazon" },
              { company: "Netflix", count: 2, color: "#E50914", logo: "ti ti-brand-netflix" },
              { company: "Flipkart", count: 5, color: "#2874F0", logo: "ti ti-shopping-cart" },
              { company: "HealthSync", count: 4, color: "#10B981", logo: "ti ti-activity" }
            ].map((corp, idx) => (
              <div key={idx} style={{
                border: "1px solid #E5E7EB", padding: "16px", borderRadius: 12, display: "flex", flexDirection: "column", gap: 6,
                background: "#F9FAFB"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <i className={corp.logo} style={{ fontSize: 18, color: corp.color }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{corp.company}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{corp.count} active graduates</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Administrative Actions */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Department Administration Tasks</h2>
        <div style={{ display: "flex", gap: 16 }}>
          <button 
            onClick={() => alert("Creating alignment report request...")}
            style={{
              padding: "12px 24px", background: "linear-gradient(135deg, #0077B5, #005987)", border: "none", color: "#FFF",
              borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}
          >
            <BookOpen size={16} /> Request Placement Alignment Report
          </button>
          
          <button 
            onClick={() => alert("Initiating syllabus review invite...")}
            style={{
              padding: "12px 24px", background: "#FFFFFF", border: "1px solid #E5E7EB", color: "#4B5563",
              borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}
          >
            Invite Mentors to Syllabus Board
          </button>
        </div>
      </div>

    </div>
  );
}
