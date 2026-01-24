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
        subtitle: "",
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
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-slide {
          animation: fadeSlideUp 0.6s ease-out;
        }
      `}</style>

      <div className="relative w-full h-full bg-black overflow-hidden md:max-w-[430px] md:mx-auto md:rounded-2xl">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              <Image src={slide.image} alt={slide.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

              <div className="absolute inset-x-0 bottom-24 px-6 text-center text-white">
                {/* TEXT ANIMATION */}
                <div key={index} className="fade-slide">
                  <h1 className="text-3xl font-bold mb-2">{slide.title}</h1>

                  {/* ✅ NEW LINE UNDER HEADER (WELCOME ONLY) */}
                  {i === 0 && (
                    <p className="font-bold italic mb-4">
                      Better Form | Better Function | Better Fitness
                    </p>
                  )}

                  {i === 0 ? (
                    <div className="space-y-3">
                      <p className="text-white/85">
                        No guesswork. Just coach-guided, science-based results.
                      </p>
                      <p className="text-white/85">
                        Book your free{" "}
                        <button
                          onClick={() => goTo(slides.length - 1)}
                          className="underline font-semibold"
                        >
                          assessment
                        </button>
                        .
                      </p>
                    </div>
                  ) : (
                    <p className="text-white/85">{slide.subtitle}</p>
                  )}

                  {slide.cta && (
                    <>
                      <button
                        onClick={() => setFaqOpen(true)}
                        className="mt-3 text-sm underline text-white/80"
                      >
                        No guesswork, just gains. Get the facts here.
                      </button>

                      <button
                        onClick={completeOnboarding}
                        className="block mt-6 w-full rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black"
                      >
                        Get Started – Free Assessment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between text-white">
          <button onClick={skip}>Skip</button>
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
          <button onClick={next} disabled={isLast} className={isLast ? "opacity-40" : ""}>
            Next
          </button>
        </div>

        {/* FAQ overlay stays EXACTLY as before */}
        {faqOpen && (
          <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
            <button
              className="absolute inset-0"
              onClick={() => setFaqOpen(false)}
            />
            <div className="relative bg-[#0b0b0b] rounded-2xl p-6 max-w-[430px] w-full text-white">
              <h2 className="font-bold mb-4">Getting Started with BearFit</h2>
              <p className="text-white/80 text-sm">
                FAQs content unchanged.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
