"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, Users, Calendar, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F9FAFB", minHeight: "100vh", color: "#111827", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUpAnim 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes fadeUpAnim {
          to { opacity: 1; transform: translateY(0); }
        }

        .hover-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(211, 47, 47, 0.12);
        }

        .gradient-text {
          background: linear-gradient(135deg, #D32F2F, #B71C1C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .primary-btn {
          background: linear-gradient(135deg, #D32F2F, #B71C1C);
          color: white;
          transition: all 0.2s ease;
        }
        .primary-btn:hover {
          box-shadow: 0 8px 24px rgba(211, 47, 47, 0.3);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Navigation */}
      <nav style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, 
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", 
        borderBottom: "1px solid rgba(0,0,0,0.05)" 
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* VSIT Logo Style */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.png" alt="VSIT Logo" width={220} height={60} style={{ objectFit: "contain" }} />
          </div>

          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Link href="#features" style={{ textDecoration: "none", color: "#4B5563", fontSize: 15, fontWeight: 500 }}>Features</Link>
            <Link href="#about" style={{ textDecoration: "none", color: "#4B5563", fontSize: 15, fontWeight: 500 }}>About</Link>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button className="primary-btn" style={{ 
                padding: "10px 24px", borderRadius: 100, border: "none", 
                fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
              }}>
                Portal Login <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        paddingTop: 160, paddingBottom: 100, paddingLeft: 24, paddingRight: 24, 
        position: "relative", overflow: "hidden" 
      }}>
        {/* Background Decorative Blobs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, background: "radial-gradient(circle, rgba(211,47,47,0.08) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: -200, left: -200, width: 800, height: 800, background: "radial-gradient(circle, rgba(43,58,103,0.05) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
          {mounted && (
            <>
              <div className="fade-up" style={{ display: "inline-block", background: "rgba(211,47,47,0.1)", color: "#D32F2F", padding: "6px 16px", borderRadius: 100, fontSize: 14, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 24 }}>
                The Official VSIT Alumni Network
              </div>
              <h1 className="fade-up" style={{ fontSize: "4.5rem", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.03em" }}>
                Empowering the Next <br/> Generation of <span className="gradient-text">Innovators</span>
              </h1>
              <p className="fade-up" style={{ animationDelay: "0.1s", fontSize: "1.25rem", color: "#4B5563", maxWidth: 600, margin: "0 auto", marginBottom: 40, lineHeight: 1.6 }}>
                Connect with Vidyalankar alumni, discover exclusive career opportunities, and foster mentorships that drive lifelong success.
              </p>
              <div className="fade-up" style={{ animationDelay: "0.2s", display: "flex", gap: 16, justifyContent: "center" }}>
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <button className="primary-btn" style={{ 
                    padding: "16px 40px", borderRadius: 100, border: "none", 
                    fontSize: 16, fontWeight: 700, cursor: "pointer"
                  }}>
                    Join the Network
                  </button>
                </Link>
                <Link href="#features" style={{ textDecoration: "none" }}>
                  <button style={{ 
                    padding: "16px 40px", borderRadius: 100, background: "white", color: "#111827",
                    border: "1px solid #E5E7EB", fontSize: 16, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.02)", transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    Learn More
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section style={{ borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6", background: "white", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#111827" }}>10k+</div>
            <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 500, textTransform: "uppercase" }}>Active Alumni</div>
          </div>
          <div style={{ width: 1, height: 60, background: "#E5E7EB" }} />
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#111827" }}>500+</div>
            <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 500, textTransform: "uppercase" }}>Jobs Posted</div>
          </div>
          <div style={{ width: 1, height: 60, background: "#E5E7EB" }} />
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#111827" }}>1k+</div>
            <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 500, textTransform: "uppercase" }}>Mentorships</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "120px 24px", background: "#F9FAFB" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111827", marginBottom: 16 }}>Everything You Need to Thrive</h2>
            <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: 600, margin: "0 auto" }}>
              Our platform bridges the gap between students and successful alumni, providing powerful tools for career growth.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            
            {/* Card 1 */}
            <div className="hover-card" style={{ background: "white", padding: 40, borderRadius: 24, border: "1px solid #F3F4F6", position: "relative", overflow: "hidden" }}>
              <div style={{ width: 64, height: 64, background: "rgba(211,47,47,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Users size={32} color="#D32F2F" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111827" }}>1-on-1 Mentorship</h3>
              <p style={{ color: "#6B7280", lineHeight: 1.6 }}>
                Connect directly with experienced alumni who have walked your path. Get personalized guidance, resume reviews, and interview prep.
              </p>
            </div>

            {/* Card 2 */}
            <div className="hover-card" style={{ background: "white", padding: 40, borderRadius: 24, border: "1px solid #F3F4F6", position: "relative", overflow: "hidden" }}>
              <div style={{ width: 64, height: 64, background: "rgba(43,58,103,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Briefcase size={32} color="#2B3A67" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111827" }}>Exclusive Job Board</h3>
              <p style={{ color: "#6B7280", lineHeight: 1.6 }}>
                Access internships and full-time roles posted exclusively for VSIT students by alumni working at top tech companies.
              </p>
            </div>

            {/* Card 3 */}
            <div className="hover-card" style={{ background: "white", padding: 40, borderRadius: 24, border: "1px solid #F3F4F6", position: "relative", overflow: "hidden" }}>
              <div style={{ width: 64, height: 64, background: "rgba(211,47,47,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Calendar size={32} color="#D32F2F" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111827" }}>Networking Events</h3>
              <p style={{ color: "#6B7280", lineHeight: 1.6 }}>
                RSVP to virtual mixers, on-campus alumni panels, and skill-building workshops hosted directly by the community.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 24px", background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "white", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <ShieldCheck size={48} color="rgba(255,255,255,0.8)" style={{ marginBottom: 24 }} />
          <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 24 }}>Ready to Elevate Your Career?</h2>
          <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.9)", marginBottom: 40 }}>
            Join thousands of VSIT students and alumni actively shaping the future.
          </p>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button style={{ 
              padding: "18px 48px", borderRadius: 100, background: "white", color: "#D32F2F", 
              border: "none", fontSize: 18, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 12px 24px rgba(0,0,0,0.15)", transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.2)' }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)' }}
            >
              Access Portal
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#111827", color: "#9CA3AF", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: "white", letterSpacing: "1px" }}>
            VSIT <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 400, color: "#6B7280" }}>Alumni Network</span>
          </div>
          <p style={{ textAlign: "center", maxWidth: 400 }}>
            Vidyalankar School of Information Technology<br/>
            Wadala (East), Mumbai
          </p>
          <div style={{ width: "100%", height: 1, background: "#1F2937", margin: "24px 0" }} />
          <div style={{ fontSize: 14 }}>
            © {new Date().getFullYear()} VSIT. Built for the community.
          </div>
        </div>
      </footer>
    </div>
  );
}
