"use client";

import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TEMP: replace later with real auth
    setTimeout(() => {
      setLoading(false);
      alert("Login logic goes here");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F6FA] to-[#ECEEF4] px-4">
      <div className="w-full max-w-[420px] bg-white rounded-[32px] px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.12)] animate-fade-in">

        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <Image
            src="/brand/bearfit-logo.png"
            alt="BearFitPH"
            width={900}
            height={300}
            priority
            className="w-[220px] h-auto"
          />
        </div>

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#111827]">
            Hello Again
          </h1>
          <p className="mt-3 text-[#6B7280] text-base">
            Welcome back — you’ve been missed!
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter email"
            required
            className="w-full rounded-full border border-[#E5E7EB] px-5 py-4 text-sm outline-none focus:border-[#F37120] transition"
          />

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full rounded-full border border-[#E5E7EB] px-5 py-4 text-sm outline-none focus:border-[#F37120] transition"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9CA3AF] cursor-pointer">
              👁
            </span>
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm font-medium text-[#F37120] hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F37120] py-4 font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-sm text-[#9CA3AF]">Or continue with</span>
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        {/* SOCIAL LOGIN (UI ONLY) */}
        <div className="flex justify-center gap-4 mb-8">
          <button className="h-12 w-12 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB]">
            <Image src="/icons/google.svg" alt="Google" width={22} height={22} />
          </button>
          <button className="h-12 w-12 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB]">
            <Image src="/icons/apple.svg" alt="Apple" width={22} height={22} />
          </button>
          <button className="h-12 w-12 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB]">
            <Image src="/icons/facebook.svg" alt="Facebook" width={22} height={22} />
          </button>
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-[#6B7280]">
          Not a member?{" "}
          <a
            href="/onboarding"
            className="font-semibold text-[#F37120] hover:underline"
          >
            Register now
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-[#9CA3AF] leading-relaxed">
          Tip: Staff and Members use the same login.
          <br />
          Your role decides where you land.
        </p>
      </div>

      {/* SIMPLE FADE ANIMATION */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
