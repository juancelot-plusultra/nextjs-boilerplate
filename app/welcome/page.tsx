"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  key: string;
  title?: string;
  subtitle?: string;
  image?: string;
  video?: string;
  cta?: boolean;
};

const STORAGE_KEY = "bearfit_onboarded_v1";

// after welcome, send them to your main app (root)
const START_PAGE = "/member/dashboard";

// timings
const DURATIONS_SECONDS = {
  welcomeVideo: 47,
  normal: 10,
};

// idle restart (seconds)
const IDLE_RESTART_SECONDS = 60;

export default function WelcomePage() {
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
        subtitle: "Your journey starts here. LetÃ¢â‚¬â„¢s get moving.",
        image: "/onboarding/free-assesment1.jpg",
        cta: true,
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  // countdown (only meaningful on video slide)
  const [countdown, setCountdown] = useState(DURATIONS_SECONDS.welcomeVideo);

  const isLast = index === slides.length - 1;

  const next = () => {
    if (!isLast) setIndex((i) => i + 1);
  };
  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };
  const skip = () => setIndex(slides.length - 1);

  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.location.href = START_PAGE;
  };

  const goToRole = (role: "Member" | "Staff" | "Leads" | "Admin") => {
    localStorage.setItem("bearfit_preview_role", role);
    localStorage.setItem(STORAGE_KEY, "1");
    window.location.href = START_PAGE;
  };

  // -----------------------------------
  // init + redirect logic
  // -----------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("reset") === "1") {
      localStorage.removeItem(STORAGE_KEY);
    }

    if (params.get("preview") === "1") {
      setReady(true);
      return;
    }

    const done = localStorage.getItem(STORAGE_KEY) === "1";
    if (done) {
      window.location.replace(START_PAGE);
      return;
    }

    setReady(true);
  }, []);

  // -----------------------------------
  // auto-advance per slide (pause if FAQ open)
  // -----------------------------------
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, ready, faqOpen]);

  // countdown tick only on video slide (pause if FAQ open)
  useEffect(() => {
    if (!ready) return;
    if (faqOpen) return;
    if (slides[index]?.key !== "welcome-video") return;

    const t = window.setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => window.clearInterval(t);
  }, [index, ready, faqOpen, slides]);

  // -----------------------------------
  // Restart slideshow after idle
  // -----------------------------------
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
    window.addEventListener("touchstart", handler, { passive: true });
    window.addEventListener("keydown", handler);
    window.addEventListener("scroll", handler, { passive: true });

    resetIdle();

    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("touchstart", handler as any);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("scroll", handler as any);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [ready]);

  // -----------------------------------
  // swipe handling (disabled while FAQ open)
  // -----------------------------------
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (faqOpen) return;
    resetIdle();
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (faqOpen) return;
    resetIdle();
    if (startX.current === null) return;

    const diff = e.changedTouches[0].clientX - startX.current;
    startX.current = null;

    if (diff < -50) next();
    if (diff > 50) prev();
  };

  if (!ready) return null;

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* SLIDES */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const active = i === index;

          return (
            <div key={slide.key} className="relative w-full h-full flex-shrink-0">
              {/* Background */}
              {slide.video ? (
                <>
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src={slide.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/45" />
                </>
              ) : (
                <>
                  <Image
                    src={slide.image!}
                    alt={slide.title ?? "BearFitPH slide"}
                    fill
                    className="object-cover"
                    priority={i === 1}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </>
              )}

              {/* CENTER EVERYTHING */}
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
                <div className={`bf-anim ${active ? "bf-anim--in" : ""} max-w-[720px]`}>
                  {slide.key === "welcome-video" && (
                    <div className="text-[#F37120] text-sm font-semibold tracking-wide mb-3">
                      Welcome to BearFitPH
                    </div>
                  )}

                  <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p className="mt-4 text-white/85 font-medium">{slide.subtitle}</p>
                  )}

                  {/* Video slide CTA (shows countdown) */}
                  {slide.key === "welcome-video" && (
                    <button
                      onClick={() => {
                        resetIdle();
                        next();
                      }}
                      className="mt-7 inline-flex items-center justify-between gap-4 w-full sm:w-[380px] rounded-full bg-[#F37120] px-6 py-4 font-semibold text-black"
                    >
                      <span>Next</span>
                      <span className="text-black/70 text-sm">{countdown}s</span>
                    </button>
                  )}

                  {/* CTA slide: FAQ + start button + ROLE VIEW BUTTONS */}
                  {slide.cta && (
  <div className="mt-6 flex flex-col items-center">
    {/* FAQ trigger */}
    <button
      type="button"
      onClick={() => {
        resetIdle();
        setFaqOpen(true);
      }}
      className="text-sm underline text-white/80 whitespace-nowrap"
    >
      No guesswork, just gains. Get the facts here
    </button>

    {/* Main CTA */}
    <button
      type="button"
      onClick={() => {
        resetIdle();
        window.location.href = "/member/dashboard";
      }}
      className="mt-4 w-full sm:w-[420px] rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black"
    >
      Get Started Ã¢â‚¬â€œ Free Assessment
    </button>

    {/* Dashboard sample */}
    <button
      type="button"
      onClick={() => {
        resetIdle();
        localStorage.setItem("bearfit_preview_role", "Member");
        window.location.href = "/member/dashboard";
      }}
      className="mt-3 rounded-full bg-white/10 hover:bg-white/15 px-5 py-2 text-sm font-semibold text-white"
    >
      Dashboard Sample
    </button>
  </div>
)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between items-center text-white">
        <button
          onClick={() => {
            resetIdle();
            skip();
          }}
          className="text-white/80"
        >
          Skip
        </button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            resetIdle();
            next();
          }}
          disabled={isLast}
          className={isLast ? "opacity-40" : "text-white/80"}
        >
          Next
        </button>
      </div>

      {/* FAQ MODAL Ã¢â‚¬â€ FULL 1Ã¢â‚¬â€œ6 */}
      {faqOpen && (
        <div className="absolute inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              resetIdle();
              setFaqOpen(false);
            }}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80%] rounded-t-2xl bg-[#0b0b0b] p-6 overflow-auto">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-white text-lg font-semibold">Getting Started with BearFit</h2>
              <button
                onClick={() => {
                  resetIdle();
                  setFaqOpen(false);
                }}
                className="text-white/70 text-xl leading-none"
                aria-label="Close FAQs"
              >
                Ã—
              </button>
            </div>

            <div className="mt-4 space-y-5 text-white/85 text-sm leading-relaxed">
              <div>
                <div className="font-semibold text-white">
                  1. What can I expect from BearFit and what services do you offer?
                </div>
