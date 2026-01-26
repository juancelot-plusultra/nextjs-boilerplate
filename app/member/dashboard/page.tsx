"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * /app/member/dashboard/page.tsx
 * Member Home (UI-only, "app feel")
 *
 * Includes 1–7 in one file:
 * 1) Polished header (avatar, greeting, live time, quick icons)
 * 2) Announcement blocks (carousel)
 * 3) Live time/date (updates while page is active)
 * 4) Weekly calendar strip (tap day)
 * 5) Upcoming cards (title, location, time, time-left, Manage)
 * 6) Quick actions grid
 * 7) Mini summary (package, sessions left, balance)
 *
 * NOTE: No backend wiring yet (all demo data).
 */

type Announcement = {
  id: string;
  title: string;
  body: string;
  tag?: string;
};

type UpcomingItem = {
  id: string;
  title: string;
  location: string;
  start: Date;
  durationMins: number;
  coach?: string;
};

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

function monthsLabel(m: number) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m] ?? "";
}

function formatClock(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const hour12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour12}:${m} ${ampm}`;
}

function formatDateLong(d: Date) {
  return `${monthsLabel(d.getMonth())} ${d.getDate()}, ${d.getFullYear()}`;
}

function diffToHuman(ms: number) {
  if (ms <= 0) return "Now";
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours < 24) return rem ? `${hours}h ${rem}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const hRem = hours % 24;
  return hRem ? `${days}d ${hRem}h` : `${days}d`;
}

function iconBase(cls = "") {
  return `h-6 w-6 ${cls}`;
}

/* ---------------- Icons (inline) ---------------- */
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
function SearchIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 2a8 8 0 1 0 5.3 14l4.2 4.2 1.4-1.4-4.2-4.2A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"
      />
    </svg>
  );
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
function BoltIcon() {
  return (
    <svg className={iconBase()} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M13 2 3 14h7l-1 8 12-15h-7l-1-5Z" />
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
function ChevronRight() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9 18 15 12 9 6l1.4-1.4L18.8 12l-8.4 7.4L9 18Z" />
    </svg>
  );
}

