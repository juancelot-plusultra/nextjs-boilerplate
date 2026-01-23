"use client";

import { useState } from "react";

const slides = [
  {
    title: "Welcome to BearFitPH",
    subtitle: "Train smarter. Move better. Live stronger.",
    image: "/onboarding/welcome.jpg",
  },
  {
    title: "Better Form",
    subtitle: "Coach-guided movement for safer, smarter training.",
    image: "/onboarding/better-form.jpg",
  },
  {
    title: "Better Function",
    subtitle: "Improve mobility, balance, and real-life strength.",
    image: "/onboarding/better-function.jpg",
  },
  {
    title: "Better Fitness",
    subtitle: "Build strength, endurance, and confidence.",
    image: "/onboarding/better-fitness.jpg",
    cta: true,
  },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      {/* Blurred background */}
      <img
        src={slide.image}
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-30"
        alt=""
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* App frame */}
      <div className="relative w-full max-w-[430px] md:max-w-[520px] lg:max-w-[430px] aspect-[9/16] bg-black overflow-hidden rounded-3xl shadow-2xl">
        {/* Main image */}
        <img
          src={slide.image}
          className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
          alt={slide.title}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Brand */}
        <div className="absolute top-6 left-6 text-white font-bold text-lg">
          BearFitPH
        </div>

        {/* Text */}
        <div className="absolute bottom-28 left-6 right-6 text-center text-white animate-fade-in">
          <h1 className="text-3xl font-extrabold">{slide.title}</h1>
          <p className="mt-3 text-white/80 text-base">{slide.subtitle}</p>
        </div>

        {/* CTA on last slide */}
        {slide.cta && (
          <div className="absolute bottom-24 left-6 right-6">
            <button className="w-full bg-orange-500 text-black font-semibold py-4 rounded-xl">
              Free Assessment — Get Started
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white/80">
          <button
            onClick={() => setIndex(slides.length - 1)}
            className="text-sm"
          >
            SKIP
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
            onClick={() => setIndex((i) => Math.min(i + 1, slides.length - 1))}
            disabled={index === slides.length - 1}
            className="text-sm disabled:opacity-40"
          >
            NEXT
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
