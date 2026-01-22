// app/onboarding/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Slide = {
  key: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  cta?: string; // button label for last slide
};

const SLIDES: Slide[] = [
  {
    key: "s1",
    title: "Better Form",
    subtitle: "Learn the right technique with coach guidance.",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "s2",
    title: "Better Function",
    subtitle: "Build strength that carries into daily life.",
    imageUrl:
      "https://images.unsplash.com/photo-1517963628607-235ccdd5476c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "s3",
    title: "Better Fitness",
    subtitle: "Track sessions, payments, and progress—easy.",
    imageUrl:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501e9?auto=format&fit=crop&w=1400&q=80",
    cta: "Get Started",
  },
];

// Small helper
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function OnboardingPage() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const total = SLIDES.length;

  // Swipe state
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef(0);
  const draggingRef = useRef(false);

  // Smooth slide translate while dragging
  const [dragX, setDragX] = useState(0);

  const slide = SLIDES[index];

  const go = useCallback(
    (next: number) => {
      setIndex((cur) => clamp(next, 0, total - 1));
      setDragX(0);
      deltaXRef.current = 0;
      startXRef.current = null;
      draggingRef.current = false;
    },
    [total]
  );

  const next = useCallback(() => {
    if (index < total - 1) go(index + 1);
    else router.push("/login"); // change later if you want /register or /me
  }, [go, index, router, total]);

  const prev = useCallback(() => {
    if (index > 0) go(index - 1);
  }, [go, index]);

  const skip = useCallback(() => {
    router.push("/login"); // change later if you want /dashboard
  }, [router]);

  // Keyboard arrows on desktop
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") skip();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, skip]);

  // Touch handlers (swipe)
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    startXRef.current = e.touches[0].clientX;
    deltaXRef.current = 0;
    draggingRef.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const sx = startXRef.current;
    if (sx == null) return;

    const x = e.touches[0].clientX;
    const dx = x - sx;
    deltaXRef.current = dx;

    // Resist at edges
    const resist =
      (index === 0 && dx > 0) || (index === total - 1 && dx < 0) ? 0.35 : 1;

    setDragX(dx * resist);
  };

  const onTouchEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const dx = deltaXRef.current;
    const threshold = 70; // px

    if (dx <= -threshold && index < total - 1) {
      go(index + 1);
      return;
    }
    if (dx >= threshold && index > 0) {
      go(index - 1);
      return;
    }

    // Snap back
    setDragX(0);
  };

  // Clickable dots
  const dots = useMemo(() => {
    return Array.from({ length: total }, (_, i) => i);
  }, [total]);

  return (
    <div className="min-h-[100svh] bg-black">
      {/* Centered "phone" container on desktop to keep app-like feel */}
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[520px] flex-col">
        {/* Slide */}
        <div
          className="relative flex-1 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform: `translateX(${dragX}px)`,
              transition: draggingRef.current ? "none" : "transform 220ms ease",
            }}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 520px) 100vw, 520px"
            />
          </div>

          {/* Soft vignette (top) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/0 to-black/60" />

          {/* Bottom card overlay (like your sample) */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="rounded-3xl bg-black/40 p-5 backdrop-blur-md">
              <div className="text-3xl font-extrabold leading-tight text-white">
                {slide.title}
              </div>
              {slide.subtitle && (
                <div className="mt-2 text-sm leading-relaxed text-white/85">
                  {slide.subtitle}
                </div>
              )}

              {/* Controls row */}
              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={skip}
                  className="text-xs font-semibold tracking-wide text-white/80 hover:text-white"
                >
                  SKIP
                </button>

                {/* Dots */}
                <div className="flex items-center gap-2">
                  {dots.map((d) => (
                    <button
                      key={d}
                      type="button"
                      aria-label={`Go to slide ${d + 1}`}
                      onClick={() => go(d)}
                      className={
                        "h-2 w-2 rounded-full transition " +
                        (d === index ? "bg-white" : "bg-white/35")
                      }
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={next}
                  className="rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold tracking-wide text-white hover:bg-white/25"
                >
                  {index === total - 1 ? (slide.cta ?? "GET STARTED") : "NEXT"}
                </button>
              </div>
            </div>

            {/* Small hint row (optional) */}
            <div className="mt-3 text-center text-[11px] text-white/55">
              Swipe left/right • Tap dots • ESC to skip
            </div>
          </div>
        </div>

        {/* Safe area bottom spacing for phones */}
        <div className="h-4" />
      </div>
    </div>
  );
}
