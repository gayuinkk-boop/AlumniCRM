"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Building, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const { jobs, fetchJobs } = useStore();
  const { profile, isMock } = useAuth();
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      if (isMock) return;
      if (profile?.organization_id) {
        setLoadingJobs(true);
        await fetchJobs(profile.organization_id);
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, [profile, fetchJobs, isMock]);

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
        Job Board
      </h1>
      <p style={{ color: "#4B5563", marginBottom: 32, fontWeight: 500 }}>Find opportunities posted by verified alumni.</p>

      {/* Search Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={18} color="#6B7280" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" placeholder="Search by role or company..." 
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "14px 16px 14px 44px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, color: "#111827", fontSize: 14, outline: "none", transition: "all 0.2s" }}
            onFocus={(e) => e.target.style.borderColor = "#D32F2F"}
            onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
          />
        </div>
      </div>

      {loadingJobs ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <Loader2 size={36} color="#D32F2F" className="animate-spin" />
        </div>
      ) : (
        /* Jobs List */
        <div style={{ display: "grid", gap: 16 }}>
          {filteredJobs.map(job => (
            <div key={job.id} style={{ padding: 24, background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{job.title}</h3>
                <div style={{ display: "flex", gap: 16, color: "#4B5563", fontSize: 13, fontWeight: 500 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Building size={14} color="#6B7280" /> {job.company}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} color="#6B7280" /> {job.location}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Briefcase size={14} color="#6B7280" /> {job.type}</div>
                </div>
                {job.description && (
                  <p style={{ marginTop: 12, fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
                    {job.description}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Posted {job.posted}</span>
                <button 
                  onClick={() => alert(`Applied successfully for ${job.title} at ${job.company}!`)}
                  style={{ background: "transparent", border: "1px solid #D32F2F", color: "#D32F2F", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(211,47,47,0.04)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
          {filteredJobs.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "#6B7280", fontWeight: 500 }}>No jobs found matching your search.</div>
          )}
        </div>
      )}
    </div>
  );
}
