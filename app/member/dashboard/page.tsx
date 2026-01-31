"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * BearFit — Dark “App Feel” Layout (Member/Staff/Admin kept)
 * Updates per your request:
 * ✅ Member home redesigned to match your 2nd image (centered app-size, dark theme)
 * ✅ Role switch kept (Member / Staff / Admin) and placed in header like the mock
 * ✅ Bottom nav kept but renamed: Home, Chat, Schedule, Payment, Profile
 * ✅ Inactive tabs = black, active = orange
 * ✅ Code still single page.tsx (output in 6 parts for easy copy)
 */

type Role = "member" | "staff" | "admin";
type MemberTab = "home" | "chat" | "schedule" | "payments" | "profile";
type StaffTab = "home" | "attendance" | "clients" | "sessions" | "sales";
type AdminTab = "home" | "overview" | "clients" | "sales" | "settings";
type TabKey = MemberTab | StaffTab | AdminTab;

/* -------------------- helpers -------------------- */
function startOfWeekMonday(d: Date) {
  const copy = new Date(d);
  const day = copy.getDay(); // Sun=0
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  copy.setDate(copy.getDate() + diffToMonday);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
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
  return `${months[d.getMonth()]} ${d.getDate()}`;
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
function ChatIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 4h8v2H6V8Zm0 4h12v2H6v-2Z"
      />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm14 8H3v10h18V10Z"
      />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 7a3 3 0 0 1 3-3h12a2 2 0 0 1 2 2v2h-2V6H6a1 1 0 0 0 0 2h14a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Zm16 6h3v2h-3v-2Z"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.7-9 6v2h18v-2c0-3.3-4-6-9-6Z"
      />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg className={iconBase("h-5 w-5")} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
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

function RoleSwitch({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const item = (k: Role, label: string) => {
    const active = role === k;
    return (
      <button
        onClick={() => onChange(k)}
        className={[
          "px-3.5 py-2 rounded-full text-xs font-semibold transition",
          active
            ? "bg-white text-[#0b0f14] shadow-sm"
            : "text-white/70 hover:text-white",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-white/10 ring-1 ring-white/10 p-1">
      {item("member", "Member")}
      {item("staff", "Staff")}
      {item("admin", "Admin")}
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
        "rounded-[26px] bg-white/[0.06] backdrop-blur-xl",
        "ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function PillTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-2 text-[13px] font-semibold transition",
        active ? "text-[#F37120]" : "text-white/55 hover:text-white/80",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function NavItem({
  active,
  label,
  badge,
  badgeColor,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  badge?: number;
  badgeColor?: "orange" | "red" | "blue";
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition",
        active ? "text-[#F37120]" : "text-[#0b0f14]",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      <span className="relative">
        {children}
        <Badge value={badge || 0} color={badgeColor} />
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
}

function Countdown({ target, now }: { target: Date; now: Date }) {
  const total = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="mt-6 flex items-end gap-5">
      <div>
        <div className="text-[40px] leading-none tracking-[0.22em] font-extrabold text-white">
          {pad(h)} : {pad(m)} : {pad(s)}
        </div>
        <div className="mt-2 flex gap-[46px] text-[11px] text-white/55">
          <span>Hours</span>
          <span>Minutes</span>
          <span>Seconds</span>
        </div>
      </div>
    </div>
  );
}
function MemberHomeScreen({
  role,
  onRoleChange,
}: {
  role: Role;
  onRoleChange: (r: Role) => void;
}) {
  const now = new Date();
  const monday = startOfWeekMonday(now);

  const user = {
    name: "Alex",
    code: "M00-1",
    branch: "Malingap Branch",
    packageName: "Full 48 Package+",
    sessionsUsed: 8,
    sessionsTotal: 48,
    activeLabel: "Active Member",
    streakDays: 17,
    mp: 1540,
    mpDelta: 120,
    prestigeTitle: "Prestige Member",
    season: 2,
    since: 2023,
  };

  const usedPct = Math.round((user.sessionsUsed / user.sessionsTotal) * 100);

  const upcoming = [
    {
      tag: "Upcoming",
      title: "Weights Sessions",
      meta: "Malingap Branch • 6:00 - 7:00pm",
      coach: "Coach Joaquin",
    },
    {
      tag: "Upcoming",
      title: "Cardio Sessions",
      meta: "Malingap Branch • 7:00 - 8:00pm",
      coach: "Coach E.Rod",
    },
  ];

  const [upIndex, setUpIndex] = useState(0);
  const target = useMemo(() => {
    const t = new Date(now);
    t.setHours(now.getHours() + 9);
    t.setMinutes(now.getMinutes() + 25);
    t.setSeconds(now.getSeconds() + 26);
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [logTab, setLogTab] = useState<"activity" | "points" | "payments" | "placeholder">("activity");

  const rows = [
    { icon: "🏋️", title: "Weights Session", sub: "1 Session Used", detail: "Malingap", time: "6:00 - 7:00pm", bal: "20 → 19" },
    { icon: "🏃", title: "Cardio Session", sub: "1 Session Used", detail: "E.Rod", time: "1:00 - 3:00pm", bal: "48 → 47" },
    { icon: "🎁", title: "Package Renewal", sub: "+48 Sessions Added", detail: "Via Gcash", time: "₱48,600", bal: "0 + 48" },
    { icon: "⚡", title: "Cardio Session", sub: "1 Free Session Used", detail: "E.Rod", time: "1:00 - 3:00pm", bal: "48 → 47" },
  ];

  useEffect(() => {
    const id = setInterval(() => setUpIndex((p) => (p + 1) % upcoming.length), 9000);
    return () => clearInterval(id);
  }, [upcoming.length]);

  return (
    <div className="space-y-4">
      {/* Top header row (brand left, role switch right) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-[#F37120]/20 ring-1 ring-[#F37120]/25 flex items-center justify-center">
            <span className="text-[#F37120] font-black">🐻</span>
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-extrabold tracking-wide text-[#F37120]">BEARFIT</div>
            <div className="text-[11px] text-white/55 -mt-0.5">Member Fitness</div>
          </div>
        </div>

        <RoleSwitch role={role} onChange={onRoleChange} />
      </div>

      {/* Profile + Package card */}
      <DarkCard className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-white/10 ring-2 ring-[#F37120]/45 overflow-hidden">
                {/* placeholder photo */}
                <div className="h-full w-full bg-gradient-to-b from-white/10 to-black/30" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#F37120] ring-2 ring-black/50" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="text-[14px] font-bold text-white">Welcome, {user.name}</div>
                <button className="ml-1 rounded-xl bg-white/10 p-2 ring-1 ring-white/10 text-white/80 hover:text-white">
                  <span className="inline-block -mt-[1px]">💬</span>
                </button>
              </div>
              <div className="mt-2 text-white/85 font-extrabold text-[18px] tracking-wide">{user.code}</div>
              <div className="text-[12px] text-white/55">{user.branch}</div>

              <div className="mt-2 flex items-center gap-2 text-[11px] text-white/55">
                <span className="inline-flex items-center gap-1">🏅</span>
                <span className="inline-flex items-center gap-1">💎</span>
                <span className="inline-flex items-center gap-1">🏷️</span>
                <span className="inline-flex items-center gap-1">✅</span>
              </div>
            </div>
          </div>

          <button className="rounded-xl bg-white/10 ring-1 ring-white/10 px-3 py-2 text-[12px] font-semibold text-white/80 hover:text-white flex items-center gap-1">
            View Profile <ChevronRight />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-black/25 ring-1 ring-white/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[13px] text-white/75">
                {user.packageName} <span className="text-[#55d38a] font-semibold">• {user.activeLabel}</span>
              </div>
              <div className="mt-2 text-[12px] text-white/60">
                {user.sessionsTotal - user.sessionsUsed} of {user.sessionsTotal} sessions
              </div>
            </div>
            <div className="text-[12px] text-white/50">{usedPct}% used</div>
          </div>

          <div className="mt-3 h-3 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F37120] via-[#ffb86b] to-[#F37120]"
              style={{ width: `${usedPct}%` }}
            />
          </div>

          {/* 3 metric tiles */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-black/25 ring-1 ring-[#F37120]/35 p-3 text-center">
              <div className="text-[11px] text-white/70 leading-tight">Workout<br/>Streak</div>
              <div className="mt-2 text-[26px] font-extrabold text-white leading-none">{user.streakDays}</div>
              <div className="text-[14px] font-extrabold text-white mt-1">Days</div>
              <div className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#F37120] px-2.5 py-1 text-[11px] font-bold text-white">
                Personal Best
              </div>
            </div>

            <div className="rounded-2xl bg-black/25 ring-1 ring-[#ffcf8a]/35 p-3 text-center">
              <div className="text-[11px] text-white/70">Bearforce</div>
              <div className="mt-3 text-[26px] font-extrabold text-white leading-none">{user.mp}</div>
              <div className="text-[14px] font-extrabold text-white mt-1">MP</div>
              <div className="mt-2 text-[11px] text-white/55">+{user.mpDelta} this month</div>
            </div>

            <div className="rounded-2xl bg-black/25 ring-1 ring-[#ff6b6b]/35 p-3 text-center">
              <div className="text-[11px] text-white/70">{user.prestigeTitle}</div>
              <div className="mt-3 text-[26px] font-extrabold text-white leading-none">Season</div>
              <div className="text-[22px] font-extrabold text-white mt-1">{user.season}</div>
              <div className="mt-2 text-[11px] text-white/55">Member since {user.since}</div>
            </div>
          </div>
        </div>
      {/* Total transactions footer */}
        <div className="mt-4 flex items-center justify-between px-2">
          <span className="text-xs text-white/50">Total transactions</span>
          <span className="text-sm font-semibold text-white/70">506</span>
        </div>

      {/* Upcoming carousel (peek) */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {upcoming.map((u, idx) => {
            const active = idx === upIndex;
            return (
              <div
                key={idx}
                className={[
                  "min-w-[270px] max-w-[270px] shrink-0",
                  "rounded-[28px] overflow-hidden",
                  "shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
                  "ring-1 ring-white/10",
                  active ? "" : "opacity-75",
                ].join(" ")}
              >
                <div className="relative h-[155px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#6c2bd9] via-[#ff5f6d] to-[#ffb86b] opacity-70" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute inset-0 p-4">
                    <div className="inline-flex rounded-full bg-[#F37120] px-3 py-1 text-[11px] font-bold text-white">
                      {u.tag}
                    </div>
                    <div className="mt-3 text-[26px] font-extrabold text-white leading-tight">{u.title}</div>
                    <div className="mt-1 text-[12px] text-white/75">{u.meta}</div>
                    <div className="mt-1 text-[12px] text-white/75">{u.coach}</div>
                    <Countdown target={target} now={now} />
                    <div className="absolute right-4 bottom-4">
                      <button className="rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#0b0f14]">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* side-peek spacer */}
          <div className="w-10 shrink-0" />
        </div>
      </div>
      {/* Log tabs */}
      <DarkCard className="px-4 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PillTab active={logTab === "activity"} label="Activity Log" onClick={() => setLogTab("activity")} />
            <PillTab active={logTab === "points"} label="Points" onClick={() => setLogTab("points")} />
            <PillTab active={logTab === "payments"} label="Payments" onClick={() => setLogTab("payments")} />
            <PillTab active={logTab === "placeholder"} label="Placeholder" onClick={() => setLogTab("placeholder")} />
          </div>
        </div>

        <div className="mt-2 h-px bg-white/10" />

        {/* Table header */}
        <div className="mt-3 grid grid-cols-[1.25fr_1fr_1fr_0.8fr] gap-2 px-2 text-[11px] text-[#F37120]/80">
          <div>Transactions</div>
          <div>Details</div>
          <div>Time/Date</div>
          {/* Table header */}
        <div className="mt-3 grid grid-cols-[1.25fr_1fr_1fr_0.8fr] gap-2 px-2 text-[11px] text-[#F37120]/80">
          <div>Transactions</div>
          <div>Details</div>
          <div>Time/Date</div>
          <div className="text-right">Balance</div>
        </div>

        {/* Rows */}
        <div className="mt-2 space-y-2">
          {logTab === "activity" &&
            rows.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-[1.25fr_1fr_1fr_0.8fr] gap-2 rounded-2xl bg-black/25 ring-1 ring-white/10 px-3 py-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center">
                    <span className="text-[14px]">{r.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-white truncate">{r.title}</div>
                    <div className="text-[11px] text-white/55 truncate">{r.sub}</div>
                  </div>
                </div>

                <div className="text-[12px] text-white/70 flex items-center">{r.detail}</div>

                <div className="text-[12px] text-white/70 flex items-center">{r.time}</div>

                <div className="text-right text-[14px] font-extrabold text-[#F37120] flex items-center justify-end">
                  {r.bal}
                </div>
              </div>
            ))}

          {logTab !== "activity" && (
            <div className="rounded-2xl bg-black/25 ring-1 ring-white/10 p-4 text-white/65 text-[13px]">
              {logTab === "points" && "Points view placeholder (you can show Bearforce MP ledger here)."}
              {logTab === "payments" && "Payments view placeholder (show invoices, due dates, receipts)."}
              {logTab === "placeholder" && "Placeholder tab content."}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between px-2 text-[12px] text-white/45">
          <span>Total transactions</span>
          <span className="text-white/70 font-semibold">506</span>
        </div>
      </DarkCard>

      {/* Bottom orange banner */}
      <div className="rounded-[26px] overflow-hidden ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
        <div className="relative p-5 bg-gradient-to-r from-[#F37120] via-[#ff8a2a] to-[#ffb86b]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_60%,white,transparent_45%)]" />
          <div className="relative">
            <div className="text-white text-[16px] font-extrabold">Track Your Daily Activities</div>
            <div className="mt-2 text-white/85 text-[12px] leading-relaxed max-w-[280px]">
              Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore aliqua.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Other member tabs (kept, themed dark) -------------------- */
function MemberChatScreen() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Chat</div>
      <div className="mt-2 text-white/60 text-sm">Chat UI placeholder.</div>
    </DarkCard>
  );
}
function MemberScheduleScreen() {
  const now = new Date();
  const monday = startOfWeekMonday(now);
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [monday]);

  return (
    <div className="space-y-4">
      <DarkCard className="p-4">
        <div className="text-white font-bold">Schedule</div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {weekDays.map((d, i) => {
            const isToday = d.toDateString() === now.toDateString();
            return (
              <div
                key={i}
                className={[
                  "rounded-2xl p-2 text-center ring-1",
                  isToday ? "bg-[#F37120]/20 ring-[#F37120]/40" : "bg-white/5 ring-white/10",
                ].join(" ")}
              >
                <div className="text-[10px] text-white/60">{dayLabel(i)}</div>
                <div className={["mt-1 text-[12px] font-bold", isToday ? "text-white" : "text-white/80"].join(" ")}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-white/55 text-sm">Schedule details placeholder.</div>
      </DarkCard>
    </div>
  );
}
function MemberPaymentsScreen() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Payment</div>
      <div className="mt-2 text-white/60 text-sm">Payments UI placeholder.</div>
    </DarkCard>
  );
}
function MemberProfileScreen() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Profile</div>
      <div className="mt-2 text-white/60 text-sm">Profile UI placeholder.</div>
    </DarkCard>
  );
}
/* -------------------- Staff/Admin screens (kept; dark placeholders) -------------------- */
function StaffHomeScreen() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Staff Home</div>
      <div className="mt-2 text-white/60 text-sm">Staff dashboard placeholder.</div>
    </DarkCard>
  );
}
function StaffAttendance() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Attendance</div>
      <div className="mt-2 text-white/60 text-sm">Attendance tools placeholder.</div>
    </DarkCard>
  );
}
function StaffClients() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Clients</div>
      <div className="mt-2 text-white/60 text-sm">Client list placeholder.</div>
    </DarkCard>
  );
}
function StaffSessions() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Sessions</div>
      <div className="mt-2 text-white/60 text-sm">Sessions management placeholder.</div>
    </DarkCard>
  );
}
function StaffSales() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Sales</div>
      <div className="mt-2 text-white/60 text-sm">Sales tracker placeholder.</div>
    </DarkCard>
  );
}

function AdminHomeScreen() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Admin Home</div>
      <div className="mt-2 text-white/60 text-sm">Admin dashboard placeholder.</div>
    </DarkCard>
  );
}
function AdminOverview() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Overview</div>
      <div className="mt-2 text-white/60 text-sm">KPIs placeholder.</div>
    </DarkCard>
  );
}
function AdminClients() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Clients</div>
      <div className="mt-2 text-white/60 text-sm">Admin client tools placeholder.</div>
    </DarkCard>
  );
}
function AdminSales() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Sales</div>
      <div className="mt-2 text-white/60 text-sm">Admin sales tools placeholder.</div>
    </DarkCard>
  );
}
function AdminSettings() {
  return (
    <DarkCard className="p-4">
      <div className="text-white font-bold">Settings</div>
      <div className="mt-2 text-white/60 text-sm">Settings placeholder.</div>
    </DarkCard>
  );
}

