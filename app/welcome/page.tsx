// WelcomePage.tsx
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import FreeAssessmentModal from "./FreeAssessmentModal"; // Import the modal component

const STORAGE_KEY = "bearfit_onboarded_v1";
const START_PAGE = "/member/dashboard";
const DURATIONS_SECONDS = { welcomeVideo: 47, normal: 10 };
const IDLE_RESTART_SECONDS = 60;

export default function WelcomePage() {
  const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [countdown, setCountdown] = useState(DURATIONS_SECONDS.welcomeVideo);

  const slides = useMemo(() => [
    {
      key: "free-assessment",
      title: "Free Assessment",
      subtitle: "Your journey starts here. Let’s get moving.",
      image: "/onboarding/free-assesment1.jpg",
      cta: true,
    },
    // other slides...
  ], []);

  const next = () => {
    if (index < slides.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const skip = () => setIndex(slides.length - 1);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY) === "1";
    if (done) {
      window.location.replace(START_PAGE);
      return;
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (faqOpen) return;
    if (slides[index]?.key === "free-assessment") return;

    const duration = slides[index]?.key === "welcome-video" ? DURATIONS_SECONDS.welcomeVideo : DURATIONS_SECONDS.normal;
    const t = window.setTimeout(() => next(), duration * 1000);
    return () => window.clearTimeout(t);
  }, [index, ready, faqOpen]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      {/* SLIDES */}
      <div className="flex h-full transition-transform duration-500 ease-out">
        {slides.map((slide, i) => (
          <div key={slide.key} className="relative w-full h-full flex-shrink-0">
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
              <h1 className="text-4xl sm:text-5xl font-extrabold">{slide.title}</h1>
              {slide.subtitle && (
                <p className="mt-4 text-white/85 font-medium">{slide.subtitle}</p>
              )}

              {slide.cta && (
                <div className="mt-6 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={openModal} // Open modal on button click
                    className="mt-4 w-full sm:w-[420px] rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black"
                  >
                    Get Started – Free Assessment
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Free Assessment Modal */}
      <FreeAssessmentModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
