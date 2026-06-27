"use client";

import { Plus, Briefcase, MapPin, Edit3, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";

export default function AlumniJobsPage() {
  const [showForm, setShowForm] = useState(false);
  const { jobs, addJob, deleteJob, fetchJobs } = useStore();
  const { profile, isMock } = useAuth();
  const [loadingJobs, setLoadingJobs] = useState(false);
  
  const [newJob, setNewJob] = useState({ title: "", location: "", type: "Full-time", description: "" });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.location) return;

    const jobData = {
      ...newJob,
      company: profile?.industry || "Alumni Partner",
      organization_id: profile?.organization_id || "mock-org-id",
      posted_by: profile?.id || "mock-alumni-id",
    };

    const { error } = await addJob(jobData);
    if (error) {
      alert(`Error posting job: ${error.message}`);
    } else {
      alert(`Job posting successfully created!`);
      setNewJob({ title: "", location: "", type: "Full-time", description: "" });
      setShowForm(false);
    }
  };

  const handleDelete = async (jobId) => {
    const orgId = profile?.organization_id || "mock-org-id";
    const { error } = await deleteJob(jobId, orgId);
    if (error) {
      alert(`Error deleting job: ${error.message}`);
    } else {
      alert(`Job posting deleted successfully.`);
    }
  };

  const myJobs = isMock ? jobs : jobs.filter(job => job.posted_by === profile?.id);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            My Job Postings
          </h1>
          <p style={{ color: "#4B5563", fontWeight: 500 }}>Manage jobs you&apos;ve posted for students.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", border: "none", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {showForm ? "Cancel" : <><Plus size={18} /> Post New Job</>}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, marginBottom: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Create Job Posting</h2>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Job Title</label>
              <input type="text" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Software Engineer Intern" style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }} onFocus={(e) => e.target.style.borderColor = "#D32F2F"} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Location</label>
                <input type="text" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. San Francisco, CA or Remote" style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }} onFocus={(e) => e.target.style.borderColor = "#D32F2F"} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Type</label>
                <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", transition: "all 0.2s" }} onFocus={(e) => e.target.style.borderColor = "#D32F2F"} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}>
                  <option>Internship</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#4B5563", marginBottom: 6, fontWeight: 600 }}>Description</label>
              <textarea rows={4} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} placeholder="Describe the role and requirements..." style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", outline: "none", resize: "vertical", transition: "all 0.2s" }} onFocus={(e) => e.target.style.borderColor = "#D32F2F"} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", border: "none", color: "#fff", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >Submit Posting</button>
            </div>
          </form>
        </div>
      )}

      {loadingJobs ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <Loader2 size={36} color="#D32F2F" className="animate-spin" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {myJobs.map(job => (
            <div key={job.id} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{job.title}</h3>
                  <span style={{ background: "rgba(16, 185, 129, 0.08)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{job.status}</span>
                </div>
                <div style={{ display: "flex", gap: 16, color: "#4B5563", fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Briefcase size={14} color="#6B7280" /> {job.type}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} color="#6B7280" /> {job.location}</div>
                </div>
                {job.description && (
                  <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 12px 0", lineHeight: 1.5 }}>
                    {job.description}
                  </p>
                )}
                <div style={{ fontSize: 13, color: "#D32F2F", fontWeight: 700 }}>{job.applicants} Applicants</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button 
                  onClick={() => alert("Job editing interface coming soon!")}
                  style={{ background: "transparent", border: "1px solid #E5E7EB", color: "#6B7280", width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#D32F2F' }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280' }}
                >
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(job.id)} style={{ background: "transparent", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#EF4444", width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)' }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
                ><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {myJobs.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "#6B7280", fontWeight: 500 }}>You haven&apos;t posted any jobs yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
