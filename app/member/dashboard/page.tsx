"use client";

import React, { useEffect, useMemo, useState } from "react";

type Role = "member" | "staff" | "admin";

type MemberTab = "home" | "chat" | "schedule" | "payments" | "profile" | "announcements";
type StaffTab = "home" | "attendance" | "clients" | "sessions" | "sales";
type AdminTab = "home" | "overview" | "clients" | "sales" | "settings";

type TabKey = MemberTab | StaffTab | AdminTab;

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
function ChevronRightIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4 9 6Z" />
    </svg>
  );
}

function Badge({ value }: { value: number }) {
  if (!value) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-extrabold rounded-full px-2 py-0.5 shadow">
      {value}
    </span>
  );
}

function RoleSwitch({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const btn = (r: Role, label: string) => (
    <button
      onClick={() => onChange(r)}
      className={[
        "px-4 py-2 rounded-full text-sm font-semibold transition",
        role === r ? "bg-[#0b1220] text-white" : "text-black/55 hover:text-black/80",
      ].join(" ")}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex rounded-full bg-white/85 backdrop-blur shadow-sm ring-1 ring-black/10 p-1">
      {btn("member", "Member")}
      {btn("staff", "Staff")}
      {btn("admin", "Admin")}
    </div>
  );
}
function DarkCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl bg-[#0f1623]/90 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SoftGlowBorder({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "absolute inset-0 rounded-3xl pointer-events-none",
        "ring-1 ring-white/10",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        className,
      ].join(" ")}
    />
  );
}

