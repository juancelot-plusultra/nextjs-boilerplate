"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image?: string; // optional (welcome slide can be gradient)
};

const slides: Slide[] = [
  {
    key: "welcome",
    title: "Welcome to BearFitPH",
    subtitle:
      "Science-driven coaching that starts with assessment — not guessing. Build better movement, strength, and conditioning with coaches who guide your form every step.",
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

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

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
    const x = e.touches[0]?.clientX ?? 0;
    touchDeltaX.current = x - touchStartX.current;
  }
  function onTouchEnd() {
    const dx = touchDeltaX.current;
    touchStartX.current = null;

    const threshold = 60;
    if (dx > threshold) goPrev();
    if (dx < -threshold) goNext();
  }

  return (
    // Dark side gutters always present; centered "screen"
    <div className="min-h-screen w-full bg-black text-white">
      {/* App frame sizing rules:
          - Mobile: full width
          - Tablet: slightly constrained (max 720px)
          - Desktop: phone/app frame (max 520px) + side gutters
      */}
      <div className="mx-auto min-h-screen w-full sm:max-w-[720px] lg:max-w-[520px]">
        <div className="min-h-screen w-full lg:border-x lg:border-white/10">
          <div
            className="relative min-h-screen w-full overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Slides track */}
            <div
              className="absolute inset-0 flex transition-transform duration-300 ease-out"
              style={trackStyle}
            >
              {slides.map((s, idx) => {
                const active = idx === index;

                return (
                  <div
                    key={s.key}
                    className="relative min-h-screen w-full flex-shrink-0"
                  >
                    {/* Background */}
                    {s.image ? (
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        priority={active}
                        sizes="(min-width: 1024px) 520px, (min-width: 640px) 720px, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black" />
                    )}

                    {/* Readability overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                    {/* Top brand */}
                    <div
                      className="absolute left-0 right-0 top-0 z-10"
                      style={{ paddingTop: "max(env(safe-area-inset-top), 16px)" }}
                    >
                      <div className="px-6 pt-2">
                        <div className="text-lg font-extrabold">
                          Bear<span className="text-orange-500">Fit</span>PH
                        </div>
                      </div>
                    </div>

                    {/* Bottom text */}
                    <div
                      className="absolute left-0 right-0 bottom-0 z-10 px-6"
                      style={{
                        paddingBottom: "max(env(safe-area-inset-bottom), 24px)",
                      }}
                    >
                      <div className="pb-24">
                        <h1 className="text-3xl font-extrabold">{s.title}</h1>
                        <p className="mt-2 max-w-md text-white/80">{s.subtitle}</p>

                        {/* CTA only on last slide */}
                        {idx === slides.length - 1 && (
                          <button
                            type="button"
                            onClick={() => router.push("/get-started")}
                            className="mt-6 w-full rounded-2xl bg-orange-500 px-5 py-4 text-base font-extrabold text-white hover:bg-orange-600 active:scale-[0.99]"
                          >
                            Free Assessment — Get Started Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom nav row (Skip • dots • Next) */}
            <div
              className="absolute inset-x-0 bottom-0 z-20 px-6"
              style={{
                paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
              }}
            >
              <div className="flex items-center justify-between pb-4">
                <button
                  type="button"
                  onClick={skip}
                  className="text-sm font-semibold text-white/70 hover:text-white"
                >
                  SKIP
                </button>

                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={
                        "h-2 w-2 rounded-full transition " +
                        (i === index
                          ? "bg-white"
                          : "bg-white/40 hover:bg-white/70")
                      }
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => (isLast ? null : goNext())}
                  disabled={isLast}
                  className={
                    "text-sm font-semibold " +
                    (isLast
                      ? "text-white/30 cursor-not-allowed"
                      : "text-white/80 hover:text-white")
                  }
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
