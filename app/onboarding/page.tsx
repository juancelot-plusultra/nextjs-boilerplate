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
];

export default function OnboardingPage() {
  const [index] = useState(0);
  const slide = slides[index];

  return (
    <div className="min-h-screen bg-black flex justify-center">
      {/* App Frame */}
      <div className="relative w-full max-w-[430px] min-h-screen bg-black overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 430px"
            className="object-cover"
          />
        </div>

        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Top brand */}
        <div className="relative z-10 p-6 text-white font-bold text-lg">
          BearFitPH
        </div>

        {/* Bottom content */}
        <div className="relative z-10 flex flex-col justify-end min-h-screen p-6 text-white">
          <h1 className="text-3xl font-bold">{slide.title}</h1>
          <p className="mt-2 text-white/80">{slide.subtitle}</p>

          <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 transition rounded-xl py-4 font-semibold">
            Get Started
          </button>

          <button className="mt-3 text-sm text-white/60">
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
