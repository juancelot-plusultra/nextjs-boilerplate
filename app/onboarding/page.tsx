"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

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
      { title: "Welcome to BearFitPH", subtitle: "", image: "/onboarding/welcome.jpg" },
      { title: "Better Form", subtitle: "Train smarter with coach-guided movement.", image: "/onboarding/better-form.jpg" },
      { title: "Better Function", subtitle: "Move better in everyday life, not just in the gym.", image: "/onboarding/better-function.jpg" },
      { title: "Better Fitness", subtitle: "Build strength, confidence, and consistency.", image: "/onboarding/better-fitness.jpg" },
      { title: "Free Assessment", subtitle: "Your journey starts here. Let’s get moving.", image: "/onboarding/cta.jpg", cta: true },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("reset") === "1") localStorage.removeItem(STORAGE_KEY);
    if (params.get("preview") === "1") {
      setReady(true);
      return;
    }

    if (localStorage.getItem(STORAGE_KEY) === "1") {
      window.location.replace(START_PAGE);
      return;
    }

    setReady(true);
  }, []);

  const goTo = (i: number) =>
    setIndex(Math.max(0, Math.min(slides.length - 1, i)));
  const next = () => index < slides.length - 1 && goTo(index + 1);
  const skip = () => goTo(slides.length - 1);

  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.location.href = START_PAGE;
  };

  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (!faqOpen) startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (faqOpen || startX.current === null) return;
    const diff = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (diff < -50) next();
    if (diff > 50) setIndex(Math.max(0, index - 1));
  };

  if (!ready) return null;

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-slide { animation: fadeSlideUp .5s ease-out; }
      `}</style>

      <div className="relative w-full h-full md:max-w-[430px] bg-black overflow-hidden md:rounded-2xl">
        <div className="flex h-full transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              <Image src={slide.image} alt={slide.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

              <div className="absolute inset-x-0 bottom-24 px-6 text-center text-white">
                <div key={index} className="fade-slide">
                  <h1 className="text-3xl font-bold mb-1">{slide.title}</h1>

                  {i === 0 && (
                    <>
                      <p className="font-bold italic mb-2">Better Form | Better Function | Better Fitness</p>
                      <p className="text-white/85 mb-2">No guesswork — just coach-guided, science-based results.</p>
                      <p className="text-white/85">
                        Book your free{" "}
                        <button onClick={() => goTo(slides.length - 1)} className="underline font-semibold">
                          assessment
                        </button>.
                      </p>
                    </>
                  )}

                  {i !== 0 && !slide.cta && <p className="text-white/85">{slide.subtitle}</p>}

                  {slide.cta && (
                    <>
                      <p className="text-white/85">{slide.subtitle}</p>
                      <button onClick={() => setFaqOpen(true)} className="mt-3 text-sm underline text-white/80">
                        No guesswork, just gains. Get the facts here.
                      </button>
                      <button onClick={completeOnboarding} className="block mt-6 w-full rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black">
                        Get Started – Free Assessment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NAV */}
        <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between text-white">
          <button onClick={skip}>Skip</button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
          <button onClick={next}>Next</button>
        </div>

        {/* FAQ MODAL */}
        {faqOpen && (
          <div className="absolute inset-0 z-50">
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/70" onClick={() => setFaqOpen(false)} />

            {/* panel */}
            <div className="absolute inset-x-0 bottom-0 md:inset-y-0 md:m-auto md:max-w-[430px] bg-[#0b0b0b] rounded-t-2xl md:rounded-2xl p-5 max-h-[85vh] overflow-y-auto text-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Getting Started with BearFit</h2>
                <button onClick={() => setFaqOpen(false)} className="text-sm underline">
                  Close
                </button>
              </div>

              <FaqItem q="1. What can I expect from BearFit?">
                Science-based personalized training with certified coaches.
              </FaqItem>
              <FaqItem q="2. Are there monthly fees?">
                No monthly fees. No lock-in contracts.
              </FaqItem>
              <FaqItem q="3. What do I get when I sign up?">
                Full gym access, personalized programs, by-appointment coaching.
              </FaqItem>
              <FaqItem q="4. Where are you located?">
                QC (Sikatuna & E. Rodriguez) and Cainta (Primark).
              </FaqItem>
              <FaqItem q="5. Opening hours?">
                Mon–Fri 7AM–10PM, Sat 7AM–2PM.
              </FaqItem>
              <FaqItem q="6. Equipment & perks?">
                Strength + combat gear, showers, lounge, bike rack, free WiFi.
              </FaqItem>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FaqItem({ q, children }: { q: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <div className="font-semibold">{q}</div>
      <div className="text-white/80 text-sm">{children}</div>
    </div>
  );
}
