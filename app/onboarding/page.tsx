"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image: string;
};

const slides: Slide[] = [
  {
    key: "better-form",
    title: "Better Form",
    subtitle: "Train smarter with coach-guided movement.",
    image: "/onboarding/better-form.jpg",
  },
];

export default function OnboardingPage() {
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
    // Outer shell: on desktop we show side gutters so it feels like an app
    <div className="min-h-screen w-full bg-black text-white">
      {/* App frame wrapper:
          - mobile: full width
          - desktop: centered phone-like frame
      */}
      <div className="mx-auto min-h-screen w-full bg-black sm:max-w-[520px] sm:border-x sm:border-white/10">
        {/* The actual "screen" */}
        <div
          className="relative min-h-screen w-full overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Track */}
          <div
            className="absolute inset-0 flex transition-transform duration-300 ease-out"
            style={trackStyle}
          >
            {slides.map((s) => (
              <div key={s.key} className="relative min-h-screen w-full flex-shrink-0">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  priority={s.key === slides[index]?.key}
                  // KEY FIX: tell Next different sizes for mobile/tablet/desktop
                  // Desktop gets the frame width, not 100vw.
                  sizes="(min-width: 640px) 520px, 100vw"
                  className="object-cover"
                />

                {/* Readability overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                {/* Top area with safe padding */}
                <div
                  className="absolute left-0 right-0 top-0 z-10"
                  style={{
                    paddingTop: "max(env(safe-area-inset-top), 16px)",
                  }}
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
                  <div className="pb-16">
                    <h1 className="text-3xl font-extrabold">{s.title}</h1>
                    <p className="mt-2 max-w-md text-white/80">{s.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom nav row */}
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
                      (i === index ? "bg-white" : "bg-white/40 hover:bg-white/70")
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

          {/* Desktop-only subtle backdrop outside frame (optional visual polish)
              This is handled by the parent bg-black + frame borders.
          */}
        </div>
      </div>
    </div>
  );
}
