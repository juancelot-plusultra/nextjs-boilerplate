"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  key: string;
  title?: string;
  subtitle?: string;
  image?: string;
  video?: string;
  cta?: boolean;
};

const STORAGE_KEY = "bearfit_onboarded_v1";
const START_PAGE = "/member/dashboard";
const DURATIONS_SECONDS = {
  welcomeVideo: 47,
  normal: 10,
};
const IDLE_RESTART_SECONDS = 60;

export default function WelcomePage() {
  const slides: Slide[] = useMemo(
    () => [
      {
        key: "welcome-video",
        video: "/welcome/welcome-bg.mp4",
        title: "EVERY SESSION BUILDS YOUR STORY.",
        subtitle: "Better Form | Better Function | Better Fitness.",
      },
      {
        key: "better-form",
        title: "Better Form",
        subtitle: "Train smarter with coach-guided movement.",
        image: "/onboarding/better-form1.jpg",
      },
      {
        key: "better-function",
        title: "Better Function",
        subtitle: "Move better in everyday life, not just in the gym.",
        image: "/onboarding/better-function1.jpg",
      },
      {
        key: "better-fitness",
        title: "Better Fitness",
        subtitle: "Build strength, confidence, and consistency.",
        image: "/onboarding/better-fintness1.jpg",
      },
      {
        key: "free-assessment",
        title: "Free Assessment",
        subtitle: "Your journey starts here. Let’s get moving.",
        image: "/onboarding/free-assesment1.jpg",
        cta: true,
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [countdown, setCountdown] = useState(DURATIONS_SECONDS.welcomeVideo);
  const [formModalOpen, setFormModalOpen] = useState(false); // State for form modal visibility

  const isLast = index === slides.length - 1;

  const next = () => {
    if (!isLast) setIndex((i) => i + 1);
  };
  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };
  const skip = () => setIndex(slides.length - 1);

  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.location.href = START_PAGE;
  };

  const goToRole = (role: "Member" | "Staff" | "Leads" | "Admin") => {
    localStorage.setItem("bearfit_preview_role", role);
    localStorage.setItem(STORAGE_KEY, "1");
    window.location.href = START_PAGE;
  };

  const openFormModal = () => setFormModalOpen(true); // Open modal
  const closeFormModal = () => setFormModalOpen(false); // Close modal

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      age: formData.get("age"),
      fitness_goal: formData.get("fitness_goal"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      preferred_schedule: formData.get("preferred_schedule"),
      additional_goals: formData.get("additional_goals"),
    };

    console.log(data); // Log the form data for now
    alert("Form submitted successfully!");
    setFormModalOpen(false); // Close modal after submission
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("reset") === "1") {
      localStorage.removeItem(STORAGE_KEY);
    }

    if (params.get("preview") === "1") {
      setReady(true);
      return;
    }

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

    const duration =
      slides[index]?.key === "welcome-video"
        ? DURATIONS_SECONDS.welcomeVideo
        : DURATIONS_SECONDS.normal;

    if (slides[index]?.key === "welcome-video") {
      setCountdown(DURATIONS_SECONDS.welcomeVideo);
    }

    const t = window.setTimeout(() => next(), duration * 1000);
    return () => window.clearTimeout(t);
  }, [index, ready, faqOpen]);

  useEffect(() => {
    if (!ready) return;
    if (faqOpen) return;
    if (slides[index]?.key !== "welcome-video") return;

    const t = window.setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => window.clearInterval(t);
  }, [index, ready, faqOpen, slides]);

  const idleTimerRef = useRef<number | null>(null);

  const resetIdle = () => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setFaqOpen(false);
      setIndex(0);
      setCountdown(DURATIONS_SECONDS.welcomeVideo);
    }, IDLE_RESTART_SECONDS * 1000);
  };

  useEffect(() => {
    if (!ready) return;

    const handler = () => resetIdle();

    window.addEventListener("mousemove", handler);
    window.addEventListener("mousedown", handler);
    window.addEventListener("touchstart", handler, { passive: true });
    window.addEventListener("keydown", handler);
    window.addEventListener("scroll", handler, { passive: true });

    resetIdle();

    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("touchstart", handler as any);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("scroll", handler as any);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [ready]);

  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (faqOpen) return;
    resetIdle();
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (faqOpen) return;
    resetIdle();
    if (startX.current === null) return;

    const diff = e.changedTouches[0].clientX - startX.current;
    startX.current = null;

    if (diff < -50) next();
    if (diff > 50) prev();
  };

  if (!ready) return null;

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const active = i === index;

          return (
            <div key={slide.key} className="relative w-full h-full flex-shrink-0">
              {slide.video ? (
                <>
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src={slide.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/45" />
                </>
              ) : (
                <>
                  <Image
                    src={slide.image!}
                    alt={slide.title ?? "BearFitPH slide"}
                    fill
                    className="object-cover"
                    priority={i === 1}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </>
              )}

              <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
                <div className={`bf-anim ${active ? "bf-anim--in" : ""} max-w-[720px]`}>
                  {slide.key === "welcome-video" && (
                    <div className="text-[#F37120] text-sm font-semibold tracking-wide mb-3">
                      Welcome to BearFitPH
                    </div>
                  )}

                  <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p className="mt-4 text-white/85 font-medium">{slide.subtitle}</p>
                  )}

                  {slide.key === "welcome-video" && (
                    <button
                      onClick={() => {
                        resetIdle();
                        next();
                      }}
                      className="mt-7 inline-flex items-center justify-between gap-4 w-full sm:w-[380px] rounded-full bg-[#F37120] px-6 py-4 font-semibold text-black"
                    >
                      <span>Next</span>
                      <span className="text-black/70 text-sm">{countdown}s</span>
                    </button>
                  )}

                  {slide.cta && (
                    <div className="mt-6 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={openFormModal} // Open modal on click
                        className="mt-4 w-full sm:w-[420px] rounded-full bg-[#F37120] px-6 py-3 font-semibold text-black"
                      >
                        Get Started – Free Assessment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between items-center text-white">
        <button
          onClick={() => {
            resetIdle();
            skip();
          }}
          className="text-white/80"
        >
          Skip
        </button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            resetIdle();
            next();
          }}
          disabled={isLast}
          className={isLast ? "opacity-40" : "text-white/80"}
        >
          Next
        </button>
      </div>

      {/* Free Assessment Form Modal */}
      {formModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeFormModal} className="close-btn">X</button>
            <h2>Free Assessment</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" required />
              <input type="number" name="age" placeholder="Age" required />
              <select name="fitness_goal" required>
                <option value="weight_loss">Weight Loss</option>
                <option value="strength_training">Strength Training</option>
                <option value="cardio">Cardio</option>
              </select>
              <input type="email" name="email" placeholder="Email" required />
              <input type="tel" name="phone" placeholder="Phone" required />
              <input type="text" name="preferred_schedule" placeholder="Preferred Schedule" required />
              <textarea name="additional_goals" placeholder="Additional Goals (optional)"></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 20px;
          cursor: pointer;
        }

        form input, form select, form textarea {
          margin: 10px 0;
          padding: 8px;
          width: 100%;
        }

        button[type="submit"] {
          background: #F37120;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}
