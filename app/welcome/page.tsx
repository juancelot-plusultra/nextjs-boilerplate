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

const DURATIONS_SECONDS = {
  welcomeVideo: 47,
  better: 10,
};

export default function WelcomePage() {
  const slides: Slide[] = useMemo(
    () => [
      {
        key: "welcome-video",
        video: "/welcome/welcome.mp4",
        title: "EVERY SESSION BUILDS YOUR STORY.",
        subtitle: "Better Form | Better Function | Better Fitness.",
      },
      {
        key: "better-form",
        title: "Better Form",
        subtitle: "Train smarter with coach-guided movement.",
        image: "/onboarding/better-form.jpg",
      },
      {
        key: "better-function",
        title: "Better Function",
        subtitle: "Move better in everyday life, not just in the gym.",
        image: "/onboarding/better-function.jpg",
      },
      {
        key: "better-fitness",
        title: "Better Fitness",
        subtitle: "Build strength, confidence, and consistency.",
        image: "/onboarding/better-fitness.jpg",
      },
      {
        key: "free-assessment",
        title: "Free Assessment",
        subtitle: "Your journey starts here. Let’s get moving.",
        image: "/onboarding/cta.jpg",
        cta: true,
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // countdown only for slide 1
  const [countdown, setCountdown] = useState(DURATIONS_SECONDS.welcomeVideo);

  // stop auto-advance while user is swiping/holding
  const [isInteracting, setIsInteracting] = useState(false);

  // ---------------------------
  // Preview / reset + redirect
  // ---------------------------
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

  const isLast = index === slides.length - 1;
  const isVideoSlide = slides[index]?.key === "welcome-video";

  const clampGoTo = (i: number) => {
    setIndex((prev) => {
      const next = Math.max(0, Math.min(slides.length - 1, i));
      return next;
    });
  };

  const next = () => {
    if (!isLast) clampGoTo(index + 1);
  };
  const prev = () => {
    if (index > 0) clampGoTo(index - 1);
  };
  const skip = () => clampGoTo(slides.length - 1);

  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.location.href = START_PAGE;
  };

  // ---------------------------
  // Auto-advance per slide
  // ---------------------------
  const slideTimeoutRef = useRef<number | null>(null);

  const clearSlideTimeout = () => {
    if (slideTimeoutRef.current) {
      window.clearTimeout(slideTimeoutRef.current);
      slideTimeoutRef.current = null;
    }
  };

  const getDurationForIndex = (i: number) => {
    const key = slides[i]?.key;
    if (key === "welcome-video") return DURATIONS_SECONDS.welcomeVideo;
    if (key === "free-assessment") return null; // no auto on last slide
    return DURATIONS_SECONDS.better;
  };

  useEffect(() => {
    if (!ready) return;

    clearSlideTimeout();

    // reset countdown when we land on video slide
    if (slides[index]?.key === "welcome-video") {
      setCountdown(DURATIONS_SECONDS.welcomeVideo);
    }

    // do not auto-advance while faq open or user is interacting
    if (faqOpen || isInteracting) return;

    const duration = getDurationForIndex(index);
    if (!duration) return;

    slideTimeoutRef.current = window.setTimeout(() => {
      next();
    }, duration * 1000);

    return () => clearSlideTimeout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, ready, faqOpen, isInteracting]);

  // countdown tick only on video slide
  useEffect(() => {
    if (!ready) return;
    if (slides[index]?.key !== "welcome-video") return;
    if (faqOpen || isInteracting) return;

    const t = window.setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => window.clearInterval(t);
  }, [index, ready, faqOpen, isInteracting, slides]);

  // ---------------------------
  // Swipe handling
  // ---------------------------
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (faqOpen) return;
    setIsInteracting(true);
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (faqOpen || startX.current === null) {
      setIsInteracting(false);
      return;
    }
    const diff = e.changedTouches[0].clientX - startX.current;
    startX.current = null;

    if (diff < -50) next();
    if (diff > 50) prev();

    // small delay so auto-advance doesn't instantly jump
    window.setTimeout(() => setIsInteracting(false), 250);
  };

  // if user taps buttons, treat as interaction (prevents immediate auto jump)
  const userNav = (fn: () => void) => {
    setIsInteracting(true);
    fn();
    window.setTimeout(() => setIsInteracting(false), 250);
  };

  if (!ready) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex justify-center items-center"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 
        IMPORTANT behavior:
        - Video slide (index 0) = FULLSCREEN ALWAYS (no frame), including desktop/tablet.
        - Other slides = phone frame on md+ (your old behavior).
      */}
      <div
        className={[
          "relative w-full h-full bg-black overflow-hidden",
          isVideoSlide ? "md:rounded-none md:max-w-none" : "md:max-w-[430px] md:mx-auto md:rounded-2xl",
        ].join(" ")}
      >
        {/* Slide track */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const active = i === index;

            return (
              <div key={slide.key} className="relative w-full h-full flex-shrink-0">
                {/* Background media */}
                {slide.video ? (
                  <>
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src={slide.video}
                      autoPlay
                      muted
                      playsInline
                      loop
                      preload="metadata"
                    />
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                  </>
                )}

                {/* Content */}
                {slide.key === "welcome-video" ? (
                  // VIDEO SLIDE LAYOUT: lower-left like your inspiration
                  <div className="absolute inset-0">
                    <div className="absolute left-6 bottom-20 right-6 max-w-[520px] text-white">
                      <div className={`bf-anim ${active ? "bf-anim--in" : ""}`}>
                        <div className="text-[#F37120] text-sm font-semibold tracking-wide mb-3">
                          Welcome to BearFitPH
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight">
                          {slide.title}
                        </h1>

                        <p className="mt-4 text-white/85 font-medium">
                          {slide.subtitle}
                        </p>

                        {/* Orange bar CTA (goes to next slide) */}
                        <button
                          onClick={() => userNav(next)}
                          className="mt-6 inline-flex items-center justify-between gap-4 w-full sm:w-[380px] rounded-full bg-[#F37120] px-6 py-4 font-semibold text-black"
                        >
                          <span>Next</span>
                          <span className="text-black/70 text-sm">
                            {countdown}s
                          </span>
                        </button>

                        {/* Countdown label */}
                        <div className="mt-3 text-xs text-white/60">
                          Auto-advancing in {countdown}s
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // NORMAL SLIDES (your existing look)
                  <div className="absolute inset-x-0 bottom-24 px-6 text-center text-white">
                    <div className={`bf-anim ${active ? "bf-anim--in" : ""}`}>
                      <h1 className="text-3xl font-bold mb-3">{slide.title}</h1>
                      <p className="text-white/85">{slide.subtitle}</p>

                      {/* Only show FAQ trigger on CTA slide */}
                      {slide.cta && (
                        <button
                          onClick={() => setFaqOpen(true)}
                          className="mt-3 text-sm underline text-white/80"
                        >
                          No guesswork, just gains. Get the facts here
                        </button>
                      )}

                      {slide.cta && (
                        <button
                          onClick={completeOnboarding}
                          className="block mt-6 w-full rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black"
                        >
                          Get Started – Free Assessment
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom controls (keep for ALL slides) */}
        <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between items-center text-white">
          <button onClick={() => userNav(skip)} className="text-white/80">
            Skip
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => userNav(next)}
            disabled={isLast}
            className={isLast ? "opacity-40" : "text-white/80"}
          >
            Next
          </button>
        </div>

        {/* FAQ MODAL (FULL 1-6; close works) */}
        {faqOpen && (
          <div className="absolute inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setFaqOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[80%] rounded-t-2xl bg-[#0b0b0b] p-6 overflow-auto">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-white text-lg font-semibold">
                  Getting Started with BearFit
                </h2>
                <button
                  onClick={() => setFaqOpen(false)}
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
                    <li>We offer both in-house and online workout packages so you can train wherever works best for you.</li>
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
                    <li>Your sessions are exclusive and by-appointment-only, so you always have dedicated time with your assigned coach.</li>
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
                    <li><span className="font-semibold">Pro tip:</span> It’s best to schedule your sessions in advance to make sure you get the time slot you want!</li>
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
                onClick={() => setFaqOpen(false)}
                className="mt-6 w-full rounded-full bg-white/10 py-3 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Text animation (no framer-motion needed) */}
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
    </div>
  );
}