function StatTile({
  title,
  big,
  sub,
  accent = "amber",
  ribbon,
}: {
  title: string;
  big: React.ReactNode;
  sub?: string;
  accent?: "amber" | "orange" | "red";
  ribbon?: string;
}) {
  const border =
    accent === "amber"
      ? "from-[#FFD36A] to-[#F59E0B]"
      : accent === "orange"
      ? "from-[#FFB54A] to-[#F37120]"
      : "from-[#FF6B6B] to-[#F87171]";

  return (
    <div className="relative flex-1 min-w-[0]">
      <div className={`rounded-3xl p-[1px] bg-gradient-to-br ${border}`}>
        <div className="relative rounded-3xl bg-[#0c111b] px-4 py-4 overflow-hidden">
          <div className="text-white/70 text-sm font-semibold">{title}</div>
          <div className="mt-4 text-white font-extrabold leading-none">{big}</div>
          {sub ? <div className="mt-3 text-white/60 text-sm font-semibold">{sub}</div> : null}

          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          </div>

          {ribbon ? (
            <div className="absolute left-0 bottom-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-[#F37120] to-[#FFB54A] text-white font-extrabold text-sm px-4 py-2 rounded-r-2xl shadow">
                  {ribbon}
                </div>
                <div className="absolute right-0 top-0 h-full w-5 bg-black/20 skew-x-[-18deg]" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionRow({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-white/85 font-extrabold text-lg">{title}</div>
      {right}
    </div>
  );
}

function ChipTabs({
  value,
  onChange,
}: {
  value: "activity" | "points" | "payments" | "placeholder";
  onChange: (v: "activity" | "points" | "payments" | "placeholder") => void;
}) {
  const tabs: { key: any; label: string }[] = [
    { key: "activity", label: "Activity Log" },
    { key: "points", label: "Points" },
    { key: "payments", label: "Payments" },
    { key: "placeholder", label: "Placeholder" },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-white/10">
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "pb-3 text-sm font-extrabold transition",
              active ? "text-[#F37120]" : "text-white/50 hover:text-white/75",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
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
        <div className="bg-white/95 backdrop-blur ring-1 ring-black/10 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] rounded-t-3xl px-2 py-2">
          <div className="grid grid-cols-5 gap-1">
            {items.map((it) => {
              const isActive = it.key === active;
              return (
                <button
                  key={String(it.key)}
                  onClick={() => onChange(it.key)}
                  className={[
                    "relative rounded-2xl px-2 py-2 flex flex-col items-center justify-center gap-1 transition",
                    isActive ? "text-[#F37120]" : "text-black hover:text-black/80", // inactive = BLACK (requested)
                  ].join(" ")}
                >
                  <div className="relative">
                    <div className={isActive ? "scale-105" : ""}>{it.icon}</div>
                    {it.badge ? <Badge value={it.badge} /> : null}
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

function formatMoneyPHP(n: number) {
  return `₱${n.toLocaleString("en-PH")}`;
}

function PillValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#F37120]/15 text-[#FFB54A] px-3 py-1 text-sm font-extrabold">
      {children}
    </span>
  );
}
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
        ? (["home", "chat", "schedule", "payments", "profile"] as TabKey[])
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

  const unreadChat = 2;

  // Demo member data (matches screenshot vibe)
  const member = {
    name: "Alex",
    code: "M00-1",
    branch: "Malingap Branch",
    packageLabel: "Full 48 Package+",
    sessionsUsed: 8,
    sessionsTotal: 48,
    activeLabel: "Active Member",
    streakDays: 17,
    bearforce: 1540,
    bearforceDelta: "+120 this month",
    prestige: { season: 2, since: 2023, label: "Prestige Member" as const },
  };

  const [logTab, setLogTab] = useState<"activity" | "points" | "payments" | "placeholder">("activity");

  const activityRows = useMemo(
    () => [
      { icon: "🏋️", title: "Weights Session", details: "Malingap", time: "6:00 - 7:00pm", value: "20 → 19" },
      { icon: "🔥", title: "Cardio Session", details: "E.Rod", time: "1:00 - 3:00pm", value: "48 → 47" },
      { icon: "🎁", title: "Package Renewal", details: "Via Gcash", time: formatMoneyPHP(48600), value: "0 + 48" },
      { icon: "⚡", title: "Cardio Session", details: "E.Rod", time: "1:00 - 3:00pm", value: "48 → 47" },
    ],
    []
  );

  const pointsRows = useMemo(
    () => [
      { icon: "🐻", title: "BearForce Earned", details: "Session Attendance", time: "This week", value: "+80" },
      { icon: "🏅", title: "Streak Bonus", details: "7-Day Streak", time: "Today", value: "+40" },
      { icon: "🔒", title: "Prestige Bonus", details: "Season 2", time: "This month", value: "+120" },
    ],
    []
  );

  const paymentRows = useMemo(
    () => [
      { icon: "💳", title: "Payment Received", details: "Via Gcash", time: "Jan 25", value: formatMoneyPHP(8000) },
      { icon: "🏦", title: "Payment Received", details: "Via BPI", time: "Jan 21", value: formatMoneyPHP(48000) },
    ],
    []
  );

  const upcoming = useMemo(
    () => [
      { tag: "Upcoming", title: "Weights Sessions", subtitle: "Malingap Branch • 6:00 - 7:00pm", coach: "Coach Joaquin" },
      { tag: "Upcoming", title: "Cardio Sessions", subtitle: "Malingap Branch • 5:00 - 6:00pm", coach: "Coach Amiel" },
    ],
    []
  );

  const percent = Math.max(0, Math.min(1, (member.sessionsTotal - member.sessionsUsed) / member.sessionsTotal));

const MemberHome = (
    <div className="pb-28">
      {/* Top strip: brand + role switch */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-[#F37120]/20 flex items-center justify-center">
            <span className="text-[#F37120] text-lg">🐻</span>
          </div>
          <div className="leading-tight">
            <div className="text-[#F37120] font-extrabold tracking-wide">BEARFIT</div>
            <div className="text-white/40 text-[11px] -mt-0.5">Member Fitness</div>
          </div>
        </div>

        <RoleSwitch role={role} onChange={onSwitchRole} />
      </div>

      {/* Dark hero/profile block */}
      <div className="px-4 mt-3">
        <DarkCard className="relative overflow-hidden p-4">
          <SoftGlowBorder />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
              <span className="text-white/35">👤</span>
              <span className="font-semibold">Welcome,</span>
              <span className="font-extrabold text-white">{member.name}</span>
            </div>
            <button className="h-10 w-10 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-white/70">
              💬
            </button>
          </div>

          <div className="mt-4 grid grid-cols-[110px_1fr] gap-4">
            {/* Hex avatar */}
            <div className="relative">
              <div className="h-[96px] w-[96px] mx-auto rounded-[26px] rotate-45 bg-gradient-to-br from-[#FFB54A] to-[#F37120] p-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                <div className="h-full w-full rounded-[24px] -rotate-45 bg-[#101826] overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=60"
                    alt="profile"
                    className="h-full w-full object-cover opacity-95"
                  />
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="text-white font-extrabold tracking-wider">{member.code}</div>
                <div className="text-white/55 text-sm font-semibold">{member.branch}</div>

                <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-white/55">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">🏅</span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">💎</span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">🛡️</span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">✅</span>
                </div>
              </div>
            </div>

            {/* Package + progress */}
            <div className="min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-white/80 font-bold">{member.packageLabel}</div>
                <div className="text-emerald-300/90 text-sm font-extrabold">{member.activeLabel}</div>
              </div>

              <div className="mt-3 h-3 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD36A] via-[#F59E0B] to-[#F37120]"
                  style={{ width: `${Math.round(percent * 100)}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-white/70 font-semibold">
                  {member.sessionsTotal - member.sessionsUsed} of {member.sessionsTotal} sessions
                </div>
                <button className="text-[#FFB54A] font-extrabold inline-flex items-center gap-1">
                  View Profile <ChevronRightIcon />
                </button>
              </div>

              {/* Stats row */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <StatTile
                  title="Workout Streak"
                  accent="amber"
                  big={
                    <div className="text-4xl">
                      {member.streakDays}
                      <span className="block text-3xl mt-1">Days</span>
                    </div>
                  }
                  ribbon="Personal Best"
                />

                <StatTile
                  title="Bearforce Points"
                  accent="amber"
                  big={
                    <div className="text-4xl">
                      {member.bearforce}
                      <span className="block text-3xl mt-1">MP</span>
                    </div>
                  }
                  sub={member.bearforceDelta}
                />

                <StatTile
                  title={member.prestige.label}
                  accent="red"
                  big={
                    <div className="text-3xl">
                      Season
                      <span className="block text-4xl mt-1">{member.prestige.season}</span>
                    </div>
                  }
                  sub={`Member since ${member.prestige.since}`}
                />
              </div>
            </div>
          </div>
        </DarkCard>
      </div>

      {/* Upcoming carousel */}
      <div className="px-4 mt-4">
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {upcoming.map((u, idx) => (
            <div
              key={idx}
              className="snap-start min-w-[320px] w-[320px] relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#F43F5E] to-[#F37120] ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=60"
                alt="session"
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />

              <div className="relative p-4">
                <div className="inline-flex rounded-xl bg-[#F37120] px-3 py-1 text-xs font-extrabold text-white">
                  {u.tag}
                </div>
                <div className="mt-3 text-3xl font-extrabold text-white leading-tight">{u.title}</div>
                <div className="mt-2 text-white/75 text-sm font-semibold">{u.subtitle}</div>
                <div className="text-white/60 text-sm font-semibold">{u.coach}</div>

                <div className="mt-6">
                  <div className="text-white font-extrabold text-4xl tracking-wider">09 : 25 : 26</div>
                  <div className="text-white/55 text-[11px] mt-1">Hours&nbsp;&nbsp;&nbsp;&nbsp;Minutes&nbsp;&nbsp;&nbsp;&nbsp;Seconds</div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="rounded-2xl bg-white/90 text-black px-4 py-2 font-extrabold text-sm shadow">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* extra card (for the side peek effect) */}
          <div className="snap-start min-w-[90px] w-[90px] rounded-3xl bg-white/5 ring-1 ring-white/10" />
        </div>
      </div>

      {/* Log block */}
      <div className="px-4 mt-4">
        <DarkCard className="p-4">
          <SectionRow title=" " />
          <ChipTabs value={logTab} onChange={setLogTab} />

          <div className="mt-4 rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[#0b111b]">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-0 px-4 py-3 text-[11px] font-extrabold text-[#FFB54A]/70 border-b border-white/10">
              <div>Transactions</div>
              <div>Details</div>
              <div>Time/Date</div>
              <div className="text-right">Balance</div>
            </div>

            {(logTab === "activity" ? activityRows : logTab === "points" ? pointsRows : logTab === "payments" ? paymentRows : []).map(
              (r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-0 px-4 py-3 text-sm text-white/85 border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                      {r.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="font-extrabold truncate">{r.title}</div>
                      <div className="text-[11px] text-white/45 font-semibold">1 Session Used</div>
                    </div>
                  </div>
                  <div className="text-white/60 font-semibold self-center">{r.details}</div>
                  <div className="text-white/60 font-semibold self-center">{r.time}</div>
                  <div className="text-right self-center">
                    <span className="text-[#FFB54A] font-extrabold">{r.value}</span>
                  </div>
                </div>
              )
            )}

            {logTab === "placeholder" ? (
              <div className="px-4 py-10 text-center text-white/45 font-semibold">Placeholder tab</div>
            ) : null}
          </div>

          <div className="mt-4 text-white/45 text-sm font-semibold flex items-center justify-between">
            <span>Total transactions</span>
            <span className="text-white/70 font-extrabold">506</span>
          </div>
        </DarkCard>
      </div>

      {/* Bottom banner */}
      <div className="px-4 mt-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#F37120] to-[#FFB54A] ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <img
            src="https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?auto=format&fit=crop&w=1200&q=60"
            alt="banner"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F37120]/85 via-[#F37120]/55 to-black/15" />
          <div className="relative p-4">
            <div className="text-white text-xl font-extrabold">Track Your Daily Activities</div>
            <div className="mt-2 text-white/80 text-sm font-semibold max-w-[320px]">
              Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore aliqua.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const MemberChat = (
    <div className="pb-28">
      <div className="px-4 pt-4">
        <RoleSwitch role={role} onChange={onSwitchRole} />
      </div>
      <div className="px-4 mt-4">
        <DarkCard className="p-4">
          <div className="text-white font-extrabold text-xl">Chat</div>
          <div className="mt-3 text-white/55 font-semibold">Messages (demo)</div>
        </DarkCard>
      </div>
    </div>
  );

  const MemberSchedule = (
    <div className="pb-28">
      <div className="px-4 pt-4">
        <RoleSwitch role={role} onChange={onSwitchRole} />
      </div>
      <div className="px-4 mt-4">
        <DarkCard className="p-4">
          <div className="text-white font-extrabold text-xl">Schedule</div>
          <div className="mt-3 text-white/55 font-semibold">This week (demo)</div>
        </DarkCard>
      </div>
    </div>
  );

  const MemberPayments = (
    <div className="pb-28">
      <div className="px-4 pt-4">
        <RoleSwitch role={role} onChange={onSwitchRole} />
      </div>
      <div className="px-4 mt-4">
        <DarkCard className="p-4">
          <div className="text-white font-extrabold text-xl">Payment</div>
          <div className="mt-3 text-white/55 font-semibold">Billing & history (demo)</div>
        </DarkCard>
      </div>
    </div>
  );

  const MemberProfile = (
    <div className="pb-28">
      <div className="px-4 pt-4">
        <RoleSwitch role={role} onChange={onSwitchRole} />
      </div>
      <div className="px-4 mt-4">
        <DarkCard className="p-4">
          <div className="text-white font-extrabold text-xl">Profile</div>
          <div className="mt-3 text-white/55 font-semibold">Member details (demo)</div>
        </DarkCard>
      </div>
    </div>
  );

  const StaffHome = (
    <div className="pb-28 px-4 pt-4">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <div className="mt-4">
        <DarkCard className="p-4">
          <div className="text-white font-extrabold text-xl">Staff Home</div>
          <div className="mt-2 text-white/55 font-semibold">Attendance, clients, sessions, sales (demo)</div>
        </DarkCard>
      </div>
    </div>
  );

  const AdminHome = (
    <div className="pb-28 px-4 pt-4">
      <RoleSwitch role={role} onChange={onSwitchRole} />
      <div className="mt-4">
        <DarkCard className="p-4">
          <div className="text-white font-extrabold text-xl">Admin Home</div>
          <div className="mt-2 text-white/55 font-semibold">Overview, clients, sales, settings (demo)</div>
        </DarkCard>
      </div>
    </div>
  );

  const content =
    role === "member"
      ? tabAnimated === "home"
        ? MemberHome
        : tabAnimated === "chat"
        ? MemberChat
        : tabAnimated === "schedule"
        ? MemberSchedule
        : tabAnimated === "payments"
        ? MemberPayments
        : MemberProfile
      : role === "staff"
      ? StaffHome
      : AdminHome;

  const memberNav: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "home", label: "Home", icon: <HomeIcon /> },
    { key: "chat", label: "Chat", icon: <ChatIcon />, badge: unreadChat },
    { key: "schedule", label: "Schedule", icon: <CalendarIcon /> },
    { key: "payments", label: "Payment", icon: <WalletIcon /> },
    { key: "profile", label: "Profile", icon: <UserIcon /> },
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
    { key: "overview", label: "Overview", icon: <CalendarIcon /> },
    { key: "clients", label: "Clients", icon: <UserIcon /> },
    { key: "sales", label: "Sales", icon: <WalletIcon /> },
    { key: "settings", label: "Settings", icon: <ChatIcon /> },
  ];

  const nav = role === "member" ? memberNav : role === "staff" ? staffNav : adminNav;

  return (
    <div className="min-h-screen bg-[#070b12]">
      <div className="mx-auto max-w-[430px] pt-2 pb-28">
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
