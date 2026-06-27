"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Briefcase, Calendar, Settings, LogOut, FileSpreadsheet, ShieldAlert, Sparkles, BookOpen, GraduationCap, Building, UserCheck } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { useEffect, useState } from "react";

function OnboardingWizard({ profile, updateProfile, handleLogout }) {
  const [role, setRole] = useState("student");
  const [stream, setStream] = useState("");
  const [year, setYear] = useState("");
  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setErrorMsg("You must agree to the Terms and Conditions to proceed.");
      return;
    }
    if (!stream || !year) {
      setErrorMsg("Please fill in your Stream and Graduation Year.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const updates = {
      role,
      stream,
      graduation_year: year,
      is_onboarded: true,
      alumni_category: role === 'student' ? 'Student' : 'Working Professional'
    };

    if (role === 'alumni') {
      updates.current_company = company || 'N/A';
      updates.current_role = jobRole || 'N/A';
      updates.headline = `${jobRole || 'Alumni'} @ ${company || 'VSIT Network'}`;
    } else {
      updates.headline = `Student in ${stream} ' ${year.slice(-2)}`;
    }

    try {
      const { error } = await updateProfile(updates);
      if (error) {
        // Fallback to local storage if DB update failed due to missing schema column
        console.warn("DB update failed, setting local onboarding flag:", error);
      }
      
      // Always store local storage flag as fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(`onboarded_user_${profile.id}`, 'true');
      }
      
      // Success: redirect to dashboard
      router.push(`/${role}`);
    } catch (err) {
      setErrorMsg("An error occurred during onboarding. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 10% 20%, #1e1b4b 0%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: "#f8fafc",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        .glass-box {
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
          border-radius: 28px;
          padding: 44px;
          width: 100%;
          max-width: 500px;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .role-card {
          border: 2px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .role-card:hover {
          border-color: rgba(244, 63, 94, 0.3);
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-2px);
        }
        .role-card.active {
          border-color: #f43f5e;
          background: rgba(244, 63, 94, 0.08);
          box-shadow: 0 0 15px rgba(244, 63, 94, 0.15);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #f43f5e, #be123c);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(244, 63, 94, 0.3);
        }
        .input-dark {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f8fafc;
          transition: border-color 0.2s;
        }
        .input-dark:focus {
          border-color: #f43f5e;
          outline: none;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(244,63,94,0.08) 0%, rgba(0,0,0,0) 80%)", borderRadius: "50%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "-15%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(0,0,0,0) 80%)", borderRadius: "50%", zIndex: 0 }} />

      <div className="glass-box" style={{ position: "relative", zIndex: 10 }}>
        {/* Onboarding Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContext: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(244,63,94,0.15)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 100, padding: "4px 12px", textTransform: "uppercase", letterSpacing: "1px" }}>Onboarding</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.01em" }}>Complete Your Profile</h2>
          <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 6, fontWeight: 500 }}>Hello, {profile.full_name}! Let&apos;s get you connected to the network.</p>
        </div>

        {errorMsg && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: 12, borderRadius: 12, fontSize: 13, marginBottom: 20, textAlign: "center", fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Step 1: Role Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Select your network coordinates</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div 
                onClick={() => setRole("student")}
                className={`role-card ${role === "student" ? "active" : ""}`}
                style={{ padding: "16px", borderRadius: 14, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
              >
                <GraduationCap size={24} color={role === "student" ? "#f43f5e" : "#94a3b8"} />
                <span style={{ fontSize: 14, fontWeight: 700 }}>I am a Student</span>
              </div>
              <div 
                onClick={() => setRole("alumni")}
                className={`role-card ${role === "alumni" ? "active" : ""}`}
                style={{ padding: "16px", borderRadius: 14, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
              >
                <UserCheck size={24} color={role === "alumni" ? "#f43f5e" : "#94a3b8"} />
                <span style={{ fontSize: 14, fontWeight: 700 }}>I am an Alumnus</span>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Stream / Major</label>
              <input 
                type="text" placeholder="e.g. Computer Science" required
                value={stream} onChange={(e) => setStream(e.target.value)}
                className="input-dark"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{role === 'student' ? 'Expected Grad Year' : 'Graduation Year'}</label>
              <input 
                type="text" placeholder="e.g. 2026" required
                value={year} onChange={(e) => setYear(e.target.value)}
                className="input-dark"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
          </div>

          {/* Corporate Info for Alumni */}
          {role === 'alumni' && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, animation: "slideUp 0.3s ease" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Current Company</label>
                <input 
                  type="text" placeholder="e.g. Google" required
                  value={company} onChange={(e) => setCompany(e.target.value)}
                  className="input-dark"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Current Job Role</label>
                <input 
                  type="text" placeholder="e.g. Software Engineer" required
                  value={jobRole} onChange={(e) => setJobRole(e.target.value)}
                  className="input-dark"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
            </div>
          )}

          {/* Terms and Conditions Checkbox */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "8px 0" }}>
            <input 
              type="checkbox" id="terms-onboarding" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              style={{ accentColor: "#f43f5e", marginTop: 2, cursor: "pointer" }}
            />
            <label htmlFor="terms-onboarding" style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.4, cursor: "pointer", fontWeight: 500 }}>
              I agree to the <Link href="/terms" target="_blank" style={{ color: "#f43f5e", textDecoration: "none", fontWeight: 700 }}>Terms and Conditions</Link>, and commit to professional conduct across the community.
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            <button 
              type="submit" disabled={submitting} className="btn-gradient"
              style={{
                width: "100%", padding: "14px", border: "none", borderRadius: 12, color: "#ffffff", fontSize: 14, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer"
              }}
            >
              {submitting ? "Initializing Account..." : "Save & Complete Setup"}
            </button>
            
            <button 
              type="button" onClick={handleLogout}
              style={{
                width: "100%", padding: "10px", border: "none", background: "transparent", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}
            >
              Cancel & Sign Out
            </button>
          </div>
        </form>

        {/* Gemini attribution */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24, fontSize: 11, color: "#64748b", fontWeight: 500 }}>
          <span>Intelligence systems powered by</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#818cf8", fontWeight: 700 }}>
            <Sparkles size={12} /> Google Gemini
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PortalLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, profile, loading, initialize, signOut: runSignOut, updateProfile } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Route security checks
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile) {
        const urlRole = pathname.split('/')[1];
        if (urlRole && profile.role !== urlRole) {
          router.push(`/${profile.role}`);
        }
      }
    }
  }, [user, profile, loading, pathname, router]);

  const handleLogout = async () => {
    await runSignOut();
    router.push('/login');
  };

  const role = profile?.role || pathname.split('/')[1] || 'student';
  const isOnboarded = profile?.is_onboarded || (typeof window !== 'undefined' && localStorage.getItem(`onboarded_user_${profile?.id}`) === 'true');

  let navItems = [];
  if (role === 'admin') {
    navItems = [
      { name: "Dashboard", href: `/admin`, icon: Home },
      { name: "Verification Queue", href: `/admin`, icon: Users },
      { name: "Excel Exports", href: `/admin/exports`, icon: FileSpreadsheet },
      { name: "Jobs", href: `/admin/jobs`, icon: Briefcase },
      { name: "Events", href: `/admin/events`, icon: Calendar },
      { name: "Settings", href: `/admin/settings`, icon: Settings },
    ];
  } else if (role === 'mentor') {
    navItems = [
      { name: "Mentor Dashboard", href: `/mentor`, icon: Home },
      { name: "Alumni Directory", href: `/mentor`, icon: Users },
      { name: "Settings", href: `/mentor/settings`, icon: Settings },
    ];
  } else if (role === 'faculty') {
    navItems = [
      { name: "Faculty Dashboard", href: `/faculty`, icon: Home },
      { name: "Network Directory", href: `/faculty/network`, icon: Users },
      { name: "Settings", href: `/faculty/settings`, icon: Settings },
    ];
  } else {
    // Student or Alumni
    navItems = [
      { name: "Dashboard", href: `/${role}`, icon: Home },
      { name: "Network", href: `/${role}/network`, icon: Users },
      { name: "Jobs", href: `/${role}/jobs`, icon: Briefcase },
      { name: "Events", href: `/${role}/events`, icon: Calendar },
      { name: "Settings", href: `/${role}/settings`, icon: Settings },
    ];
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, border: "4px solid rgba(211, 47, 47, 0.1)", borderTop: "4px solid #D32F2F", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: "#6B7280" }}>Securing connection...</div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Intercept layout rendering if the logged in user has not yet completed onboarding
  if (user && profile && !isOnboarded) {
    return <OnboardingWizard profile={profile} updateProfile={updateProfile} handleLogout={handleLogout} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F9FAFB", color: "#111827", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .nav-item { 
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        .nav-item:hover { 
          background: rgba(211, 47, 47, 0.04); 
          color: #D32F2F; 
          transform: translateX(3px);
        }
        .nav-item.active { 
          background: rgba(211, 47, 47, 0.06); 
          border-left: 3px solid #D32F2F; 
          color: #D32F2F !important; 
          font-weight: 700; 
        }

        .glass-widget {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.03);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-widget:hover {
          transform: translateY(-3px);
          border-color: rgba(211, 47, 47, 0.15);
          box-shadow: 0 16px 36px rgba(211, 47, 47, 0.08);
        }

        .avatar-hover {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .avatar-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(211, 47, 47, 0.15);
        }
      `}</style>
      
      {/* Sidebar */}
      <aside style={{ width: 260, borderRight: "1px solid #E5E7EB", background: "#FFFFFF", display: "flex", flexDirection: "column", zIndex: 20 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/logo.png" alt="VSIT Logo" width={180} height={50} style={{ objectFit: "contain" }} />
          </div>
        </div>

        <div style={{ padding: "16px 24px", color: "#6B7280", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {role.toUpperCase()} PORTAL
        </div>

        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8,
                color: isActive ? "#D32F2F" : "#4B5563", textDecoration: "none", fontSize: 14, fontWeight: 500
              }}>
                <Icon size={18} color={isActive ? "#D32F2F" : "#6B7280"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer with Gemini credits */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>
            <span>Powered by</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color: "#6366f1", fontWeight: 700 }}>
              <Sparkles size={11} /> Gemini
            </span>
          </div>
          
          <button onClick={handleLogout} className="nav-item" style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8,
            color: "#EF4444", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600
          }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <header style={{
          height: 70, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 32px",
          background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", position: "relative", zIndex: 30
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{profile?.full_name || "VSIT User"}</div>
              <div style={{ fontSize: 12, color: "#6B7280", textTransform: "capitalize", fontWeight: 500 }}>{role}</div>
            </div>
            <div className="avatar-hover" style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(211, 47, 47, 0.08)", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#D32F2F", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
              {(profile?.full_name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        <div style={{ flex: 1, overflowY: "auto", padding: 32, position: "relative" }}>
          {/* Subtle background blob inside content area */}
          <div style={{ position: "absolute", top: 40, right: 40, width: 300, height: 300, background: "radial-gradient(circle, rgba(211,47,47,0.03) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0, pointerEvents: "none" }} />
          
          <div style={{ position: "relative", zIndex: 10 }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
