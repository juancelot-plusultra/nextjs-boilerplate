"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Mobile-first Fitness App (single-file page.tsx)
 * - Standardized typography + spacing (app-like)
 * - Safe-area padding + phone-width canvas
 * - Session cards: horizontal scroll + snap
 * - Hero + Promo: same visual height & padding
 * - Goal Progress removed (Activity Log + Payments instead)
 */

type Role = "member" | "staff" | "admin";
type MemberTab = "home" | "schedule" | "chat" | "announcements" | "payments" | "profile";
type StaffTab = "home" | "attendance" | "clients" | "sessions" | "sales";
type AdminTab = "home" | "overview" | "clients" | "sales" | "settings";
type TabKey = MemberTab | StaffTab | AdminTab;

function dayLabel(i: number) {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
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
function HomeIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 3 2.5 11.2l1.3 1.5L5 11.7V21h6v-6h2v6h6v-9.3l1.2 1 1.3-1.5L12 3Z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v15a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2h3V2Zm14 8H3v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V10ZM20 6H4v2h16V6Z"
      />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 5h12v2H6V9Zm0 4h9v2H6v-2Z"
      />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 7a3 3 0 0 1 3-3h12a2 2 0 0 1 2 2v2h-9a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h9v2a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V7Zm18 4h-9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9v-4Zm-3 1.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.4 0-8 2.1-8 4.7V21h16v-2.3c0-2.6-3.6-4.7-8-4.7Z"
      />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg className={iconBase("h-5 w-5")} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 2a8 8 0 1 1 5.3 14l4.2 4.2-1.4 1.4-4.2-4.2A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"
      />
    </svg>
  );
}
function DumbbellIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 5h2v14H7V5Zm8 0h2v14h-2V5ZM3 9h2v6H3V9Zm18 0h-2v6h2V9ZM9 11h6v2H9v-2Z"
      />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 2a8 8 0 1 1-8 8 8 8 0 0 1 8-8Zm0 3a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 2a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z"
      />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4 9 6Z" />
    </svg>
  );
}

/* -------------------- Small UI primitives -------------------- */
function Badge({ value, color = "red" }: { value: number; color?: "red" | "orange" | "blue" }) {
  if (!value) return null;
  const bg = color === "red" ? "bg-red-500" : color === "orange" ? "bg-[#F37120]" : "bg-blue-500";
  return (
    <span className={`absolute -top-1 -right-1 ${bg} text-white text-[10px] font-extrabold rounded-full px-2 py-0.5 shadow`}>
      {value}
    </span>
  );
}

function Card({
  title,
  right,
  children,
  className = "",
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["rounded-3xl bg-white/90 backdrop-blur shadow-sm ring-1 ring-black/5", className].join(" ")}>
      {(title || right) && (
        <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-3">
          {title && <div className="text-[18px] font-extrabold tracking-[-0.02em] text-black/75">{title}</div>}
          {right}
        </div>
      )}
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

function SectionHeader({ title, onViewAll }: { title: string; onViewAll?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-[18px] font-extrabold tracking-[-0.02em] text-black/70">{title}</div>
      {onViewAll && (
        <button onClick={onViewAll} className="text-[#F37120] font-semibold text-sm inline-flex items-center gap-1">
          View All <ChevronRightIcon />
        </button>
      )}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full bg-orange-100 text-[#F37120] font-extrabold text-sm px-3 py-1">
      {children}
    </div>
  );
}

function ListRow({
  leftIcon,
  title,
  subtitle,
  right,
  onClick,
}: {
  leftIcon: React.ReactNode;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-4 rounded-2xl bg-white ring-1 ring-black/5 px-4 py-3 active:scale-[0.99] transition"
    >
      <div className="h-11 w-11 rounded-full bg-orange-100 flex items-center justify-center shrink-0">{leftIcon}</div>

      <div className="min-w-0 flex-1">
        <div className="font-extrabold text-[15px] text-black/75 truncate">{title}</div>
        <div className="text-[13px] text-black/45 truncate">{subtitle}</div>
      </div>

      {right && <div className="shrink-0">{right}</div>}
    </button>
  );
}

/* -------------------- App Top Bar -------------------- */
function AppTopBar({ avatarUrl, onSearch }: { avatarUrl: string; onSearch?: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 pt-[max(16px,env(safe-area-inset-top))]">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-2xl bg-orange-100 flex items-center justify-center">
          <span className="text-[#F37120] text-xl">🏋️</span>
        </div>
        <div className="text-[22px] font-extrabold tracking-[-0.02em] text-[#F37120]">Fitness</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSearch}
          className="h-11 w-11 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center text-black/55 active:scale-[0.98] transition"
          aria-label="Search"
        >
          <SearchIcon />
        </button>

        <img
          src={avatarUrl}
          alt="Profile"
          className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
      </div>
    </div>
  );
}

/* -------------------- Hero + Promo (same height) -------------------- */
function BannerShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["relative rounded-3xl overflow-hidden ring-1 ring-black/5 shadow-sm min-h-[152px]", className].join(" ")}>
      {children}
    </div>
  );
}

