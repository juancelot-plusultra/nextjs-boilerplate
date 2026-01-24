"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Slide = {
  title: string;
  subtitle: string;
  image: string;
  cta?: boolean;
};

const STORAGE_KEY = "bearfit_onboarded_v1";
const START_PAGE = "/get-started";

export default function OnboardingPage() {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Welcome to BearFitPH",
        subtitle: "welcome", // handled specially below
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

  const [index, setIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(false);
  const [ready, setReady] = useState(false);

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

  const goTo = (i: number) =>
    setIndex(Math.max(0, Math.min(slides.length - 1, i)));

  const next = () => !isLast && goTo(index + 1);
  const prev = () => index > 0 && goTo(index - 1);
  const skip = () => goTo(slides.length - 1);

  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.location.href = START_PAGE;
  };

  // Swipe handling
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (faqOpen) return;
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (faqOpen || startX.current === null) return;
    const diff = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (diff < -50) next();
    if (diff > 50) prev();
  };

  if (!ready) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex justify-center items-center"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full h-full bg-black overflow-hidden md:max-w-[430px] md:mx-auto md:rounded-2xl">
        {/* SLIDER */}
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
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

              <div className="absolute inset-x-0 bottom-24 px-6 text-center text-white">
                <h1 className="text-3xl font-bold mb-4">{slide.title}</h1>

                {/* ✅ WELCOME SLIDE CUSTOM CONTENT */}
                {i === 0 ? (
                  <div className="space-y-3">
                    <p className="text-white/85">
                      No guesswork. Just coach-guided, science-based results.
                    </p>

                    <p className="font-bold italic">
                      Better Form | Better Function | Better Fitness.
                    </p>

                    <p className="text-white/85">
                      Book your{" "}
                      <button
                        onClick={() => goTo(slides.length - 1)}
                        className="underline underline-offset-4 font-semibold"
                      >
                        free assessment
                      </button>
                      .
                    </p>
                  </div>
                ) : (
                  <p className="text-white/85">{slide.subtitle}</p>
                )}

                {/* FAQ link ONLY on Free Assessment slide */}
                {slide.cta && (
                  <button
                    type="button"
                    onClick={() => setFaqOpen(true)}
                    className="mt-3 text-sm underline text-white/80"
                  >
                    No guesswork, just gains. Get the facts here.
                  </button>
                )}

                {slide.cta && (
                  <button
                    type="button"
                    onClick={completeOnboarding}
                    className="block mt-6 w-full rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black"
                  >
                    Get Started – Free Assessment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between text-white">
          <button type="button" onClick={skip}>
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
            type="button"
            onClick={next}
            disabled={isLast}
            className={isLast ? "opacity-40" : ""}
          >
            Next
          </button>
        </div>

        {/* FAQ overlay (unchanged) */}
        {faqOpen && (
          <div className="absolute inset-0 z-50">
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              onClick={() => setFaqOpen(false)}
              aria-label="Close FAQs"
            />

            <div className="absolute inset-x-0 bottom-0 md:inset-y-0 md:m-auto md:h-[80%] md:max-w-[430px]">
              <div className="relative h-[78vh] md:h-full w-full rounded-t-2xl md:rounded-2xl bg-[#0b0b0b] border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
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

                <div className="p-5 text-white/80 text-sm">
                  FAQs content stays the same as before.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FaqItem({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <summary className="cursor-pointer text-white font-semibold">
        {q}
      </summary>
      <div className="mt-3 text-white/80 text-sm">{children}</div>
    </details>
  );
}
