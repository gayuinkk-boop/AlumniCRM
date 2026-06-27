"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/store/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const { initialize } = useAuth();

  useEffect(() => {
    let active = true;

    async function handleCallback() {
      try {
        // Parse the URL parameters to check for OAuth parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        // Handle OAuth error parameter if returned by provider
        const errorParam = urlParams.get("error");
        const errorDesc = urlParams.get("error_description");
        if (errorParam) {
          throw new Error(errorDesc || errorParam);
        }

        const code = urlParams.get("code");
        let activeSession = null;

        if (code) {
          // Explicitly exchange the OAuth code for a session on the client
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          activeSession = data.session;
        } else {
          // Retrieve the current session (e.g. from cache or local persistence)
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          activeSession = session;
        }

        if (activeSession && activeSession.user) {
          if (!active) return;
          // Fetch the profile to redirect to the correct portal role
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", activeSession.user.id)
            .single();

          if (profileError && profileError.code !== "PGRST116") {
            throw profileError;
          }

          // Re-initialize our auth store to pick up the new session
          await initialize();

          const role = profile?.role || "student";
          router.push(`/${role}`);
        } else {
          // If no session found yet, let's listen to auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session && session.user) {
              if (!active) return;
              const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", session.user.id)
                .single();
              
              await initialize();
              const role = profile?.role || "student";
              subscription.unsubscribe();
              router.push(`/${role}`);
            }
          });

          // Timeout after 15 seconds if no auth state triggers
          const timeout = setTimeout(() => {
            if (active) {
              subscription.unsubscribe();
              setError("Authentication timeout. Please try logging in again.");
            }
          }, 15000);

          return () => {
            active = false;
            clearTimeout(timeout);
            subscription.unsubscribe();
          };
        }
      } catch (err) {
        console.error("Callback handling error:", err);
        if (active) {
          setError(err.message || "Failed to process auth callback.");
        }
      }
    }

    handleCallback();

    return () => {
      active = false;
    };
  }, [router, initialize]);

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#F9FAFB",
      color: "#111827",
      padding: 24
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
      `}</style>
      
      {error ? (
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#EF4444", marginBottom: 12 }}>Authentication Error</h2>
          <p style={{ color: "#4B5563", fontSize: 14, marginBottom: 24, fontWeight: 500 }}>{error}</p>
          <button
            onClick={() => router.push("/login")}
            style={{
              background: "linear-gradient(135deg, #D32F2F, #B71C1C)",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 20px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Loader2 size={36} color="#D32F2F" className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Completing Sign In</h2>
          <p style={{ color: "#6B7280", fontSize: 13, fontWeight: 500 }}>Exchanging credentials and loading your portal experience...</p>
        </div>
      )}
    </div>
  );
}
