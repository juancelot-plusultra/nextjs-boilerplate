"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * BearFit Dashboard (UI only)
 * - Animated tab transitions (slide)
 * - Badge counters
 * - Role switching: Member / Staff / Admin(Owner) with different nav items
 * - Member Schedule includes a simple week calendar grid
 *
 * ✅ Updated Member HOME to match screenshot:
 * - Top row: BearFit logo (left), centered Role switch, bell + small caret (right)
 * - Profile card with plan pill on right + sessions remaining bar + View Profile
 * - Updates Feed: slidable image cards + AUTO SLIDE every 10s (NO countdown)
 * - Schedule for this week: slidable big cards (countdown allowed here)
 * - Activity Log section with tabs + list items
 *
 * ❗Other tabs / pages are preserved from your uploaded file.
 */

type Role = "member" | "staff" | "admin";

type MemberTab = "home" | "schedule" | "chat" | "announcements" | "payments" | "profile";
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
function CaretDown() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
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

function BearFitLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 rounded-2xl bg-[#F37120] grid place-items-center shadow-sm">
        <span className="text-white font-extrabold text-lg">B</span>
      </div>
      <div className="leading-tight">
        <div className="text-[#F37120] font-extrabold tracking-wide">BEARFIT</div>
        <div className="text-[11px] text-black/35 -mt-0.5">Better Fitness</div>
      </div>
    </div>
  );
}
export default function DashboardPage() {
  const now = new Date();

  // Member demo data to match screenshot vibe
  const memberName = "Aya Mohamed";
  const memberSubtitle = "Beast Member";
  const branchName = "Malingap Branch - A01";
  const planTitle = "Sustain 48 Membership";
  const planStatus = "Active";
  const totalSessions = 48;
  const sessionsRemaining = 40;
  const sessionsUsed = Math.max(0, totalSessions - sessionsRemaining);

  const remainingPct = Math.max(0, Math.min(100, Math.round((sessionsRemaining / totalSessions) * 100)));

  // Role switching
  const [role, setRole] = useState<Role>("member");

  // Active tab + animation direction
  const [tab, setTab] = useState<TabKey>("home");
  const [animDir, setAnimDir] = useState<"left" | "right">("right");

  const setTabAnimated = (next: TabKey) => {
    if (next === tab) return;

    const orderMember: MemberTab[] = ["home", "schedule", "chat", "announcements", "payments", "profile"];
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
    setAnimDir("right");
    setTab("home");
  };

  // Week data
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

  // Announcements (used for counts + announcements page)
  const announcements = useMemo(
    () => [
      {
        title: "Valentine’s Special",
        body: "Stronger Together — Train with your partner this Valentine’s. Feb 10–14 only.",
        date: "Feb 10–14",
        unread: true,
        img: "https://images.unsplash.com/photo-1599058917765-3e8a1d7b7d9f?auto=format&fit=crop&w=1600&q=70",
      },
      {
        title: "New Class Drop",
        body: "Mobility — Better Function starts this Wednesday 7PM.",
        date: "Jan 29",
        unread: true,
        img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=60",
      },
      {
        title: "Bring-a-Friend Promo",
        body: "Bring a friend this week and get 1 free session add-on.",
        date: "Jan 23",
        unread: false,
        img: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1600&q=60",
      },
    ],
    []
  );

  const unreadAnnouncements = announcements.filter((a) => a.unread).length;

  // Counters
  const unreadChat = 3;
  const unpaidBalancePhp = 980;
  const notifCount = unreadAnnouncements;

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

  // Home: Updates Feed (AUTO every 10 seconds, slidable)
  const updatesSlides = useMemo(
    () => [
      {
        tag: "Valentine’s Special 💞",
        title: "STRONGER TOGETHER 💪❤️",
        subtitle: "Train with your partner this Valentine’s",
        cta: "Train as a Duo",
        meta: "124 couples joined",
        img: "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?auto=format&fit=crop&w=1600&q=70",
      },
      {
        tag: "Tutorial",
        title: "How to create Savings Goals",
        subtitle: "Quick steps to track progress",
        cta: "Click to watch",
        meta: "1 min video",
        img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=70",
      },
      {
        tag: "Reminder",
        title: "Hydrate + Stretch",
        subtitle: "Recovery keeps you consistent",
        cta: "View tips",
        meta: "Updated today",
        img: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1600&q=60",
      },
    ],
    []
  );

  const updatesRef = useRef<HTMLDivElement | null>(null);
  const [updIdx, setUpdIdx] = useState(0);

  useEffect(() => {
    const el = updatesRef.current;
    if (!el) return;

    const t = setInterval(() => {
      setUpdIdx((i) => (i + 1) % updatesSlides.length);
    }, 10000);

    return () => clearInterval(t);
  }, [updatesSlides.length]);

  useEffect(() => {
    const el = updatesRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>("[data-bf-slide='updates']");
    if (!card) return;

    const gap = 16;
    const cardW = card.offsetWidth + gap;

    el.scrollTo({ left: updIdx * cardW, behavior: "smooth" });
  }, [updIdx]);

  // Home: Schedule for this week (slidable)
  const scheduleRef = useRef<HTMLDivElement | null>(null);

  const nextSessionAt = useMemo(() => {
    const d = new Date(now);
    d.setHours(18, 0, 0, 0); // 6:00 PM today
    if (d.getTime() < now.getTime()) d.setDate(d.getDate() + 1);
    return d;
  }, [now]);

  const scheduleCards = useMemo(
    () => [
      {
        badge: "Today",
        title: "Weights Sessions",
        sub1: `${branchName} • 6:00 - 7:00pm`,
        sub2: "Coach Joaquin",
        img: "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=1600&q=70",
        action: "View Details",
        target: nextSessionAt,
      },
      {
        badge: "Wed",
        title: "Cardio Sessions",
        sub1: `${branchName} • 7:00 - 8:00pm`,
        sub2: "Coach Aly",
        img: "https://images.unsplash.com/photo-1517838277536-f5f99be50112?auto=format&fit=crop&w=1600&q=70",
        action: "View Details",
        target: new Date(nextSessionAt.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        badge: "Sat",
        title: "Mobility Session",
        sub1: `${branchName} • 9:00 - 10:00am`,
        sub2: "Coach Ken",
        img: "https://images.unsplash.com/photo-1518611012118-f0c5b74c62b5?auto=format&fit=crop&w=1600&q=70",
        action: "View Details",
        target: new Date(nextSessionAt.getTime() + 4 * 24 * 60 * 60 * 1000),
      },
    ],
    [branchName, nextSessionAt]
  );

  // Home: Activity Log
  type ActivityTab = "All" | "Sessions" | "Check-ins" | "Payments" | "Place";
  const [activityTab, setActivityTab] = useState<ActivityTab>("All");

  const activityItems = useMemo(
    () => [
      {
        type: "Sessions",
        title: "Weights Session",
        sub: `${branchName}`,
        when: "Today • 6:00 - 7:00pm",
        delta: "20 → 19",
        icon: "🏋️",
      },
      {
        type: "Sessions",
        title: "Cardio Session",
        sub: `${branchName}`,
        when: "Today • 6:00 - 7:00pm",
        delta: "21 → 20",
        icon: "🚴",
      },
      {
        type: "Payments",
        title: "Bonus Session Added",
        sub: "Package Renewal",
        when: "Tues, Jan 23",
        delta: "48 + 3",
        icon: "🧾",
      },
      {
        type: "Sessions",
        title: "Weights Session",
        sub: `${branchName}`,
        when: "Today • 6:00 - 7:00pm",
        delta: "20 → 19",
        icon: "🏋️",
      },
    ],
    [branchName]
  );

  const filteredActivity = activityTab === "All" ? activityItems : activityItems.filter((x) => x.type === activityTab);

  /* -------------------- Tab Content -------------------- */
  const MemberHome = (
    <div className="space-y-6">
      {/* Top bar: logo + role switch centered + bell & caret */}
      <div className="relative flex items-center justify-between">
        <BearFitLogo />

        <div className="absolute left-1/2 -translate-x-1/2">
          <RoleSwitch role={role} onChange={onSwitchRole} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTabAnimated("announcements")}
            className="relative h-12 w-12 rounded-full bg-white/65 backdrop-blur shadow-sm ring-1 ring-black/5 flex items-center justify-center"
            aria-label="Open announcements"
          >
            <BellIcon />
            <Badge value={notifCount} color="red" />
          </button>

          <button className="h-12 w-12 rounded-full bg-white/65 backdrop-blur shadow-sm ring-1 ring-black/5 flex items-center justify-center">
            <CaretDown />
          </button>
        </div>
      </div>

      {/* Profile Card (matches screenshot layout) */}
      <div className="rounded-[32px] bg-white/75 backdrop-blur shadow-sm ring-1 ring-black/5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-16 w-16 rounded-2xl overflow-hidden ring-1 ring-black/10 bg-black/5">
              <img
                alt="avatar"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=70"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="text-black/40 text-sm">Welcome Back</div>
              <div className="flex items-center gap-2 min-w-0">
                <div className="text-xl font-extrabold truncate">{memberName}</div>
                <span className="text-[#F37120]">🏅</span>
                <span className="text-[#2b6fff]">✔️</span>
              </div>
              <div className="text-black/45 text-sm font-semibold">{memberSubtitle}</div>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-[#0b1220]/10 ring-1 ring-black/10 px-4 py-3 text-right">
            <div className="text-sm font-extrabold text-[#0b1220]">{planTitle}</div>
            <div className="text-xs text-black/50 font-semibold">{planStatus}</div>
            <div className="text-xs text-black/50 mt-1">{branchName}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="text-sm text-black/60 font-semibold">
            You Have:{" "}
            <span className="text-[#F37120] font-extrabold">
              {sessionsRemaining} of {totalSessions}
            </span>{" "}
            sessions remaining
          </div>

          <button
            onClick={() => setTabAnimated("profile")}
            className="text-sm font-extrabold text-[#F37120] flex items-center gap-2"
          >
            View Profile <ChevronRight />
          </button>
        </div>

        <div className="mt-3">
          <div className="h-3 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F37120]"
              style={{ width: `${remainingPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Updates Feed (slidable + auto every 10s) */}
      <div className="space-y-3">
        <div className="text-xl font-extrabold text-[#1f4ea8]">Updates Feed</div>

        <div
          ref={updatesRef}
          className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {updatesSlides.map((s, i) => (
            <div
              key={i}
              data-bf-slide="updates"
              className="min-w-[86%] sm:min-w-[520px] rounded-[28px] overflow-hidden bg-white shadow-sm ring-1 ring-black/5 relative"
            >
              <div className="relative h-[170px]">
                <img src={s.img} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/35" />

                <div className="relative h-full p-5 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-white text-xs font-bold">
                      {s.tag}
                    </div>
                    <div className="mt-3 text-white font-extrabold text-2xl leading-tight">
                      {s.title}
                    </div>
                    <div className="mt-1 text-white/85 text-sm">{s.subtitle}</div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button className="rounded-2xl bg-white/15 backdrop-blur px-4 py-2.5 text-white font-bold">
                      {s.cta}
                    </button>
                    <div className="text-white/85 text-xs font-semibold">{s.meta}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule for this week (slidable) */}
      <div className="space-y-3">
        <div className="text-xl font-extrabold text-[#F37120]">Schedule for this week</div>

        <div
          ref={scheduleRef}
          className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {scheduleCards.map((c, i) => (
            <div
              key={i}
              className="min-w-[88%] sm:min-w-[620px] rounded-[34px] overflow-hidden shadow-sm ring-1 ring-black/5 relative"
            >
              <div className="relative h-[260px] bg-black">
                <img src={c.img} alt={c.title} className="absolute inset-0 h-full w-full object-cover opacity-95" />
                <div className="absolute inset-0 bg-[#0b3b7a]/60" />

                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                  <div>
                    <div className="inline-flex items-center rounded-2xl bg-[#F37120] px-4 py-2 text-sm font-extrabold shadow-sm">
                      {c.badge}
                    </div>
                    <div className="mt-4 text-4xl font-extrabold tracking-tight">{c.title}</div>
                    <div className="mt-2 text-white/85 text-sm">{c.sub1}</div>
                    <div className="text-white/85 text-sm">{c.sub2}</div>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <Countdown target={c.target} now={now} />
                    <button
                      onClick={() => setTabAnimated("schedule")}
                      className="rounded-xl bg-white px-4 py-3 text-[#0b1220] font-extrabold shadow-sm"
                    >
                      {c.action}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="rounded-[28px] bg-white/75 backdrop-blur shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div className="p-5 flex items-center justify-between">
          <div className="text-xl font-extrabold">Activity Log</div>
          <button className="text-sm font-extrabold text-[#F37120]">View All</button>
        </div>

        <div className="px-5 pb-4">
          <div className="rounded-full bg-black/5 p-1 flex items-center gap-1 overflow-x-auto">
            {(["All", "Sessions", "Check-ins", "Payments", "Place"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActivityTab(t)}
                className={[
                  "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition",
                  activityTab === t ? "bg-[#F37120] text-white shadow-sm" : "text-black/45 hover:text-black/70",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5 space-y-3">
          {filteredActivity.map((x, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 rounded-2xl bg-[#eef3fb] ring-1 ring-black/10 grid place-items-center text-xl">
                  {x.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold truncate">{x.title}</div>
                  <div className="text-black/50 text-sm truncate">{x.sub}</div>
                  <div className="text-black/40 text-xs">{x.when}</div>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[#F37120] font-extrabold text-lg">{x.delta}</div>
                <div className="text-black/35 text-xs font-semibold">
                  {x.type === "Sessions" ? "1 Session Used" : x.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  const MemberSchedule = (
    <div className="space-y-6">
      <HeaderRow title="Schedule" role={role} onRoleChange={onSwitchRole} />

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
          {[
            { when: "Today • 6:00 PM", what: "Coach Session — Better Form", where: "Sikatuna" },
            { when: "Wed • 7:00 PM", what: "Strength — Better Fitness", where: "E. Rodriguez" },
            { when: "Sat • 9:00 AM", what: "Mobility — Better Function", where: "Cainta" },
          ].map((x, idx) => (
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
            <input
              className="flex-1 rounded-2xl bg-[#eef3fb] px-4 py-3 outline-none ring-1 ring-black/5"
              placeholder="Type here…"
            />
            <button className="rounded-2xl bg-[#0b1220] text-white px-5 font-semibold">Send</button>
          </div>
        </div>
      </Card>
    </div>
  );

  const MemberAnnouncements = (
    <div className="space-y-6">
      <HeaderRow title="Announcements" role={role} onRoleChange={onSwitchRole} />

      <Card
        title="Latest Updates"
        subtitle="Gym news, promos, reminders"
        right={
          unreadAnnouncements > 0 ? (
            <span className="rounded-full bg-red-500 text-white px-3 py-1 text-sm font-bold">{unreadAnnouncements} unread</span>
          ) : (
            <span className="rounded-full bg-black/5 text-black/60 px-3 py-1 text-sm font-bold">All caught up</span>
          )
        }
      >
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <div key={i} className="rounded-2xl bg-white ring-1 ring-black/10 overflow-hidden">
              <div className="relative h-40">
                <img src={a.img} alt={a.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative p-4 text-white">
                  <div className="text-white/85 text-sm">{a.date}</div>
                  <div className="mt-1 text-xl font-extrabold">
                    {a.title} {a.unread ? <span className="ml-2 text-[#F37120]">•</span> : null}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="text-black/55">{a.body}</div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-xl bg-black/5 px-3 py-2 font-semibold text-black/60 hover:bg-black/10">Mark as read</button>
                  <button className="rounded-xl bg-[#F37120] px-3 py-2 font-semibold text-white">Acknowledge</button>
                </div>
              </div>
            </div>
          ))}
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
          <RowItem label="Name" value={memberName} />
          <RowItem label="Role" value="Member" />
          <RowItem label="Home branch" value={branchName} />
        </div>
      </Card>
      <Card title="Settings" subtitle="App preferences">
        <div className="space-y-3">
          <RowItem label="Notifications" value="On" />
          <RowItem label="Preferred Branch" value={branchName} />
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
      if (tab === "announcements") return MemberAnnouncements;
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

/* -------------------- Shared Components -------------------- */
function Countdown({ target, now }: { target: Date; now: Date }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const liveNow = useMemo(() => new Date(now.getTime() + tick * 1000), [now, tick]);

  const total = Math.max(0, Math.floor((target.getTime() - liveNow.getTime()) / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const two = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-start">
      <div className="text-3xl font-extrabold tracking-tight">
        {two(h)} : {two(m)} : {two(s)}
      </div>
      <div className="mt-1 text-white/85 text-[11px] font-semibold">
        <div className="grid grid-cols-3 gap-3">
          <span className="text-left">Hours</span>
          <span className="text-left">Minutes</span>
          <span className="text-left">Seconds</span>
        </div>
      </div>
    </div>
  );
}

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

