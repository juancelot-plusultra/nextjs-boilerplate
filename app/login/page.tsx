"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Role = "member" | "staff" | "admin";

function normalizeRole(v: any): Role {
  const s = String(v ?? "").toLowerCase();
  if (s === "staff" || s === "admin") return s as Role;
  return "member";
}

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // forgot password
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [resetEmail, setResetEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const title = useMemo(
    () => (
      <h1 className="text-3xl font-bold text-white">
        Bear<span className="text-[#F37120]">Fit</span>PH
      </h1>
    ),
    []
  );

  async function resolveRoleAndRedirect(userId: string) {
    // 1) Try profiles.role (if table exists)
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    let role: Role | null = profileData?.role
      ? normalizeRole(profileData.role)
      : null;

    // 2) Fallback to user_metadata.role
    if (!role) {
      const { data } = await supabase.auth.getUser();
      role = normalizeRole(data?.user?.user_metadata?.role);
    }

    // 3) Default member
    if (!role) role = "member";

    // Redirect
    if (role === "staff" || role === "admin") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/member/dashboard";
    }
  }

  async function handleLogin() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setErr("Login succeeded but user ID is missing.");
      setLoading(false);
      return;
    }

    await resolveRoleAndRedirect(userId);
  }

  async function handleForgotPassword() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    // Send reset email, redirect back to your app reset page
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo,
    });

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    setMsg("Reset link sent. Check your email to set a new password.");
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Simple app-like animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp .5s ease-out forwards; }
      `}</style>

      <div className="w-full h-full md:max-w-[430px] md:rounded-2xl bg-[#0b0b0b] flex items-center justify-center px-6">
        <div className={`w-full max-w-sm ${mounted ? "fade-up" : "opacity-0"}`}>
          <div className="text-center mb-8">
            {title}
            <p className="text-white/70 text-sm mt-2">
              {mode === "login"
                ? "Welcome back. Let’s get you moving."
                : "Forgot your password? We’ll send a reset link."}
            </p>
          </div>

          {mode === "login" ? (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#F37120]"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#F37120]"
              />

              {err && <div className="text-red-400 text-sm text-center">{err}</div>}
              {msg && <div className="text-green-300 text-sm text-center">{msg}</div>}

              <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="w-full rounded-full bg-[#F37120] py-3 font-semibold text-black disabled:opacity-60"
              >
                {loading ? "Logging in…" : "Log in"}
              </button>

              <div className="mt-6 text-center space-y-3 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setResetEmail(email || "");
                    setErr(null);
                    setMsg(null);
                  }}
                  className="text-white/70 underline underline-offset-4"
                >
                  Forgot password?
                </button>

                <div className="text-white/50">
                  New here?{" "}
                  <a
                    href="/onboarding?preview=1"
                    className="underline underline-offset-4 text-white"
                  >
                    Book a free assessment
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#F37120]"
              />

              {err && <div className="text-red-400 text-sm text-center">{err}</div>}
              {msg && <div className="text-green-300 text-sm text-center">{msg}</div>}

              <button
                onClick={handleForgotPassword}
                disabled={loading || !resetEmail}
                className="w-full rounded-full bg-[#F37120] py-3 font-semibold text-black disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErr(null);
                  setMsg(null);
                }}
                className="w-full rounded-full border border-white/20 py-3 font-semibold text-white/90"
              >
                Back to login
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-xs text-white/40">
            Tip: Staff and Members use the same login. Your role decides where you land.
          </div>
        </div>
      </div>
    </div>
  );
}