/* -------------------- Main Page -------------------- */
export default function Page() {
  const now = new Date();

  const [role, setRole] = useState<Role>("member");
  const [tab, setTab] = useState<TabKey>("home");
  const [animDir, setAnimDir] = useState<"left" | "right">("right");

  const setTabAnimated = (next: TabKey) => {
    if (next === tab) return;

    const orderMember: MemberTab[] = ["home", "chat", "schedule", "payments", "profile"];
    const orderStaff: StaffTab[] = ["home", "attendance", "clients", "sessions", "sales"];
    const orderAdmin: AdminTab[] = ["home", "overview", "clients", "sales", "settings"];

    const order = role === "member" ? (orderMember as TabKey[]) : role === "staff" ? (orderStaff as TabKey[]) : (orderAdmin as TabKey[]);
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

  // member nav (as requested)
  const memberNav: { key: MemberTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: "orange" | "red" | "blue" }[] = [
    { key: "home", label: "Home", icon: <HomeIcon /> },
    { key: "chat", label: "Chat", icon: <ChatIcon />, badge: 2, badgeColor: "red" },
    { key: "schedule", label: "Schedule", icon: <CalendarIcon /> },
    { key: "payments", label: "Payment", icon: <WalletIcon />, badge: 1, badgeColor: "orange" },
    { key: "profile", label: "Profile", icon: <UserIcon /> },
  ];

  // keep staff/admin nav internal (not shown on member bottom bar)
  const staffNav: { key: StaffTab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <HomeIcon /> },
    { key: "attendance", label: "Attendance", icon: <CalendarIcon /> },
    { key: "clients", label: "Clients", icon: <UserIcon /> },
    { key: "sessions", label: "Sessions", icon: <ChatIcon /> },
    { key: "sales", label: "Sales", icon: <WalletIcon /> },
  ];
  const adminNav: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <HomeIcon /> },
    { key: "overview", label: "Overview", icon: <CalendarIcon /> },
    { key: "clients", label: "Clients", icon: <UserIcon /> },
    { key: "sales", label: "Sales", icon: <WalletIcon /> },
    { key: "settings", label: "Settings", icon: <ChatIcon /> },
  ];

  const content =
    role === "member"
      ? tab === "home"
        ? <MemberHomeScreen role={role} onRoleChange={onSwitchRole} />
        : tab === "chat"
        ? <MemberChatScreen />
        : tab === "schedule"
        ? <MemberScheduleScreen />
        : tab === "payments"
        ? <MemberPaymentsScreen />
        : <MemberProfileScreen />
      : role === "staff"
      ? tab === "home"
        ? <StaffHomeScreen />
        : tab === "attendance"
        ? <StaffAttendance />
        : tab === "clients"
        ? <StaffClients />
        : tab === "sessions"
        ? <StaffSessions />
        : <StaffSales />
      : tab === "home"
      ? <AdminHomeScreen />
      : tab === "overview"
      ? <AdminOverview />
      : tab === "clients"
      ? <AdminClients />
      : tab === "sales"
      ? <AdminSales />
      : <AdminSettings />;

  const nav = role === "member" ? (memberNav as { key: TabKey; label: string; icon: React.ReactNode; badge?: number; badgeColor?: "orange" | "red" | "blue" }[]) :
              role === "staff" ? (staffNav as { key: TabKey; label: string; icon: React.ReactNode }[]) :
              (adminNav as { key: TabKey; label: string; icon: React.ReactNode }[]);

  return (
    <div className="min-h-screen bg-[#070a0f] text-white">
      {/* background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-[#F37120]/10 blur-[90px]" />
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-[#6c2bd9]/10 blur-[110px]" />
      </div>

      {/* centered app-size frame */}
      <div className="relative mx-auto w-full max-w-[420px] px-4 pt-5 pb-28">
        <div key={`${role}-${tab}`} className={`bf-pane ${animDir === "right" ? "bf-in-right" : "bf-in-left"}`}>
          {content}
        </div>
      </div>

      {/* bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto w-full max-w-[420px] px-4 pb-4">
          <div className="rounded-[22px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.55)] ring-1 ring-black/5 px-3 py-2">
            <div className="grid grid-cols-5 gap-1">
              {nav.slice(0, 5).map((item: any) => (
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
        .bf-in-right { animation-name: bfSlideInRight; }
        .bf-in-left { animation-name: bfSlideInLeft; }
        @keyframes bfSlideInRight {
          from { opacity: 0; transform: translateX(14px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bfSlideInLeft {
          from { opacity: 0; transform: translateX(-14px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
