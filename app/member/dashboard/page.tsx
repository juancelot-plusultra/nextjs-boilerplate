// PART 1/8
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

type Role = "member" | "staff" | "admin";
type TabKey =
  | "home"
  | "chat"
  | "schedule"
  | "payments"
  | "profile"
  | "attendance"
  | "clients"
  | "sessions"
  | "sales"
  | "overview"
  | "settings";

function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

/* ---------- Icons (simple + reliable) ---------- */
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
          d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v15a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2h3V2Zm14 8H3v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V10ZM20 6H4v2h16V6Z"
        />
      </svg>
    </IconWrap>
  );
}
function WalletIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 7a3 3 0 0 1 3-3h12a2 2 0 0 1 2 2v2h-9a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h9v2a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V7Zm18 4h-9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9v-4Zm-3 1.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"
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
          d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.4 0-8 2.1-8 4.7V21h16v-2.3c0-2.6-3.6-4.7-8-4.7Z"
        />
      </svg>
    </IconWrap>
  );
}
function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="currentColor" d="M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4 9 6Z" />
    </svg>
  );
}
// PART 2/8
function Badge({ value }: { value: number }) {
  if (!value) return null;
  return (
    <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
      {value}
    </span>
  );
}

function RoleSwitch({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const Btn = ({ r, label }: { r: Role; label: string }) => {
    const on = role === r;
    return (
      <button
        onClick={() => onChange(r)}
        className={cx(
          "px-3 py-2 rounded-full text-[12px] font-semibold transition",
          on
            ? "bg-white text-black shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
            : "text-white/70 hover:text-white"
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/10 backdrop-blur">
      <Btn r="member" label="Member" />
      <Btn r="staff" label="Staff" />
      <Btn r="admin" label="Admin" />
    </div>
  );
}

function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "rounded-[26px] bg-[#0B111D]/90 ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-2">
      {tabs.map((t) => {
        const on = t === active;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={cx(
              "relative pb-2 text-[12px] font-semibold transition",
              on ? "text-white" : "text-white/55 hover:text-white/75"
            )}
          >
            {t}
            {on && <span className="absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full bg-[#F59A3E]" />}
          </button>
        );
      })}
    </div>
  );
}

function GradientOutlineCard({
  children,
  tone = "gold",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "gold" | "orange" | "red";
  className?: string;
}) {
  const ring =
    tone === "gold"
      ? "from-[#F6C75A] via-[#F59A3E] to-[#F37120]"
      : tone === "red"
      ? "from-[#FF5B5B] via-[#F37120] to-[#F6C75A]"
      : "from-[#F37120] via-[#F59A3E] to-[#F6C75A]";

  return (
    <div className={cx("relative rounded-[20px] p-[1px]", className)}>
      <div className={cx("absolute inset-0 rounded-[20px] bg-gradient-to-br", ring, "opacity-80")} />
      <div className="relative rounded-[19px] bg-[#0B111D] ring-1 ring-white/10 p-3">{children}</div>
    </div>
  );
}

/* hex avatar using clip-path (very close to mock) */
function HexAvatar({ src }: { src: string }) {
  return (
    <div className="relative h-[92px] w-[92px]">
      <div className="absolute inset-0 rounded-[18px] bg-gradient-to-br from-[#F6C75A] to-[#F37120] opacity-60 blur-[10px]" />
      <div className="relative h-full w-full p-[2px]" style={{ clipPath: "polygon(25% 6%, 75% 6%, 96% 50%, 75% 94%, 25% 94%, 4% 50%)" }}>
        <div
          className="h-full w-full overflow-hidden bg-black"
          style={{ clipPath: "polygon(25% 6%, 75% 6%, 96% 50%, 75% 94%, 25% 94%, 4% 50%)" }}
        >
          <img src={src} alt="avatar" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
// PART 3/8
function TopHeader({
  role,
  onRoleChange,
}: {
  role: Role;
  onRoleChange: (r: Role) => void;
}) {
  return (
    <div className="flex items-center justify-between pt-5">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-[#F37120]/15 ring-1 ring-[#F37120]/25 flex items-center justify-center">
          <span className="text-[#F59A3E] text-lg">🐻</span>
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-bold text-[#F59A3E] tracking-wide">BEARFIT</div>
          <div className="text-[11px] text-white/45 -mt-0.5">Member Fitness</div>
        </div>
      </div>

      <RoleSwitch role={role} onChange={onRoleChange} />
    </div>
  );
}

function WelcomeRow({
  name,
  onChat,
}: {
  name: string;
  onChat?: () => void;
}) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/70">
        <span className="text-white/35">👤</span>
        <div className="text-[14px] font-semibold">
          Welcome, <span className="text-white">{name}</span>
        </div>
      </div>

      <button
        onClick={onChat}
        className="h-10 w-10 rounded-[14px] bg-white/5 ring-1 ring-white/10 text-white/70 flex items-center justify-center"
        aria-label="Open chat"
      >
        💬
      </button>
    </div>
  );
}

function MemberProfileCard({
  avatar,
  code,
  branch,
  packageName,
  status,
  used,
  total,
  onViewProfile,
}: {
  avatar: string;
  code: string;
  branch: string;
  packageName: string;
  status: string;
  used: number;
  total: number;
  onViewProfile?: () => void;
}) {
  const pct = Math.max(0, Math.min(100, (used / Math.max(1, total)) * 100));

  return (
    <DarkCard className="mt-3 p-4">
      <div className="flex items-start gap-4">
        {/* left column (close to mock proportions) */}
        <div className="w-[120px] shrink-0 text-center">
          <HexAvatar src={avatar} />

          <div className="mt-3 text-[22px] font-bold text-white tracking-wide">{code}</div>
          <div className="text-[12px] text-white/55">{branch}</div>

          <div className="mt-2 flex justify-center gap-1">
            <span className="h-5 w-5 rounded-full bg-white/10 ring-1 ring-white/10" />
            <span className="h-5 w-5 rounded-full bg-white/10 ring-1 ring-white/10" />
            <span className="h-5 w-5 rounded-full bg-white/10 ring-1 ring-white/10" />
            <span className="h-5 w-5 rounded-full bg-white/10 ring-1 ring-white/10" />
          </div>
        </div>

        {/* right column */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-white/80 truncate">{packageName}</div>
              <div className="mt-0.5 text-[12px] font-semibold text-[#62D48E]">{status}</div>
            </div>

            <button
              onClick={onViewProfile}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#F59A3E]"
            >
              View Profile <ChevronRightIcon />
            </button>
          </div>

          <div className="mt-3 h-[10px] rounded-full bg-white/10 ring-1 ring-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F6C75A] to-[#F37120]"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-2 text-[12px] text-white/70 font-medium">
            {used} of {total} sessions
          </div>

          {/* merit tiles (taller, outlined like mock) */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <GradientOutlineCard tone="orange">
              <div className="text-[10px] text-white/60 font-semibold leading-tight">Workout Streak</div>
              <div className="mt-2 text-[26px] font-bold text-white leading-none">17</div>
              <div className="text-[14px] font-bold text-white/90">Days</div>
              <div className="mt-2 inline-flex rounded-full bg-[#F37120] px-2 py-1 text-[10px] font-semibold text-white">
                Personal Best
              </div>
            </GradientOutlineCard>

            <GradientOutlineCard tone="gold">
              <div className="text-[10px] text-white/60 font-semibold leading-tight">Bearforce Points</div>
              <div className="mt-2 text-[26px] font-bold text-white leading-none">1540</div>
              <div className="text-[14px] font-bold text-white/90">MP</div>
              <div className="mt-2 text-[10px] text-white/55">+120 this month</div>
            </GradientOutlineCard>

            <GradientOutlineCard tone="red">
              <div className="inline-flex rounded-[10px] bg-red-600/90 px-2 py-1 text-[10px] font-bold text-white">
                Prestige Member
              </div>
              <div className="mt-2 text-[22px] font-bold text-white leading-none">Season</div>
              <div className="text-[20px] font-bold text-white/90">2</div>
              <div className="mt-2 text-[10px] text-white/55">Member since 2023</div>
            </GradientOutlineCard>
          </div>
        </div>
      </div>
    </DarkCard>
  );
}
// PART 4/8
function UpcomingCard({
  title,
  branch,
  time,
  coach,
  countdown,
  tone = "orange",
}: {
  title: string;
  branch: string;
  time: string;
  coach: string;
  countdown: string;
  tone?: "orange" | "purple";
}) {
  const grad =
    tone === "orange"
      ? "from-[#7A2B12] via-[#F37120]/55 to-[#4C0F18]"
      : "from-[#2D1C5B] via-[#5C3AD6]/50 to-[#140B2B]";

  return (
    <div className="snap-center shrink-0 w-[88%] sm:w-[78%]">
      <div className="relative overflow-hidden rounded-[28px] ring-1 ring-white/10 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
        <div className={cx("absolute inset-0 bg-gradient-to-br", grad)} />
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=60"
            alt="gym"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative p-5">
          <div className="inline-flex items-center rounded-full bg-white/15 ring-1 ring-white/15 px-3 py-1 text-[11px] font-semibold text-white/95">
            Upcoming
          </div>

          <div className="mt-3 text-[26px] font-bold text-white leading-tight">{title}</div>
          <div className="mt-2 text-[12px] text-white/75 font-semibold">
            {branch} • {time}
          </div>
          <div className="text-[12px] text-white/60">{coach}</div>

          <div className="mt-6">
            <div className="text-[36px] font-bold tracking-wider text-white">{countdown}</div>
            <div className="mt-1 text-[10px] text-white/55">Hours &nbsp; Minutes &nbsp; Seconds</div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="rounded-full bg-white/90 px-4 py-2 text-[12px] font-bold text-black">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpcomingCarousel() {
  return (
    <div className="mt-4 relative -mx-4 px-4">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 pr-12 no-scrollbar">
        <UpcomingCard
          title="Weights Sessions"
          branch="Malingap Branch"
          time="6:00 - 7:00pm"
          coach="Coach Joaquin"
          countdown="09 : 25 : 26"
          tone="orange"
        />
        <UpcomingCard
          title="Cardio Session"
          branch="Malingap Branch"
          time="5:00 - 6:00pm"
          coach="Coach E.Rod"
          countdown="09 : 11 : 02"
          tone="purple"
        />
      </div>

      {/* right-side “peek” fade like app */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-[#050812] to-transparent" />
    </div>
  );
}

function ActivityRow({
  icon,
  title,
  subtitle,
  detail,
  time,
  balanceLeft,
  balanceRight,
  mode = "minus",
}: {
  icon: string;
  title: string;
  subtitle: string;
  detail: string;
  time: string;
  balanceLeft: string;
  balanceRight: string;
  mode?: "minus" | "plus";
}) {
  return (
    <div className="grid grid-cols-[1.45fr_0.9fr_0.9fr_0.7fr] gap-2 items-center rounded-[18px] bg-white/5 ring-1 ring-white/10 px-3 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-[14px] bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-[14px]">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-white/85 truncate">{title}</div>
          <div className="text-[11px] text-[#F59A3E]/90 font-semibold">{subtitle}</div>
        </div>
      </div>

      <div className="text-[11px] text-white/60 truncate">{detail}</div>
      <div className="text-[11px] text-white/55 truncate">{time}</div>

      <div className="text-right text-[14px] font-bold text-[#F59A3E]">
        {balanceLeft} <span className="text-white/35 font-semibold">{mode === "plus" ? "+" : "→"}</span> {balanceRight}
      </div>
    </div>
  );
}
// PART 5/8
function ActivityPanel() {
  const [active, setActive] = useState("Activity Log");

  const rows = useMemo(
    () => [
      {
        icon: "🏋️",
        title: "Weights Session",
        subtitle: "1 Session Used",
        detail: "Malingap",
        time: "6:00 - 7:00pm",
        left: "20",
        right: "19",
        mode: "minus" as const,
      },
      {
        icon: "🔥",
        title: "Cardio Session",
        subtitle: "1 Session Used",
        detail: "E.Rod",
        time: "1:00 - 3:00pm",
        left: "48",
        right: "47",
        mode: "minus" as const,
      },
      {
        icon: "🎁",
        title: "Package Renewal",
        subtitle: "+3 Session Added",
        detail: "Via Gcash",
        time: "₱48,600",
        left: "0",
        right: "48",
        mode: "plus" as const,
      },
      {
        icon: "⚡",
        title: "Cardio Session",
        subtitle: "1 Free Session Used",
        detail: "E.Rod",
        time: "1:00 - 3:00pm",
        left: "48",
        right: "47",
        mode: "minus" as const,
      },
    ],
    []
  );

  return (
    <DarkCard className="mt-4 p-4">
      <SectionTabs
        tabs={["Activity Log", "Points", "Payments", "Placeholder"]}
        active={active}
        onChange={setActive}
      />

      <div className="mt-3 h-px bg-white/10" />

      {/* header row like mock */}
      <div className="mt-3 grid grid-cols-[1.45fr_0.9fr_0.9fr_0.7fr] gap-2 px-2 text-[10px] font-semibold text-[#F59A3E]/80">
        <div>Transactions</div>
        <div>Details</div>
        <div>Time/Date</div>
        <div className="text-right">Balance</div>
      </div>

      <div className="mt-3 space-y-2">
        {active !== "Activity Log" ? (
          <div className="rounded-[18px] bg-white/5 ring-1 ring-white/10 p-4 text-[12px] text-white/60">
            {active} content (placeholder)
          </div>
        ) : (
          rows.map((r, i) => (
            <ActivityRow
              key={i}
              icon={r.icon}
              title={r.title}
              subtitle={r.subtitle}
              detail={r.detail}
              time={r.time}
              balanceLeft={r.left}
              balanceRight={r.right}
              mode={r.mode}
            />
          ))
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-white/45">
        <span>Total transactions</span>
        <span className="font-semibold text-white/70">506</span>
      </div>
    </DarkCard>
  );
}

function OrangeBanner() {
  return (
    <div className="mt-4 overflow-hidden rounded-[22px] bg-gradient-to-r from-[#F37120] to-[#F6C75A] ring-1 ring-[#F37120]/30 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
      <div className="relative p-5">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=60"
            alt="banner"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative">
          <div className="text-[16px] font-bold text-white">Track Your Daily Activities</div>
          <div className="mt-2 text-[12px] text-white/85">
            Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore aliqua.
          </div>
        </div>
      </div>
    </div>
  );
}
// PART 6/8
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
    <div className="fixed bottom-5 left-0 right-0 z-50 pointer-events-none">
      {/* desktop: still centered, matches phone width; mobile: full width within padding */}
      <div className="mx-auto max-w-[980px] px-4 pointer-events-auto">
        <div className="mx-auto w-full max-w-[430px]">
          <div className="rounded-[22px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] ring-1 ring-black/5 px-3 py-2">
            <div className="grid grid-cols-5 gap-1">
              {items.map((it) => {
                const on = it.key === active;
                return (
                  <button
                    key={String(it.key)}
                    onClick={() => onChange(it.key)}
                    className="relative rounded-2xl px-2 py-2 flex flex-col items-center justify-center gap-1"
                  >
                    <div
                      className={cx(
                        "relative transition-transform duration-200",
                        on ? "text-[#F37120] scale-[1.18] -translate-y-[2px]" : "text-black"
                      )}
                    >
                      {it.icon}
                      {it.badge ? <Badge value={it.badge} /> : null}
                    </div>

                    <div className={cx("text-[11px] transition", on ? "font-bold text-[#F37120]" : "font-semibold text-black")}>
                      {it.label}
                    </div>

                    {on && (
                      <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full bg-[#F37120]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Desktop shell: looks like a “desktop app view” while staying mobile-optimized */
function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pb-28">
      <div className="relative mx-auto w-full max-w-[430px]">
        {/* desktop ambient glow */}
        <div className="hidden md:block absolute -inset-10 rounded-[42px] bg-gradient-to-b from-[#6B3CE6]/10 via-[#F37120]/10 to-transparent blur-2xl" />
        <div className="relative rounded-[36px] bg-[#050812] ring-1 ring-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.75)] overflow-hidden">
          <div className="px-4 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
// PART 7/8
export default function Page() {
  const [role, setRole] = useState<Role>("member");
  const [tab, setTab] = useState<TabKey>("home");

  const userName = "Alex";
  const unreadChat = 2;

  const nav =
    role === "member"
      ? [
          { key: "home" as const, label: "Home", icon: <HomeIcon /> },
          { key: "chat" as const, label: "Chat", icon: <ChatIcon />, badge: unreadChat },
          { key: "schedule" as const, label: "Schedule", icon: <CalendarIcon /> },
          { key: "payments" as const, label: "Payment", icon: <WalletIcon /> },
          { key: "profile" as const, label: "Profile", icon: <UserIcon /> },
        ]
      : role === "staff"
      ? [
          { key: "home" as const, label: "Home", icon: <HomeIcon /> },
          { key: "attendance" as const, label: "Attend", icon: <CalendarIcon /> },
          { key: "clients" as const, label: "Clients", icon: <UserIcon /> },
          { key: "sessions" as const, label: "Sessions", icon: <ChatIcon /> },
          { key: "sales" as const, label: "Sales", icon: <WalletIcon /> },
        ]
      : [
          { key: "home" as const, label: "Home", icon: <HomeIcon /> },
          { key: "overview" as const, label: "Overview", icon: <CalendarIcon /> },
          { key: "clients" as const, label: "Clients", icon: <UserIcon /> },
          { key: "sales" as const, label: "Sales", icon: <WalletIcon /> },
          { key: "settings" as const, label: "Settings", icon: <ChatIcon /> },
        ];

  const MemberHome = (
    <>
      <TopHeader role={role} onRoleChange={(r) => { setRole(r); setTab("home"); }} />
      <WelcomeRow name={userName} onChat={() => setTab("chat")} />

      <MemberProfileCard
        avatar="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=60"
        code="M00-1"
        branch="Malingap Branch"
        packageName="Full 48 Package+"
        status="Active Member"
        used={40}
        total={48}
        onViewProfile={() => setTab("profile")}
      />

      <UpcomingCarousel />
      <ActivityPanel />
      <OrangeBanner />
    </>
  );

  const Placeholder = (title: string) => (
    <>
      <TopHeader role={role} onRoleChange={(r) => { setRole(r); setTab("home"); }} />
      <WelcomeRow name={userName} />
      <DarkCard className="mt-4 p-4">
        <div className="text-[14px] font-semibold text-white/85">{title}</div>
        <div className="mt-2 text-[12px] text-white/55">Placeholder screen.</div>
      </DarkCard>
    </>
  );

  const content =
    role === "member"
      ? tab === "home"
        ? MemberHome
        : tab === "chat"
        ? Placeholder("Chat")
        : tab === "schedule"
        ? Placeholder("Schedule")
        : tab === "payments"
        ? Placeholder("Payments")
        : Placeholder("Profile")
      : role === "staff"
      ? tab === "home"
        ? Placeholder("Staff Home")
        : Placeholder("Staff")
      : tab === "home"
      ? Placeholder("Admin Home")
      : Placeholder("Admin");// PART 8/8
  return (
    <div className={cx(poppins.variable, "min-h-screen font-sans")}>
      {/* Desktop background + mobile-friendly base */}
      <div className="min-h-screen bg-[#050812]">
        <div className="relative">
          <div className="hidden md:block absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[880px] rounded-full bg-[#6B3CE6]/20 blur-3xl" />
            <div className="absolute top-20 left-1/3 h-[360px] w-[520px] rounded-full bg-[#F37120]/15 blur-3xl" />
          </div>

          <PhoneShell>{content}</PhoneShell>
        </div>

        <BottomNav items={nav} active={tab} onChange={setTab} />
      </div>

      <style jsx global>{`
        :root {
          --font-poppins: ${poppins.style.fontFamily};
        }
        body {
          font-family: var(--font-poppins), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
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
