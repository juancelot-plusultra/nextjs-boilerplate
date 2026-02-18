"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Supabase client setup
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STORAGE_KEY = "bearfit_onboarded_v1";
const START_PAGE = "/member/dashboard";
const DURATIONS_SECONDS = { welcomeVideo: 47, normal: 10 };
const IDLE_RESTART_SECONDS = 60;

// Define Slide type
type Slide = {
  key: string;
  title?: string;
  subtitle?: string;
  image?: string;
  video?: string;
  cta?: boolean;
};

export default function WelcomePage() {
  const router = useRouter();
  const slides: Slide[] = useMemo(() => [
    {
      key: "welcome-video",
      video: "/welcome/welcome-bg.mp4",
      title: "EVERY SESSION BUILDS YOUR STORY.",
      subtitle: "Better Form | Better Function | Better Fitness.",
    },
    {
      key: "better-form",
      title: "Better Form",
      subtitle: "Train smarter with coach-guided movement.",
      image: "/onboarding/better-form1.jpg",
    },
    {
      key: "better-function",
      title: "Better Function",
      subtitle: "Move better in everyday life, not just in the gym.",
      image: "/onboarding/better-function1.jpg",
    },
    {
      key: "better-fitness",
      title: "Better Fitness",
      subtitle: "Build strength, confidence, and consistency.",
      image: "/onboarding/better-fintness1.jpg",
    },
    {
      key: "free-assessment",
      title: "Free Assessment",
      subtitle: "Your journey starts here. Let’s get moving.",
      image: "/onboarding/free-assesment1.jpg",
      cta: true,
    },
  ], []);

  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(DURATIONS_SECONDS.welcomeVideo);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isLast = index === slides.length - 1;

  const next = () => setIndex(i => (isLast ? i : i + 1));
  const prev = () => setIndex(i => (i > 0 ? i - 1 : i));
  const skip = () => setIndex(slides.length - 1);

  // Handle login logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    if (data) {
      router.push("/member/dashboard");
    }
  };

  // Handle signup logic
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    if (data) {
      router.push("/member/dashboard");
    }
  };

  // Video countdown logic
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => next(), DURATIONS_SECONDS.welcomeVideo * 1000);
    return () => window.clearTimeout(t);
  }, [index, ready]);

  if (!ready) return null;

  return (
    <div className="relative w-full h-full">
      {/* Background Image or Video */}
      <div className="absolute inset-0 w-full h-full">
        {slides[index]?.video ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={slides[index]?.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={slides[index]?.image!}
            alt={slides[index]?.title ?? "BearFitPH slide"}
            fill
            className="object-cover"
            priority={index === 1}
          />
        )}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Centered Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
        <div className={`max-w-[720px] transition-opacity duration-500 ${index === 0 ? "opacity-100" : "opacity-0"}`}>
          <h1 className="text-4xl sm:text-5xl font-extrabold">{slides[index]?.title}</h1>
          {slides[index]?.subtitle && <p className="mt-4 text-white/85">{slides[index]?.subtitle}</p>}
          {slides[index]?.key === "welcome-video" && (
            <button
              onClick={() => next()}
              className="mt-7 w-full sm:w-[380px] rounded-full bg-[#F37120] px-6 py-4 text-black"
            >
              <span>Next</span>
              <span className="text-sm">{countdown}s</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between items-center text-white">
        <button onClick={skip} className="text-white/80">Skip</button>
        <div className="flex gap-2">{slides.map((_, i) => (
          <span key={i} className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`} />
        ))}</div>
        <button onClick={next} disabled={isLast} className={isLast ? "opacity-40" : "text-white/80"}>Next</button>
      </div>

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-center text-xl font-semibold mb-4">Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg"
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg">Login</button>
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="mt-3 w-full p-3 border rounded-lg"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {signupModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-center text-xl font-semibold mb-4">Sign Up</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSignup}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg"
                required
              />
              <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg">Sign Up</button>
              <button
                type="button"
                onClick={() => setSignupModalOpen(false)}
                className="mt-3 w-full p-3 border rounded-lg"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom controls for Login and Sign Up */}
      <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between items-center text-white">
        <button onClick={() => setLoginModalOpen(true)} className="w-full p-3 mt-3 bg-blue-600 text-white rounded-lg">
          Login
        </button>
        <button onClick={() => setSignupModalOpen(true)} className="w-full p-3 mt-3 bg-green-600 text-white rounded-lg">
          Sign Up
        </button>
      </div>
    </div>
  );
}
