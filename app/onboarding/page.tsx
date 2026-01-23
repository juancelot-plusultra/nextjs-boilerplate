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
  // Add more slides later:
  // { key: "better-function", title: "Better Function", subtitle: "Move pain-free and stronger daily.", image: "/onboarding/better-function.jpg" },
  // { key: "better-fitness", title: "Better Fitness", subtitle: "Build endurance and confidence.", image: "/onboarding/better-fitness.jpg" },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const isFirst = index === 0;
  const isLast = index === slides.length - 1;

  const goNext = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const skip = () => setIndex(slides.length - 1);

  // For smooth transform
  const trackStyle = useMemo(() => {
    return {
      transform: `translateX(-${index * 100}%)`,
    } as React.CSSProperties;
  }, [index]);

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

    // swipe threshold
    const threshold = 60;
    if (dx > threshold) goPrev();
    if (dx < -threshold) goNext();
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* FULLSCREEN SLIDER */}
      <div
        ref={containerRef}
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
            <div key={s.key} className="relative min-h-screen w-full flex-shrink-0">
              {/* Background image */}
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={s.key === slides[index]?.key}
                sizes="100vw"
                className="object-cover"
              />

              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Top brand */}
              <div className="absolute left-0 right-0 top-0 z-10 p-6">
                <div className="text-lg font-extrabold">
                  Bear<span className="text-orange-500">Fit</span>PH
                </div>
              </div>

              {/* Bottom text + controls */}
              <div className="absolute left-0 right-0 bottom-0 z-10 p-6 pb-8">
                <h1 className="text-3xl font-extrabold">{s.title}</h1>
                <p className="mt-2 max-w-xl text-white/80">{s.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom navigation row (Skip • dots • Next) */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={skip}
              className="text-sm font-semibold text-white/70 hover:text-white"
            >
              SKIP
            </button>

            {/* Dots */}
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

        {/* Optional: subtle left/right tap zones for desktop */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5" />
      </div>
    </div>
  );
}
