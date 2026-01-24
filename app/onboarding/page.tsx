"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    key: "welcome",
    title: "Welcome to BearFitPH",
    subtitle:
      "Science-based, coach-guided training built for real people. Start with a free assessment and train with purpose.",
    image: "/onboarding/welcome.jpg",
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
    subtitle: "Move better in everyday life, not just in the gym.",
    image: "/onboarding/better-function.jpg",
  },
  {
    key: "better-fitness",
    title: "Better Fitness",
    subtitle: "Build strength, confidence, and consistency.",
    image: "/onboarding/better-fitness.jpg",
  },
  {
    key: "cta",
    title: "Free Assessment",
    subtitle: "Your journey starts here. Let’s get moving.",
    image: "/onboarding/cta.jpg",
    cta: true,
  },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const next = () => {
    if (index < slides.length - 1) setIndex(index + 1);
  };

  const skip = () => setIndex(slides.length - 1);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full h-full md:max-w-[420px] md:mx-auto md:rounded-2xl overflow-hidden">
        {/* KEY: simple fade animation via key */}
        <div key={slide.key} className="absolute inset-0 animate-fadeIn">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

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
                className={`h-2 w-2 rounded-full ${
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

      {/* CSS animation helper */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}
