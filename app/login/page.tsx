"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
    <div className="fixed inset-0 bg-black">
      {/* Background (image + orange gradient like your reference) */}
      <div className="absolute inset-0">
        <Image
          src="/auth/hero.jpg"
          alt="BearFitPH hero"
          fill
          priority
          className="object-cover"
        />
        {/* Darken for readability */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Orange wash gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F37120]/55 via-[#F37120]/20 to-black/80" />
      </div>

      {/* App frame like your onboarding (desktop gutters) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp .45s ease-out forwards; }
        `}</style>

        <div className="w-full h-full md:max-w-[430px] md:rounded-2xl overflow-hidden bg-black/30 md:bg-black/20 md:ring-1 md:ring-white/10">
          <div className={`h-full px-6 py-8 flex items-center ${mounted ? "fade-up" : "opacity-0"}`}>
            <div className="w-full max-w-sm mx-auto">
              {/* Brand header */}
              <div className="text-center mb-7">
                <div className="text-3xl font-extrabold tracking-tight text-white">
                  Bear<span className="text-[#F37120]">Fit</span>PH
                </div>
                <div className="text-white/80 mt-2">
                  {mode === "login"
                    ? "Welcome back. Let’s get you moving."
                    : "Forgot your password? We’ll send a reset link."}
                </div>
              </div>

              {/* Glass card like reference */}
              <div className="rounded-2xl bg-black/35 backdrop-blur-xl border border-white/10 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.55)]">
                {mode === "login" ? (
                  <div className="space-y-4">
                    <Field
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={setEmail}
                    />
                    <Field
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={setPassword}
                    />

                    {err && (
                      <div className="text-red-300 text-sm text-center">
                        {err}
                      </div>
                    )}
                    {msg && (
                      <div className="text-green-200 text-sm text-center">
                        {msg}
                      </div>
                    )}

                    <button
                      onClick={handleLogin}
                      disabled={loading || !email || !password}
                      className="w-full rounded-full bg-[#F37120] py-3 font-semibold text-black disabled:opacity-60 active:scale-[0.99] transition"
                    >
                      {loading ? "Logging in…" : "Log in"}
                    </button>

                    <div className="pt-2 text-center space-y-3 text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setResetEmail(email || "");
                          setErr(null);
                          setMsg(null);
                        }}
                        className="text-white/80 underline underline-offset-4"
                      >
                        Forgot password?
                      </button>

                      <div className="text-white/70">
                        New here?{" "}
                        <a
                          href="/onboarding?preview=1"
                          className="text-white underline underline-offset-4 font-semibold"
                        >
                          Book a free assessment
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Field
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={setResetEmail}
                    />

                    {err && (
                      <div className="text-red-300 text-sm text-center">
                        {err}
                      </div>
                    )}
                    {msg && (
                      <div className="text-green-200 text-sm text-center">
                        {msg}
                      </div>
                    )}

                    <button
                      onClick={handleForgotPassword}
                      disabled={loading || !resetEmail}
                      className="w-full rounded-full bg-[#F37120] py-3 font-semibold text-black disabled:opacity-60 active:scale-[0.99] transition"
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
                      className="w-full rounded-full border border-white/20 py-3 font-semibold text-white/90 bg-white/5 active:scale-[0.99] transition"
                    >
                      Back to login
                    </button>
                  </div>
                )}
              </div>

              {/* Footer tip (kept from your existing) */}
              <div className="mt-6 text-center text-xs text-white/60">
                Tip: Staff and Members use the same login. Your role decides where you land.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small reusable input */
function Field({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/55
                 focus:outline-none focus:ring-2 focus:ring-[#F37120] focus:border-transparent"
    />
  );
}
