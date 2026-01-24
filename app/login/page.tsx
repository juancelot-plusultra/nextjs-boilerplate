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

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const redirectToReset = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/reset-password`;
  }, []);

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

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: redirectToReset,
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
    <div className="min-h-screen bg-[#EEF0F6] flex items-center justify-center px-4">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp .45s ease-out forwards; }
      `}</style>

      <div
        className={[
          "w-full max-w-[430px] rounded-[44px] bg-white shadow-[0_16px_60px_rgba(16,24,40,0.18)]",
          "px-8 pt-10 pb-8",
          mounted ? "fade-up" : "opacity-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-tight text-[#111827]">
            Bear<span className="text-[#F37120]">Fit</span>PH
          </div>

          <h1 className="mt-8 text-3xl font-extrabold text-[#111827]">
            Hello Again
          </h1>

          <p className="mt-3 text-[#6B7280] text-base leading-snug">
            {mode === "login"
              ? "Welcome back — you’ve been missed!"
              : "Enter your email and we’ll send a reset link."}
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-4">
          {mode === "login" ? (
            <>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={setEmail}
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={setPassword}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="p-2 text-[#9CA3AF] hover:text-[#111827] transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon />
                    </button>
                  }
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setResetEmail(email || "");
                    setErr(null);
                    setMsg(null);
                  }}
                  className="text-sm font-semibold text-[#F37120] hover:opacity-80"
                >
                  Forgot Password?
                </button>
              </div>

              {err && (
                <div className="text-sm text-red-600 text-center">{err}</div>
              )}
              {msg && (
                <div className="text-sm text-green-700 text-center">{msg}</div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="w-full mt-2 rounded-full bg-[#F37120] py-4 font-extrabold text-white text-lg
                           disabled:opacity-60 active:scale-[0.99] transition"
              >
                {loading ? "Signing In…" : "Sign In"}
              </button>

              {/* Divider + social (UI only placeholders) */}
              <div className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                  <div className="text-xs text-[#9CA3AF]">Or continue with</div>
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                </div>

                <div className="mt-4 flex justify-center gap-4">
                  <SocialButton label="Google">
                    <GoogleIcon />
                  </SocialButton>
                  <SocialButton label="Apple">
                    <AppleIcon />
                  </SocialButton>
                  <SocialButton label="Facebook">
                    <FacebookIcon />
                  </SocialButton>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-[#6B7280]">
                Not a member?{" "}
                <a
                  href="/onboarding?preview=1"
                  className="font-semibold text-[#F37120] hover:opacity-80"
                >
                  Register now
                </a>
              </div>

              <div className="mt-6 text-center text-xs text-[#9CA3AF] leading-relaxed">
                Tip: Staff and Members use the same login. Your role decides where you land.
              </div>

              <div className="mt-3 text-center text-xs text-[#9CA3AF]">
                New here?{" "}
                <a
                  href="/onboarding?preview=1"
                  className="font-semibold text-[#111827] underline underline-offset-4"
                >
                  Book a free assessment
                </a>
              </div>
            </>
          ) : (
            <>
              <Input
                type="email"
                placeholder="Enter email"
                value={resetEmail}
                onChange={setResetEmail}
              />

              {err && (
                <div className="text-sm text-red-600 text-center">{err}</div>
              )}
              {msg && (
                <div className="text-sm text-green-700 text-center">{msg}</div>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={loading || !resetEmail}
                className="w-full rounded-full bg-[#F37120] py-4 font-extrabold text-white text-lg
                           disabled:opacity-60 active:scale-[0.99] transition"
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
                className="w-full rounded-full border border-[#E5E7EB] py-4 font-bold text-[#111827]
                           bg-white active:scale-[0.99] transition"
              >
                Back to Sign In
              </button>

              <div className="mt-8 text-center text-xs text-[#9CA3AF]">
                New here?{" "}
                <a
                  href="/onboarding?preview=1"
                  className="font-semibold text-[#111827] underline underline-offset-4"
                >
                  Book a free assessment
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Rounded input like Image 2 */
function Input({
  type,
  placeholder,
  value,
  onChange,
  rightSlot,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-[#E5E7EB] bg-white px-5 py-4 text-[#111827]
                   placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F37120]/40"
      />
      {rightSlot && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

/** Social button (UI placeholder only) */
function SocialButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      className="h-14 w-14 rounded-full border border-[#E5E7EB] bg-white
                 flex items-center justify-center shadow-[0_10px_30px_rgba(16,24,40,0.06)]
                 active:scale-[0.98] transition"
      onClick={() => {
        // placeholder
        alert(`${label} login coming soon`);
      }}
    >
      {children}
    </button>
  );
}

/** Icons (no extra packages needed) */
function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.3 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.3 29.5 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.1C29.2 35.1 26.7 36 24 36c-5.3 0-9.8-3.4-11.3-8.1l-6.5 5C9.4 39.6 16.1 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-0.7 2-2 3.7-3.9 4.9l6.2 5.1C40.9 35 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#111827">
      <path d="M16.7 13.2c0 2.3 2 3.1 2 3.1s-1.6 4.6-4.3 4.6c-1.2 0-1.7-.8-3.2-.8s-2 .8-3.2.8C5.3 20.9 3 16.9 3 13.9c0-3 1.9-4.6 3.8-4.6 1.2 0 2.2.8 3 .8.8 0 2-.9 3.4-.9.6 0 2.4.1 3.6 1.9-.1.1-2.1 1.2-2.1 3.6ZM14 6.6c.7-.9 1.2-2.1 1.1-3.4-1.1.1-2.4.7-3.1 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.6 3.1-1.4Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-3h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.4.7-1.4 1.4V12H16l-.5 3h-2.5v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}