function HeroBanner() {
  return (
    <BannerShell className="bg-gradient-to-r from-orange-600 to-orange-400 text-white">
      <img
        src="https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?auto=format&fit=crop&w=1200&q=60"
        alt="Daily activities"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/95 via-orange-500/85 to-orange-400/35" />

      <div className="relative p-5">
        <div className="text-[22px] font-extrabold tracking-[-0.02em] leading-tight">Track Your Daily Activities</div>
        <div className="mt-2 text-[13px] text-white/85 max-w-[270px] leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore aliqua.
        </div>
      </div>
    </BannerShell>
  );
}

function PromoBanner() {
  return (
    <BannerShell className="bg-gradient-to-r from-purple-600 to-purple-400 text-white">
      <div className="absolute inset-0 opacity-25">
        <div className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-white/20" />
      </div>

      <div className="relative p-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[20px] font-extrabold tracking-[-0.02em] leading-tight">
            50% off on Premium Membership
          </div>
          <div className="mt-2 text-[13px] text-white/85 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
          </div>
          <button className="mt-4 rounded-2xl bg-[#F37120] px-6 py-3 text-[14px] font-extrabold shadow-sm active:scale-[0.99] transition">
            Upgrade
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=700&q=60"
          alt="Promo"
          className="h-24 w-24 rounded-2xl object-cover ring-2 ring-white/30 shrink-0"
        />
      </div>
    </BannerShell>
  );
}

/* -------------------- Session Tiles (scroll + snap) -------------------- */
function WaveBg() {
  return (
    <svg className="absolute inset-0 h-full w-full text-black/10" viewBox="0 0 400 220" preserveAspectRatio="none">
      <path
        fill="currentColor"
        d="M0 130 C 60 110, 90 160, 150 140 C 210 120, 250 80, 310 105 C 350 120, 370 160, 400 150 L 400 220 L 0 220 Z"
      />
      <path
        fill="currentColor"
        opacity="0.55"
        d="M0 155 C 60 130, 110 190, 170 165 C 230 140, 260 120, 320 140 C 360 152, 380 190, 400 175 L 400 220 L 0 220 Z"
      />
    </svg>
  );
}

