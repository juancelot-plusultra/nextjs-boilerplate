"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image?: string;
};

const slides: Slide[] = [
  {
    key: "welcome",
    title: "Welcome to BearFitPH",
    subtitle:
      "Science-driven coaching that starts with assessment, not guessing.\n\nMove better. Train smarter. Get stronger — with coaches who guide your form every step.",
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
    subtitle: "Move stronger in real life — pain-free, stable, and efficient.",
    image:
      "https://images.unsplash.com/photo-1526401485004-2aa6e39bba27?auto=format&fit=crop&w=1800&q=80",
  },
  {
    key: "better-fitness",
    title: "Better Fitness",
    subtitle: "Build endurance and confidence with a sustainable program.",
    image:
      "https://images.unsplash.com/photo-1517963628607-235ccdd5476c?auto=format&fit=crop&w=1800&q=80",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [showFAQ, setShowFAQ] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const isLast = index === slides.length - 1;

  const goNext = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const skip = () => setIndex(slides.length - 1);

  const trackStyle = useMemo(
    () =>
      ({
        transform: `translateX(-${index * 100}%)`,
      }) as React.CSSProperties,
    [index]
  );

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function onTouchEnd() {
    const dx = touchDeltaX.current;
    touchStartX.current = null;
    if (dx > 60) goPrev();
    if (dx < -60) goNext();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto min-h-screen w-full sm:max-w-[720px] lg:max-w-[520px]">
        <div className="min-h-screen lg:border-x lg:border-white/10">
          <div
            className="relative min-h-screen overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Slides */}
            <div
              className="absolute inset-0 flex transition-transform duration-300 ease-out"
              style={trackStyle}
            >
              {slides.map((s, i) => {
                const active = i === index;
                return (
                  <div
                    key={s.key}
                    className="relative min-h-screen w-full flex-shrink-0"
                  >
                    {s.image ? (
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        priority={active}
                        sizes="(min-width:1024px) 520px, (min-width:640px) 720px, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                    {/* Brand */}
                    <div className="absolute top-0 left-0 right-0 px-6 pt-6 z-10 text-center">
                      <div className="text-lg font-extrabold">
                        Bear<span className="text-orange-500">Fit</span>PH
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-32 z-10">
                      <div
                        className={`mx-auto max-w-md text-center transition-all duration-500 ease-out ${
                          active
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        <h1 className="text-3xl font-extrabold">{s.title}</h1>

                        <p className="mt-3 whitespace-pre-line text-white/80">
                          {s.subtitle}
                        </p>

                        {/* Welcome CTA */}
                        {s.key === "welcome" && (
                          <button
                            onClick={goNext}
                            className="mt-6 w-full rounded-2xl bg-orange-500 px-5 py-4 text-base font-extrabold hover:bg-orange-600"
                          >
                            Start
                          </button>
                        )}

                        {/* Final CTA */}
                        {s.key === "better-fitness" && (
                          <button
                            onClick={() => {
                              localStorage.setItem("bf_onboarded", "1");
                              router.push("/get-started");
                            }}
                            className="mt-6 w-full rounded-2xl bg-orange-500 px-5 py-4 text-base font-extrabold hover:bg-orange-600"
                          >
                            Free Assessment — Get Started Now
                          </button>
                        )}

                        {/* FAQ trigger */}
                        <button
                          onClick={() => setShowFAQ(true)}
                          className="mt-4 text-sm text-white/70 underline"
                        >
                          Questions? See FAQs
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Nav */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-20">
              <div className="flex items-center justify-between">
                <button onClick={skip} className="text-sm text-white/70">
                  SKIP
                </button>

                <div className="flex gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-2.5 w-2.5 rounded-full ${
                        i === index ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={goNext}
                  disabled={isLast}
                  className={`text-sm ${
                    isLast ? "text-white/30" : "text-white/80"
                  }`}
                >
                  NEXT
                </button>
              </div>
            </div>

            {/* FAQ Bottom Sheet */}
            {showFAQ && (
              <div className="fixed inset-0 z-50 bg-black/60">
                <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl bg-white text-black p-6 overflow-y-auto">
                  <div className="mb-4 text-center font-extrabold text-lg">
                    Getting Started with BearFit
                  </div>

                  <FAQItem
                    q="What can I expect from BearFit and what services do you offer?"
                    a={[
                      "BearFit is all about science-based personalized training.",
                      "You'll get exclusive workout sessions with our team of certified coaches.",
                      "We offer both in-house and online workout packages so you can train wherever works best for you.",
                    ]}
                  />

                  <FAQItem
                    q="How much are the monthly fees and are there any hidden costs?"
                    a={[
                      "The great news is that BearFit doesn’t charge monthly fees at all!",
                      "No joining fees. No lock-in contracts.",
                    ]}
                  />

                  <FAQItem
                    q="What do I get when I sign up for a workout package?"
                    a={[
                      "Full access to all gym equipment and amenities.",
                      "A personalized workout program tailored to you.",
                      "By-appointment-only sessions with your assigned coach.",
                    ]}
                  />

                  <FAQItem
                    q="Where are your branches located?"
                    a={[
                      "Sikatuna Village: 48 Malingap Street, Quezon City",
                      "E. Rodriguez: G/F Puzon Building, 1118 E. Rodriguez Sr. Ave",
                      "Cainta: Primark Town Center, 271 Ortigas Ave Ext, Rizal",
                    ]}
                  />

                  <FAQItem
                    q="What are your opening hours?"
                    a={[
                      "Monday–Friday: 7 AM – 10 PM",
                      "Saturday: 7 AM – 2 PM",
                      "Sessions are best booked in advance.",
                    ]}
                  />

                  <button
                    onClick={() => setShowFAQ(false)}
                    className="mt-6 w-full rounded-2xl bg-black px-5 py-3 font-bold text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string[] }) {
  return (
    <div className="mb-5">
      <div className="font-bold">{q}</div>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
        {a.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
