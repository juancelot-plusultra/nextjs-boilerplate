"use client";

import React, { useMemo, useState } from "react";

/**
 * BearFit Dashboard (UI only)
 * - Animated tab transitions (slide)
 * - Badge counters (chat, unpaid, notifications)
 * - Role switching: Member / Staff / Admin(Owner) with different nav items
 * - Member Schedule includes a simple week calendar grid
 */

type Role = "member" | "staff" | "admin";

type MemberTab = "home" | "schedule" | "chat" | "payments" | "profile";
type StaffTab = "home" | "attendance" | "clients" | "sessions" | "sales";
type AdminTab = "home" | "overview" | "clients" | "sales" | "settings";

type TabKey = MemberTab | StaffTab | AdminTab;

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

/* -------------------- Icons -------------------- */
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
      <path
        fill="currentColor"
        d="M12 3 2.5 11.2l1.3 1.5L5 11.7V20a2 2 0 0 0 2 2h4v-6h2v6h4a2 2 0 0 0 2-2v-8.3l1.2 1 1.3-1.5L12 3z"
      />
    </svg>
  );
}
function ScheduleIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm14 8H3v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-9ZM6 6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1H6Z"
      />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H7Z"
      />
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
      <path
        fill="currentColor"
        d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
      />
    </svg>
  );
}
function ClipboardIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9 2h6a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2Zm6 2H9v2h6V4Zm4 4H5v12h14V8Z"
      />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 11a4 4 0 1 0-3.999-4A4 4 0 0 0 16 11ZM8 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4ZM8 13c-.44 0-.92.03-1.43.1C4.03 13.4 2 14.44 2 17v3h5v-3.2c0-1.86.98-3.02 2.37-3.8A10.2 10.2 0 0 0 8 13Z"
      />
    </svg>
  );
}
function DumbbellIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 10h2V8a2 2 0 0 1 2-2h1v12H7a2 2 0 0 1-2-2v-2H3v-4Zm16 0h2v4h-2v2a2 2 0 0 1-2 2h-1V6h1a2 2 0 0 1 2 2v2Zm-4 1H9v2h6v-2Z"
      />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M4 19h16v2H2V3h2v16Zm4-8h2v6H8v-6Zm5-4h2v10h-2V7Zm5 6h2v4h-2v-4Z" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.4 13a7.9 7.9 0 0 0 0-2l2-1.2a.9.9 0 0 0 .3-1.2l-1.9-3.3a.9.9 0 0 0-1.1-.4l-2.2.9a8.2 8.2 0 0 0-1.7-1l-.3-2.4A.9.9 0 0 0 13.6 1h-3.2a.9.9 0 0 0-.9.8l-.3 2.4a8.2 8.2 0 0 0-1.7 1l-2.2-.9a.9.9 0 0 0-1.1.4L2.3 8a.9.9 0 0 0 .3 1.2l2 1.2a7.9 7.9 0 0 0 0 2l-2 1.2a.9.9 0 0 0-.3 1.2l1.9 3.3a.9.9 0 0 0 1.1.4l2.2-.9a8.2 8.2 0 0 0 1.7 1l.3 2.4a.9.9 0 0 0 .9.8h3.2a.9.9 0 0 0 .9-.8l.3-2.4a8.2 8.2 0 0 0 1.7-1l2.2.9a.9.9 0 0 0 1.1-.4l1.9-3.3a.9.9 0 0 0-.3-1.2L19.4 13ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
      />
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

/* -------------------- UI Primitives -------------------- */
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

