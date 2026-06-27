"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/store/useAuth";
import { parseCSV, mapCSVRowsToProfiles } from "@/utils/csv";
import { 
  Search, GraduationCap, Building, Download, FileSpreadsheet, 
  Sparkles, Filter, ChevronRight, Upload, AlertCircle, 
  CheckCircle2, FileText, Info, HelpCircle, RefreshCw, Trash2
} from "lucide-react";

export default function AdminExportsPage() {
  const { verifiedAlumni, fetchVerifiedAlumni, importAlumniFromCSV } = useStore();
  const { profile, isMock } = useAuth();

  // Navigation state
  const [activeTab, setActiveTab] = useState("export"); // "export" or "import"

  // ── EXPORT TAB STATES ──
  const [search, setSearch] = useState("");
  const [streamFilter, setStreamFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  // ── IMPORT TAB STATES ──
  const [dragActive, setDragActive] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [parsedProfiles, setParsedProfiles] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importStatus, setImportStatus] = useState({ type: null, message: "" });
  const [skippedCount, setSkippedCount] = useState(0);
  const fileInputRef = useRef(null);

  // ── AI QUERY STATES ──
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");

  useEffect(() => {
    if (!isMock && profile?.organization_id) {
      fetchVerifiedAlumni(profile.organization_id);
    }
  }, [profile, fetchVerifiedAlumni, isMock]);

  // Extract unique filters from database
  const streams = ["All", ...new Set(verifiedAlumni.map(a => a.stream).filter(Boolean))];
  const companies = ["All", ...new Set(verifiedAlumni.map(a => a.current_company).filter(Boolean))];
  const categories = ["All", ...new Set(verifiedAlumni.map(a => a.alumni_category).filter(Boolean))];

  // Filtering Logic for Export
  const filteredAlumni = verifiedAlumni.filter(a => {
    const matchesSearch = 
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (a.current_role && a.current_role.toLowerCase().includes(search.toLowerCase())) ||
      (a.current_company && a.current_company.toLowerCase().includes(search.toLowerCase()));

    const matchesStream = streamFilter === "All" || a.stream === streamFilter;
    const matchesCompany = companyFilter === "All" || a.current_company === companyFilter;
    const matchesCategory = categoryFilter === "All" || a.alumni_category === categoryFilter;

    // Graduation Year Range Logic
    let matchesYear = true;
    if (a.graduation_year) {
      const year = parseInt(a.graduation_year);
      if (startYear) {
        matchesYear = matchesYear && year >= parseInt(startYear);
      }
      if (endYear) {
        matchesYear = matchesYear && year <= parseInt(endYear);
      }
    } else if (startYear || endYear) {
      matchesYear = false;
    }

    return matchesSearch && matchesStream && matchesCompany && matchesCategory && matchesYear;
  });

  const handleAIQuery = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiFeedback("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "filter", 
          query: aiQuery,
          availableFilters: {
            companies: companies.filter(c => c !== "All"),
            streams: streams.filter(s => s !== "All"),
            categories: categories.filter(c => c !== "All")
          }
        })
      });
      const data = await res.json();
      if (data.filters) {
        const { company, stream, category, startYear, endYear, role, search: searchField } = data.filters;
        
        if (role || searchField) {
          setSearch(role || searchField);
        } else {
          setSearch("");
        }
        
        if (company) {
          setCompanyFilter(company);
        } else {
          setCompanyFilter("All");
        }
        
        if (stream) {
          setStreamFilter(stream);
        } else {
          setStreamFilter("All");
        }
        
        if (category) {
          setCategoryFilter(category);
        } else {
          setCategoryFilter("All");
        }
        
        if (startYear) {
          setStartYear(startYear);
        } else {
          setStartYear("");
        }
        
        if (endYear) {
          setEndYear(endYear);
        } else {
          setEndYear("");
        }

        setAiFeedback(data.explanation || "Filters applied successfully!");
      } else {
        setAiFeedback("No filters could be extracted. Please refine your query.");
      }
    } catch (err) {
      console.error(err);
      setAiFeedback("Failed to process request with AI.");
    } finally {
      setAiLoading(false);
    }
  };

  // Export to Excel-compatible CSV
  const handleExportCSV = () => {
    if (filteredAlumni.length === 0) {
      alert("No data matched current filters. Generate matching profiles first.");
      return;
    }

    const headers = [
      "Full Name",
      "Role Title",
      "Current Company",
      "Degree/Stream",
      "Graduation Year",
      "Alumni Category",
      "LinkedIn URL",
      "Synced Skills",
      "Professional Bio",
      "First Scraped Experience Title",
      "First Scraped Experience Company"
    ];

    const rows = filteredAlumni.map(a => [
      a.full_name,
      a.current_role || "N/A",
      a.current_company || "N/A",
      a.stream || "N/A",
      a.graduation_year || "N/A",
      a.alumni_category || "N/A",
      a.linkedin_url || "N/A",
      (a.skills || []).join("; "),
      a.bio || "N/A",
      a.experience?.[0]?.title || "N/A",
      a.experience?.[0]?.company || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `vsit_alumni_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── CSV IMPORT FUNCTIONS ──

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setImportStatus({ type: "error", message: "Only CSV (.csv) file uploads are supported." });
      return;
    }
    
    setCsvFile(file);
    setImportStatus({ type: null, message: "" });

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsedRows = parseCSV(text);
      if (parsedRows.length < 2) {
        setImportStatus({ type: "error", message: "The CSV file is empty or lacks a header row." });
        setParsedProfiles([]);
        return;
      }
      
      const profiles = mapCSVRowsToProfiles(parsedRows);
      
      // Calculate skipped count (rows with no name)
      const skipped = (parsedRows.length - 1) - profiles.length;
      
      setParsedProfiles(profiles);
      setSkippedCount(skipped);
      
      if (profiles.length === 0) {
        setImportStatus({ type: "warning", message: "No valid rows containing a 'Full Name' were found in the file." });
      } else {
        setImportStatus({
          type: "success",
          message: `Successfully parsed ${profiles.length} profiles from "${file.name}". Click Commit to import.`
        });
      }
    };
    reader.onerror = () => {
      setImportStatus({ type: "error", message: "An error occurred while reading the file." });
    };
    reader.readAsText(file);
  };

  const handleCommitImport = async (isVerified) => {
    if (parsedProfiles.length === 0) return;
    setImportLoading(true);
    setImportStatus({ type: null, message: "" });
    
    const orgId = profile?.organization_id || "mock-org-id";
    const { error, count } = await importAlumniFromCSV(parsedProfiles, orgId, isVerified);
    
    setImportLoading(false);
    
    if (error) {
      // Graceful error display for foreign key constraint in production mode
      if (error.message?.includes("foreign key constraint") || error.code === "23503") {
        setImportStatus({
          type: "error",
          message: "Database Constraint Error: The profiles references 'auth.users' table. In production mode, you must register these user emails in Supabase Auth before importing profiles, or modify the database schema constraint. (Read settings tab for setup details)"
        });
      } else {
        setImportStatus({ type: "error", message: `Import failed: ${error.message || "Unknown error"}` });
      }
    } else {
      setImportStatus({
        type: "committed",
        message: isVerified
          ? `Successfully imported ${count} verified alumni profiles! They are now active in the directory.`
          : `Successfully submitted ${count} alumni profiles! They have been added to the Verification Queue as pending requests.`
      });
      // Clear current upload state
      setCsvFile(null);
      setParsedProfiles([]);
      setSkippedCount(0);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Full Name", "Job Title", "Company", "Graduation Year", "Stream", 
      "Alumni Category", "LinkedIn URL", "Skills", "Bio", "Industry"
    ];
    const sampleRows = [
      ["Gaurav Sawant", "Software Engineer", "Amazon", "2021", "Information Technology", "Working Professional", "https://linkedin.com/in/gaurav-sawant", "React;Node.js;AWS", "Alumni of VSIT '21, backend engineer at Amazon.", "Technology"],
      ["Sneha Patel", "Product Manager", "Flipkart", "2019", "Computer Science", "Working Professional", "https://linkedin.com/in/sneha-patel", "Product Strategy;Agile;SQL", "Product leader with ecommerce checkout experience.", "Technology"],
      ["Dr. Vikram Mehta", "AI Research Scientist", "NVIDIA", "2012", "Computer Science", "Mentor", "https://linkedin.com/in/vikram-mehta", "PyTorch;CUDA;Deep Learning", "NVIDIA researcher, happy to guide CS students.", "Tech & AI"]
    ];
    
    const content = [
      headers.join(","),
      ...sampleRows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "vsit_alumni_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <style>{`
        .filter-input { transition: all 0.2s; }
        .filter-input:focus { border-color: #F59E0B !important; }
        .tab-btn { transition: all 0.2s; position: relative; }
        .tab-btn:hover { color: #D97706 !important; }
        .dropzone { transition: all 0.2s ease-in-out; border: 2px dashed #D1D5DB; background: #F9FAFB; cursor: pointer; }
        .dropzone.drag-active { border-color: #F59E0B; background: rgba(245, 158, 11, 0.04); }
        .dropzone:hover { border-color: #F59E0B; background: rgba(245, 158, 11, 0.02); }
      `}</style>

      {/* Main Page Title */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
          Alumni Data Center
        </h1>
        <p style={{ color: "#4B5563", fontWeight: 500 }}>
          Manage your institution&apos;s alumni records. Bulk import student lists or export filtered data reports.
        </p>
      </div>

      {/* Premium Tabbed Navigation */}
      <div style={{ display: "flex", gap: 16, borderBottom: "1px solid #E5E7EB", marginBottom: 28 }}>
        <button 
          onClick={() => setActiveTab("export")}
          className="tab-btn"
          style={{
            background: "transparent", border: "none",
            borderBottom: activeTab === "export" ? "3px solid #F59E0B" : "3px solid transparent",
            color: activeTab === "export" ? "#D97706" : "#6B7280",
            padding: "12px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}
        >
          <FileSpreadsheet size={16} /> Export Reports & Query Builder
        </button>
        <button 
          onClick={() => setActiveTab("import")}
          className="tab-btn"
          style={{
            background: "transparent", border: "none",
            borderBottom: activeTab === "import" ? "3px solid #F59E0B" : "3px solid transparent",
            color: activeTab === "import" ? "#D97706" : "#6B7280",
            padding: "12px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}
        >
          <Upload size={16} /> Bulk Import Profiles (CSV)
        </button>
      </div>

      {/* ── TAB 1: EXPORT SYSTEM ── */}
      {activeTab === "export" && (
        <div>
          {/* Header Action Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
              <Filter size={20} color="#F59E0B" /> Filter & Query Builder
            </h2>
            
            <button
              onClick={handleExportCSV}
              style={{
                background: "linear-gradient(135deg, #F59E0B, #D97706)", border: "none", color: "#FFF",
                padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(245, 158, 11, 0.25)",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Download size={16} /> Export to Excel (.csv)
            </button>
          </div>

          {/* AI Query Panel */}
          <div style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.03), rgba(217, 119, 6, 0.05))",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 4px 20px rgba(245, 158, 11, 0.05)",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#D97706"
              }}>
                <Sparkles size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>AI Natural Language Query Assistant</h3>
                <p style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>
                  Search and filter directory records using plain English sentences. No student profile data leaves the server.
                </p>
              </div>
            </div>

            <form onSubmit={handleAIQuery} style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  placeholder="e.g., 'Find CS graduates from 2021 class working at Google'"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "12px 16px",
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: 10,
                    color: "#111827",
                    fontSize: 13,
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#F59E0B"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>
              <button
                type="submit"
                disabled={aiLoading}
                style={{
                  background: "linear-gradient(135deg, #111827, #1F2937)",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "0 24px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => { if (!aiLoading) e.currentTarget.style.opacity = 0.9; }}
                onMouseOut={(e) => { if (!aiLoading) e.currentTarget.style.opacity = 1; }}
              >
                {aiLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                Apply AI Filter
              </button>
            </form>

            {aiFeedback && (
              <div style={{
                marginTop: 16,
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(245, 158, 11, 0.06)",
                border: "1px solid rgba(245, 158, 11, 0.15)",
                fontSize: 12,
                color: "#B45309",
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{aiFeedback}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAiFeedback("");
                    setAiQuery("");
                    setSearch("");
                    setStreamFilter("All");
                    setCompanyFilter("All");
                    setCategoryFilter("All");
                    setStartYear("");
                    setEndYear("");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#D97706",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Filters Form Card */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", marginBottom: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
              {/* Search name */}
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Search Profile</label>
                <div style={{ position: "relative" }}>
                  <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    type="text" placeholder="Name, role, or company..." 
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="filter-input"
                    style={{ width: "100%", padding: "10px 10px 10px 30px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", fontSize: 13, outline: "none" }}
                  />
                </div>
              </div>

              {/* Stream */}
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Academic Stream</label>
                <select
                  value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)}
                  className="filter-input"
                  style={{ width: "100%", padding: "10px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", fontSize: 13, outline: "none" }}
                >
                  <option value="All">All streams</option>
                  {streams.filter(s => s !== "All").map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Company */}
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Corporate Enterprise</label>
                <select
                  value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}
                  className="filter-input"
                  style={{ width: "100%", padding: "10px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", fontSize: 13, outline: "none" }}
                >
                  <option value="All">All enterprises</option>
                  {companies.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Alumni Category</label>
                <select
                  value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                  className="filter-input"
                  style={{ width: "100%", padding: "10px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", fontSize: 13, outline: "none" }}
                >
                  <option value="All">All categories</option>
                  {categories.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Batch Range */}
            <div style={{ display: "flex", gap: 16, borderTop: "1px solid #F3F4F6", paddingTop: 16, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Graduation Year:</span>
              
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input 
                  type="number" placeholder="Start Year" 
                  value={startYear} onChange={(e) => setStartYear(e.target.value)}
                  className="filter-input"
                  style={{ width: 120, padding: "8px 12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", fontSize: 13, outline: "none" }}
                />
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>to</span>
                <input 
                  type="number" placeholder="End Year" 
                  value={endYear} onChange={(e) => setEndYear(e.target.value)}
                  className="filter-input"
                  style={{ width: 120, padding: "8px 12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827", fontSize: 13, outline: "none" }}
                />
              </div>

              <button 
                onClick={() => { setSearch(""); setStreamFilter("All"); setCompanyFilter("All"); setCategoryFilter("All"); setStartYear(""); setEndYear(""); }}
                style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#6B7280", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                onMouseOver={(e) => e.currentTarget.style.color = '#F59E0B'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6B7280'}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Matched Data Preview Table Card */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
                <FileSpreadsheet size={20} color="#F59E0B" /> Query Results Preview
              </h2>
              <span style={{ background: "rgba(245,158,11,0.08)", color: "#D97706", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                {filteredAlumni.length} graduates match
              </span>
            </div>

            {filteredAlumni.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 0", color: "#6B7280", fontWeight: 500 }}>
                No records matched your selected query parameters. Expand filters above.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #E5E7EB", color: "#6B7280", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
                      <th style={{ padding: "12px 16px" }}>Graduate Name</th>
                      <th style={{ padding: "12px 16px" }}>Current Role & Company</th>
                      <th style={{ padding: "12px 16px" }}>Stream / Branch</th>
                      <th style={{ padding: "12px 16px" }}>Batch Year</th>
                      <th style={{ padding: "12px 16px" }}>Category</th>
                      <th style={{ padding: "12px 16px" }}>LinkedIn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlumni.map(person => (
                      <tr key={person.id} style={{ borderBottom: "1px solid #E5E7EB", fontSize: 13 }}>
                        <td style={{ padding: "16px 16px", color: "#111827", fontWeight: 700 }}>{person.full_name}</td>
                        <td style={{ padding: "16px 16px", color: "#4B5563", fontWeight: 600 }}>
                          {person.current_role ? `${person.current_role} @ ` : ""}
                          <strong>{person.current_company || "Unspecified"}</strong>
                        </td>
                        <td style={{ padding: "16px 16px", color: "#4B5563", fontWeight: 500 }}>{person.stream || "N/A"}</td>
                        <td style={{ padding: "16px 16px", color: "#4B5563", fontWeight: 700 }}>{person.graduation_year || "N/A"}</td>
                        <td style={{ padding: "16px 16px" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 6, textTransform: "uppercase",
                            background: person.alumni_category === "Entrepreneur" ? "rgba(245,158,11,0.08)" : person.alumni_category === "Mentor" ? "rgba(16,185,129,0.08)" : "rgba(0,119,181,0.08)",
                            color: person.alumni_category === "Entrepreneur" ? "#D97706" : person.alumni_category === "Mentor" ? "#10B981" : "#0077B5"
                          }}>
                            {person.alumni_category || "Alumni"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 16px" }}>
                          <a 
                            href={person.linkedin_url ? (person.linkedin_url.startsWith("http") ? person.linkedin_url : `https://${person.linkedin_url}`) : "https://linkedin.com"} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ fontSize: 12, color: "#F59E0B", textDecoration: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}
                          >
                            Visit <ChevronRight size={14} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: IMPORT SYSTEM ── */}
      {activeTab === "import" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "start" }}>
          
          {/* Main Uploader and Preview Card */}
          <div>
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
                  <Upload size={20} color="#F59E0B" /> Upload CSV Sheet
                </h2>
                <button 
                  onClick={handleDownloadTemplate}
                  style={{
                    background: "transparent", border: "1px solid #E5E7EB", color: "#4B5563",
                    padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <FileText size={14} /> Download Sample Template
                </button>
              </div>

              {/* Drag and Drop Container */}
              <div 
                className={`dropzone ${dragActive ? "drag-active" : ""}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{
                  padding: "40px 20px", borderRadius: 16, textAlign: "center",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12
                }}
              >
                <input 
                  type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv"
                  style={{ display: "none" }}
                />
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(245, 158, 11, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", marginBottom: 4 }}>
                  <Upload size={24} />
                </div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                    {csvFile ? `Selected: ${csvFile.name}` : "Drag and drop your CSV file here"}
                  </span>
                  <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                    {csvFile ? `Size: ${(csvFile.size / 1024).toFixed(1)} KB` : "or click to browse local files"}
                  </p>
                </div>
              </div>

              {/* Status & Warning Banners */}
              {importStatus.type && (
                <div style={{
                  marginTop: 20, padding: 16, borderRadius: 12, display: "flex", gap: 12, alignItems: "start",
                  background: importStatus.type === "error" ? "rgba(239, 68, 68, 0.05)" : importStatus.type === "warning" ? "rgba(245, 158, 11, 0.05)" : "rgba(16, 185, 129, 0.05)",
                  border: `1px solid ${importStatus.type === "error" ? "rgba(239, 68, 68, 0.15)" : importStatus.type === "warning" ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)"}`,
                  color: importStatus.type === "error" ? "#EF4444" : importStatus.type === "warning" ? "#D97706" : "#10B981"
                }}>
                  {importStatus.type === "error" ? (
                    <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  ) : importStatus.type === "committed" || importStatus.type === "success" ? (
                    <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                  ) : (
                    <Info size={20} style={{ flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                      {importStatus.type === "error" ? "Parsing Failed" : importStatus.type === "committed" ? "Import Successful" : "Validation Stats"}
                    </div>
                    <p style={{ fontSize: 12, marginTop: 4, fontWeight: 500, lineHeight: 1.5, color: "#4B5563" }}>
                      {importStatus.message}
                    </p>
                    {skippedCount > 0 && importStatus.type !== "committed" && (
                      <p style={{ fontSize: 11, color: "#EF4444", marginTop: 4, fontWeight: 600 }}>
                        * Note: {skippedCount} rows skipped due to missing name credentials.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Real DB Warning Info Banner */}
              {!isMock && (
                <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "rgba(211, 47, 47, 0.05)", border: "1px solid rgba(211, 47, 47, 0.1)", display: "flex", gap: 12, color: "#D32F2F" }}>
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.5 }}>
                    <strong style={{ fontWeight: 700 }}>Production Mode Active:</strong> Direct CSV insert into the <code>profiles</code> table requires matching accounts to exist in Supabase Auth. For independent mock listings, please sign out and utilize the local Demo Admin session, or run the custom schema migrations detailed in the guide on the right.
                  </div>
                </div>
              )}

              {/* Actions Commit Bar */}
              {parsedProfiles.length > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #E5E7EB", paddingTop: 20, marginTop: 24 }}>
                  <button 
                    onClick={() => { setCsvFile(null); setParsedProfiles([]); setImportStatus({ type: null, message: "" }); }}
                    style={{
                      background: "transparent", border: "1px solid #E5E7EB", color: "#6B7280",
                      padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
                      marginLeft: "auto"
                    }}
                  >
                    Clear File
                  </button>
                  <button 
                    onClick={() => handleCommitImport(false)}
                    disabled={importLoading}
                    style={{
                      background: "transparent", border: "1px solid #D1D5DB", color: "#4B5563",
                      padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: importLoading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", gap: 8, opacity: importLoading ? 0.7 : 1
                    }}
                  >
                    Submit as Requests
                  </button>
                  <button 
                    onClick={() => handleCommitImport(true)}
                    disabled={importLoading}
                    style={{
                      background: "linear-gradient(135deg, #F59E0B, #D97706)", border: "none", color: "#FFF",
                      padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: importLoading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", gap: 8, opacity: importLoading ? 0.7 : 1
                    }}
                  >
                    {importLoading ? <RefreshCw size={14} className="animate-spin" /> : null}
                    Commit Verified Profiles
                  </button>
                </div>
              )}
            </div>

            {/* Parsed Rows Preview Table */}
            {parsedProfiles.length > 0 && (
              <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Parsed Records Preview</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #E5E7EB", color: "#6B7280", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
                        <th style={{ padding: "10px 12px" }}>Name</th>
                        <th style={{ padding: "10px 12px" }}>Job Designation</th>
                        <th style={{ padding: "10px 12px" }}>Academic Stream</th>
                        <th style={{ padding: "10px 12px" }}>Batch</th>
                        <th style={{ padding: "10px 12px" }}>Skills</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedProfiles.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB", fontSize: 12 }}>
                          <td style={{ padding: "12px", color: "#111827", fontWeight: 700 }}>{p.full_name}</td>
                          <td style={{ padding: "12px", color: "#4B5563" }}>
                            {p.current_role ? `${p.current_role} @ ` : ""}
                            <strong>{p.current_company || "N/A"}</strong>
                          </td>
                          <td style={{ padding: "12px", color: "#4B5563" }}>{p.stream || "N/A"}</td>
                          <td style={{ padding: "12px", color: "#4B5563", fontWeight: 700 }}>{p.graduation_year || "N/A"}</td>
                          <td style={{ padding: "12px" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {p.skills.slice(0, 3).map((s, sIdx) => (
                                <span key={sIdx} style={{ fontSize: 9, background: "#F3F4F6", color: "#4B5563", padding: "2px 6px", borderRadius: 4, fontWeight: 500 }}>
                                  {s}
                                </span>
                              ))}
                              {p.skills.length > 3 ? (
                                <span style={{ fontSize: 9, color: "#9CA3AF" }}>+{p.skills.length - 3}</span>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines Sidebar Card */}
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <HelpCircle size={16} color="#F59E0B" /> Column Mapping Guide
              </h3>
              <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5, marginBottom: 16, fontWeight: 500 }}>
                The parser automatically detects headers case-insensitively. Please name your columns matching these titles or aliases:
              </p>
              
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { field: "Full Name", aliases: "Name, full_name, fullname", required: true },
                  { field: "Job Title", aliases: "Role, designation, current_role", required: false },
                  { field: "Company", aliases: "Current Company, organization, employer", required: false },
                  { field: "Graduation Year", aliases: "Year, batch, class, graduation_year", required: false },
                  { field: "Stream", aliases: "Major, degree, branch, department", required: false },
                  { field: "Skills", aliases: "Tags, key skills (semicolon or comma split)", required: false },
                  { field: "Alumni Category", aliases: "Category (e.g. Entrepreneur, Mentor)", required: false },
                  { field: "Bio", aliases: "Summary, biography, about", required: false }
                ].map((item, i) => (
                  <div key={i} style={{ borderBottom: "1px solid #F3F4F6", paddingBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{item.field}</span>
                      {item.required ? (
                        <span style={{ fontSize: 9, background: "rgba(239, 68, 68, 0.08)", color: "#EF4444", padding: "1px 6px", borderRadius: 4, fontWeight: 700, textTransform: "uppercase" }}>Required</span>
                      ) : (
                        <span style={{ fontSize: 9, background: "#F3F4F6", color: "#6B7280", padding: "1px 6px", borderRadius: 4, fontWeight: 700, textTransform: "uppercase" }}>Optional</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2, fontStyle: "italic" }}>
                      Aliases: {item.aliases}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 20, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <Info size={16} color="#0077B5" /> Supabase DB Schema Adjustment
              </h3>
              <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5, marginBottom: 12, fontWeight: 500 }}>
                To support direct CSV imports in real production mode (without user authorization steps), run the following SQL command in your Supabase SQL Editor. This drops the mandatory foreign key link from <code>profiles.id</code> to <code>auth.users</code>:
              </p>
              <pre style={{
                background: "#F3F4F6", padding: 12, borderRadius: 8, fontSize: 10, fontFamily: "monospace",
                color: "#1F2937", border: "1px solid #E5E7EB", overflowX: "auto", marginBottom: 12
              }}>
{`-- Make auth relationship optional:
ALTER TABLE profiles 
DROP CONSTRAINT profiles_id_fkey;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE SET NULL;`}
              </pre>
              <p style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>
                * Running this sql script allows the profile database rows to exist independently and automatically associate with users if they log in later using matching IDs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
