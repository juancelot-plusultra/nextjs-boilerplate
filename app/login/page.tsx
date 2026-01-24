"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect logic (member vs staff can be added later)
    window.location.href = "/member/dashboard";
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Animation styles */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp .5s ease-out forwards;
        }
      `}</style>

      <div className="w-full h-full md:max-w-[430px] md:rounded-2xl bg-[#0b0b0b] flex items-center justify-center px-6">
        <div
          className={`w-full max-w-sm ${
            mounted ? "fade-up" : "opacity-0"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bear<span className="text-[#F37120]">Fit</span>PH
            </h1>
            <p className="text-white/70 text-sm">
              Welcome back. Let’s get you moving.
            </p>
          </div>

          {/* Form */}
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

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-full bg-[#F37120] py-3 font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </div>

          {/* Secondary actions */}
          <div className="mt-6 text-center space-y-3 text-sm">
            <button className="text-white/70 underline">
              Forgot password?
            </button>

            <div className="text-white/50">
              New here?{" "}
              <a
                href="/onboarding?preview=1"
                className="underline text-white"
              >
                Book a free assessment
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
