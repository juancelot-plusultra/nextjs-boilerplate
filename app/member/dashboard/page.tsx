// PART 1/8
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

type Role = "member" | "staff" | "admin";
type MainTab = "home" | "chat" | "schedule" | "payment" | "profile";
type FeedTab = "activity" | "points" | "payments" | "placeholder";

function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function formatTime(n: number) {
  const s = Math.max(0, Math.floor(n));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return { hh, mm, ss };
}

/* ----------------- Simple Icons ----------------- */
const IconWrap = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex h-6 w-6 items-center justify-center">{children}</span>
);

function HomeIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3 2.6 11.2l1.3 1.5L5 11.7V21h6v-6h2v6h6v-9.3l1.1 1 1.3-1.5L12 3Z"
        />
      </svg>
    </IconWrap>
  );
}
function ChatIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 5h12v2H6V9Zm0 4h9v2H6v-2Z"
        />
      </svg>
    </IconWrap>
  );
}
function CalendarIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm15 8H4v10h18V10ZM4 8h18V6H4v2Z"
        />
      </svg>
    </IconWrap>
  );
}
function CardIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm18 3H3v3h18V9Zm-12 9H5v-2h4v2Z"
        />
      </svg>
    </IconWrap>
  );
}
function UserIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5.5V21h18v-1.5C21 16.5 17 14 12 14Z"
        />
      </svg>
    </IconWrap>
  );
}
function BellIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 22a2.4 2.4 0 0 0 2.3-2H9.7A2.4 2.4 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5L3 18v1h18v-1l-2-2Z"
        />
      </svg>
    </IconWrap>
  );
}
function MessageIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M2 3h20v14H6l-4 4V3Zm5 6h10v2H7V9Zm0 4h7v2H7v-2Z"
        />
      </svg>
    </IconWrap>
  );
}
// PART 2/8
/* ----------------- Reusable UI ----------------- */
function RoleSwitch({
  role,
  onChange,
}: {
  role: Role;
  onChange: (r: Role) => void;
}) {
  const items: Array<{ k: Role; label: string }> = [
    { k: "member", label: "Member" },
    { k: "staff", label: "Staff" },
    { k: "admin", label: "Admin" },
  ];

  return (
    <div className="rounded-full bg-white/10 p-1 ring-1 ring-white/10 backdrop-blur">
      <div className="flex items-center gap-1">
        {items.map((it) => {
          const active = role === it.k;
          return (
            <button
              key={it.k}
              onClick={() => onChange(it.k)}
              className={cx(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                active
                  ? "bg-white text-black shadow"
                  : "text-white/70 hover:text-white"
              )}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[22px] bg-white/[0.06] ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  right,
  className,
}: {
  title: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex items-center justify-between", className)}>
      <div className="text-sm font-semibold text-white/90">{title}</div>
      {right}
    </div>
  );
}

function Pill({
  children,
  tone = "orange",
}: {
  children: React.ReactNode;
  tone?: "orange" | "green" | "gray";
}) {
  const cls =
    tone === "orange"
      ? "bg-[#F37A12]/15 text-[#F7A247] ring-[#F37A12]/25"
      : tone === "green"
      ? "bg-emerald-400/10 text-emerald-300 ring-emerald-300/20"
      : "bg-white/10 text-white/70 ring-white/10";

  return (
    <span className={cx("rounded-full px-2.5 py-1 text-[11px] ring-1", cls)}>
      {children}
    </span>
  );
}

function TabButton({
  active,
  label,
  icon,
  badge,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "relative flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition",
        active
          ? "bg-white/10 text-white ring-1 ring-white/15"
          : "text-white/65 hover:bg-white/5 hover:text-white"
      )}
    >
      <span
        className={cx(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1",
          active ? "bg-white/10 ring-white/15" : "bg-white/5 ring-white/10"
        )}
      >
        {icon}
      </span>
      <span className="font-semibold">{label}</span>

      {typeof badge === "number" && badge > 0 && (
        <span className="absolute right-2 top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F37A12] px-1.5 text-[11px] font-bold text-white shadow">
          {badge}
        </span>
      )}
    </button>
  );
}
// PART 3/8
/* ----------------- Mock Data ----------------- */
type ActivityRow = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  delta: string;
  icon: "weights" | "cardio" | "renew" | "bonus";
};

type PaymentRow = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  note: string;
  icon: "gcash" | "bpi" | "cash";
};

