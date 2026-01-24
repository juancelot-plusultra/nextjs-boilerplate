"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    title: "Welcome to BearFitPH",
    subtitle:
      "Science-based, coach-guided training built for real people. Start your journey with a free assessment.",
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
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < slides.length - 1) setIndex(index + 1);
  };

  const skip = () => setIndex(slides.length - 1);

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      {/* App frame */}
      <div className="relative w-full h-full md:max-w-[420px] md:mx-auto overflow-hidden bg-black">
        {/* SLIDES ROW */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 420px"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              {/* Text */}
              <div className="absolute inset-x-0 bottom-24 px-6 text-center text-white">
                <h1 className="text-3xl font-bold mb-3">{slide.title}</h1>
                <p className="text-white/85 text-base leading-relaxed">
                  {slide.subtitle}
                </p>

                {slide.cta && (
                  <a
                    href="/login"
                    className="inline-block mt-6 rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black"
                  >
                    Get Started – Free Assessment
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom controls */}
        <div className="absolute inset-x-0 bottom-6 px-6 flex items-center justify-between text-white">
          <button
            onClick={skip}
            className="text-sm opacity-70 hover:opacity-100"
          >
            Skip
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={index === slides.length - 1}
            className="text-sm font-medium disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
