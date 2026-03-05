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
const START_PAGE = "/get-started";

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
        subtitle: "Your journey starts here. Let’s get moving.",
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
      // restart to slide 0 if idle
      setFaqOpen(false);
      setIndex(0);
      setCountdown(DURATIONS_SECONDS.welcomeVideo);
    }, IDLE_RESTART_SECONDS * 1000);
  };

  useEffect(() => {
    if (!ready) return;

    const handler = () => resetIdle();

    // any interaction resets idle timer
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

              {/* ✅ CENTER EVERYTHING */}
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

                  {/* CTA slide: FAQ + start button */}
                  {slide.cta && (
                    <>
                      <button
                        onClick={() => {
                          resetIdle();
                          setFaqOpen(true);
                        }}
                        className="mt-5 text-sm underline text-white/80"
                      >
                        No guesswork, just gains. Get the facts here
                      </button>

                      <button
                        onClick={() => {
                          resetIdle();
                          completeOnboarding();
                        }}
                        className="mt-6 w-full sm:w-[420px] rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black"
                      >
                        Get Started – Free Assessment
                      </button>
                    </>
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

      {/* ✅ FAQ MODAL — FULL 1–6 (RESTORED) */}
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
              <h2 className="text-white text-lg font-semibold">
                Getting Started with BearFit
              </h2>
              <button
                onClick={() => {
                  resetIdle();
                  setFaqOpen(false);
                }}
                className="text-white/70 text-xl leading-none"
                aria-label="Close FAQs"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-5 text-white/85 text-sm leading-relaxed">
              <div>
                <div className="font-semibold text-white">
                  1. What can I expect from BearFit and what services do you offer?
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>BearFit is all about science-based personalized training.</li>
                  <li>You&apos;ll get exclusive workout sessions with our team of certified coaches.</li>
                  <li>
                    We offer both in-house and online workout packages so you can train wherever works best for you.
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-semibold text-white">
                  2. How much are the monthly fees and are there any hidden costs?
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>The great news is that BearFit doesn’t charge monthly fees at all!</li>
                  <li>You don’t have to worry about joining fees or being stuck in a 12-month lock-in contract.</li>
                </ul>
              </div>

              <div>
                <div className="font-semibold text-white">
                  3. What do I actually get when I sign up for a workout package?
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Each package is fully inclusive, giving you complete access to all gym equipment and amenities.</li>
                  <li>You’ll receive a personalized workout program tailored specifically to you.</li>
                  <li>
                    Your sessions are exclusive and by-appointment-only, so you always have dedicated time with your assigned coach.
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-semibold text-white">
                  4. Where exactly are your branches located?
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-2">
                  <li>
                    We have two spots in Quezon City:
                    <div className="mt-1">
                      <span className="font-semibold">Sikatuna Village:</span> 48 Malingap Street
                    </div>
                    <div>
                      <span className="font-semibold">E. Rodriguez:</span> G/F Puzon Building, 1118 E. Rodriguez Sr. Avenue
                    </div>
                  </li>
                  <li>
                    We also have a location in <span className="font-semibold">Cainta</span>:
                    <div className="mt-1">
                      <span className="font-semibold">Primark Town Center Cainta:</span> 271 Ortigas Ave Ext, Cainta, Rizal
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-semibold text-white">
                  5. What are your opening hours, and do I need to book ahead?
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>We are open Monday through Saturday to fit your schedule.</li>
                  <li>Mon–Fri: 7 AM to 10 PM • Sat: 7 AM to 2 PM</li>
                  <li>
                    <span className="font-semibold">Pro tip:</span> It’s best to schedule your sessions in advance to make sure you get the time slot you want!
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-semibold text-white">
                  6. What kind of equipment and extra perks do you have?
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>We’re well-equipped with strength and resistance training gear, plus Muay Thai and boxing equipment.</li>
                  <li>If you want the full list of what’s on the floor, feel free to send us a DM!</li>
                  <li>For your comfort: shower rooms, lounge area, bicycle rack, drinking water, free WiFi.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                resetIdle();
                setFaqOpen(false);
              }}
              className="mt-6 w-full rounded-full bg-white/10 py-3 text-white font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* text animation */}
      <style jsx global>{`
        .bf-anim {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 420ms ease, transform 420ms ease;
        }
        .bf-anim--in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