type UpcomingCard = {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  coach: string;
  secondsLeft: number;
};

type MeritCard = {
  id: string;
  title: string;
  value: string;
  sub: string;
  accent: "gold" | "orange" | "red";
  ribbon?: string;
};

function SmallGlyph({ kind }: { kind: ActivityRow["icon"] | PaymentRow["icon"] }) {
  const common = "h-10 w-10 rounded-2xl ring-1 ring-white/10 bg-white/5 grid place-items-center";
  if (kind === "weights") {
    return (
      <div className={common}>
        <span className="text-lg">🏋️</span>
      </div>
    );
  }
  if (kind === "cardio") {
    return (
      <div className={common}>
        <span className="text-lg">🏃</span>
      </div>
    );
  }
  if (kind === "renew") {
    return (
      <div className={common}>
        <span className="text-lg">🎁</span>
      </div>
    );
  }
  if (kind === "bonus") {
    return (
      <div className={common}>
        <span className="text-lg">⚡</span>
      </div>
    );
  }
  if (kind === "gcash") {
    return (
      <div className={common}>
        <span className="text-lg">💳</span>
      </div>
    );
  }
  if (kind === "bpi") {
    return (
      <div className={common}>
        <span className="text-lg">🏦</span>
      </div>
    );
  }
  return (
    <div className={common}>
      <span className="text-lg">💵</span>
    </div>
  );
}

function useCountdown(initialSeconds: number) {
  const [sec, setSec] = useState(initialSeconds);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    function tick(t: number) {
      if (last.current == null) last.current = t;
      const dt = (t - last.current) / 1000;
      if (dt >= 1) {
        const drop = Math.floor(dt);
        last.current = t;
        setSec((s) => Math.max(0, s - drop));
      }
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      last.current = null;
    };
  }, []);

  return sec;
}

