"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useSession } from '@supabase/auth-helpers-react'; // Supabase Auth for session management

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image?: string;
  cta?: boolean;
};

const STORAGE_KEY = "bearfit_onboarded_v1";
const START_PAGE = "/member/dashboard"; // Redirect to main app after onboarding
const DURATIONS_SECONDS = { welcomeVideo: 47, normal: 10 };
const IDLE_RESTART_SECONDS = 60;

export default function WelcomePage() {
  const { session } = useSession(); // Check user session
  const router = useRouter();

  const slides: Slide[] = useMemo(() => [
    {
      key: "welcome-video",
      title: "Welcome to BearFit!",
      subtitle: "Transform Your Fitness Journey.",
      video: "/welcome/welcome-bg.mp4",
    },
    {
      key: "better-form",
      title: "Better Form",
      subtitle: "Train smarter with expert guidance.",
      image: "/onboarding/better-form1.jpg",
    },
    {
      key: "better-fitness",
      title: "Better Fitness",
      subtitle: "Track your progress to stay motivated.",
      image: "/onboarding/better-fitness1.jpg",
    },
    {
      key: "free-assessment",
      title: "Free Assessment",
      subtitle: "Personalized plan just for you.",
      image: "/onboarding/free-assessment.jpg",
      cta: true,
    },
  ], []);

  const [index, setIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(false);
  const [countdown, setCountdown] = useState(DURATIONS_SECONDS.welcomeVideo);
  
  const isLast = index === slides.length - 1;

  const next = () => {
    if (isLast) {
      // Redirect to assessment or main app after completion
      session ? router.push(START_PAGE) : router.push("/signup"); // Handle redirection for logged-in users
    } else {
      setIndex(index + 1);
    }
  };

  const skipIntro = () => {
    // Skip onboarding and navigate to the dashboard
    router.push(START_PAGE);
  };

  return (
    <div className="welcome-container">
      <div className="slide">
        <h1>{slides[index].title}</h1>
        <p>{slides[index].subtitle}</p>
        {slides[index].video && <video src={slides[index].video} autoPlay loop />}
        {slides[index].image && <img src={slides[index].image} alt={slides[index].title} />}
      </div>

      <div className="cta-container">
        {slides[index].cta && (
          <button onClick={() => router.push('/assessment')} className="cta-button">
            Start Your Free Assessment
          </button>
        )}

        {!isLast && (
          <button onClick={next} className="cta-button">
            Next
          </button>
        )}

        {isLast && (
          <button onClick={skipIntro} className="cta-button">
            Skip Intro
          </button>
        )}
      </div>

      {/* FAQ section */}
      {faqOpen && (
        <div className="faq-container">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-item">
            <p>How does BearFit work?</p>
            <p>It works by providing guided workouts and personalized tracking.</p>
          </div>
          <div className="faq-item">
            <p>Do I need to book sessions?</p>
            <p>Yes, you can book sessions directly within the app.</p>
          </div>
          <button onClick={() => setFaqOpen(false)} className="close-faq-button">
            Close FAQ
          </button>
        </div>
      )}
    </div>
  );
}
