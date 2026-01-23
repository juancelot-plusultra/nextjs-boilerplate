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
  // add more slides later...
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
    // Dark side gutters always present; the "screen" sits centered
    <div className="min-h-screen w-full bg-black text-white">
      {/*
        App frame sizing rules:
        - Mobile (<640px): full width (100vw)
        - Tablet (640–1023px): slightly constrained (max 720px)
        - Desktop (>=1024px): phone/app frame (max 520px) + side gutters
      */}
      <div className="mx-auto min-h-screen w-full sm:max-w-[720px] lg:max-w-[520px]">
        {/* Optional frame only on desktop */}
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
              {slides.map((s) => (
                <div
                  key={s.key}
                  className="relative min-h-screen w-full flex-shrink-0"
                >
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    priority={s.key === slides[index]?.key}
                    /*
                      IMPORTANT:
                      - Mobile: 100vw
                      - Tablet: up to 720px
                      - Desktop: 520px frame
                    */
                    sizes="(min-width: 1024px) 520px, (min-width: 640px) 720px, 100vw"
                    className="object-cover"
                  />

                  {/* Readability overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                  {/* Top safe area */}
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
                    <div className="pb-16">
                      <h1 className="text-3xl font-extrabold">{s.title}</h1>
                      <p className="mt-2 max-w-md text-white/80">{s.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
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

            {/* Optional: keyboard nav for desktop */}
            <div className="sr-only" aria-hidden="true">
              Use swipe or click dots.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
