"use client";

import { useMemo } from "react";

function dayLabel(i: number) {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
}

function formatTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const hour12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour12}.${m} ${ampm}`;
}

function formatDate(d: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
}

function startOfWeekMonday(d: Date) {
  const copy = new Date(d);
  const day = copy.getDay(); // Sun=0
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  copy.setDate(copy.getDate() + diffToMonday);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-90">
      <path
        fill="currentColor"
        d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9ZM6 6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1H6Z"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-90">
      <path
        fill="currentColor"
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const now = new Date();

  // Demo user (replace later with real auth)
  const userName = "John";
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";

  // Week strip
  const monday = startOfWeekMonday(now);
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [monday]);

  const todayIdxMon0 = (() => {
    // convert JS day to Mon=0
    const js = now.getDay(); // Sun=0
    return js === 0 ? 6 : js - 1;
  })();

  // Simple schedule-based goals (edit these freely)
  const goalsByDay: Record<number, { title: string; detail: string }> = {
    0: { title: "Weights Training", detail: "Lower body + core" }, // Mon
    1: { title: "Mobility + Form", detail: "Technique & movement quality" }, // Tue
    2: { title: "Weights Training", detail: "Upper body strength" }, // Wed
    3: { title: "Conditioning", detail: "Intervals + endurance" }, // Thu
    4: { title: "Weights Training", detail: "Full body session" }, // Fri
    5: { title: "Recovery", detail: "Light cardio + mobility" }, // Sat
    6: { title: "Rest Day", detail: "Walk + stretch" }, // Sun
  };

  const todayGoal = goalsByDay[todayIdxMon0] ?? { title: "Training", detail: "Stay consistent" };

  // Fake weather (swap later with API)
  const location = "Marikina";
  const tempC = 28;

  return (
    <div className="min-h-screen bg-[#eef3fb] text-[#0b1220]">
      <div className="mx-auto w-full max-w-[1100px] px-5 py-6">
        {/* HEADER (like Image 1) */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* avatar */}
            <div className="h-14 w-14 rounded-full bg-white/80 shadow-sm ring-1 ring-black/5 overflow-hidden flex items-center justify-center">
              {/* placeholder avatar */}
              <span className="text-sm font-semibold text-black/60">JP</span>
            </div>

            <div>
              <div className="text-2xl font-semibold">{userName}</div>
              <div className="text-black/45">{greeting}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative h-14 w-14 rounded-full bg-white/55 backdrop-blur shadow-sm ring-1 ring-black/5 flex items-center justify-center">
              <CalendarIcon />
            </button>

            <button className="relative h-14 w-14 rounded-full bg-white/55 backdrop-blur shadow-sm ring-1 ring-black/5 flex items-center justify-center">
              <BellIcon />
              {/* red dot */}
              <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>
          </div>
        </div>

        {/* BIG WELCOME (Image 1 vibe) */}
        <div className="mt-8">
          <div className="text-black/30">Hello, {userName}</div>
          <div className="mt-1 text-6xl font-extrabold tracking-tight">Welcome Back</div>
        </div>

        {/* WEEK STRIP */}
        <div className="mt-6 rounded-3xl bg-white/70 backdrop-blur px-6 py-5 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-7 gap-2 text-center">
            {weekDays.map((d, i) => {
              const isToday = i === todayIdxMon0;
              return (
                <div key={i} className="flex flex-col items-center justify-center gap-2">
                  <div className="text-black/40 text-lg">{dayLabel(i)}</div>

                  <div
                    className={[
                      "h-14 w-14 rounded-full flex items-center justify-center text-xl font-semibold",
                      isToday ? "bg-[#6ea8ff] text-white shadow-md" : "text-black/70",
                    ].join(" ")}
                  >
                    {d.getDate()}
                  </div>

                  {/* tiny activity dot (demo) */}
                  <div className={["h-2 w-2 rounded-full", i < todayIdxMon0 ? "bg-[#6ea8ff]" : "bg-transparent"].join(" ")} />
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2 (Image 2 vibe) */}
        <div className="mt-10">
          <div className="text-3xl font-bold">Goals Activity</div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather/time card */}
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5 p-6 flex items-center justify-between">
              <div>
                <div className="text-black/50 text-lg">{location}</div>
                <div className="text-4xl font-extrabold mt-1">{formatTime(now)}</div>
                <div className="text-black/40 text-xl mt-2">{formatDate(now)}</div>
              </div>

              {/* orange weather box */}
              <div className="h-28 w-28 rounded-3xl bg-[#F37120] flex flex-col items-center justify-center text-white shadow-md">
                <div className="text-4xl">☁️</div>
                <div className="mt-2 text-xl font-semibold">{tempC}°C</div>
              </div>
            </div>

            {/* Goals today card (orange like Image 2) */}
            <div className="rounded-3xl bg-[#F37120] shadow-sm ring-1 ring-black/5 p-6 flex flex-col justify-center text-white">
              <div className="text-white/80 text-xl">Goals Today</div>
              <div className="mt-2 text-4xl font-extrabold">{todayGoal.title}</div>
              <div className="mt-2 text-white/85 text-xl">{todayGoal.detail}</div>

              <div className="mt-6 rounded-2xl bg-white/15 px-4 py-3 text-white/90">
                Based on today’s schedule.
              </div>
            </div>
          </div>
        </div>

        {/* spacing bottom */}
        <div className="h-10" />
      </div>
    </div>
  );
}
