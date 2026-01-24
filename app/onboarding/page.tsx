"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Welcome to BearFitPH",
    subtitle: (
      <>
        Start your journey with a{" "}
        <a href="/get-started" className="underline font-semibold">
          Free Assessment
        </a>
      </>
    ),
    image: "/onboarding/welcome.jpg",
  },
  {
    title: "Better Form",
    subtitle: "Train smarter with coach-guided movement.",
    image: "/onboarding/better-form.jpg",
  },
  {
    title: "Better Function",
    subtitle: "Move better, feel stronger every day.",
    image: "/onboarding/better-function.jpg",
  },
  {
    title: "Better Fitness",
    subtitle: "Build strength that lasts.",
    image: "/onboarding/better-fitness.jpg",
  },
  {
    title: "Free Assessment",
    subtitle: "No guesswork, just gains. Get the facts here",
    image: "/onboarding/free-assessment.jpg",
    cta: true,
  },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const slide = slides[index];

  return (
    <div
      className="fixed inset-0 bg-black flex justify-center"
      onTouchStart={(e) => (window as any).startX = e.touches[0].clientX}
      onTouchEnd={(e) => {
        const diff = (window as any).startX - e.changedTouches[0].clientX;
        if (diff > 50 && index < slides.length - 1) setIndex(index + 1);
        if (diff < -50 && index > 0) setIndex(index - 1);
      }}
    >
      <div className="relative w-full max-w-md h-full overflow-hidden">
        {/* Image */}
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-10 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">{slide.title}</h1>
          <p className="text-white/80 mb-6">{slide.subtitle}</p>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === index ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          {slide.cta ? (
            <button
              onClick={() => router.push("/get-started")}
              className="w-full rounded-full bg-[#F37120] py-3 font-semibold text-black"
            >
              Get Started – Free Assessment
            </button>
          ) : (
            <button
              onClick={() => setIndex(index + 1)}
              className="text-white/80 text-sm"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
