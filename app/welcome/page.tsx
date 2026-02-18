"use client";

import { useEffect, useState } from "react"; import { motion, AnimatePresence } from "framer-motion"; import { Button } from "@/components/ui/button"; import { Card, CardContent } from "@/components/ui/card";

const slides = [ { key: "welcome", title: "Welcome to Plus Ultra", description: "Your journey starts here.", }, { key: "features", title: "Powerful Features", description: "Track progress, unlock potential, grow faster.", }, { key: "welcome-video", title: "Get Started", description: "Let’s set up your account.", }, ];

export default function WelcomePage() { const [index, setIndex] = useState(0); const [faqOpen, setFaqOpen] = useState(false); const [assessmentOpen, setAssessmentOpen] = useState(false);

const nextSlide = () => { if (index < slides.length - 1) setIndex(index + 1); };

const prevSlide = () => { if (index > 0) setIndex(index - 1); };

const skipSlides = () => { setIndex(slides.length - 1); };

useEffect(() => { const handleKey = (e: KeyboardEvent) => { if (e.key === "ArrowRight") nextSlide(); if (e.key === "ArrowLeft") prevSlide(); }; window.addEventListener("keydown", handleKey); return () => window.removeEventListener("keydown", handleKey); }, [index]);

return ( <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6"> <div className="w-full max-w-2xl"> <AnimatePresence mode="wait"> <motion.div key={slides[index].key} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} > <Card className="rounded-2xl shadow-xl"> <CardContent className="p-8 text-center space-y-4"> <h2 className="text-2xl font-bold">{slides[index].title}</h2> <p className="text-gray-600">{slides[index].description}</p>

{slides[index].key === "welcome-video" && (
              <div className="space-y-4">
                <Button className="w-full" onClick={() => alert("Sign In clicked")}>
                  Sign In
                </Button>
                <Button variant="outline" className="w-full" onClick={() => alert("Sign Up clicked")}>
                  Sign Up
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>

    {/* Navigation Controls */}
    <div className="flex justify-between mt-6">
      <Button variant="ghost" onClick={skipSlides}>
        Skip
      </Button>

      <div className="flex gap-2">
        <Button variant="outline" onClick={prevSlide} disabled={index === 0}>
          Back
        </Button>
        <Button onClick={nextSlide} disabled={index === slides.length - 1}>
          Next
        </Button>
      </div>
    </div>

    {/* Free Assessment Button */}
    <div className="mt-6 text-center">
      <Button
        className="rounded-2xl px-6"
        onClick={() => setAssessmentOpen(true)}
      >
        Free Assessment
      </Button>
    </div>

    {/* FAQ Button */}
    <div className="mt-4 text-center">
      <Button variant="link" onClick={() => setFaqOpen(true)}>
        View FAQ
      </Button>
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
          <Button onClick={() => setFaqOpen(false)} className="w-full">
            Close
          </Button>
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
          <Button onClick={() => setAssessmentOpen(false)} className="w-full">
            Close
          </Button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

); }