/* ---------------- UI primitives ---------------- */
function Card({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl bg-white/70 backdrop-blur shadow-sm ring-1 ring-black/5 p-5 ${className}`}>
      {(title || subtitle || right) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <div className="text-lg font-bold">{title}</div>}
            {subtitle && <div className="mt-1 text-black/50 text-sm">{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      <div className={title || subtitle || right ? "mt-4" : ""}>{children}</div>
    </div>
  );
}

function Pill({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "orange" | "soft";
}) {
  const cls =
    tone === "orange"
      ? "bg-[#F37120] text-white"
      : tone === "soft"
      ? "bg-black/5 text-black/70"
      : "bg-[#0b1220] text-white";
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
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

/* ---------------- Page ---------------- */
export default function MemberDashboardHomePage() {
  // 3) Live time/date: updates while tab is visible (reduces CPU in background)
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    let timer: number | null = null;

    const start = () => {
      stop();
      timer = window.setInterval(() => setNow(new Date()), 1000);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const onVis = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const userName = "John";
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  // 4) Week strip
  const monday = useMemo(() => startOfWeekMonday(now), [now]);
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [monday]);

  const todayIdxMon0 = (() => {
    const js = now.getDay(); // Sun=0
    return js === 0 ? 6 : js - 1;
  })();

  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(todayIdxMon0);
  useEffect(() => setSelectedDayIdx(todayIdxMon0), [todayIdxMon0]);

  // 2) Announcements carousel (UI only)
  const announcements: Announcement[] = useMemo(
    () => [
      {
        id: "a1",
        tag: "Promo",
        title: "Bring a friend week",
        body: "Free assessment for your +1 when you book this week.",
      },
      {
        id: "a2",
        tag: "Update",
        title: "New schedule slots",
        body: "More evening sessions added for Sikatuna branch.",
      },
      {
        id: "a3",
        tag: "Reminder",
        title: "Hydration challenge",
        body: "Log your water intake daily. Small wins add up.",
      },
    ],
    []
  );

  // 1) "Restart slideshow after idle"
  const [annIdx, setAnnIdx] = useState(0);
  const lastInteractRef = useRef<number>(Date.now());
  useEffect(() => {
    const onInteract = () => {
      lastInteractRef.current = Date.now();
    };
    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("keydown", onInteract);

    const tick = window.setInterval(() => {
      const idleMs = Date.now() - lastInteractRef.current;
      // if idle for 10s, auto-advance every 4s
      if (idleMs >= 10000) {
        setAnnIdx((p) => (p + 1) % announcements.length);
      }
    }, 4000);

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.clearInterval(tick);
    };
  }, [announcements.length]);

  // 5) Upcoming card list (demo)
  const upcoming: UpcomingItem[] = useMemo(() => {
    const base = new Date(now);
    const mk = (addDays: number, hh: number, mm: number, title: string, location: string): UpcomingItem => {
      const d = new Date(base);
      d.setDate(base.getDate() + addDays);
      d.setHours(hh, mm, 0, 0);
      return { id: `${addDays}-${hh}${mm}`, title, location, start: d, durationMins: 60, coach: "Coach JP" };
    };
    return [
      mk(0, 18, 0, "Coach Session", "Sikatuna"),
      mk(2, 19, 0, "Strength Training", "E. Rodriguez"),
      mk(5, 9, 0, "Mobility / Form", "Cainta"),
    ];
  }, [now]);

  // Filter for selected day
  const selectedDate = weekDays[selectedDayIdx];
  const dayStart = new Date(selectedDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(selectedDate);
  dayEnd.setHours(23, 59, 59, 999);
  const upcomingForDay = upcoming.filter((u) => u.start >= dayStart && u.start <= dayEnd);

  // 6/7) Summary demo
  const packageName = "24 Sessions (Staggered)";
  const sessionsLeft = 9;
  const balancePhp = 980;

  // Badges demo
  const notifCount = 2;
  const unreadChat = 3;

  return (
    <div className="min-h-screen bg-[#eef3fb] text-[#0b1220]">
      <div className="mx-auto w-full max-w-[1100px] px-5 pt-6 pb-28">
        {/* 1) Polished header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center">
              <span className="text-sm font-bold text-black/60">JP</span>
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="min-w-0">
              <div className="text-sm text-black/50">{greeting}</div>
              <div className="text-xl font-extrabold truncate">{userName}</div>
              <div className="text-xs text-black/45 mt-0.5 truncate">
                {formatDateLong(now)} • {formatClock(now)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="relative h-11 w-11 rounded-2xl bg-white/75 backdrop-blur shadow-sm ring-1 ring-black/5 flex items-center justify-center"
              aria-label="Notifications"
            >
              <BellIcon />
              <Badge value={notifCount} color="red" />
            </button>

            <button
              className="h-11 px-4 rounded-2xl bg-[#0b1220] text-white font-semibold flex items-center gap-2 shadow-sm"
              aria-label="Quick action"
            >
              <BoltIcon />
              <span className="hidden sm:inline">Quick</span>
            </button>
          </div>
        </div>

        {/* Search bar (adds app-feel) */}
        <div className="mt-5">
          <div className="rounded-3xl bg-white/70 backdrop-blur ring-1 ring-black/5 shadow-sm px-4 py-3 flex items-center gap-3">
            <div className="text-black/50">
              <SearchIcon />
            </div>
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Search (sessions, coaches, payments)…"
            />
            <Pill tone="soft">Member</Pill>
          </div>
        </div>

        {/* 2) Announcements */}
        <div className="mt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-black/50">Updates</div>
              <div className="text-2xl font-extrabold">Announcements</div>
            </div>
            <div className="flex gap-1">
              {announcements.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => {
                    lastInteractRef.current = Date.now();
                    setAnnIdx(i);
                  }}
                  className={[
                    "h-2.5 w-2.5 rounded-full transition",
                    i === annIdx ? "bg-[#F37120]" : "bg-black/10 hover:bg-black/20",
                  ].join(" ")}
                  aria-label={`Announcement ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <AnnouncementCard a={announcements[annIdx]} />
          </div>
        </div>

        {/* 4) Week strip */}
        <div className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-black/50">Plan</div>
              <div className="text-2xl font-extrabold">Calendar</div>
            </div>
            <button className="text-sm font-semibold text-black/60 hover:text-black/80 inline-flex items-center gap-2">
              <span>Open</span>
              <ChevronRight />
            </button>
          </div>

          <Card className="mt-4">
            <div className="grid grid-cols-7 gap-2 text-center">
              {weekDays.map((d, i) => {
                const isToday = i === todayIdxMon0;
                const isSel = i === selectedDayIdx;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDayIdx(i)}
                    className={[
                      "rounded-2xl py-3 transition ring-1 ring-black/5",
                      isSel ? "bg-[#0b1220] text-white shadow-sm" : "bg-white hover:bg-black/[0.02]",
                    ].join(" ")}
                    aria-label={`Select ${dayLabel(i)}`}
                  >
                    <div className={isSel ? "text-white/80 text-xs" : "text-black/50 text-xs"}>{dayLabel(i)}</div>
                    <div className={["mt-1 text-lg font-extrabold", isSel ? "text-white" : "text-black/80"].join(" ")}>
                      {d.getDate()}
                    </div>
                    <div
                      className={[
                        "mx-auto mt-2 h-1.5 w-10 rounded-full",
                        isToday ? "bg-[#F37120]" : "bg-black/5",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* 5) Upcoming (matches your screenshot style: title/location/time-left/manage) */}
        <div className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-black/50">Next</div>
              <div className="text-2xl font-extrabold">Upcoming</div>
            </div>
            <Pill tone="soft">{dayLabel(selectedDayIdx)} • {monthsLabel(selectedDate.getMonth())} {selectedDate.getDate()}</Pill>
          </div>

          <div className="mt-4 space-y-3">
            {upcomingForDay.length === 0 ? (
              <Card>
                <div className="text-black/55">
                  No sessions for this day yet.
                  <button className="ml-2 font-semibold text-[#F37120] hover:underline">Book now</button>
                </div>
              </Card>
            ) : (
              upcomingForDay.map((u) => {
                const msLeft = u.start.getTime() - now.getTime();
                const timeLeft = diffToHuman(msLeft);
                return (
                  <div key={u.id} className="rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-extrabold truncate">{u.title}</div>
                          <Pill tone="orange">{timeLeft}</Pill>
                        </div>
                        <div className="mt-1 text-sm text-black/55 truncate">
                          {u.location} • {formatClock(u.start)} • {u.durationMins} mins
                        </div>
                        <div className="mt-1 text-xs text-black/45 truncate">
                          Coach: {u.coach ?? "TBA"}
                        </div>
                      </div>

                      <button className="shrink-0 rounded-2xl bg-black/5 hover:bg-black/10 px-4 py-3 font-semibold text-black/70 inline-flex items-center gap-2">
                        <span>Manage</span>
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 6) Quick actions */}
        <div className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-black/50">Shortcuts</div>
              <div className="text-2xl font-extrabold">Quick Actions</div>
            </div>
            <Pill tone="soft">Unread {unreadChat}</Pill>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickTile icon={<CalendarIcon />} title="Book" subtitle="Schedule" />
            <QuickTile icon={<WalletIcon />} title="Pay" subtitle="Balance" badge={balancePhp > 0 ? 1 : 0} />
            <QuickTile icon={<ChatIcon />} title="Chat" subtitle="Coach" badge={unreadChat} badgeColor="red" />
            <QuickTile icon={<BoltIcon />} title="Check-in" subtitle="QR" />
          </div>
        </div>

        {/* 7) Summary */}
        <div className="mt-7">
          <Card title="Today summary" subtitle="Membership at a glance" right={<Pill tone="soft">Active</Pill>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SummaryStat label="Package" value={packageName} />
              <SummaryStat label="Sessions left" value={String(sessionsLeft)} />
              <SummaryStat label="Balance" value={`PHP ${balancePhp}`} />
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky bottom app bar (pure UI; safe to keep/remove) */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto w-full max-w-[1100px] px-5 pb-4">
          <div className="rounded-3xl bg-white/80 backdrop-blur shadow-sm ring-1 ring-black/5 px-3 py-2">
            <div className="grid grid-cols-4 gap-2">
              <BottomBtn label="Home" active />
              <BottomBtn label="Schedule" />
              <BottomBtn label="Chat" badge={unreadChat} badgeColor="red" />
              <BottomBtn label="Pay" badge={balancePhp > 0 ? 1 : 0} />
            </div>
          </div>
        </div>
      </div>

      {/* App-like micro animations */}
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .bf-fadein {
            animation: bfFadeIn 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          @keyframes bfFadeIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );
}

/* ---------------- Components ---------------- */
function AnnouncementCard({ a }: { a: Announcement }) {
  return (
    <div className="rounded-3xl overflow-hidden ring-1 ring-black/5 shadow-sm bg-white/70 backdrop-blur">
      {/* Image placeholder (replace with your Image component later) */}
      <div className="h-28 bg-gradient-to-r from-[#0b1220] via-[#1b2a4a] to-[#F37120]" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-black/50">{a.tag ?? "Announcement"}</div>
            <div className="text-lg font-extrabold truncate">{a.title}</div>
          </div>
          <Pill tone="soft">New</Pill>
        </div>
        <div className="mt-2 text-sm text-black/60 leading-relaxed">{a.body}</div>

        <button className="mt-4 w-full rounded-2xl bg-black/5 hover:bg-black/10 py-3 font-semibold text-black/70 inline-flex items-center justify-center gap-2">
          <span>View details</span>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

function QuickTile({
  icon,
  title,
  subtitle,
  badge = 0,
  badgeColor = "orange",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: number;
  badgeColor?: "orange" | "red" | "blue";
}) {
  return (
    <button className="relative rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow-sm p-4 text-left hover:bg-white">
      <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black/70">
        {icon}
        <Badge value={badge} color={badgeColor} />
      </div>
      <div className="mt-3">
        <div className="font-extrabold">{title}</div>
        <div className="text-sm text-black/50">{subtitle}</div>
      </div>
    </button>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-4">
      <div className="text-xs text-black/50">{label}</div>
      <div className="mt-1 font-extrabold text-black/80 truncate">{value}</div>
    </div>
  );
}

function BottomBtn({
  label,
  active = false,
  badge = 0,
  badgeColor = "orange",
}: {
  label: string;
  active?: boolean;
  badge?: number;
  badgeColor?: "orange" | "red" | "blue";
}) {
  return (
    <button
      className={[
        "relative rounded-2xl py-2 text-sm font-semibold transition",
        active ? "bg-[#F37120] text-white shadow-sm" : "text-black/60 hover:bg-black/5",
      ].join(" ")}
    >
      {label}
      <Badge value={badge} color={badgeColor} />
    </button>
  );
}
