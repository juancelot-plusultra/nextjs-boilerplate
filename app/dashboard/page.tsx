"use client";

import { useMemo, useState } from "react";

type TabKey = "home" | "schedule" | "chat" | "payments" | "profile";

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

function iconBase(cls = "") {
  return `h-6 w-6 ${cls}`;
}

function CalendarIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9ZM6 6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1H6Z"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 3 2.5 11.2l1.3 1.5L5 11.7V20a2 2 0 0 0 2 2h4v-6h2v6h4a2 2 0 0 0 2-2v-8.3l1.2 1 1.3-1.5L12 3z" />
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm14 8H3v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-9ZM6 6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1H6Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H7Z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 7a3 3 0 0 1 3-3h12a1 1 0 1 1 0 2H7a1 1 0 0 0 0 2h13a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Zm15 6a1.5 1.5 0 1 0 0 3h2v-3h-2Z"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9 18 15 12 9 6l1.4-1.4L18.8 12l-8.4 7.4L9 18Z" />
    </svg>
  );
}

function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur shadow-sm ring-1 ring-black/5 p-6">
      {(title || subtitle || right) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <div className="text-xl font-bold">{title}</div>}
            {subtitle && <div className="mt-1 text-black/50">{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      <div className={title || subtitle || right ? "mt-5" : ""}>{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState<TabKey>("home");

  const now = new Date();
  const userName = "John";
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";

  const monday = startOfWeekMonday(now);
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [monday]);

  const todayIdxMon0 = (() => {
    const js = now.getDay();
    return js === 0 ? 6 : js - 1;
  })();

  // Demo schedule + goals (swap later with real data)
  const upcoming = useMemo(
    () => [
      { when: "Today • 6:00 PM", what: "Coach Session — Better Form", where: "Sikatuna" },
      { when: "Wed • 7:00 PM", what: "Strength — Better Fitness", where: "E. Rodriguez" },
      { when: "Sat • 9:00 AM", what: "Mobility — Better Function", where: "Cainta" },
    ],
    []
  );

  const goalsByDay: Record<number, { title: string; detail: string }> = {
    0: { title: "Weights Training", detail: "Lower body + core" },
    1: { title: "Mobility + Form", detail: "Technique & movement quality" },
    2: { title: "Weights Training", detail: "Upper body strength" },
    3: { title: "Conditioning", detail: "Intervals + endurance" },
    4: { title: "Weights Training", detail: "Full body session" },
    5: { title: "Recovery", detail: "Light cardio + mobility" },
    6: { title: "Rest Day", detail: "Walk + stretch" },
  };

  const todayGoal = goalsByDay[todayIdxMon0] ?? { title: "Training", detail: "Stay consistent" };

  // Fake weather for UI (replace with API later)
  const location = "Marikina";
  const tempC = 28;

  // Payments demo
  const balancePhp = 980;
  const packageName = "24 Sessions (Staggered)";
  const sessionsLeft = 9;

  // Chat demo
  const threads = useMemo(
    () => [
      { name: "Coach JP", last: "Send me your availability for this week.", time: "2h" },
      { name: "BearFit Support", last: "Your assessment is confirmed. See you!", time: "1d" },
    ],
    []
  );

  // ----------- Pages (tab content) -----------
  const HomeTab = (
    <div className="space-y-6">
      {/* Top header (like your Image 1) */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-white/80 shadow-sm ring-1 ring-black/5 overflow-hidden flex items-center justify-center">
            <span className="text-sm font-semibold text-black/60">JP</span>
          </div>
          <div>
            <div className="text-2xl font-semibold">{userName}</div>
            <div className="text-black/45">{greeting}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTab("schedule")}
            className="relative h-14 w-14 rounded-full bg-white/55 backdrop-blur shadow-sm ring-1 ring-black/5 flex items-center justify-center"
            aria-label="Open schedule"
          >
            <CalendarIcon />
          </button>

          <button
            onClick={() => setTab("chat")}
            className="relative h-14 w-14 rounded-full bg-white/55 backdrop-blur shadow-sm ring-1 ring-black/5 flex items-center justify-center"
            aria-label="Open notifications"
          >
            <BellIcon />
            <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      {/* Big Welcome */}
      <div>
        <div className="text-black/30">Hello, {userName}</div>
        <div className="mt-1 text-6xl font-extrabold tracking-tight">Welcome Back</div>
      </div>

      {/* Week strip */}
      <Card>
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

                <div className={["h-2 w-2 rounded-full", i < todayIdxMon0 ? "bg-[#6ea8ff]" : "bg-transparent"].join(" ")} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Goals activity (weather + goals) */}
      <div>
        <div className="text-3xl font-bold">Goals Activity</div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5 p-6 flex items-center justify-between">
            <div>
              <div className="text-black/50 text-lg">{location}</div>
              <div className="text-4xl font-extrabold mt-1">{formatTime(now)}</div>
              <div className="text-black/40 text-xl mt-2">{formatDate(now)}</div>
            </div>

            <div className="h-28 w-28 rounded-3xl bg-[#F37120] flex flex-col items-center justify-center text-white shadow-md">
              <div className="text-4xl">☁️</div>
              <div className="mt-2 text-xl font-semibold">{tempC}°C</div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#F37120] shadow-sm ring-1 ring-black/5 p-6 flex flex-col justify-center text-white">
            <div className="text-white/80 text-xl">Goals Today</div>
            <div className="mt-2 text-4xl font-extrabold">{todayGoal.title}</div>
            <div className="mt-2 text-white/85 text-xl">{todayGoal.detail}</div>

            <button
              onClick={() => setTab("schedule")}
              className="mt-6 rounded-2xl bg-white/15 px-4 py-3 text-white/95 text-left flex items-center justify-between"
            >
              <span>View schedule</span>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions row (app-feel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Quick Actions"
          subtitle="Fast shortcuts for members"
        >
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setTab("schedule")} className="rounded-2xl bg-[#0b1220] text-white py-4 font-semibold">
              Book Session
            </button>
            <button onClick={() => setTab("payments")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              Pay Balance
            </button>
            <button onClick={() => setTab("chat")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              Message Coach
            </button>
            <button onClick={() => setTab("profile")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              My Profile
            </button>
          </div>
        </Card>

        <Card title="Today’s Summary" subtitle="Your membership at a glance">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/10 px-4 py-3">
              <span className="text-black/60">Package</span>
              <span className="font-semibold">{packageName}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/10 px-4 py-3">
              <span className="text-black/60">Sessions left</span>
              <span className="font-semibold">{sessionsLeft}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/10 px-4 py-3">
              <span className="text-black/60">Balance</span>
              <span className="font-semibold">₱{balancePhp}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const ScheduleTab = (
    <div className="space-y-6">
      <div className="text-4xl font-extrabold">Schedule</div>

      <Card title="Upcoming Sessions" subtitle="Your next trainings">
        <div className="space-y-3">
          {upcoming.map((x, idx) => (
            <div key={idx} className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
              <div className="text-black/50">{x.when}</div>
              <div className="mt-1 text-lg font-semibold">{x.what}</div>
              <div className="mt-1 text-black/50">{x.where}</div>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full rounded-2xl bg-[#F37120] py-4 font-semibold text-white">
          Book a new session
        </button>
        <div className="mt-2 text-sm text-black/45 text-center">
          (Connect to your booking system later)
        </div>
      </Card>

      <Card title="Workout Plan" subtitle="Suggested focus this week">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <div className="text-black/50">Better Form</div>
            <div className="mt-1 font-semibold">Technique & coaching cues</div>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <div className="text-black/50">Better Function</div>
            <div className="mt-1 font-semibold">Mobility & daily movement</div>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <div className="text-black/50">Better Fitness</div>
            <div className="mt-1 font-semibold">Strength & conditioning</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const ChatTab = (
    <div className="space-y-6">
      <div className="text-4xl font-extrabold">Chat</div>

      <Card title="Messages" subtitle="Coach support & updates">
        <div className="space-y-3">
          {threads.map((t, idx) => (
            <button
              key={idx}
              className="w-full text-left rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-start justify-between gap-4"
            >
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="mt-1 text-black/50">{t.last}</div>
              </div>
              <div className="text-black/40">{t.time}</div>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white ring-1 ring-black/10 p-4">
          <div className="text-black/50 mb-2">Quick message</div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-2xl bg-[#eef3fb] px-4 py-3 outline-none ring-1 ring-black/5"
              placeholder="Type here…"
            />
            <button className="rounded-2xl bg-[#0b1220] text-white px-5 font-semibold">
              Send
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  const PaymentsTab = (
    <div className="space-y-6">
      <div className="text-4xl font-extrabold">Payments</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Balance" subtitle="Amount due">
          <div className="text-5xl font-extrabold">₱{balancePhp}</div>
          <button className="mt-5 w-full rounded-2xl bg-[#F37120] py-4 font-semibold text-white">
            Pay now
          </button>
          <div className="mt-2 text-sm text-black/45 text-center">
            (Hook up PayMongo/GCash/card later)
          </div>
        </Card>

        <Card title="Package" subtitle="Your current plan">
          <div className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <div className="text-black/50">Plan</div>
            <div className="mt-1 text-lg font-semibold">{packageName}</div>
          </div>
          <div className="mt-3 rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <div className="text-black/50">Sessions left</div>
            <div className="mt-1 text-lg font-semibold">{sessionsLeft}</div>
          </div>

          <button className="mt-5 w-full rounded-2xl bg-[#0b1220] py-4 font-semibold text-white">
            Buy more sessions
          </button>
        </Card>
      </div>

      <Card title="History" subtitle="Recent transactions">
        <div className="space-y-3">
          {[
            { date: "Jan 22", item: "24 Sessions Package", amt: "₱9,999" },
            { date: "Jan 10", item: "Assessment Fee", amt: "₱499" },
          ].map((p, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
              <div>
                <div className="font-semibold">{p.item}</div>
                <div className="text-black/50">{p.date}</div>
              </div>
              <div className="font-semibold">{p.amt}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const ProfileTab = (
    <div className="space-y-6">
      <div className="text-4xl font-extrabold">Profile</div>

      <Card title="Member Info" subtitle="Your account">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <span className="text-black/50">Name</span>
            <span className="font-semibold">{userName}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <span className="text-black/50">Role</span>
            <span className="font-semibold">Member</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <span className="text-black/50">Home branch</span>
            <span className="font-semibold">Sikatuna</span>
          </div>
        </div>
      </Card>

      <Card title="Progress" subtitle="Quick view">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <div className="text-black/50">Streak</div>
            <div className="mt-1 text-2xl font-extrabold">6</div>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <div className="text-black/50">Sessions this month</div>
            <div className="mt-1 text-2xl font-extrabold">8</div>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
            <div className="text-black/50">Next goal</div>
            <div className="mt-1 font-semibold">Better squat depth</div>
          </div>
        </div>
      </Card>

      <Card title="Settings" subtitle="App preferences">
        <div className="space-y-3">
          {[
            { label: "Notifications", value: "On" },
            { label: "Preferred Branch", value: "Sikatuna" },
            { label: "Dark mode", value: "Auto" },
          ].map((s, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
              <span className="font-semibold">{s.label}</span>
              <span className="text-black/50">{s.value}</span>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
          Log out
        </button>
      </Card>
    </div>
  );

  const content = tab === "home" ? HomeTab : tab === "schedule" ? ScheduleTab : tab === "chat" ? ChatTab : tab === "payments" ? PaymentsTab : ProfileTab;

  // ----------- Layout -----------
  return (
    <div className="min-h-screen bg-[#eef3fb] text-[#0b1220]">
      {/* main */}
      <div className="mx-auto w-full max-w-[1100px] px-5 py-6 pb-28">{content}</div>

      {/* bottom nav (app feel) */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto w-full max-w-[1100px] px-5 pb-4">
          <div className="rounded-3xl bg-white/70 backdrop-blur shadow-sm ring-1 ring-black/5 px-4 py-3">
            <div className="grid grid-cols-5 gap-2">
              <NavItem active={tab === "home"} label="Home" onClick={() => setTab("home")}>
                <HomeIcon />
              </NavItem>
              <NavItem active={tab === "schedule"} label="Schedule" onClick={() => setTab("schedule")}>
                <ScheduleIcon />
              </NavItem>
              <NavItem active={tab === "chat"} label="Chat" onClick={() => setTab("chat")}>
                <ChatIcon />
              </NavItem>
              <NavItem active={tab === "payments"} label="Pay" onClick={() => setTab("payments")}>
                <WalletIcon />
              </NavItem>
              <NavItem active={tab === "profile"} label="Profile" onClick={() => setTab("profile")}>
                <UserIcon />
              </NavItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition",
        active ? "bg-[#F37120] text-white shadow-sm" : "text-black/55 hover:bg-black/5",
      ].join(" ")}
    >
      <div className={active ? "text-white" : "text-black/60"}>{children}</div>
      <div className={["text-xs font-semibold", active ? "text-white" : "text-black/45"].join(" ")}>
        {label}
      </div>
    </button>
  );
}
