"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const nextSlide = () => {
    if (index < slides.length - 1) setIndex(index + 1);
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  const skipSlides = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].key}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4"
          >
            <h2 className="text-2xl font-bold">{slides[index].title}</h2>
            <p className="text-gray-600">{slides[index].description}</p>

            {slides[index].key === "welcome-video" && (
              <div className="space-y-4">
                <button
                  className="w-full bg-black text-white py-2 rounded-xl"
                  onClick={() => alert("Sign In clicked")}
                >
                  Sign In
                </button>
                <button
                  className="w-full border border-black py-2 rounded-xl"
                  onClick={() => alert("Sign Up clicked")}
                >
                  Sign Up
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

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

      {/* FAQ Modal */}
      <AnimatePresence>
        {faqOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Free Assessment Modal */}
      <AnimatePresence>
        {assessmentOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
