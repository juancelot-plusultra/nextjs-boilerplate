"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

// -----------------------------
// Types
// -----------------------------
type Slide = {
  key: string;
  title?: string;
  subtitle?: string;
  image?: string;
  video?: string;
  cta?: boolean;
};

const STORAGE_KEY = "bearfit_onboarded_v1";
const START_PAGE = "/member/dashboard";

const DURATIONS_SECONDS = {
  welcomeVideo: 47,
  normal: 10,
};

const IDLE_RESTART_SECONDS = 60;

export default function WelcomePage() {
  // -----------------------------
  // Slides
  // -----------------------------
  const slides: Slide[] = useMemo(
    () => [
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
    ],
    []
  );

  // -----------------------------
  // State
  // -----------------------------
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [countdown, setCountdown] = useState(DURATIONS_SECONDS.welcomeVideo);

  // Auth State
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isLast = index === slides.length - 1;

  const next = () => {
    if (!isLast) setIndex((i) => i + 1);
  };

  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const skip = () => setIndex(slides.length - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // Init
  // -----------------------------
  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY) === "1";
    if (done) {
      window.location.replace(START_PAGE);
      return;
    }
    setReady(true);
  }, []);

  // -----------------------------
  // Auto Advance
  // -----------------------------
  useEffect(() => {
    if (!ready) return;
    if (faqOpen) return;
    if (slides[index]?.key === "free-assessment") return;

    const duration =
      slides[index]?.key === "welcome-video"
        ? DURATIONS_SECONDS.welcomeVideo
        : DURATIONS_SECONDS.normal;

    if (slides[index]?.key === "welcome-video") {
      setCountdown(DURATIONS_SECONDS.welcomeVideo);
    }

    const t = window.setTimeout(() => next(), duration * 1000);
    return () => window.clearTimeout(t);
  }, [index, ready, faqOpen]);

  useEffect(() => {
    if (!ready) return;
    if (faqOpen) return;
    if (slides[index]?.key !== "welcome-video") return;

    const t = window.setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => window.clearInterval(t);
  }, [index, ready, faqOpen, slides]);

  // -----------------------------
  // Idle Restart
  // -----------------------------
  const idleTimerRef = useRef<number | null>(null);

  const resetIdle = () => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setFaqOpen(false);
      setIndex(0);
      setCountdown(DURATIONS_SECONDS.welcomeVideo);
    }, IDLE_RESTART_SECONDS * 1000);
  };

  useEffect(() => {
    if (!ready) return;

    const handler = () => resetIdle();

    window.addEventListener("mousemove", handler);
    window.addEventListener("mousedown", handler);
    window.addEventListener("touchstart", handler);
    window.addEventListener("keydown", handler);
    window.addEventListener("scroll", handler);

    resetIdle();

    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("scroll", handler);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [ready]);

  if (!ready) return null;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.key} className="relative w-full h-full flex-shrink-0">
            {slide.video ? (
              <>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={slide.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-black/50" />
              </>
            ) : (
              <>
                <Image
                  src={slide.image!}
                  alt="slide"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </>
            )}

            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
              <div className="max-w-[720px] w-full">
                <h1 className="text-4xl sm:text-5xl font-extrabold">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="mt-4 text-white/80">{slide.subtitle}</p>
                )}

                {/* Welcome Slide Auth UI */}
                {slide.key === "welcome-video" && (
                  <>
                    <button
                      onClick={next}
                      className="mt-7 w-full sm:w-[380px] rounded-full bg-[#F37120] px-6 py-4 font-semibold text-black"
                    >
                      Next ({countdown}s)
                    </button>

                    <div className="mt-6 w-full sm:w-[420px] mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-5">
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => setAuthMode("signin")}
                          className={`flex-1 py-2 rounded-full text-sm font-semibold ${
                            authMode === "signin"
                              ? "bg-[#F37120] text-black"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => setAuthMode("signup")}
                          className={`flex-1 py-2 rounded-full text-sm font-semibold ${
                            authMode === "signup"
                              ? "bg-[#F37120] text-black"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          Sign Up
                        </button>
                      </div>

                      {authMode === "signin" && (
                        <div className="space-y-3">
                          <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-black/40 border border-white/20 px-4 py-2 text-white"
                          />
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-black/40 border border-white/20 px-4 py-2 text-white"
                          />
                          <button className="w-full rounded-full bg-[#F37120] py-2 text-black font-semibold">
                            Sign In
                          </button>
                        </div>
                      )}

                      {authMode === "signup" && (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              name="firstName"
                              placeholder="First Name"
                              value={form.firstName}
                              onChange={handleChange}
                              className="w-1/2 rounded-lg bg-black/40 border border-white/20 px-4 py-2 text-white"
                            />
                            <input
                              name="lastName"
                              placeholder="Last Name"
                              value={form.lastName}
                              onChange={handleChange}
                              className="w-1/2 rounded-lg bg-black/40 border border-white/20 px-4 py-2 text-white"
                            />
                          </div>
                          <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-black/40 border border-white/20 px-4 py-2 text-white"
                          />
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-black/40 border border-white/20 px-4 py-2 text-white"
                          />
                          <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-black/40 border border-white/20 px-4 py-2 text-white"
                          />
                          <button className="w-full rounded-full bg-[#F37120] py-2 text-black font-semibold">
                            Create Account
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
