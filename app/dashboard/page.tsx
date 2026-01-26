"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Dashboard with:
 * - Animated tab transitions (slide/fade)
 * - Badge counters (unread chat, unpaid balance, notifications)
 * - Role switching (Member vs Staff vs Admin) with different nav items
 *
 * NOTE:
 * - UI only (no backend)
 * - Live clock updates every 30s while page is open
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
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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
        d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.2 7.2 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.24-1.12.55-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.3.6.22l2.39-.96c.51.39 1.05.7 1.63.94l.36 2.54c.04.24.25.42.49.42h3.8c.24 0 .45-.18.49-.42l.36-2.54c.58-.24 1.12-.55 1.63-.94l2.39.96c.22.08.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
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
    <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full ${bg} text-white text-[11px] font-bold flex items-center justify-center`}>
      {value > 99 ? "99+" : value}
    </span>
  );
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-full text-sm font-semibold transition",
        active ? "bg-[#0b1220] text-white" : "text-black/50 hover:text-black/70",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
/* -------------------- Main Page -------------------- */
export default function DashboardPage() {
  // live clock (updates while page is open)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const userName = "John";
  const greeting =
    now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";

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
      role === "member"
        ? (orderMember as TabKey[])
        : role === "staff"
        ? (orderStaff as TabKey[])
        : (orderAdmin as TabKey[]);

    const cur = order.indexOf(tab);
    const nxt = order.indexOf(next);

    setAnimDir(nxt >= cur ? "right" : "left");
    setTab(next);
  };

  const onSwitchRole = (r: Role) => {
    setRole(r);
    // Keep UX consistent: reset to home on role change
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

  // Staff sample counters
  const attendancePending = 5;
  const salesLeads = 2;

  // Admin sample counters
  const adminNotifs = 4;
  const unpaidInvoices = 7;

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

  /* -------------------- TAB CONTENT (declared in PART 3 + PART 4) -------------------- */
  // MemberHome, MemberSchedule, MemberChat, MemberPayments, MemberProfile
  // StaffHome, StaffAttendance, StaffClients, StaffSessions, StaffSales
  // AdminHome, AdminOverview, AdminClients, AdminSales, AdminSettings

  // Placeholder until PART 3/4 defines them (DO NOT REMOVE)
  const MemberHome = null as any;
  const MemberSchedule = null as any;
  const MemberChat = null as any;
  const MemberPayments = null as any;
  const MemberProfile = null as any;

  const StaffHome = null as any;
  const StaffAttendance = null as any;
  const StaffClients = null as any;
  const StaffSessions = null as any;
  const StaffSales = null as any;

  const AdminHome = null as any;
  const AdminOverview = null as any;
  const AdminClients = null as any;
  const AdminSales = null as any;
  const AdminSettings = null as any;

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
          { key: "home", label: "Home", icon: <HomeIcon /> },
          { key: "overview", label: "Overview", icon: <ChartIcon />, badge: adminNotifs, badgeColor: "red" as const },
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

  /* -------------------- NOTE --------------------
     PART 3 will replace the placeholder tab components above with REAL ones.
  ----------------------------------------------- */
}
/* -------------------- TAB CONTENT -------------------- */

// ---------- MEMBER ----------
const MemberHome = (
  <div className="space-y-6">
    {/* Top header + role toggle + quick icons */}
    <div className="flex items-start justify-between gap-4">
      {/* left */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-white/80 shadow-sm ring-1 ring-black/5 overflow-hidden flex items-center justify-center">
          <span className="text-sm font-semibold text-black/60">JP</span>
        </div>
        <div>
          <div className="text-2xl font-semibold">{userName}</div>
          <div className="text-black/45">{greeting}</div>
        </div>
      </div>

      {/* right */}
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

    {/* Big Welcome (center-ish like your ref, but still responsive) */}
    <div className="text-center">
      <div className="text-black/30 text-lg">Hello, {userName}</div>
      <div className="mt-1 text-5xl sm:text-6xl font-extrabold tracking-tight">Welcome Back</div>
    </div>

    {/* Week strip (matches your ref vibe) */}
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

              <div
                className={[
                  "h-2 w-2 rounded-full",
                  i < todayIdxMon0 ? "bg-[#6ea8ff]" : "bg-transparent",
                ].join(" ")}
              />
            </div>
          );
        })}
      </div>
    </Card>

    {/* Goals activity (weather + goals today) */}
    <div className="space-y-3">
      <div className="text-3xl font-bold">Goals Activity</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather/Date card - like your 2nd reference */}
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

        {/* Goals today - orange tile like your ref */}
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

    {/* Announcement section (image + text block you can design later) */}
    <Card
      title="Announcements"
      subtitle="Latest updates from BearFit"
      right={
        <button className="text-sm font-semibold text-[#F37120] hover:opacity-80">
          View all
        </button>
      }
    >
      <div className="rounded-3xl overflow-hidden ring-1 ring-black/10 bg-white">
        {/* placeholder “image” block – swap with real image later */}
        <div className="h-40 bg-gradient-to-r from-[#0b1220] to-[#1b2a4a]" />
        <div className="p-5">
          <div className="text-lg font-bold">New: Free Assessment Week</div>
          <div className="mt-1 text-black/55">
            Book your complimentary assessment this week and get a personalized program.
          </div>
          <button
            onClick={() => setTabAnimated("schedule")}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#0b1220] text-white px-4 py-3 font-semibold"
          >
            Book now <ChevronRight />
          </button>
        </div>
      </div>
    </Card>

    {/* Calendar schedule grid (simple UI first) */}
    <Card title="Schedule Grid" subtitle="Today + upcoming">
      <div className="space-y-3">
        {upcoming.map((x, idx) => (
          <button
            key={idx}
            onClick={() => setTabAnimated("schedule")}
            className="w-full text-left rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-start justify-between gap-4 hover:bg-black/[0.02]"
          >
            <div>
              <div className="text-black/50">{x.when}</div>
              <div className="mt-1 text-lg font-semibold">{x.what}</div>
              <div className="mt-1 text-black/50">{x.where}</div>
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>
    </Card>

    {/* Quick actions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Quick Actions" subtitle="Fast shortcuts for members">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTabAnimated("schedule")}
            className="rounded-2xl bg-[#0b1220] text-white py-4 font-semibold"
          >
            Book Session
          </button>
          <button
            onClick={() => setTabAnimated("payments")}
            className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold"
          >
            Pay Balance
          </button>
          <button
            onClick={() => setTabAnimated("chat")}
            className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold"
          >
            Message Coach
          </button>
          <button
            onClick={() => setTabAnimated("profile")}
            className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold"
          >
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
            <span className="font-semibold">₱{unpaidBalancePhp}</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const MemberSchedule = (
  <div className="space-y-6">
    <HeaderRow title="Schedule" role={role} onRoleChange={onSwitchRole} />
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

const MemberPayments = (
  <div className="space-y-6">
    <HeaderRow title="Payments" role={role} onRoleChange={onSwitchRole} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Balance" subtitle="Amount due">
        <div className="text-5xl font-extrabold">₱{unpaidBalancePhp}</div>
        <button className="mt-5 w-full rounded-2xl bg-[#F37120] py-4 font-semibold text-white">
          Pay now
        </button>
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
      <button className="mt-5 w-full rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold">
        Log out
      </button>
    </Card>
  </div>
);

// ---------- STAFF ----------
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
          <button
            onClick={() => setTabAnimated("attendance")}
            className="rounded-2xl bg-[#0b1220] text-white py-4 font-semibold"
          >
            Check-in
          </button>
          <button
            onClick={() => setTabAnimated("clients")}
            className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold"
          >
            Clients
          </button>
          <button
            onClick={() => setTabAnimated("sessions")}
            className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold"
          >
            Sessions
          </button>
          <button
            onClick={() => setTabAnimated("sales")}
            className="rounded-2xl bg-[#F37120] text-white py-4 font-semibold"
          >
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
          <div
            key={i}
            className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between"
          >
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
        <input
          className="flex-1 rounded-2xl bg-white px-4 py-3 outline-none ring-1 ring-black/10"
          placeholder="Search client…"
        />
        <button className="rounded-2xl bg-[#0b1220] text-white px-5 font-semibold">
          Find
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {[
          { name: "Sophia", plan: "24 Full", left: 6 },
          { name: "Chich", plan: "24 Staggered", left: 4 },
          { name: "Leo", plan: "48 Full", left: 19 },
        ].map((x, i) => (
          <button
            key={i}
            className="w-full text-left rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between"
          >
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
          <div
            key={i}
            className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between"
          >
            <div>
              <div className="text-black/50">{x.time}</div>
              <div className="font-semibold">{x.who}</div>
              <div className="text-black/50">{x.type}</div>
            </div>
            <button className="rounded-2xl bg-[#F37120] text-white px-4 py-3 font-semibold">
              Complete
            </button>
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
            <div
              key={i}
              className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">{x.name}</div>
                <div className="text-black/50">{x.stage}</div>
              </div>
              <button className="rounded-2xl bg-[#0b1220] text-white px-4 py-3 font-semibold">
                Message
              </button>
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
        <button className="mt-5 w-full rounded-2xl bg-[#F37120] text-white py-4 font-semibold">
          Create invoice
        </button>
      </Card>
    </div>
  </div>
);

// ---------- ADMIN (HOME only in Part 3) ----------
const AdminHome = (
  <div className="space-y-6">
    <HeaderRow title="Owner Dashboard" role={role} onRoleChange={onSwitchRole} />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Today" subtitle="Gym pulse">
        <div className="space-y-3">
          <RowItem label="Check-ins" value="28" />
          <RowItem label="Sessions" value="12" />
          <RowItem label="New leads" value="5" />
        </div>
      </Card>

      <Card title="Sales" subtitle="Quick snapshot">
        <div className="space-y-3">
          <RowItem label="Revenue (today)" value="₱9,800" />
          <RowItem label="Unpaid invoices" value={String(unpaidInvoices)} />
          <RowItem label="Top package" value="24 Full" />
        </div>
      </Card>

      <Card title="Operations" subtitle="What needs attention">
        <div className="text-black/55 leading-relaxed">
          • Follow up on unpaid balances<br />
          • Review coach schedules<br />
          • Confirm inventory (water/towels)<br />
          • Check lead response times
        </div>
      </Card>
    </div>

    <Card title="Quick Actions" subtitle="Owner shortcuts">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setTabAnimated("overview")}
          className="rounded-2xl bg-[#0b1220] text-white py-4 font-semibold"
        >
          KPI Overview
        </button>
        <button
          onClick={() => setTabAnimated("clients")}
          className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold"
        >
          Client List
        </button>
        <button
          onClick={() => setTabAnimated("sales")}
          className="rounded-2xl bg-[#F37120] text-white py-4 font-semibold"
        >
          Sales / Billing
        </button>
        <button
          onClick={() => setTabAnimated("settings")}
          className="rounded-2xl bg-white ring-1 ring-black/10 py-4 font-semibold"
        >
          Gym Settings
        </button>
      </div>
    </Card>

    <Card title="Alerts" subtitle="Owner notifications">
      <div className="space-y-3">
        {[
          { title: "Unpaid balances", detail: "7 invoices pending", tone: "orange" },
          { title: "Coach coverage", detail: "Fri 7–9PM needs 1 coach", tone: "blue" },
          { title: "Leads waiting", detail: "2 leads older than 24h", tone: "red" },
        ].map((a, i) => (
          <div key={i} className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{a.title}</div>
              <div className="text-black/50">{a.detail}</div>
            </div>
            <div
              className={[
                "h-3 w-3 rounded-full",
                a.tone === "red" ? "bg-red-500" : a.tone === "blue" ? "bg-blue-500" : "bg-[#F37120]",
              ].join(" ")}
            />
          </div>
        ))}
      </div>
    </Card>
  </div>
);
type Role = "member" | "staff" | "admin";

type MemberTab = "home" | "schedule" | "chat" | "payments" | "profile";
type StaffTab = "home" | "attendance" | "clients" | "sessions" | "sales";
type AdminTab = "home" | "overview" | "clients" | "sales" | "settings";

type TabKey = MemberTab | StaffTab | AdminTab;

function SettingsIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.75.75 0 0 0 .18-.95l-1.92-3.32a.75.75 0 0 0-.9-.33l-2.39.96a7.1 7.1 0 0 0-1.63-.94l-.36-2.54A.75.75 0 0 0 12.4 0h-3.8a.75.75 0 0 0-.74.62l-.36 2.54c-.57.22-1.12.53-1.63.94l-2.39-.96a.75.75 0 0 0-.9.33L.66 6.79a.75.75 0 0 0 .18.95l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L.84 14.52a.75.75 0 0 0-.18.95l1.92 3.32c.2.34.6.48.98.33l2.39-.96c.5.41 1.06.72 1.63.94l.36 2.54c.06.36.38.62.74.62h3.8c.36 0 .68-.26.74-.62l.36-2.54c.57-.22 1.12-.53 1.63-.94l2.39.96c.38.15.78.01.98-.33l1.92-3.32a.75.75 0 0 0-.18-.95l-2.03-1.58ZM10.5 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"
      />
    </svg>
  );
}