function SessionTile({
  tone,
  title,
  branch,
  time,
  coach,
  timer,
  icon,
}: {
  tone: "teal" | "orange" | "purple";
  title: string;
  branch: string;
  time: string;
  coach?: string;
  timer: string;
  icon: React.ReactNode;
}) {
  const bg =
    tone === "teal"
      ? "from-cyan-600 to-cyan-500"
      : tone === "orange"
      ? "from-orange-600 to-orange-500"
      : "from-purple-600 to-purple-500";

  return (
    <div
      className={[
        "relative w-[280px] sm:w-[300px] snap-start rounded-2xl overflow-hidden bg-gradient-to-br",
        bg,
        "text-white p-4 ring-1 ring-black/10 shadow-sm",
      ].join(" ")}
    >
      <WaveBg />

      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">{icon}</div>
          <div className="min-w-0">
            <div className="font-extrabold text-[15px] leading-tight">{title}</div>
            <div className="text-white/80 text-[12px] mt-1">{branch}</div>
            <div className="text-white/80 text-[12px]">{time}</div>
            {coach && <div className="text-white/70 text-[12px]">{coach}</div>}
          </div>
        </div>

        <div className="mt-6">
          <div className="font-extrabold tracking-wider text-[16px]">{timer}</div>
          <div className="text-[10px] text-white/70 mt-0.5">Hours&nbsp;&nbsp;&nbsp;Minutes&nbsp;&nbsp;&nbsp;Seconds</div>
        </div>

        <div className="mt-2 flex justify-end">
          <button className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold active:scale-[0.99] transition">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Bottom Nav -------------------- */
function BottomNav({
  items,
  active,
  onChange,
}: {
  items: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[];
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="mx-auto max-w-[430px]">
        <div
          className={[
            "bg-white/90 backdrop-blur ring-1 ring-black/5",
            "shadow-[0_-10px_30px_rgba(0,0,0,0.08)]",
            "rounded-t-3xl px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))]",
          ].join(" ")}
        >
          <div className="grid grid-cols-5 gap-1">
            {items.map((it) => {
              const isActive = it.key === active;
              return (
                <button
                  key={String(it.key)}
                  onClick={() => onChange(it.key)}
                  className={[
                    "relative rounded-2xl px-2 py-2 flex flex-col items-center justify-center gap-1 transition",
                    isActive ? "text-[#F37120]" : "text-black/45",
                    "active:scale-[0.99]",
                  ].join(" ")}
                >
                  <div className="relative">
                    <div className={isActive ? "scale-105" : ""}>{it.icon}</div>
                    {it.badge ? <Badge value={it.badge} color="red" /> : null}
                  </div>
                  <div className="text-[11px] font-semibold">{it.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Role Switch (kept) -------------------- */
function RoleSwitch({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const btn = (r: Role, label: string) => (
    <button
      onClick={() => onChange(r)}
      className={[
        "px-4 py-2 rounded-full text-sm font-semibold transition",
        role === r ? "bg-[#0b1220] text-white" : "text-black/45 hover:text-black/70",
      ].join(" ")}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex rounded-full bg-white/80 backdrop-blur shadow-sm ring-1 ring-black/5 p-1">
      {btn("member", "Member")}
      {btn("staff", "Staff")}
      {btn("admin", "Admin")}
    </div>
  );
}

/* ============================ PAGE ============================ */
export default function Page() {
  const [role, setRole] = useState<Role>("member");

  const [tab, setTab] = useState<TabKey>("home");
  const [tabAnimated, setTabAnimated] = useState<TabKey>("home");
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [animKey, setAnimKey] = useState(0);

  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const onSwitchRole = (r: Role) => {
    setRole(r);
    setAnimKey((k) => k + 1);
    setTab("home");
    setTabAnimated("home");
  };

  const switchTab = (next: TabKey) => {
    if (next === tab) return;

    const order: TabKey[] =
      role === "member"
        ? (["home", "chat", "announcements", "schedule", "profile"] as TabKey[])
        : role === "staff"
        ? (["home", "attendance", "clients", "sessions", "sales"] as TabKey[])
        : (["home", "overview", "clients", "sales", "settings"] as TabKey[]);

    const from = order.indexOf(tab);
    const to = order.indexOf(next);
    setAnimDir(to > from ? "right" : "left");
    setTab(next);

    window.setTimeout(() => {
      setTabAnimated(next);
      setAnimKey((k) => k + 1);
    }, 110);
  };

  // demo user
  const userName = "Aya Mohamed";
  const avatarUrl = "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=60";

  const unreadChat = 3;
  const unreadAnnouncements = 2;

  const activityRows = useMemo(
    () => [
      { title: "Weights Session", subtitle: "Malingap Branch / 6:00 - 7:00pm", right: <Pill>45 → 46</Pill>, emoji: "🥊" },
      { title: "Cardio Sessions", subtitle: "Malingap Branch / 5:00 - 6:00pm", right: <Pill>46</Pill>, emoji: "🧘" },
    ],
    []
  );

  const paymentRows = useMemo(
    () => [
      { title: "Via Gcash", subtitle: "1st-6th - NEW    P800   Due: January 25", amount: "₱8000", last: "Last: ₱5800", emoji: "💳" },
      { title: "Via BPI", subtitle: "Full Paid   P48000    Due: January 21", amount: "₱48000", last: "Last: ₱48000", emoji: "🎁" },
    ],
    []
  );

  /* -------------------- Member Home -------------------- */
  const MemberHome = (
    <div className="pb-28">
      <AppTopBar avatarUrl={avatarUrl} onSearch={() => {}} />

      <div className="px-4 mt-4">
        <div className="text-black/55 text-[13px]">Good Morning!</div>
        <div className="text-[26px] font-extrabold tracking-[-0.03em] text-black/75">Welcome Back!</div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <HeroBanner />

        {/* session row: scroll + snap */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-3 snap-x snap-mandatory">
            <SessionTile
              tone="teal"
              title="Weight Sessions"
              branch="Malingap Branch"
              time="6:00 - 7:00pm"
              timer="01 : 42 : 50"
              icon={<span className="text-lg">🏋️</span>}
            />
            <SessionTile
              tone="orange"
              title="Cardio Sessions"
              branch="Malingap Branch"
              time="5:00 - 6:00pm"
              coach="Coach Amiel"
              timer="46 : 36 : 26"
              icon={<span className="text-lg">🔥</span>}
            />
            <SessionTile
              tone="purple"
              title="Muay Thai/Boxing"
              branch="Malingap Branch"
              time="5:00 - 6:00pm"
              timer="90 : 60 : 30"
              icon={<span className="text-lg">🥊</span>}
            />
          </div>
        </div>

        <Card className="px-0">
          <div className="px-5 pt-5 pb-4">
            <SectionHeader title="Activity Log" onViewAll={() => switchTab("announcements")} />
          </div>
          <div className="px-5 pb-5 space-y-3">
            {activityRows.map((r, i) => (
              <ListRow
                key={i}
                leftIcon={<span className="text-xl">{r.emoji}</span>}
                title={r.title}
                subtitle={r.subtitle}
                right={r.right}
                onClick={() => {}}
              />
            ))}
          </div>
        </Card>

        <Card className="px-0">
          <div className="px-5 pt-5 pb-4">
            <SectionHeader title="Payments" onViewAll={() => switchTab("payments")} />
          </div>

          <div className="px-5 pb-5 space-y-3">
            {paymentRows.map((p, i) => (
              <button
                key={i}
                onClick={() => switchTab("payments")}
                className="w-full text-left flex items-start gap-4 rounded-2xl bg-white ring-1 ring-black/5 px-4 py-3 active:scale-[0.99] transition"
              >
                <div className="h-11 w-11 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <span className="text-xl">{p.emoji}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-[15px] text-black/75">{p.title}</div>
                  <div className="text-[13px] text-black/45 mt-0.5 leading-snug">{p.subtitle}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-extrabold text-[16px] text-black/75">{p.amount}</div>
                  <div className="text-[11px] text-black/40 mt-1">{p.last}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <PromoBanner />
      </div>
    </div>
  );

  /* -------------------- Other pages (kept) -------------------- */
  const MemberSchedule = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <RoleSwitch role={role} onChange={onSwitchRole} />
      </div>

      <Card title="My Schedule" right={<div className="text-sm text-black/40 font-semibold">{formatDate(now)}</div>}>
        {(() => {
          const start = startOfWeekMonday(now);
          const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
          });

          return (
            <div className="grid grid-cols-7 gap-2">
              {days.map((d, i) => (
                <div key={i} className="rounded-2xl bg-black/5 ring-1 ring-black/5 px-2 py-3 text-center">
                  <div className="text-[11px] text-black/45">{dayLabel(i)}</div>
                  <div className="mt-1 text-[14px] font-extrabold text-black/70">{d.getDate()}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </Card>

      <Card title="Upcoming">
        <div className="space-y-3">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
            <div className="font-extrabold text-black/70">Weights Session</div>
            <div className="text-[13px] text-black/45 mt-1">Today • 6:00 - 7:00pm • Malingap Branch</div>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
            <div className="font-extrabold text-black/70">Cardio Session</div>
            <div className="text-[13px] text-black/45 mt-1">Tomorrow • 5:00 - 6:00pm • Malingap Branch</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const MemberChat = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <RoleSwitch role={role} onChange={onSwitchRole} />
        <div className="text-black/45 font-semibold">Workout</div>
      </div>

      <Card title="Coach Chat">
        <div className="space-y-3">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-black/70">Coach JP</div>
              <div className="text-[13px] text-black/45 mt-1">Send me your availability for this week.</div>
            </div>
            <div className="text-[11px] text-black/35 font-bold">2h</div>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-black/70">Support</div>
              <div className="text-[13px] text-black/45 mt-1">Your assessment is confirmed. See you!</div>
            </div>
            <div className="text-[11px] text-black/35 font-bold">1d</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const MemberAnnouncements = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <RoleSwitch role={role} onChange={onSwitchRole} />
        <div className="text-black/45 font-semibold">Goals</div>
      </div>

      <Card title="Activity Log" right={<span className="rounded-full bg-black/5 text-black/60 px-3 py-1 text-sm font-bold">All</span>}>
        <div className="space-y-3">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-black/70">Weights Session</div>
              <div className="text-[13px] text-black/45 mt-1">Malingap Branch • 6:00 - 7:00pm</div>
            </div>
            <Pill>20 → 19</Pill>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-black/70">Cardio Session</div>
              <div className="text-[13px] text-black/45 mt-1">Malingap Branch • 6:00 - 7:00pm</div>
            </div>
            <Pill>21 → 20</Pill>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-black/70">Bonus Session Added</div>
              <div className="text-[13px] text-black/45 mt-1">Package Renewal • +3 Session Added</div>
            </div>
            <Pill>48 + 3</Pill>
          </div>
        </div>
      </Card>
    </div>
  );

  const MemberPayments = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <RoleSwitch role={role} onChange={onSwitchRole} />
        <div className="text-black/45 font-semibold">Payments</div>
      </div>

      <Card title="Payments" right={<div className="text-sm text-black/40 font-semibold">Billing</div>}>
        <div className="space-y-3">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 flex items-start justify-between gap-4">
            <div>
              <div className="font-extrabold text-black/70">Via Gcash</div>
              <div className="text-[13px] text-black/45 mt-1">1st-6th - NEW • Due: January 25</div>
              <div className="text-[13px] text-black/45 mt-1">Last Payment: ₱5800</div>
            </div>
            <div className="font-extrabold text-black/70">₱8000</div>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 flex items-start justify-between gap-4">
            <div>
              <div className="font-extrabold text-black/70">Via BPI</div>
              <div className="text-[13px] text-black/45 mt-1">Full Paid • Due: January 21</div>
              <div className="text-[13px] text-black/45 mt-1">Last Payment: ₱48000</div>
            </div>
            <div className="font-extrabold text-black/70">₱48000</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const MemberProfile = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <RoleSwitch role={role} onChange={onSwitchRole} />
        <div className="text-black/45 font-semibold">More</div>
      </div>

      <Card title={userName} right={<div className="text-sm text-black/40 font-semibold">{formatDate(now)}</div>}>
        <div className="flex items-center gap-4">
          <img src={avatarUrl} alt="profile" className="h-16 w-16 rounded-2xl object-cover ring-1 ring-black/5" />
          <div className="min-w-0">
            <div className="font-extrabold text-black/70 truncate">{userName}</div>
            <div className="text-[13px] text-black/45 mt-1 truncate">Malingap Branch • Active</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => switchTab("payments")}
            className="rounded-2xl bg-white ring-1 ring-black/5 p-4 text-left active:scale-[0.99] transition"
          >
            <div className="font-extrabold text-black/70">Payments</div>
            <div className="text-[13px] text-black/45 mt-1">View billing</div>
          </button>
          <button className="rounded-2xl bg-white ring-1 ring-black/5 p-4 text-left active:scale-[0.99] transition">
            <div className="font-extrabold text-black/70">Settings</div>
            <div className="text-[13px] text-black/45 mt-1">App & profile</div>
          </button>
        </div>
      </Card>
    </div>
  );

  // Staff/Admin placeholders
  const StaffHome = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Staff Home">
        <div className="text-black/55 text-sm">Attendance, clients, sessions, sales.</div>
      </Card>
    </div>
  );
  const StaffAttendance = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Attendance">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">Attendance list (demo)</div>
      </Card>
    </div>
  );
  const StaffClients = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Clients">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">Clients list (demo)</div>
      </Card>
    </div>
  );
  const StaffSessions = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Sessions">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">Sessions list (demo)</div>
      </Card>
    </div>
  );
  const StaffSales = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Sales">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">Sales pipeline (demo)</div>
      </Card>
    </div>
  );

  const AdminHome = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Admin Home">
        <div className="text-black/55 text-sm">Overview, clients, sales, settings.</div>
      </Card>
    </div>
  );
  const AdminOverview = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Overview">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">Overview (demo)</div>
      </Card>
    </div>
  );
  const AdminClients = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Clients">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">Clients (demo)</div>
      </Card>
    </div>
  );
  const AdminSales = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Sales">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">Sales (demo)</div>
      </Card>
    </div>
  );
  const AdminSettings = (
    <div className="space-y-6">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <Card title="Settings">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">Settings (demo)</div>
      </Card>
    </div>
  );

  const content =
    role === "member"
      ? tabAnimated === "home"
        ? MemberHome
        : tabAnimated === "schedule"
        ? MemberSchedule
        : tabAnimated === "chat"
        ? MemberChat
        : tabAnimated === "announcements"
        ? MemberAnnouncements
        : tabAnimated === "payments"
        ? MemberPayments
        : MemberProfile
      : role === "staff"
      ? tabAnimated === "home"
        ? StaffHome
        : tabAnimated === "attendance"
        ? StaffAttendance
        : tabAnimated === "clients"
        ? StaffClients
        : tabAnimated === "sessions"
        ? StaffSessions
        : StaffSales
      : tabAnimated === "home"
      ? AdminHome
      : tabAnimated === "overview"
      ? AdminOverview
      : tabAnimated === "clients"
      ? AdminClients
      : tabAnimated === "sales"
      ? AdminSales
      : AdminSettings;

  const memberNav: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "home", label: "Overview", icon: <HomeIcon /> },
    { key: "chat", label: "Workout", icon: <DumbbellIcon />, badge: unreadChat },
    { key: "announcements", label: "Goals", icon: <TargetIcon />, badge: unreadAnnouncements },
    { key: "schedule", label: "Schedule", icon: <CalendarIcon /> },
    { key: "profile", label: "More", icon: <UserIcon /> },
  ];

  const staffNav: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <HomeIcon /> },
    { key: "attendance", label: "Attendance", icon: <CalendarIcon /> },
    { key: "clients", label: "Clients", icon: <UserIcon /> },
    { key: "sessions", label: "Sessions", icon: <ChatIcon /> },
    { key: "sales", label: "Sales", icon: <WalletIcon /> },
  ];

  const adminNav: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <HomeIcon /> },
    { key: "overview", label: "Overview", icon: <TargetIcon /> },
    { key: "clients", label: "Clients", icon: <UserIcon /> },
    { key: "sales", label: "Sales", icon: <WalletIcon /> },
    { key: "settings", label: "Settings", icon: <ChatIcon /> },
  ];

  const nav = role === "member" ? memberNav : role === "staff" ? staffNav : adminNav;

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-black">
      {/* Typography baseline */}
      <style jsx global>{`
        :root {
          -webkit-tap-highlight-color: transparent;
          text-rendering: optimizeLegibility;
        }
        html,
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji",
            "Segoe UI Emoji";
        }
        /* smoother horizontal scroll on iOS */
        .momentum-scroll {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      {/* Dev role switch (kept but subtle) */}
      <div className="mx-auto max-w-[430px] px-4 pt-3">
        <div className="flex justify-center">
          <RoleSwitch role={role} onChange={onSwitchRole} />
        </div>
      </div>

      {/* phone-width canvas */}
      <div className="mx-auto max-w-[430px] px-4 pt-3 pb-28">
        <div
          key={animKey}
          className={[
            "transition-all duration-300",
            animDir === "right" ? "animate-[slideInRight_.25s_ease-out]" : "animate-[slideInLeft_.25s_ease-out]",
          ].join(" ")}
        >
          {content}
        </div>
      </div>

      <BottomNav items={nav} active={tab} onChange={(k) => switchTab(k)} />

      {/* keyframes */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(14px);
            opacity: 0.6;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-14px);
            opacity: 0.6;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