function DesktopShell({
  role,
  setRole,
  tab,
  setTab,
  children,
  chatBadge = 2,
}: {
  role: Role;
  setRole: (r: Role) => void;
  tab: MainTab;
  setTab: (t: MainTab) => void;
  children: React.ReactNode;
  chatBadge?: number;
}) {
  const nav = useMemo(
    () => [
      { k: "home" as const, label: "Home", icon: <HomeIcon /> },
      { k: "chat" as const, label: "Chat", icon: <ChatIcon />, badge: chatBadge },
      { k: "schedule" as const, label: "Schedule", icon: <CalendarIcon /> },
      { k: "payment" as const, label: "Payment", icon: <CardIcon /> },
      { k: "profile" as const, label: "Profile", icon: <UserIcon /> },
    ],
    [chatBadge]
  );

  return (
    <div className={cx(poppins.variable, "min-h-screen font-sans")}>
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[#070A0F]" />
      <div className="fixed inset-0 -z-10 opacity-80 bg-[radial-gradient(circle_at_15%_12%,rgba(247,122,18,0.20),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(112,196,255,0.14),transparent_45%),radial-gradient(circle_at_60%_80%,rgba(190,120,255,0.14),transparent_45%)]" />

      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <span className="text-lg">🐻</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide text-white">BEARFIT</div>
              <div className="text-[11px] text-white/60">Member Fitness</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RoleSwitch role={role} onChange={setRole} />
            <button className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10">
              <BellIcon />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10">
              <MessageIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 md:grid-cols-[280px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block">
          <GlassCard className="p-3">
            <div className="mb-2 px-2 pt-1">
              <div className="text-xs text-white/60">Navigation</div>
            </div>
            <div className="space-y-2">
              {nav.map((n) => (
                <TabButton
                  key={n.k}
                  active={tab === n.k}
                  label={n.label}
                  icon={n.icon}
                  badge={(n as any).badge}
                  onClick={() => setTab(n.k)}
                />
              ))}
            </div>
          </GlassCard>

          <div className="mt-4 hidden md:block">
            <GlassCard className="p-4">
              <div className="text-xs text-white/60">Tip</div>
              <div className="mt-2 text-sm text-white/85">
                Desktop-first layout with mobile optimization built-in.
              </div>
              <div className="mt-3 text-xs text-white/55">
                On mobile, navigation switches to a bottom bar automatically.
              </div>
            </GlassCard>
          </div>
        </aside>

        {/* Main content */}
        <main className="pb-24 md:pb-6">{children}</main>
      </div>

      {/* Bottom nav (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/40 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-2 py-2">
          {nav.map((n) => {
            const active = tab === n.k;
            return (
              <button
                key={n.k}
                onClick={() => setTab(n.k)}
                className={cx(
                  "relative flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold",
                  active ? "text-[#F37A12]" : "text-black/65"
                )}
              >
                <span className={cx("grid h-9 w-9 place-items-center rounded-2xl", active ? "bg-black/5" : "")}>
                  <span className={active ? "text-[#F37A12]" : "text-black"}>{n.icon}</span>
                </span>
                <span>{n.label}</span>

                {typeof (n as any).badge === "number" && (n as any).badge > 0 && (
                  <span className="absolute right-3 top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F37A12] px-1.5 text-[11px] font-bold text-white">
                    {(n as any).badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// PART 4/8
/* ----------------- Member Screen (desktop-first + mobile optimized) ----------------- */
function MemberHomeScreen() {
  const [feedTab, setFeedTab] = useState<FeedTab>("activity");

  const upcoming: UpcomingCard[] = useMemo(
    () => [
      {
        id: "u1",
        tag: "Upcoming",
        title: "Weights Sessions",
        subtitle: "Malingap Branch • 6:00 - 7:00pm",
        coach: "Coach Joaquin",
        secondsLeft: 9 * 3600 + 25 * 60 + 26,
      },
      {
        id: "u2",
        tag: "Upcoming",
        title: "Cardio Session",
        subtitle: "Malingap Branch • 7:00 - 8:00pm",
        coach: "Coach Joaquin",
        secondsLeft: 10 * 3600 + 2 * 60 + 4,
      },
      {
        id: "u3",
        tag: "Upcoming",
        title: "Muay Thai / Boxing",
        subtitle: "Malingap Branch • 8:00 - 9:00pm",
        coach: "Coach Amiel",
        secondsLeft: 12 * 3600 + 15 * 60 + 1,
      },
    ],
    []
  );

  const activity: ActivityRow[] = useMemo(
    () => [
      {
        id: "a1",
        title: "Weights Session",
        subtitle: "Malingap",
        time: "6:00 - 7:00pm",
        delta: "20 → 19",
        icon: "weights",
      },
      {
        id: "a2",
        title: "Cardio Session",
        subtitle: "E.Rod",
        time: "1:00 - 3:00pm",
        delta: "48 → 47",
        icon: "cardio",
      },
      {
        id: "a3",
        title: "Package Renewal",
        subtitle: "Via GCash",
        time: "₱48,600",
        delta: "0 + 48",
        icon: "renew",
      },
      {
        id: "a4",
        title: "Cardio Session",
        subtitle: "E.Rod",
        time: "1:00 - 3:00pm",
        delta: "48 → 47",
        icon: "bonus",
      },
    ],
    []
  );

  const payments: PaymentRow[] = useMemo(
    () => [
      {
        id: "p1",
        title: "Via GCash",
        subtitle: "1st–6th • NEW",
        amount: "₱8000",
        note: "Last: ₱5800",
        icon: "gcash",
      },
      {
        id: "p2",
        title: "Via BPI",
        subtitle: "Full Paid",
        amount: "₱48000",
        note: "Last: ₱48000",
        icon: "bpi",
      },
    ],
    []
  );

  const merit: MeritCard[] = useMemo(
    () => [
      { id: "m1", title: "Workout Streak", value: "17", sub: "Days", accent: "gold", ribbon: "Personal Best" },
      { id: "m2", title: "Bearforce Points", value: "1540", sub: "MP • +120 this month", accent: "orange" },
      { id: "m3", title: "Bear Prestige", value: "Season", sub: "2 • Member since 2023", accent: "red" },
    ],
    []
  );

  const sessionTotal = 48;
  const sessionRemaining = 40;
  const pct = clamp((sessionRemaining / sessionTotal) * 100, 0, 100);

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <GlassCard className="overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <span className="text-white/80">👤</span>
              </div>
              <div>
                <div className="text-xs text-white/60">Welcome,</div>
                <div className="text-base font-bold text-white">Alex</div>
              </div>
            </div>

            <button className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-white/75 ring-1 ring-white/10 hover:bg-white/10">
              <MessageIcon />
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[240px_1fr]">
            {/* Left block (photo + meta) */}
            <div className="flex gap-4">
              <div className="relative">
                <div className="grid h-24 w-24 place-items-center rounded-[28px] bg-white/5 ring-1 ring-[#F37A12]/30 shadow-[0_0_0_6px_rgba(243,122,18,0.08)]">
                  <div className="h-20 w-20 rounded-[22px] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.14),transparent_55%),linear-gradient(135deg,rgba(243,122,18,0.25),rgba(255,255,255,0.06))]" />
                </div>
                <div className="absolute -right-2 top-8 h-10 w-10 rounded-full bg-[#F37A12] opacity-20 blur-[10px]" />
              </div>

              <div className="pt-1">
                <div className="text-lg font-extrabold tracking-wide text-white">M00-1</div>
                <div className="text-sm text-white/70">Malingap Branch</div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-white/55">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    🏅
                  </span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    ✅
                  </span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    🧊
                  </span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    🔥
                  </span>
                </div>
              </div>
            </div>

            {/* Right block (package + bar + merits) */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-white/90">
                  Full 48 Package+ <span className="text-white/50">•</span>{" "}
                  <span className="text-emerald-300">Active Member</span>
                </div>
                <button className="text-sm font-semibold text-[#F7A247] hover:text-[#ffb56e]">
                  View Profile →
                </button>
              </div>

              <div className="relative h-3 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#F37A12] via-[#ff8a2a] to-[#ffb86c]"
                  style={{ width: `${pct}%` }}
                />
                <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.25),transparent_35%)]" />
              </div>

              <div className="text-sm text-white/70">
                <span className="font-semibold text-white">40</span> of{" "}
                <span className="font-semibold text-white">48</span> sessions
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {merit.map((m) => (
                  <MeritTile key={m.id} data={m} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Upcoming horizontal rail */}
      <div className="space-y-2">
        <SectionHeader
          title="Schedule for this week"
          right={<Pill tone="gray">Swipe</Pill>}
        />
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
          {upcoming.map((u) => (
            <UpcomingTile key={u.id} data={u} />
          ))}
        </div>
      </div>

      {/* Feed panel */}
      <GlassCard className="overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFeedTab("activity")}
              className={cx(
                "text-sm font-semibold",
                feedTab === "activity" ? "text-[#F7A247]" : "text-white/60 hover:text-white/80"
              )}
            >
              Activity Log
            </button>
            <button
              onClick={() => setFeedTab("points")}
              className={cx(
                "text-sm font-semibold",
                feedTab === "points" ? "text-[#F7A247]" : "text-white/60 hover:text-white/80"
              )}
            >
              Points
            </button>
            <button
              onClick={() => setFeedTab("payments")}
              className={cx(
                "text-sm font-semibold",
                feedTab === "payments" ? "text-[#F7A247]" : "text-white/60 hover:text-white/80"
              )}
            >
              Payments
            </button>
            <button
              onClick={() => setFeedTab("placeholder")}
              className={cx(
                "text-sm font-semibold",
                feedTab === "placeholder" ? "text-[#F7A247]" : "text-white/60 hover:text-white/80"
              )}
            >
              Placeholder
            </button>
          </div>
        </div>

        <div className="p-5">
          {feedTab === "activity" && (
            <div className="space-y-3">
              {/* Header row */}
              <div className="grid grid-cols-[1.3fr_1fr_1fr_0.9fr] gap-2 px-2 text-[11px] font-semibold text-[#F7A247]/80">
                <div>Transactions</div>
                <div>Details</div>
                <div>Time/Date</div>
                <div className="text-right">Balance</div>
              </div>

              {/* Rows */}
              <div className="space-y-3">
                {activity.map((r) => (
                  <ActivityRowItem key={r.id} row={r} />
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-white/55">
                <span>Total transactions</span>
                <span className="font-semibold text-white/75">506</span>
              </div>
            </div>
          )}

          {feedTab === "points" && (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-white/85">Bearforce / Prestige</div>
              <div className="text-sm text-white/65">
                Tie your points to check-ins, completed sessions, and consistency streaks.
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {merit.map((m) => (
                  <MeritTile key={m.id} data={m} />
                ))}
              </div>
            </div>
          )}

          {feedTab === "payments" && (
            <div className="space-y-3">
              <div className="grid gap-3">
                {payments.map((p) => (
                  <PaymentRowItem key={p.id} row={p} />
                ))}
              </div>
            </div>
          )}

          {feedTab === "placeholder" && (
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-white/85">Placeholder</div>
              <div className="mt-1 text-sm text-white/60">
                Add announcements, referrals, leaderboards, or challenges here.
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Bottom banner */}
      <GlassCard className="overflow-hidden">
        <div className="relative p-5">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F37A12] via-[#ff8a2a] to-[#ffb86c] opacity-95" />
          <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.35),transparent_55%)]" />
          <div className="relative">
            <div className="text-base font-bold text-white">Track Your Daily Activities</div>
            <div className="mt-2 max-w-xl text-sm text-white/90">
              Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore aliqua.
            </div>
          </div>
        </div>
      </GlassCard>

      <style jsx global>{`
        :root {
          --font-poppins: ${poppins.style.fontFamily};
        }
        html,
        body {
          font-family: var(--font-poppins), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
// PART 5/8
function MeritTile({ data }: { data: MeritCard }) {
  const ring =
    data.accent === "gold"
      ? "ring-[#ffcf6d]/40"
      : data.accent === "orange"
      ? "ring-[#F37A12]/35"
      : "ring-rose-400/30";

  const edge =
    data.accent === "gold"
      ? "from-[#ffcf6d] via-[#ff9f3c] to-[#ffcf6d]"
      : data.accent === "orange"
      ? "from-[#F37A12] via-[#ff9a3a] to-[#F37A12]"
      : "from-[#ff3b3b] via-[#ff8b5a] to-[#ff3b3b]";

  return (
    <div className={cx("relative overflow-hidden rounded-[22px] bg-black/20 p-[1px] ring-1", ring)}>
      <div className={cx("absolute inset-0 bg-gradient-to-b opacity-30", edge)} />
      <div className="relative rounded-[21px] bg-[#0B0F17]/70 p-4">
        <div className="text-[12px] font-semibold text-white/70">{data.title}</div>
        <div className="mt-3 text-center">
          <div className="text-3xl font-extrabold tracking-tight text-white">{data.value}</div>
          <div className="text-sm font-bold text-white/90">{data.sub}</div>
        </div>

        {data.ribbon && (
          <div className="mt-3">
            <span className="inline-flex items-center rounded-[12px] bg-[#F37A12] px-3 py-1 text-[11px] font-bold text-white shadow">
              {data.ribbon}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function UpcomingTile({ data }: { data: UpcomingCard }) {
  const sec = useCountdown(data.secondsLeft);
  const t = formatTime(sec);

  return (
    <div className="min-w-[280px] max-w-[320px] flex-1">
      <GlassCard className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a2bff]/20 via-[#F37A12]/20 to-[#00d2ff]/15" />
        <div className="relative p-5">
          <div className="flex items-center justify-between">
            <Pill tone="orange">{data.tag}</Pill>
            <button className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/85 ring-1 ring-white/15 hover:bg-white/15">
              View Details
            </button>
          </div>

          <div className="mt-4 text-2xl font-extrabold tracking-tight text-white">{data.title}</div>
          <div className="mt-1 text-sm text-white/70">{data.subtitle}</div>
          <div className="mt-1 text-sm text-white/65">{data.coach}</div>

          <div className="mt-6">
            <div className="text-[44px] font-extrabold tracking-[0.08em] text-white">
              {t.hh} : {t.mm} : {t.ss}
            </div>
            <div className="mt-1 flex gap-6 text-[11px] font-semibold text-white/60">
              <span>Hours</span>
              <span>Minutes</span>
              <span>Seconds</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function ActivityRowItem({ row }: { row: ActivityRow }) {
  return (
    <div className="rounded-[18px] bg-white/5 p-4 ring-1 ring-white/10">
      <div className="grid grid-cols-[1.3fr_1fr_1fr_0.9fr] items-center gap-2">
        <div className="flex items-center gap-3">
          <SmallGlyph kind={row.icon} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white/90">{row.title}</div>
            <div className="truncate text-xs text-[#F7A247]/80">1 Session Used</div>
          </div>
        </div>

        <div className="text-sm text-white/70">{row.subtitle}</div>
        <div className="text-sm text-white/70">{row.time}</div>

        <div className="text-right text-lg font-extrabold tracking-tight text-[#F7A247]">
          {row.delta}
        </div>
      </div>
    </div>
  );
}

function PaymentRowItem({ row }: { row: PaymentRow }) {
  return (
    <div className="rounded-[18px] bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SmallGlyph kind={row.icon} />
          <div>
            <div className="text-sm font-semibold text-white/90">{row.title}</div>
            <div className="text-xs text-white/60">{row.subtitle}</div>
            <div className="mt-1 text-xs text-white/50">{row.note}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-extrabold tracking-tight text-white">{row.amount}</div>
          <div className="text-xs font-semibold text-white/55">Due: January 25</div>
        </div>
      </div>
    </div>
  );
}
// PART 6/8
/* ----------------- Staff + Admin placeholders (kept simple, retain structure) ----------------- */
function StaffScreen() {
  return (
    <div className="space-y-4">
      <GlassCard className="p-5">
        <div className="text-lg font-extrabold text-white">Staff</div>
        <div className="mt-2 text-sm text-white/65">
          Keep your existing staff modules here (check-ins, schedules, client list).
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionHeader title="Quick Actions" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white/85">Scan QR</div>
            <div className="mt-1 text-sm text-white/60">Fast check-in</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white/85">Create Session</div>
            <div className="mt-1 text-sm text-white/60">Add schedule slot</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function AdminScreen() {
  return (
    <div className="space-y-4">
      <GlassCard className="p-5">
        <div className="text-lg font-extrabold text-white">Admin</div>
        <div className="mt-2 text-sm text-white/65">
          Keep your admin tools here (packages, payments, staff management).
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionHeader title="Overview" right={<Pill tone="green">All systems OK</Pill>} />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs text-white/60">Active Members</div>
            <div className="mt-2 text-2xl font-extrabold text-white">128</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs text-white/60">Payments Today</div>
            <div className="mt-2 text-2xl font-extrabold text-white">₱26k</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs text-white/60">Upcoming Sessions</div>
            <div className="mt-2 text-2xl font-extrabold text-white">14</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
// PART 7/8
/* ----------------- Page Root + Tab Content ----------------- */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <GlassCard className="p-6">
        <div className="text-lg font-extrabold text-white">{title}</div>
        <div className="mt-2 text-sm text-white/65">
          This is a placeholder screen. Keep your existing logic/components and swap this later.
        </div>
      </GlassCard>
    </div>
  );
}

function ContentRouter({ role, tab }: { role: Role; tab: MainTab }) {
  // You can wire each tab to your real pages/components.
  if (role === "member") {
    if (tab === "home") return <MemberHomeScreen />;
    if (tab === "chat") return <PlaceholderPage title="Chat" />;
    if (tab === "schedule") return <PlaceholderPage title="Schedule" />;
    if (tab === "payment") return <PlaceholderPage title="Payment" />;
    return <PlaceholderPage title="Profile" />;
  }

  if (role === "staff") {
    if (tab === "home") return <StaffScreen />;
    if (tab === "chat") return <PlaceholderPage title="Chat" />;
    if (tab === "schedule") return <PlaceholderPage title="Schedule" />;
    if (tab === "payment") return <PlaceholderPage title="Payment" />;
    return <PlaceholderPage title="Profile" />;
  }

  // admin
  if (tab === "home") return <AdminScreen />;
  if (tab === "chat") return <PlaceholderPage title="Chat" />;
  if (tab === "schedule") return <PlaceholderPage title="Schedule" />;
  if (tab === "payment") return <PlaceholderPage title="Payment" />;
  return <PlaceholderPage title="Profile" />;
}

export default function Page() {
  const [role, setRole] = useState<Role>("member");
  const [tab, setTab] = useState<MainTab>("home");

  // Example: show chat badge on member only
  const chatBadge = role === "member" ? 2 : 0;

  return (
    <DesktopShell role={role} setRole={setRole} tab={tab} setTab={setTab} chatBadge={chatBadge}>
      <ContentRouter role={role} tab={tab} />
    </DesktopShell>
  );
}
// PART 8/8
/* ----------------- Notes (kept in-code only) -----------------
Desktop-first:
- md+ shows sidebar navigation and roomy spacing
Mobile optimization:
- Bottom nav appears automatically on md- screens
- Content uses responsive grids (md columns) + horizontal swipe rails
Font system:
- Poppins via next/font and applied globally

If you want it EVEN closer to your 2nd image next:
- tighten the profile card width and center it (max-w + mx-auto)
- increase the “side peek” of Upcoming cards by adjusting min widths
- nudge typography sizes (title 24/28) and spacing (paddings) slightly
--------------------------------------------------------------- */
