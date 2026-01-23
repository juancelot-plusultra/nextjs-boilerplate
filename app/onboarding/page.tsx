"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    key: "better-form",
    title: "Better Form",
    subtitle: "Train smarter with coach-guided movement.",
    image: "/onboarding/better-form.png",
  },
  // add more slides later
];

export default function OnboardingPage() {
  const [i, setI] = useState(0);
  const slide = slides[i];

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* App-like centered frame (phone feel on desktop/tablet) */}
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-black">
        <div className="relative min-h-screen overflow-hidden">
          {/* Background image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 430px) 100vw, 430px"
          />

          {/* Gradient overlay for text readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/80" />

          {/* Top area (optional logo) */}
          <div className="absolute left-0 right-0 top-0 p-5">
            <div className="text-white/90 text-lg font-extrabold">
              Bear<span className="text-orange-500">Fit</span>PH
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-8 text-white">
            <h1 className="text-3xl font-extrabold leading-tight">
              {slide.title}
            </h1>
            <p className="mt-2 text-white/85">{slide.subtitle}</p>

            {/* Dots + buttons */}
            <div className="mt-6 flex items-center justify-between">
              <button
                className="text-sm font-semibold text-white/80"
                onClick={() => (window.location.href = "/login")}
              >
                Skip
              </button>

              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={
                      "h-2 w-2 rounded-full " +
                      (idx === i ? "bg-white" : "bg-white/35")
                    }
                  />
                ))}
              </div>

              <button
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white"
                onClick={() => {
                  if (i < slides.length - 1) setI(i + 1);
                  else window.location.href = "/login";
                }}
              >
                Next
              </button>
            </div>
          </div>

          {/* Safe-area padding for iPhone notches */}
          <div className="absolute inset-x-0 bottom-0 h-[env(safe-area-inset-bottom)]" />
        </div>
      </div>
    </div>
  );
}
