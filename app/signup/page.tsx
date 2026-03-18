"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signup",
          email,
          password,
          fullName,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      // Sign up successful, redirect to login
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
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
            Join BearFitPH
          </h1>
          <p className="mt-3 text-[#6B7280] text-base">
            Create your account to get started
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-full border border-[#E5E7EB] px-5 py-4 text-sm outline-none focus:border-[#F37120] transition disabled:opacity-50"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-full border border-[#E5E7EB] px-5 py-4 text-sm outline-none focus:border-[#F37120] transition disabled:opacity-50"
          />

          <div>
            <label className="block text-xs text-[#6B7280] mb-2 font-medium">
              Account Type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full rounded-full border border-[#E5E7EB] px-5 py-4 text-sm outline-none focus:border-[#F37120] transition disabled:opacity-50"
            >
              <option value="member">Member</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-full border border-[#E5E7EB] px-5 py-4 text-sm outline-none focus:border-[#F37120] transition disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9CA3AF] cursor-pointer hover:text-[#6B7280]"
              disabled={loading}
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-full border border-[#E5E7EB] px-5 py-4 text-sm outline-none focus:border-[#F37120] transition disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9CA3AF] cursor-pointer hover:text-[#6B7280]"
              disabled={loading}
            >
              {showConfirmPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F37120] py-4 font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-sm text-[#9CA3AF]">Or continue with</span>
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        {/* SOCIAL SIGNUP (UI ONLY) */}
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
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-[#F37120] hover:underline"
          >
            Sign In
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-[#9CA3AF] leading-relaxed">
          By signing up, you agree to our Terms of Service and Privacy Policy.
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
