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

type MemberTab = "home" | "chat" | "schedule" | "payments" | "profile";
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
function ChevronRightIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4 9 6Z" />
    </svg>
  );
}
// PART 2/8
function Badge({ value }: { value: number }) {
  if (!value) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 shadow">
      {value}
    </span>
  );
}

function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        "rounded-[26px] bg-[#0B111D]/92 ring-1 ring-white/10 shadow-[0_18px_70px_rgba(0,0,0,0.6)] backdrop-blur",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function RoleSwitch({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const btn = (r: Role, label: string) => (
    <button
      onClick={() => onChange(r)}
      className={[
        "px-3 py-2 rounded-full text-[12px] font-semibold transition",
        role === r
          ? "bg-[#0B111D] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          : "text-white/70 hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <div className="inline-flex rounded-full bg-white/10 backdrop-blur ring-1 ring-white/10 p-1">
      {btn("member", "Member")}
      {btn("staff", "Staff")}
      {btn("admin", "Admin")}
    </div>
  );
}

function SectionHeaderDark({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-[13px] md:text-[14px] font-semibold text-white/85">{title}</div>
      {right}
    </div>
  );
}

function DesktopTabBar({
  items,
  active,
  onChange,
}: {
  items: { key: TabKey; label: string }[];
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <div className="hidden md:flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 p-1">
      {items.map((it) => {
        const on = it.key === active;
        return (
          <button
            key={String(it.key)}
            onClick={() => onChange(it.key)}
            className={[
              "px-4 py-2 rounded-full text-[12px] font-semibold transition",
              on ? "bg-white text-black shadow" : "text-white/65 hover:text-white",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function TopBar({
  role,
  onRoleChange,
  onSearch,
  desktopTabs,
  tab,
  onTab,
}: {
  role: Role;
  onRoleChange: (r: Role) => void;
  onSearch?: () => void;
  desktopTabs: { key: TabKey; label: string }[];
  tab: TabKey;
  onTab: (k: TabKey) => void;
}) {
  return (
    <div className="flex items-center justify-between pt-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#F37120]/15 ring-1 ring-[#F37120]/25 flex items-center justify-center">
          <span className="text-[#F37120] text-lg">🐻</span>
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-[#F59A3E]">BEARFIT</div>
          <div className="text-[11px] text-white/50 -mt-0.5">Member Fitness</div>
        </div>

        {/* desktop nav */}
        <div className="ml-3">
          <DesktopTabBar items={desktopTabs} active={tab} onChange={onTab} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSearch}
          className="h-10 w-10 rounded-full bg-white/5 ring-1 ring-white/10 text-white/70 flex items-center justify-center"
          aria-label="Search"
        >
          <SearchIcon />
        </button>
        <RoleSwitch role={role} onChange={onRoleChange} />
      </div>
    </div>
  );
}
// PART 3/8
function ProfileHeaderCard({
  branch,
  avatarUrl,
  packageName,
  sessionsUsed,
  sessionsTotal,
  statusText,
  onViewProfile,
}: {
  branch: string;
  avatarUrl: string;
  packageName: string;
  sessionsUsed: number;
  sessionsTotal: number;
  statusText: string;
  onViewProfile?: () => void;
}) {
  const pct = Math.max(0, Math.min(100, (sessionsUsed / Math.max(1, sessionsTotal)) * 100));

  return (
    <DarkCard className="p-4 md:p-5">
      <div className="flex items-start gap-4">
        {/* left */}
        <div className="w-[102px] shrink-0 text-center">
          <div className="mx-auto h-[76px] w-[76px] rounded-full overflow-hidden ring-2 ring-[#F59A3E]/50 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <img src={avatarUrl} alt="Member" className="h-full w-full object-cover" />
          </div>

          <div className="mt-3 text-[18px] font-bold text-white leading-none">M00-1</div>
          <div className="mt-1 text-[11px] text-white/55">{branch}</div>

          <div className="mt-2 flex items-center justify-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#F59A3E]" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
          </div>
        </div>

        {/* right */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-white/75 truncate">{packageName}</div>
              <div className="text-[11px] text-[#62D48E] font-semibold mt-0.5">{statusText}</div>
            </div>

            <button
              onClick={onViewProfile}
              className="text-[#F59A3E] text-[12px] font-semibold inline-flex items-center gap-1 shrink-0"
            >
              View Profile <ChevronRightIcon />
            </button>
          </div>

          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F6C75A] to-[#F37120]"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-2 text-[12px] text-white/70 font-medium">
            {sessionsUsed} of {sessionsTotal} sessions
          </div>

          {/* merit tiles (closer look: taller, tighter) */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-[18px] bg-white/5 ring-1 ring-[#F6C75A]/25 p-3">
              <div className="text-[10px] text-white/60 font-semibold">Workout Streak</div>
              <div className="mt-2 text-[22px] font-bold text-white leading-none">17</div>
              <div className="text-[12px] font-bold text-white/90">Days</div>
              <div className="mt-2 inline-flex items-center rounded-full bg-[#F37120] px-2 py-1 text-[10px] font-semibold text-white">
                Personal Best
              </div>
            </div>

            <div className="rounded-[18px] bg-white/5 ring-1 ring-[#F6C75A]/25 p-3">
              <div className="text-[10px] text-white/60 font-semibold">Bearforce Points</div>
              <div className="mt-2 text-[22px] font-bold text-white leading-none">1540</div>
              <div className="text-[12px] font-bold text-white/90">MP</div>
              <div className="mt-2 text-[10px] text-white/55">+120 this month</div>
            </div>

            <div className="rounded-[18px] bg-white/5 ring-1 ring-[#F37120]/35 p-3">
              <div className="inline-flex items-center rounded-[10px] bg-red-600/90 px-2 py-1 text-[10px] font-bold text-white">
                Prestige Member
              </div>
              <div className="mt-2 text-[14px] font-bold text-white/90 leading-none">Season</div>
              <div className="mt-1 text-[22px] font-bold text-white leading-none">2</div>
              <div className="mt-2 text-[10px] text-white/55">Member since 2023</div>
            </div>
          </div>
        </div>
      </div>
    </DarkCard>
  );
}

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
  coach?: string;
  countdown: string;
  tone?: "orange" | "purple";
}) {
  const grad =
    tone === "orange"
      ? "from-[#7A2B12] via-[#F37120]/60 to-[#6E2A2A]"
      : "from-[#2D1C5B] via-[#5C3AD6]/55 to-[#2B1346]";

  return (
    <div className="snap-center shrink-0 w-[86%] sm:w-[78%] md:w-full">
      <div className="relative rounded-[26px] overflow-hidden ring-1 ring-white/10 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
        <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=60"
            alt="Gym"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative p-5">
          <div className="inline-flex items-center rounded-full bg-white/15 ring-1 ring-white/15 px-3 py-1 text-[11px] font-semibold text-white/90">
            Upcoming
          </div>

          <div className="mt-3 text-[24px] md:text-[28px] leading-tight font-bold text-white">{title}</div>

          <div className="mt-2 text-[12px] text-white/70 font-medium">
            {branch} • {time}
          </div>
          {coach && <div className="text-[12px] text-white/60 mt-0.5">{coach}</div>}

          <div className="mt-6">
            <div className="text-[34px] md:text-[38px] font-bold tracking-wider text-white">{countdown}</div>
            <div className="text-[10px] text-white/55 mt-1">Hours &nbsp;&nbsp; Minutes &nbsp;&nbsp; Seconds</div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="rounded-full bg-white/90 text-black px-4 py-2 text-[12px] font-semibold">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// PART 4/8
function SegmentedTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex items-center gap-6 text-[12px] font-semibold">
      {tabs.map((t) => {
        const on = t === active;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={[
              "relative pb-2 transition",
              on ? "text-[#F59A3E]" : "text-white/55 hover:text-white/75",
            ].join(" ")}
          >
            {t}
            {on && <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-[#F59A3E] rounded-full" />}
          </button>
        );
      })}
    </div>
  );
}

function MiniRow({
  icon,
  title,
  details,
}: {
  icon: React.ReactNode;
  title: string;
  details: string;
}) {
  return (
    <div className="rounded-[18px] bg-white/5 ring-1 ring-white/10 px-4 py-3 flex items-center gap-3">
      <div className="h-9 w-9 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-white/70">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-semibold text-white/85 truncate">{title}</div>
        <div className="text-[11px] text-white/50 truncate">{details}</div>
      </div>
    </div>
  );
}

function ActivityPaymentsCard({ defaultTab = "Activity Log" }: { defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab);

  const rows = [
    {
      type: "Weights Session",
      details: "Malingap",
      time: "6:00 - 7:00pm",
      balance: (
        <span className="text-[#F59A3E] font-bold">
          20 <span className="text-white/35 font-semibold">→</span> 19
        </span>
      ),
      icon: "🏋️",
    },
    {
      type: "Cardio Session",
      details: "E.Rod",
      time: "1:00 - 3:00pm",
      balance: (
        <span className="text-[#F59A3E] font-bold">
          48 <span className="text-white/35 font-semibold">→</span> 47
        </span>
      ),
      icon: "🔥",
    },
    {
      type: "Package Renewal",
      details: "Via Gcash  ₱48,600",
      time: "",
      balance: (
        <span className="text-[#F59A3E] font-bold">
          0 <span className="text-white/35 font-semibold">+</span> 48
        </span>
      ),
      icon: "🎁",
    },
    {
      type: "Cardio Session",
      details: "E.Rod",
      time: "1:00 - 3:00pm",
      balance: (
        <span className="text-[#F59A3E] font-bold">
          48 <span className="text-white/35 font-semibold">→</span> 47
        </span>
      ),
      icon: "⚡",
    },
  ];

  return (
    <DarkCard className="p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <SegmentedTabs tabs={["Activity Log", "Points", "Payments", "Placeholder"]} active={active} onChange={setActive} />
      </div>

      <div className="mt-3 h-px bg-white/10" />

      {/* header */}
      <div className="mt-3 grid grid-cols-[1.25fr_0.9fr_0.9fr_0.75fr] gap-2 px-2 text-[10px] text-[#F59A3E]/85 font-semibold">
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
          rows.map((r, idx) => (
            <div key={idx} className="grid grid-cols-[1.25fr_0.9fr_0.9fr_0.75fr] gap-2 items-center">
              <div>
                <MiniRow icon={<span className="text-[14px]">{r.icon}</span>} title={r.type} details="1 Session Used" />
              </div>
              <div className="px-2 text-[11px] text-white/60 truncate">{r.details}</div>
              <div className="px-2 text-[11px] text-white/50 truncate">{r.time}</div>
              <div className="px-2 text-right">{r.balance}</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 text-[11px] text-white/45 flex items-center justify-between">
        <span>Total transactions</span>
        <span className="text-white/70 font-semibold">506</span>
      </div>
    </DarkCard>
  );
}

function OrangeBanner() {
  return (
    <div className="rounded-[22px] overflow-hidden ring-1 ring-[#F37120]/30 bg-gradient-to-r from-[#F37120] to-[#F6C75A] shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
      <div className="relative p-5 md:p-6">
        <div className="text-[16px] md:text-[18px] font-bold text-white">Track Your Daily Activities</div>
        <div className="mt-2 text-[12px] md:text-[13px] text-white/85 max-w-[52ch]">
          Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore aliqua.
        </div>
      </div>
    </div>
  );
}
// PART 5/8
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
    <div className="fixed bottom-5 left-0 right-0 z-50 pointer-events-none md:hidden">
      <div className="mx-auto max-w-[420px] px-4 pointer-events-auto">
        <div className="rounded-[22px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] ring-1 ring-black/5 px-3 py-2">
          <div className="grid grid-cols-5 gap-1">
            {items.map((it) => {
              const isActive = it.key === active;

              return (
                <button
                  key={String(it.key)}
                  onClick={() => onChange(it.key)}
                  className="relative rounded-2xl px-2 py-2 flex flex-col items-center justify-center gap-1 transition"
                >
                  <div
                    className={[
                      "relative transition-transform duration-200 will-change-transform",
                      isActive ? "text-[#F37120] scale-[1.18] -translate-y-[2px]" : "text-black",
                    ].join(" ")}
                  >
                    {it.icon}
                    {it.badge ? <Badge value={it.badge} /> : null}
                  </div>

                  <div className={["text-[11px] transition duration-200", isActive ? "font-bold text-[#F37120]" : "font-semibold text-black"].join(" ")}>
                    {it.label}
                  </div>

                  {isActive && <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full bg-[#F37120]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Desktop “floating rail” (matches app feel, no bottom nav on desktop) */
function DesktopDock({
  items,
  active,
  onChange,
}: {
  items: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[];
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <div className="hidden md:block fixed right-6 bottom-6 z-50">
      <div className="rounded-[22px] bg-white/10 backdrop-blur ring-1 ring-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.5)] p-2">
        <div className="flex items-center gap-2">
          {items.map((it) => {
            const on = it.key === active;
            return (
              <button
                key={String(it.key)}
                onClick={() => onChange(it.key)}
                className={[
                  "relative rounded-2xl px-3 py-2 flex items-center gap-2 transition",
                  on ? "bg-white text-black shadow" : "text-white/70 hover:text-white",
                ].join(" ")}
              >
                <span className="relative">
                  <span className={on ? "text-[#F37120]" : ""}>{it.icon}</span>
                  {it.badge ? <Badge value={it.badge} /> : null}
                </span>
                <span className="text-[12px] font-semibold">{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// PART 6/8
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

  const userName = "Alex";
  const avatarMain =
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=60";

  const unreadChat = 2;

  const memberNav = useMemo(
    () =>
      [
        { key: "home" as TabKey, label: "Home", icon: <HomeIcon /> },
        { key: "chat" as TabKey, label: "Chat", icon: <ChatIcon />, badge: unreadChat },
        { key: "schedule" as TabKey, label: "Schedule", icon: <CalendarIcon /> },
        { key: "payments" as TabKey, label: "Payment", icon: <WalletIcon /> },
        { key: "profile" as TabKey, label: "Profile", icon: <UserIcon /> },
      ] as { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[],
    [unreadChat]
  );

  const staffNav = [
    { key: "home" as TabKey, label: "Home", icon: <HomeIcon /> },
    { key: "attendance" as TabKey, label: "Attendance", icon: <CalendarIcon /> },
    { key: "clients" as TabKey, label: "Clients", icon: <UserIcon /> },
    { key: "sessions" as TabKey, label: "Sessions", icon: <ChatIcon /> },
    { key: "sales" as TabKey, label: "Sales", icon: <WalletIcon /> },
  ];

  const adminNav = [
    { key: "home" as TabKey, label: "Home", icon: <HomeIcon /> },
    { key: "overview" as TabKey, label: "Overview", icon: <CalendarIcon /> },
    { key: "clients" as TabKey, label: "Clients", icon: <UserIcon /> },
    { key: "sales" as TabKey, label: "Sales", icon: <WalletIcon /> },
    { key: "settings" as TabKey, label: "Settings", icon: <ChatIcon /> },
  ];

  const nav = role === "member" ? memberNav : role === "staff" ? staffNav : adminNav;

  const desktopTabs = nav.map((n) => ({ key: n.key, label: n.label }));
  // PART 7/8
  /* --------- Member Screens (desktop + mobile optimized) --------- */
  const MemberHome = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />

      {/* welcome line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/75">
          <span className="text-white/40">👤</span>
          <div className="text-[14px] font-semibold">
            Welcome, <span className="text-white">{userName}</span>
          </div>
        </div>
        <button className="h-10 w-10 rounded-[14px] bg-white/5 ring-1 ring-white/10 text-white/70 flex items-center justify-center">
          💬
        </button>
      </div>

      {/* Desktop layout: left column = profile card; right column = upcoming + logs + banner */}
      <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-5 md:gap-6 items-start">
        {/* LEFT */}
        <div className="space-y-5 md:sticky md:top-6">
          <ProfileHeaderCard
            branch="Malingap Branch"
            avatarUrl={avatarMain}
            packageName="Full 48 Package+"
            sessionsUsed={40}
            sessionsTotal={48}
            statusText="Active Member"
            onViewProfile={() => switchTab("profile")}
          />

          {/* On desktop, keep the orange banner under profile like mock (clean stack) */}
          <div className="hidden md:block">
            <OrangeBanner />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {/* Mobile: carousel side peek. Desktop: show just one full width card (more “desktop app”) */}
          <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 pr-10 no-scrollbar md:block md:overflow-visible md:pr-0">
              <UpcomingCard
                title="Weights Sessions"
                branch="Malingap Branch"
                time="6:00 - 7:00pm"
                coach="Coach Joaquin"
                countdown="09 : 25 : 26"
                tone="orange"
              />
              <div className="md:hidden">
                <UpcomingCard
                  title="Cardio"
                  branch="Malingap Branch"
                  time="5:00 - 6:00pm"
                  coach="Coach Amiel"
                  countdown="09 : 12 : 40"
                  tone="purple"
                />
              </div>
            </div>

            {/* mobile “peek” fade */}
            <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#060A12] to-transparent" />
          </div>

          <ActivityPaymentsCard />

          {/* Mobile: banner at bottom (like your mock). Desktop: already shown on left. */}
          <div className="md:hidden">
            <OrangeBanner />
          </div>
        </div>
      </div>
    </div>
  );

  const MemberSchedule = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />
      <DarkCard className="p-4 md:p-6">
        <SectionHeaderDark title="Schedule" right={<span className="text-[11px] text-white/50">{now.toLocaleString()}</span>} />
        <div className="mt-4 text-[12px] text-white/55">Schedule screen (placeholder)</div>
      </DarkCard>
    </div>
  );

  const MemberChat = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />
      <DarkCard className="p-4 md:p-6">
        <SectionHeaderDark title="Chat" right={<span className="text-[11px] text-white/50">Inbox</span>} />
        <div className="mt-4 space-y-2">
          <div className="rounded-[18px] bg-white/5 ring-1 ring-white/10 p-4">
            <div className="text-[12px] font-semibold text-white/85">Coach JP</div>
            <div className="mt-1 text-[11px] text-white/55">Send me your availability for this week.</div>
          </div>
          <div className="rounded-[18px] bg-white/5 ring-1 ring-white/10 p-4">
            <div className="text-[12px] font-semibold text-white/85">BearFit Support</div>
            <div className="mt-1 text-[11px] text-white/55">Your assessment is confirmed. See you!</div>
          </div>
        </div>
      </DarkCard>
    </div>
  );

  const MemberPayments = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />
      <DarkCard className="p-4 md:p-6">
        <SectionHeaderDark title="Payments" right={<span className="text-[11px] text-white/50">Billing</span>} />
        <div className="mt-4 text-[12px] text-white/55">Payments screen (placeholder)</div>
      </DarkCard>
    </div>
  );

  const MemberProfile = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />
      <DarkCard className="p-4 md:p-6">
        <SectionHeaderDark title="Profile" right={<span className="text-[11px] text-white/50">Member</span>} />
        <div className="mt-4 text-[12px] text-white/55">Profile screen (placeholder)</div>
      </DarkCard>
    </div>
  );
  // PART 7/8
  /* --------- Member Screens (desktop + mobile optimized) --------- */
  const MemberHome = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />

      {/* welcome line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/75">
          <span className="text-white/40">👤</span>
          <div className="text-[14px] font-semibold">
            Welcome, <span className="text-white">{userName}</span>
          </div>
        </div>
        <button className="h-10 w-10 rounded-[14px] bg-white/5 ring-1 ring-white/10 text-white/70 flex items-center justify-center">
          💬
        </button>
      </div>

      {/* Desktop layout: left column = profile card; right column = upcoming + logs + banner */}
      <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-5 md:gap-6 items-start">
        {/* LEFT */}
        <div className="space-y-5 md:sticky md:top-6">
          <ProfileHeaderCard
            branch="Malingap Branch"
            avatarUrl={avatarMain}
            packageName="Full 48 Package+"
            sessionsUsed={40}
            sessionsTotal={48}
            statusText="Active Member"
            onViewProfile={() => switchTab("profile")}
          />

          {/* On desktop, keep the orange banner under profile like mock (clean stack) */}
          <div className="hidden md:block">
            <OrangeBanner />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {/* Mobile: carousel side peek. Desktop: show just one full width card (more “desktop app”) */}
          <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 pr-10 no-scrollbar md:block md:overflow-visible md:pr-0">
              <UpcomingCard
                title="Weights Sessions"
                branch="Malingap Branch"
                time="6:00 - 7:00pm"
                coach="Coach Joaquin"
                countdown="09 : 25 : 26"
                tone="orange"
              />
              <div className="md:hidden">
                <UpcomingCard
                  title="Cardio"
                  branch="Malingap Branch"
                  time="5:00 - 6:00pm"
                  coach="Coach Amiel"
                  countdown="09 : 12 : 40"
                  tone="purple"
                />
              </div>
            </div>

            {/* mobile “peek” fade */}
            <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#060A12] to-transparent" />
          </div>

          <ActivityPaymentsCard />

          {/* Mobile: banner at bottom (like your mock). Desktop: already shown on left. */}
          <div className="md:hidden">
            <OrangeBanner />
          </div>
        </div>
      </div>
    </div>
  );

  const MemberSchedule = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />
      <DarkCard className="p-4 md:p-6">
        <SectionHeaderDark title="Schedule" right={<span className="text-[11px] text-white/50">{now.toLocaleString()}</span>} />
        <div className="mt-4 text-[12px] text-white/55">Schedule screen (placeholder)</div>
      </DarkCard>
    </div>
  );

  const MemberChat = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />
      <DarkCard className="p-4 md:p-6">
        <SectionHeaderDark title="Chat" right={<span className="text-[11px] text-white/50">Inbox</span>} />
        <div className="mt-4 space-y-2">
          <div className="rounded-[18px] bg-white/5 ring-1 ring-white/10 p-4">
            <div className="text-[12px] font-semibold text-white/85">Coach JP</div>
            <div className="mt-1 text-[11px] text-white/55">Send me your availability for this week.</div>
          </div>
          <div className="rounded-[18px] bg-white/5 ring-1 ring-white/10 p-4">
            <div className="text-[12px] font-semibold text-white/85">BearFit Support</div>
            <div className="mt-1 text-[11px] text-white/55">Your assessment is confirmed. See you!</div>
          </div>
        </div>
      </DarkCard>
    </div>
  );

  const MemberPayments = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />
      <DarkCard className="p-4 md:p-6">
        <SectionHeaderDark title="Payments" right={<span className="text-[11px] text-white/50">Billing</span>} />
        <div className="mt-4 text-[12px] text-white/55">Payments screen (placeholder)</div>
      </DarkCard>
    </div>
  );

  const MemberProfile = (
    <div className="space-y-5">
      <TopBar role={role} onRoleChange={onSwitchRole} onSearch={() => {}} desktopTabs={desktopTabs} tab={tab} onTab={switchTab} />
      <DarkCard className="p-4 md:p-6">
        <SectionHeaderDark title="Profile" right={<span className="text-[11px] text-white/50">Member</span>} />
        <div className="mt-4 text-[12px] text-white/55">Profile screen (placeholder)</div>
      </DarkCard>
    </div>
  );
