"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomeSplashPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // enables simple fade/slide in on load
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const goNext = () => {
    router.push("/onboarding");
  };

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      {/* Desktop frame (same pattern as your onboarding) */}
      <div className="relative w-full h-full bg-black overflow-hidden md:max-w-[430px] md:mx-auto md:rounded-2xl">
        {/* Background image (optional): replace url or remove this block */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("/welcome/welcome-bg.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />

        {/* Text stack */}
        <div className="absolute inset-x-0 top-0 bottom-28 px-6 flex items-center">
          <div
            className={[
              "w-full text-center text-white transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
            ].join(" ")}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              EVERY SESSION
              <br />
              BUILDS YOUR
              <br />
              STORY.
            </h1>

            <p className="mt-4 text-white/85 text-base sm:text-lg">
              <span className="font-semibold italic">
                Better Form | Better Function | Better Fitness.
              </span>
            </p>
          </div>
        </div>

        {/* Bottom orange bar button */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <button
            onClick={goNext}
            className="w-full rounded-2xl bg-[#F37120] text-black font-semibold py-4 text-lg shadow-lg active:scale-[0.99] transition"
            aria-label="Welcome to BearFitPH - Continue"
          >
            Welcome to BearFitPH
          </button>

          {/* optional tiny hint */}
          <p className="mt-3 text-center text-xs text-white/55">
            Tap to continue
          </p>
        </div>
      </div>
    </div>
  );
}