function Badge({ value, color = "orange" }: { value: number; color?: "orange" | "red" | "blue" }) {
  const bg = color === "red" ? "bg-red-500" : color === "blue" ? "bg-blue-500" : "bg-[#F37120]";
  if (value <= 0) return null;
  return (
    <span
      className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full ${bg} text-white text-[11px] font-bold flex items-center justify-center`}
    >
      {value > 99 ? "99+" : value}
    </span>
  );
}

/* -------------------- Main Page -------------------- */
export default function DashboardPage() {
  const now = new Date();
  const userName = "John";
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";

  // Role switching
  const [role, setRole] = useState<Role>("member");

  // Active tab + animation direction
  const [tab, setTab] = useState<TabKey>("home");
  const [animDir, setAnimDir] = useState<"left" | "right">("right");

  const setTabAnimated = (next: TabKey) => {
    if (next === tab) return;

    const orderMember: MemberTab[] = ["home", "schedule", "chat", "payments", "profile"];
    const orderStaff: StaffTab[] = ["home", "attendance", "clients", "sessions", "sales"];
    const orderAdmin: AdminTab[] = ["home", "overview", "clients", "sales", "settings"];

    const order =
      role === "member" ? (orderMember as TabKey[]) : role === "staff" ? (orderStaff as TabKey[]) : (orderAdmin as TabKey[]);

    const cur = order.indexOf(tab);
    const nxt = order.indexOf(next);

    setAnimDir(nxt >= cur ? "right" : "left");
    setTab(next);
  };

  const onSwitchRole = (r: Role) => {
    setRole(r);
    setAnimDir("right");
    setTab("home");
  };

  // Week data (Home UI)
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

  // Demo schedule + goals
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

  // Fake weather for UI
  const location = "Marikina";
  const tempC = 28;

  // Counters (badges)
  const unreadChat = 3;
  const unpaidBalancePhp = 980;
  const notifCount = 2;

  // Staff counters
  const attendancePending = 5;
  const salesLeads = 2;

  // Admin counters
  const unpaidInvoices = 7;
  const adminNotif = 4;

  // Payments demo
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

  /* -------------------- Tab Content -------------------- */

  const MemberHome = (
    <div className="space-y-6">
      {/* Top header + role toggle */}
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
          <RoleSwitch role={role} onChange={onSwitchRole} />

          <button
            onClick={() => setTabAnimated("schedule")}
            className="relative h-14 w-14 rounded-full bg-white/55 backdrop-blur shadow-sm ring-1 ring-black/5 flex items-center justify-center"
            aria-label="Open schedule"
          >
            <CalendarIcon />
          </button>

          <button
            onClick={() => setTabAnimated("chat")}
            className="relative h-14 w-14 rounded-full bg-white/55 backdrop-blur shadow-sm ring-1 ring-black/5 flex items-center justify-center"
            aria-label="Open notifications"
          >
            <BellIcon />
            <Badge value={notifCount} color="red" />
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

      {/* Goals activity */}
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
              onClick={() => setTabAnimated("schedule")}
              className="mt-6 rounded-2xl bg-white/15 px-4 py-3 text-white/95 text-left flex items-center justify-between"
            >
              <span>View schedule</span>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Quick Actions" subtitle="Fast shortcuts for members">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setTabAnimated("schedule")} className="rounded-2xl bg-[#0b1220] text-white py-4 font-semibold">
              Book Session
            </button>
            <button onClick={() => setTabAnimated("payments")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              Pay Balance
            </button>
            <button onClick={() => setTabAnimated("chat")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              Message Coach
            </button>
            <button onClick={() => setTabAnimated("profile")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              My Profile
            </button>
          </div>
        </Card>

        <Card title="Today’s Summary" subtitle="Your membership at a glance">
          <div className="space-y-3">
            <RowItem label="Package" value={packageName} />
            <RowItem label="Sessions left" value={String(sessionsLeft)} />
            <RowItem label="Balance" value={`₱${unpaidBalancePhp}`} />
          </div>
        </Card>
      </div>
    </div>
  );

  const MemberSchedule = (
    <div className="space-y-6">
      <HeaderRow title="Schedule" role={role} onRoleChange={onSwitchRole} />

      {/* Simple calendar week grid */}
      <Card title="Week View" subtitle="UI-only calendar (tap a day)">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((d, i) => {
            const isToday = i === todayIdxMon0;
            return (
              <button
                key={i}
                className={[
                  "rounded-2xl py-4 text-center ring-1 ring-black/10 bg-white hover:bg-black/[0.02] transition",
                  isToday ? "bg-[#0b1220] text-white ring-black/20" : "text-black",
                ].join(" ")}
              >
                <div className={isToday ? "text-white/80" : "text-black/50"}>{dayLabel(i)}</div>
                <div className="text-xl font-bold">{d.getDate()}</div>
              </button>
            );
          })}
        </div>
      </Card>

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
        <button className="mt-5 w-full rounded-2xl bg-[#F37120] py-4 font-semibold text-white">Book a new session</button>
      </Card>
    </div>
  );

  const MemberChat = (
    <div className="space-y-6">
      <HeaderRow title="Chat" role={role} onRoleChange={onSwitchRole} />
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
            <input className="flex-1 rounded-2xl bg-[#eef3fb] px-4 py-3 outline-none ring-1 ring-black/5" placeholder="Type here…" />
            <button className="rounded-2xl bg-[#0b1220] text-white px-5 font-semibold">Send</button>
          </div>
        </div>
      </Card>
    </div>
  );

  const MemberPayments = (
    <div className="space-y-6">
      <HeaderRow title="Payments" role={role} onRoleChange={onSwitchRole} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Balance" subtitle="Amount due">
          <div className="text-5xl font-extrabold">₱{unpaidBalancePhp}</div>
          <button className="mt-5 w-full rounded-2xl bg-[#F37120] py-4 font-semibold text-white">Pay now</button>
        </Card>

        <Card title="Package" subtitle="Your current plan">
          <RowItem label="Plan" value={packageName} />
          <div className="mt-3">
            <RowItem label="Sessions left" value={String(sessionsLeft)} />
          </div>
          <button className="mt-5 w-full rounded-2xl bg-[#0b1220] py-4 font-semibold text-white">Buy more sessions</button>
        </Card>
      </div>
    </div>
  );

  const MemberProfile = (
    <div className="space-y-6">
      <HeaderRow title="Profile" role={role} onRoleChange={onSwitchRole} />
      <Card title="Member Info" subtitle="Your account">
        <div className="space-y-3">
          <RowItem label="Name" value={userName} />
          <RowItem label="Role" value="Member" />
          <RowItem label="Home branch" value="Sikatuna" />
        </div>
      </Card>
      <Card title="Settings" subtitle="App preferences">
        <div className="space-y-3">
          <RowItem label="Notifications" value="On" />
          <RowItem label="Preferred Branch" value="Sikatuna" />
          <RowItem label="Dark mode" value="Auto" />
        </div>
        <button className="mt-5 w-full rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">Log out</button>
      </Card>
    </div>
  );

  // ---------- STAFF PAGES ----------
  const StaffHome = (
    <div className="space-y-6">
      <HeaderRow title="Staff Dashboard" role={role} onRoleChange={onSwitchRole} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Today" subtitle="Quick ops snapshot">
          <div className="space-y-3">
            <RowItem label="Pending check-ins" value={String(attendancePending)} />
            <RowItem label="Sessions today" value="12" />
            <RowItem label="New leads" value={String(salesLeads)} />
          </div>
        </Card>

        <Card title="Actions" subtitle="Fast shortcuts">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setTabAnimated("attendance")} className="rounded-2xl bg-[#0b1220] text-white py-4 font-semibold">
              Check-in
            </button>
            <button onClick={() => setTabAnimated("clients")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              Clients
            </button>
            <button onClick={() => setTabAnimated("sessions")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              Sessions
            </button>
            <button onClick={() => setTabAnimated("sales")} className="rounded-2xl bg-[#F37120] text-white py-4 font-semibold">
              Sales
            </button>
          </div>
        </Card>

        <Card title="Notes" subtitle="What to prioritize">
          <div className="text-black/55 leading-relaxed">
            • Confirm assessments<br />
            • Follow up inactive members<br />
            • Update session deductions<br />
            • Close leads for packages
          </div>
        </Card>
      </div>
    </div>
  );

  const StaffAttendance = (
    <div className="space-y-6">
      <HeaderRow title="Attendance" role={role} onRoleChange={onSwitchRole} />
      <Card title="Quick Check-in" subtitle="Kiosk-friendly flow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="rounded-2xl bg-[#F37120] text-white py-4 font-semibold">Scan QR</button>
          <button className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">Search Member</button>
        </div>
        <div className="mt-5 space-y-3">
          {[
            { name: "Manny", status: "Arrived", time: "10:05 AM" },
            { name: "Ria", status: "Arrived", time: "10:20 AM" },
            { name: "Jed", status: "Booked", time: "11:00 AM" },
          ].map((x, i) => (
            <div key={i} className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{x.name}</div>
                <div className="text-black/45">{x.time}</div>
              </div>
              <div className="text-black/60 font-semibold">{x.status}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const StaffClients = (
    <div className="space-y-6">
      <HeaderRow title="Clients" role={role} onRoleChange={onSwitchRole} />
      <Card title="Member List" subtitle="Search + quick actions">
        <div className="flex gap-2">
          <input className="flex-1 rounded-2xl bg-white px-4 py-3 outline-none ring-1 ring-black/10" placeholder="Search client…" />
          <button className="rounded-2xl bg-[#0b1220] text-white px-5 font-semibold">Find</button>
        </div>

        <div className="mt-5 space-y-3">
          {[
            { name: "Sophia", plan: "24 Full", left: 6 },
            { name: "Chich", plan: "24 Staggered", left: 4 },
            { name: "Leo", plan: "48 Full", left: 19 },
          ].map((x, i) => (
            <button key={i} className="w-full text-left rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{x.name}</div>
                <div className="text-black/50">
                  {x.plan} • {x.left} left
                </div>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );

  const StaffSessions = (
    <div className="space-y-6">
      <HeaderRow title="Sessions" role={role} onRoleChange={onSwitchRole} />
      <Card title="Today’s Sessions" subtitle="Tap to mark complete">
        <div className="space-y-3">
          {[
            { time: "6:00 PM", who: "Manny", type: "Coached Strength" },
            { time: "7:00 PM", who: "Ria", type: "Mobility / Function" },
            { time: "8:00 PM", who: "Jed", type: "Better Form" },
          ].map((x, i) => (
            <div key={i} className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between">
              <div>
                <div className="text-black/50">{x.time}</div>
                <div className="font-semibold">{x.who}</div>
                <div className="text-black/50">{x.type}</div>
              </div>
              <button className="rounded-2xl bg-[#F37120] text-white px-4 py-3 font-semibold">Complete</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const StaffSales = (
    <div className="space-y-6">
      <HeaderRow title="Sales" role={role} onRoleChange={onSwitchRole} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Leads" subtitle="Follow up today">
          <div className="space-y-3">
            {[
              { name: "Victor", stage: "Assessment booked" },
              { name: "Karen", stage: "Considering 24 Full" },
            ].map((x, i) => (
              <div key={i} className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{x.name}</div>
                  <div className="text-black/50">{x.stage}</div>
                </div>
                <button className="rounded-2xl bg-[#0b1220] text-white px-4 py-3 font-semibold">Message</button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Revenue Snapshot" subtitle="This week">
          <div className="space-y-3">
            <RowItem label="Packages sold" value="7" />
            <RowItem label="Assessments" value="14" />
            <RowItem label="Projected revenue" value="₱72,000" />
          </div>
          <button className="mt-5 w-full rounded-2xl bg-[#F37120] text-white py-4 font-semibold">Create invoice</button>
        </Card>
      </div>
    </div>
  );

  // ---------- ADMIN / OWNER PAGES ----------
  const AdminHome = (
    <div className="space-y-6">
      <HeaderRow title="Owner Dashboard" role={role} onRoleChange={onSwitchRole} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Today" subtitle="High-level snapshot">
          <div className="space-y-3">
            <RowItem label="Revenue today" value="₱12,300" />
            <RowItem label="Check-ins" value="38" />
            <RowItem label="Invoices unpaid" value={String(unpaidInvoices)} />
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Owner shortcuts">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setTabAnimated("overview")} className="rounded-2xl bg-[#0b1220] text-white py-4 font-semibold">
              KPI
            </button>
            <button onClick={() => setTabAnimated("clients")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              Clients
            </button>
            <button onClick={() => setTabAnimated("sales")} className="rounded-2xl bg-[#F37120] text-white py-4 font-semibold">
              Sales
            </button>
            <button onClick={() => setTabAnimated("settings")} className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
              Settings
            </button>
          </div>
        </Card>

        <Card title="Alerts" subtitle="What needs attention">
          <div className="text-black/55 leading-relaxed">
            • 7 unpaid invoices<br />
            • 12 members at-risk<br />
            • 3 coaches need schedule confirmation<br />
            • Stock low: protein drinks
          </div>
        </Card>
      </div>
    </div>
  );

  const AdminOverview = (
    <div className="space-y-6">
      <HeaderRow title="KPI Overview" role={role} onRoleChange={onSwitchRole} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Revenue" subtitle="This week">
          <div className="text-5xl font-extrabold">₱72,000</div>
          <div className="mt-2 text-black/50">+12% vs last week</div>
        </Card>
        <Card title="Retention" subtitle="Active members">
          <div className="text-5xl font-extrabold">184</div>
          <div className="mt-2 text-black/50">12 at-risk</div>
        </Card>
        <Card title="Utilization" subtitle="Sessions delivered">
          <div className="text-5xl font-extrabold">96</div>
          <div className="mt-2 text-black/50">Avg 13.7/day</div>
        </Card>
      </div>

      <Card title="Management To-Do" subtitle="Owner checklist">
        <div className="space-y-3">
          {["Review staff schedule coverage", "Follow up unpaid invoices", "Approve promos for next week", "Audit session deductions"].map((t, i) => (
            <div key={i} className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between">
              <div className="font-semibold">{t}</div>
              <button className="rounded-xl bg-black/5 px-3 py-2 font-semibold text-black/60 hover:bg-black/10">Done</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const AdminClients = (
    <div className="space-y-6">
      <HeaderRow title="All Clients" role={role} onRoleChange={onSwitchRole} />
      <Card title="Search + segments" subtitle="Owners see everything (UI only)">
        <div className="flex gap-2">
          <input className="flex-1 rounded-2xl bg-white px-4 py-3 outline-none ring-1 ring-black/10" placeholder="Search member…" />
          <button className="rounded-2xl bg-[#0b1220] text-white px-5 font-semibold">Find</button>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {["All", "Active", "At-risk", "Unpaid", "New leads"].map((x) => (
            <span key={x} className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-black/60">
              {x}
            </span>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {[
            { name: "Sophia", status: "Active", note: "24 Full • 6 left" },
            { name: "Chich", status: "Unpaid", note: "Balance ₱980" },
            { name: "Leo", status: "At-risk", note: "No visit in 10 days" },
          ].map((x, i) => (
            <button key={i} className="w-full text-left rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{x.name}</div>
                <div className="text-black/50">
                  {x.status} • {x.note}
                </div>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );

  const AdminSales = (
    <div className="space-y-6">
      <HeaderRow title="Sales & Billing" role={role} onRoleChange={onSwitchRole} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Unpaid Invoices" subtitle="Needs follow-up">
          <div className="text-5xl font-extrabold">{unpaidInvoices}</div>
          <div className="mt-2 text-black/50">Tap an invoice (UI only)</div>

          <div className="mt-5 space-y-3">
            {[
              { who: "Chich", amount: "₱980", age: "3d" },
              { who: "Manny", amount: "₱1,500", age: "5d" },
              { who: "Ria", amount: "₱800", age: "7d" },
            ].map((x, i) => (
              <div key={i} className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{x.who}</div>
                  <div className="text-black/50">
                    {x.amount} • overdue {x.age}
                  </div>
                </div>
                <button className="rounded-2xl bg-[#0b1220] text-white px-4 py-3 font-semibold">Remind</button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Create" subtitle="Owner tools">
          <div className="grid grid-cols-1 gap-3">
            <button className="rounded-2xl bg-[#F37120] text-white py-4 font-semibold">Create invoice</button>
            <button className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">Record cash sale</button>
            <button className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">Promo / discount</button>
            <button className="rounded-2xl bg-[#0b1220] text-white py-4 font-semibold">Export report</button>
          </div>
        </Card>
      </div>
    </div>
  );

  const AdminSettings = (
    <div className="space-y-6">
      <HeaderRow title="Gym Settings" role={role} onRoleChange={onSwitchRole} />

      <Card title="Branches" subtitle="Locations + hours (UI only)">
        <div className="space-y-3">
          <RowItem label="Sikatuna" value="Mon–Fri 7AM–10PM" />
          <RowItem label="E. Rodriguez" value="Mon–Fri 7AM–10PM" />
          <RowItem label="Cainta" value="Sat 7AM–2PM" />
        </div>
        <button className="mt-5 w-full rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">Add branch</button>
      </Card>

      <Card title="Packages" subtitle="Plans + pricing (UI only)">
        <div className="space-y-3">
          <RowItem label="24 Full" value="₱xxxx" />
          <RowItem label="24 Staggered" value="₱xxxx" />
          <RowItem label="48 Full" value="₱xxxx" />
        </div>
        <button className="mt-5 w-full rounded-2xl bg-[#0b1220] text-white py-4 font-semibold">Edit packages</button>
      </Card>
    </div>
  );

  // Choose content
  const content = (() => {
    if (role === "member") {
      if (tab === "home") return MemberHome;
      if (tab === "schedule") return MemberSchedule;
      if (tab === "chat") return MemberChat;
      if (tab === "payments") return MemberPayments;
      return MemberProfile;
    }
    if (role === "staff") {
      if (tab === "home") return StaffHome;
      if (tab === "attendance") return StaffAttendance;
      if (tab === "clients") return StaffClients;
      if (tab === "sessions") return StaffSessions;
      return StaffSales;
    }
    // admin
    if (tab === "home") return AdminHome;
    if (tab === "overview") return AdminOverview;
    if (tab === "clients") return AdminClients;
    if (tab === "sales") return AdminSales;
    return AdminSettings;
  })();

  // Nav config (role-based)
  const navItems =
    role === "member"
      ? ([
          { key: "home", label: "Home", icon: <HomeIcon /> },
          { key: "schedule", label: "Schedule", icon: <ScheduleIcon /> },
          { key: "chat", label: "Chat", icon: <ChatIcon />, badge: unreadChat, badgeColor: "red" as const },
          { key: "payments", label: "Pay", icon: <WalletIcon />, badge: unpaidBalancePhp > 0 ? 1 : 0, badgeColor: "orange" as const },
          { key: "profile", label: "Profile", icon: <UserIcon /> },
        ] as { key: MemberTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: "orange" | "red" | "blue" }[])
      : role === "staff"
      ? ([
          { key: "home", label: "Home", icon: <HomeIcon /> },
          { key: "attendance", label: "Attend", icon: <ClipboardIcon />, badge: attendancePending, badgeColor: "blue" as const },
          { key: "clients", label: "Clients", icon: <UsersIcon /> },
          { key: "sessions", label: "Sessions", icon: <DumbbellIcon /> },
          { key: "sales", label: "Sales", icon: <ChartIcon />, badge: salesLeads, badgeColor: "orange" as const },
        ] as { key: StaffTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: "orange" | "red" | "blue" }[])
      : ([
          { key: "home", label: "Home", icon: <HomeIcon />, badge: adminNotif, badgeColor: "red" as const },
          { key: "overview", label: "KPI", icon: <ChartIcon /> },
          { key: "clients", label: "Clients", icon: <UsersIcon /> },
          { key: "sales", label: "Sales", icon: <WalletIcon />, badge: unpaidInvoices, badgeColor: "orange" as const },
          { key: "settings", label: "Settings", icon: <SettingsIcon /> },
        ] as { key: AdminTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: "orange" | "red" | "blue" }[]);

  return (
    <div className="min-h-screen bg-[#eef3fb] text-[#0b1220]">
      {/* main */}
      <div className="mx-auto w-full max-w-[1100px] px-5 py-6 pb-28">
        {/* Animated content wrapper */}
        <div key={`${role}-${tab}`} className={`bf-pane ${animDir === "right" ? "bf-in-right" : "bf-in-left"}`}>
          {content}
        </div>
      </div>

      {/* bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto w-full max-w-[1100px] px-5 pb-4">
          <div className="rounded-3xl bg-white/70 backdrop-blur shadow-sm ring-1 ring-black/5 px-4 py-3">
            <div className="grid grid-cols-5 gap-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.key}
                  active={tab === item.key}
                  label={item.label}
                  onClick={() => setTabAnimated(item.key)}
                  badge={item.badge}
                  badgeColor={item.badgeColor}
                >
                  {item.icon}
                </NavItem>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        .bf-pane {
          opacity: 0;
          animation-duration: 260ms;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }
        .bf-in-right {
          animation-name: bfSlideInRight;
        }
        .bf-in-left {
          animation-name: bfSlideInLeft;
        }
        @keyframes bfSlideInRight {
          from {
            opacity: 0;
            transform: translateX(14px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes bfSlideInLeft {
          from {
            opacity: 0;
            transform: translateX(-14px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

/* -------------------- Helpers -------------------- */
function NavItem({
  active,
  label,
  onClick,
  badge = 0,
  badgeColor = "orange",
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  badge?: number;
  badgeColor?: "orange" | "red" | "blue";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition",
        active ? "bg-[#F37120] text-white shadow-sm" : "text-black/55 hover:bg-black/5",
      ].join(" ")}
    >
      <div className={active ? "text-white" : "text-black/60"}>{children}</div>
      <Badge value={badge ?? 0} color={badgeColor} />
      <div className={["text-xs font-semibold", active ? "text-white" : "text-black/45"].join(" ")}>{label}</div>
    </button>
  );
}

function RowItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
      <span className="text-black/50">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function HeaderRow({
  title,
  role,
  onRoleChange,
}: {
  title: string;
  role: Role;
  onRoleChange: (r: Role) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-4xl font-extrabold">{title}</div>
      <RoleSwitch role={role} onChange={onRoleChange} />
    </div>
  );
}

function RoleSwitch({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return (
    <div className="rounded-full bg-white/70 backdrop-blur shadow-sm ring-1 ring-black/5 p-1 flex items-center">
      <button
        onClick={() => onChange("member")}
        className={[
          "px-3 py-2 rounded-full text-sm font-semibold transition",
          role === "member" ? "bg-[#0b1220] text-white" : "text-black/50 hover:text-black/70",
        ].join(" ")}
      >
        Member
      </button>
      <button
        onClick={() => onChange("staff")}
        className={[
          "px-3 py-2 rounded-full text-sm font-semibold transition",
          role === "staff" ? "bg-[#0b1220] text-white" : "text-black/50 hover:text-black/70",
        ].join(" ")}
      >
        Staff
      </button>
      <button
        onClick={() => onChange("admin")}
        className={[
          "px-3 py-2 rounded-full text-sm font-semibold transition",
          role === "admin" ? "bg-[#0b1220] text-white" : "text-black/50 hover:text-black/70",
        ].join(" ")}
      >
        Admin
      </button>
    </div>
  );
}
