"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  image: string;
  cta?: boolean;
};

const STORAGE_KEY = "bearfit_onboarded_v1";

export default function OnboardingPage() {
  // ===== Slides =====
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Welcome to BearFitPH",
        subtitle:
          "Science-based, coach-guided training built for real people. Start your journey with a free assessment.",
        image: "/onboarding/welcome.jpg",
      },
      {
        title: "Better Form",
        subtitle: "Train smarter with coach-guided movement.",
        image: "/onboarding/better-form.jpg",
      },
      {
        title: "Better Function",
        subtitle: "Move better in everyday life, not just in the gym.",
        image: "/onboarding/better-function.jpg",
      },
      {
        title: "Better Fitness",
        subtitle: "Build strength, confidence, and consistency.",
        image: "/onboarding/better-fitness.jpg",
      },
      {
        title: "Free Assessment",
        subtitle: "Your journey starts here. Let’s get moving.",
        image: "/onboarding/cta.jpg",
        cta: true,
      },
    ],
    []
  );

  // ===== FAQ content =====
  const faqs = useMemo(
    () => [
      {
        q: "1. What can I expect from BearFit and what services do you offer?",
        a: [
          "BearFit is all about science-based personalized training.",
          "You'll get exclusive workout sessions with our team of certified coaches.",
          "We offer both in-house and online workout packages so you can train wherever works best for you.",
        ],
      },
      {
        q: "2. How much are the monthly fees and are there any hidden costs?",
        a: [
          "The great news is that BearFit doesn’t charge monthly fees at all!",
          "You don't have to worry about joining fees or being stuck in a 12-month lock-in contract.",
        ],
      },
      {
        q: "3. What do I actually get when I sign up for a workout package?",
        a: [
          "Each package is fully inclusive, giving you complete access to all gym equipment and amenities.",
          "You’ll receive a personalized workout program tailored specifically to you.",
          "Your sessions are exclusive and by-appointment-only, so you always have dedicated time with your assigned coach.",
        ],
      },
      {
        q: "4. Where exactly are your branches located?",
        a: [
          "We have two spots in Quezon City:",
          "• Sikatuna Village: 48 Malingap Street.",
          "• E. Rodriguez: G/F of the Puzon Building, 1118 E. Rodriguez Sr. Avenue.",
          "We also have a location in Cainta:",
          "• Primark Town Center Cainta: 271 Ortigas Ave Ext, Cainta, Rizal.",
        ],
      },
      {
        q: "5. What are your opening hours, and do I need to book ahead?",
        a: [
          "We are open Monday through Saturday to fit your schedule.",
          "From Monday to Friday, we're open from 7 AM to 10 PM, and on Saturdays, we're here from 7 AM to 2 PM.",
          "Pro tip: It’s best to schedule your sessions in advance to make sure you get the time slot you want!",
        ],
      },
      {
        q: "6. What kind of equipment and extra perks do you have?",
        a: [
          "We’re well-equipped with a variety of strength and resistance training gear, plus equipment for Muay Thai and boxing.",
          "If you want the full list of what’s on the floor, feel free to send us a DM!",
          "For your comfort, we have shower rooms, a lounge area, a bicycle rack, drinking water, and even free WiFi.",
        ],
      },
    ],
    []
  );

  // ===== State =====
  const [index, setIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // First-time only
  useEffect(() => {
    try {
      const done = localStorage.getItem(STORAGE_KEY) === "1";
      if (done) {
        window.location.replace("/login"); // change if needed
        return;
      }
    } catch {}
    setReady(true);
  }, []);

  const isLast = index === slides.length - 1;

  const goTo = (i: number) =>
    setIndex(Math.max(0, Math.min(slides.length - 1, i)));

  const next = () => {
    if (!isLast) goTo(index + 1);
  };

  const prev = () => {
    if (index > 0) goTo(index - 1);
  };

  const skip = () => goTo(slides.length - 1);

  const completeOnboarding = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    window.location.href = "/free-assessment"; // change if needed
  };

  // ===== Swipe Gesture (Touch + Mouse) =====
  const startX = useRef<number | null>(null);
  const isDown = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    if (faqOpen) return;
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (faqOpen) return;
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;
    startX.current = null;

    const threshold = 50;
    if (diff < -threshold) next();
    if (diff > threshold) prev();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (faqOpen) return;
    isDown.current = true;
    startX.current = e.clientX;
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (faqOpen) return;
    if (!isDown.current || startX.current === null) return;
    isDown.current = false;
    const diff = e.clientX - startX.current;
    startX.current = null;

    const threshold = 80;
    if (diff < -threshold) next();
    if (diff > threshold) prev();
  };

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (faqOpen) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setFaqOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [faqOpen, index]);

  if (!ready) return null;

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      {/* Phone frame on desktop, full screen on mobile */}
      <div
        className="relative w-full h-full bg-black overflow-hidden
                   md:max-w-[430px] md:mx-auto md:rounded-2xl md:ring-1 md:ring-white/10"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        {/* Slider row */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 430px"
              />

              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

              {/* Header (NO FAQ button anymore) */}
              <div className="absolute inset-x-0 top-0 px-5 pt-5 flex items-center justify-between text-white">
                <div className="font-semibold tracking-wide">
                  Bear<span className="text-[#F37120]">Fit</span>PH
                </div>
              </div>

              {/* Centered text */}
              <div className="absolute inset-x-0 bottom-24 px-6 text-center text-white">
                <div
                  key={`text-${index}`}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <h1 className="text-3xl font-bold mb-3">{slide.title}</h1>

                  <p className="text-white/85 text-base leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* ✅ New FAQ trigger under subtitle (every slide) */}
                  <button
                    type="button"
                    onClick={() => setFaqOpen(true)}
                    className="mt-3 text-sm text-white/80 underline underline-offset-4 hover:text-white"
                  >
                    Questions? Read the FAQs
                  </button>

                  {slide.cta && (
                    <button
                      onClick={completeOnboarding}
                      className="inline-block mt-6 rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black"
                    >
                      Get Started – Free Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom controls */}
        <div className="absolute inset-x-0 bottom-6 px-6 flex items-center justify-between text-white">
          <button onClick={skip} className="text-sm opacity-70 hover:opacity-100">
            Skip
          </button>

          <div className="flex gap-2 items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={isLast}
            className="text-sm font-medium disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {/* FAQ Drawer (same behavior/effects) */}
        {faqOpen && (
          <div className="absolute inset-0 z-50">
            <button
              className="absolute inset-0 bg-black/60"
              onClick={() => setFaqOpen(false)}
              aria-label="Close FAQ"
            />

            <div className="absolute inset-x-0 bottom-0 max-h-[80%] bg-neutral-950 rounded-t-2xl border-t border-white/10 overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
                <div className="text-white font-semibold">
                  Getting Started with BearFit
                </div>
                <button
                  onClick={() => setFaqOpen(false)}
                  className="text-white/70 hover:text-white text-sm"
                >
                  Close
                </button>
              </div>

              <div className="px-5 py-4 overflow-auto max-h-[calc(80vh-56px)] text-white">
                {faqs.map((f, idx) => (
                  <div key={idx} className="mb-5">
                    <div className="font-semibold mb-2">{f.q}</div>
                    <ul className="space-y-1 text-white/85">
                      {f.a.map((line, j) => (
                        <li key={j} className="leading-relaxed">
                          {line}
                        </li>
                      ))}
                    </ul>
                    <div className="h-px bg-white/10 mt-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hint */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-16 text-xs text-white/50">
          Swipe left/right
        </div>
      </div>
    </div>
  );
}
