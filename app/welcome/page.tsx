"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    key: "welcome",
    title: "Welcome to Plus Ultra",
    description: "Your journey starts here.",
  },
  {
    key: "features",
    title: "Powerful Features",
    description: "Track progress, unlock potential, grow faster.",
  },
  {
    key: "welcome-video",
    title: "Get Started",
    description: "Let’s set up your account.",
  },
];

export default function WelcomePage() {
  const [index, setIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const nextSlide = () => {
    if (index < slides.length - 1) {
      setDirection("right");
      setIndex(index + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setDirection("left");
      setIndex(index - 1);
    }
  };

  const skipSlides = () => {
    setDirection("right");
    setIndex(slides.length - 1);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6 overflow-hidden">
      <div className="w-full max-w-2xl relative">
        <div
          key={slides[index].key}
          className={`bg-white rounded-2xl shadow-xl p-8 text-center space-y-4 transition-all duration-500 ${
            direction === "right" ? "animate-slide-in-right" : "animate-slide-in-left"
          }`}
        >
          <h2 className="text-2xl font-bold">{slides[index].title}</h2>
          <p className="text-gray-600">{slides[index].description}</p>

          {slides[index].key === "welcome-video" && (
            <div className="space-y-4">
              <button
                className="w-full bg-black text-white py-2 rounded-xl"
                onClick={() => setSignInOpen(true)}
              >
                Sign In
              </button>
              <button
                className="w-full border border-black py-2 rounded-xl"
                onClick={() => setSignUpOpen(true)}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between mt-6">
          <button className="text-gray-600" onClick={skipSlides}>
            Skip
          </button>

          <div className="flex gap-2">
            <button
              className="border px-4 py-2 rounded-xl"
              onClick={prevSlide}
              disabled={index === 0}
            >
              Back
            </button>
            <button
              className="bg-black text-white px-4 py-2 rounded-xl"
              onClick={nextSlide}
              disabled={index === slides.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        {/* Free Assessment Button */}
        <div className="mt-6 text-center">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-2xl"
            onClick={() => setAssessmentOpen(true)}
          >
            Free Assessment
          </button>
        </div>

        {/* FAQ Button */}
        <div className="mt-4 text-center">
          <button
            className="text-blue-600 underline"
            onClick={() => setFaqOpen(true)}
          >
            View FAQ
          </button>
        </div>
      </div>

      {/* Sign In Modal */}
      {signInOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">Sign In</h3>
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded mb-4"
            />
            <button className="w-full bg-black text-white py-2 rounded-xl mb-2">
              Login
            </button>
            <button
              className="w-full text-gray-500"
              onClick={() => setSignInOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {signUpOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">Sign Up</h3>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded mb-4"
            />
            <button className="w-full bg-black text-white py-2 rounded-xl mb-2">
              Create Account
            </button>
            <button
              className="w-full text-gray-500"
              onClick={() => setSignUpOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">FAQ</h3>
            <p className="text-gray-600 mb-4">
              Here are answers to common questions about getting started.
            </p>
            <button
              className="w-full bg-black text-white py-2 rounded-xl"
              onClick={() => setFaqOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Free Assessment Modal */}
      {assessmentOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">Free Assessment</h3>
            <p className="text-gray-600 mb-4">
              Complete this short assessment to personalize your experience.
            </p>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-xl"
              onClick={() => setAssessmentOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Simple slide animations */}
      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease;
        }
      `}</style>
    </div>
  );
}
