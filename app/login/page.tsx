// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // For now: UI only (Supabase next step)
    setTimeout(() => {
      setLoading(false);
      alert("Login UI working ✅ (Supabase next)");
    }, 600);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top bar */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Bear<span className="text-[#f37120]">Fit</span>PH
          </Link>

          <Link
            href="/"
            className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-2 md:py-16">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
            Welcome back.
            <br />
            <span className="text-[#f37120]">Let’s get to work.</span>
          </h1>

          <p className="mt-3 max-w-md text-slate-600">
            Log in to access your BearFit PH portal. Track your sessions, follow
            your plan, and stay consistent.
          </p>

          <div className="mt-6 rounded-2xl border bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Quick note (for now)
            </p>
            <p className="mt-1 text-sm text-slate-600">
              This is just the login UI. Next step we’ll connect Supabase Auth
              and route members to <span className="font-semibold">/dashboard</span>.
            </p>
          </div>
        </div>

        {/* Right (Form) */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Log in</h2>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border px-3 py-2 outline-none ring-[#f37120]/30 focus:ring-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border px-3 py-2 outline-none ring-[#f37120]/30 focus:ring-4"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f37120] px-4 py-2.5 font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Log in"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="text-slate-600 hover:text-slate-900"
                onClick={() => alert("We’ll add reset password with Supabase ✅")}
              >
                Forgot password?
              </button>

              <Link className="font-semibold text-[#f37120]" href="/auth">
                Create account →
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
