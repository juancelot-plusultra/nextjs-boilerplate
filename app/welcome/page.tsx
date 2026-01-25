"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomeSplashPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const goNext = () => router.push("/onboarding");

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      {/* Desktop frame (phone-like) */}
      <div className="relative w-full h-full bg-black overflow-hidden md:max-w-[430px] md:mx-auto md:rounded-2xl">
        {/* ✅ VIDEO BACKGROUND */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/welcome/welcome-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Optional: slight darkening for readability */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Bottom gradient like the sample (stronger at bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* ✅ Lower-left headline block */}
        <div className="absolute inset-x-0 bottom-28 px-6">
          <div
            className={[
              "max-w-[320px] text-left text-white transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
            ].join(" ")}
          >
            {/* Small orange label */}
            <div className="mb-3">
              <span className="inline-flex items-center rounded-full bg-[#F37120]/20 px-3 py-1 text-xs font-semibold text-[#F37120]">
                Welcome to BearFitPH
              </span>
            </div>

            {/* Big headline (lower-left like the reference) */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              EVERY SESSION
              <br />
              BUILDS YOUR
              <br />
              STORY.
            </h1>

            {/* Subtext / tagline */}
            <p className="mt-3 text-white/85 text-sm sm:text-base">
              <span className="font-semibold italic">
                Better Form | Better Function | Better Fitness.
              </span>
            </p>
          </div>
        </div>

        {/* ✅ Orange “next step” bar button (bottom, like the sample) */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <button
            onClick={goNext}
            className="w-full rounded-2xl bg-[#F37120] text-black font-semibold py-4 text-lg shadow-lg active:scale-[0.99] transition flex items-center justify-between px-6"
            aria-label="Continue to onboarding"
          >
            <span>Continue</span>
            <span className="text-black/80">›</span>
          </button>

          <p className="mt-3 text-left text-xs text-white/55">
            Tap to continue
          </p>
        </div>
      </div>
    </div>
  );
}
