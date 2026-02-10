"use client"

import * as React from "react"
import Image from "next/image"
import {
  Bell,
  MessageCircle,
  Home,
  Calendar,
  CreditCard,
  User,
  MoreHorizontal,
  Trophy,
  BadgeCheck,
  Target,
  Flame,
  Info,
  SlidersHorizontal,
  QrCode,
  Users,
  Dumbbell,
  Wallet,
} from "lucide-react"

/**
 * Single-file dashboard page.
 * Put this file at: app/member/dashboard/page.tsx
 *
 * Notes:
 * - Big logo (no "BEARFIT / Better fitness." text anywhere)
 * - No duplicate "Welcome, Alex"
 * - Role tabs always visible (desktop + mobile)
 * - Bottom tabs show on mobile, hidden on desktop
 */

type Role = "Member" | "Staff" | "Leads" | "Admin"
type Tab = "home" | "schedule" | "payment" | "profile" | "more"

export default function DashboardPage() {
  const [activeRole, setActiveRole] = React.useState<Role>("Member")
  const [activeTab, setActiveTab] = React.useState<Tab>("home")
  const [showChat, setShowChat] = React.useState(false)
  const [showNotifications, setShowNotifications] = React.useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* ======================
            DESKTOP SIDEBAR (LG+)
            Logo only (big) + nav
        ====================== */}
        <aside className="hidden lg:flex w-[280px] flex-col border-r border-border/40 bg-background/40 backdrop-blur-xl">
          {/* Logo block (no text) */}
          <div className="px-6 pt-7 pb-6 border-b border-border/30">
            <Image
              src="/brand/Bearfit-Logo-v2.png"
              alt="BearFit Logo"
              width={320}
              height={90}
              priority
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Role Tabs (desktop sidebar) */}
          <div className="px-5 pt-5">
            <RoleTabs activeRole={activeRole} onRoleChange={setActiveRole} />
          </div>

          {/* Nav */}
          <nav className="mt-6 px-4 space-y-2">
            <SideNavItem
              active={activeTab === "home"}
              icon={<Home className="h-5 w-5" />}
              label="Home"
              onClick={() => setActiveTab("home")}
            />
            <SideNavItem
              active={activeTab === "schedule"}
              icon={<Calendar className="h-5 w-5" />}
              label="Schedule"
              onClick={() => setActiveTab("schedule")}
            />
            <SideNavItem
              active={activeTab === "payment"}
              icon={<CreditCard className="h-5 w-5" />}
              label="Payment"
              onClick={() => setActiveTab("payment")}
            />
            <SideNavItem
              active={activeTab === "profile"}
              icon={<User className="h-5 w-5" />}
              label="Profile"
              onClick={() => setActiveTab("profile")}
            />
            <SideNavItem
              active={activeTab === "more"}
              icon={<MoreHorizontal className="h-5 w-5" />}
              label="More"
              onClick={() => setActiveTab("more")}
            />
          </nav>

          <div className="mt-auto px-4 py-5 space-y-2">
            <SideMiniAction
              icon={<Bell className="h-5 w-5" />}
              label="Notifications"
              badge="3"
              onClick={() => setShowNotifications(true)}
            />
            <SideMiniAction
              icon={<MessageCircle className="h-5 w-5" />}
              label="Messages"
              badge="2"
              onClick={() => setShowChat(true)}
            />
          </div>
        </aside>

        {/* ======================
            MAIN CONTENT
        ====================== */}
        <main className="flex-1 min-h-screen">
          {/* Top header (mobile + desktop) */}
          <header className="sticky top-0 z-30 border-b border-border/40 bg-background/50 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-4 flex items-center gap-4">
              {/* Mobile logo only (avoid duplicate with desktop sidebar) */}
              <div className="lg:hidden flex items-center">
                <Image
                  src="/brand/Bearfit-Logo-v2.png"
                  alt="BearFit Logo"
                  width={220}
                  height={60}
                  priority
                  className="h-10 w-auto object-contain"
                />
              </div>

              {/* Role tabs (always visible) */}
              <div className="flex-1 flex justify-center lg:justify-start">
                <div className="w-full max-w-[520px]">
                  <RoleTabs activeRole={activeRole} onRoleChange={setActiveRole} />
                </div>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <IconPillButton
                  onClick={() => setShowNotifications(true)}
                  ariaLabel="Notifications"
                  icon={<Bell className="h-5 w-5" />}
                  badge="3"
                />
                <IconPillButton
                  onClick={() => setShowChat(true)}
                  ariaLabel="Messages"
                  icon={<MessageCircle className="h-5 w-5" />}
                  badge="2"
                />
                <div className="hidden sm:flex h-10 w-10 rounded-full bg-secondary border border-border/40 items-center justify-center overflow-hidden">
                  <Image
                    src="/brand/bear"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-6 pb-28 lg:pb-10 space-y-6">
            {/* Single welcome line (no duplicates) */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <User className="h-5 w-5" />
              <div className="text-lg">
                <span className="text-muted-foreground">Welcome, </span>
                <span className="font-semibold text-foreground">Alex</span>
              </div>
            </div>

            {activeTab === "home" && (
              <div className="space-y-6">
                <ProfileHeroCard />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7">
                    <UpcomingSessionsCard />
                  </div>
                  <div className="lg:col-span-5">
                    <QuickActionsCard role={activeRole} />
                  </div>
                </div>

                <ActivityLogCard />
              </div>
            )}

            {activeTab === "schedule" && <Placeholder title="Schedule" icon={<Calendar className="h-5 w-5" />} />}
            {activeTab === "payment" && <Placeholder title="Payment" icon={<Wallet className="h-5 w-5" />} />}
            {activeTab === "profile" && <Placeholder title="Profile" icon={<User className="h-5 w-5" />} />}
            {activeTab === "more" && <Placeholder title="More" icon={<MoreHorizontal className="h-5 w-5" />} />}
          </div>

          {/* Bottom tabs (mobile only) */}
          <BottomTabs active={activeTab} onChange={setActiveTab} />
        </main>
      </div>

      {/* Lightweight overlays (optional) */}
      <Modal open={showChat} title="Messages" onClose={() => setShowChat(false)}>
        <div className="text-sm text-muted-foreground">
          This is a placeholder drawer/modal. Replace with your real chat panel.
        </div>
      </Modal>

      <Modal open={showNotifications} title="Notifications" onClose={() => setShowNotifications(false)}>
        <div className="space-y-3">
          <NoticeRow title="Session reminder" desc="Weights session starts in 30 minutes." />
          <NoticeRow title="Payment received" desc="Package renewal successful." />
          <NoticeRow title="New message" desc="Coach Joaquin sent you an update." />
        </div>
      </Modal>
    </div>
  )
}

/* ================================
   UI PIECES
================================ */

function RoleTabs({
  activeRole,
  onRoleChange,
}: {
  activeRole: Role
  onRoleChange: (role: Role) => void
}) {
  const roles: Role[] = ["Member", "Staff", "Leads", "Admin"]
  return (
    <div className="w-full flex flex-wrap gap-1 items-center bg-secondary rounded-xl p-1 text-xs">
      {roles.map((role) => {
        const isActive = role === activeRole
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange(role)}
            className={[
              "px-3 py-2 rounded-lg font-semibold transition flex-1 min-w-[72px]",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40",
            ].join(" ")}
          >
            {role}
          </button>
        )
      })}
    </div>
  )
}

function SideNavItem({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition",
        active
          ? "bg-primary text-primary-foreground border-primary/40"
          : "bg-transparent text-muted-foreground border-transparent hover:bg-secondary/50 hover:text-foreground",
      ].join(" ")}
    >
      <span className="opacity-90">{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  )
}

function SideMiniAction({
  icon,
  label,
  badge,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 bg-secondary/40 border border-border/40 hover:bg-secondary/60 transition"
    >
      <div className="flex items-center gap-3 text-muted-foreground">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>
      {badge ? (
        <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

function IconPillButton({
  onClick,
  ariaLabel,
  icon,
  badge,
}: {
  onClick: () => void
  ariaLabel: string
  icon: React.ReactNode
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative h-10 w-10 rounded-full bg-secondary/60 border border-border/40 hover:bg-secondary transition flex items-center justify-center"
    >
      {icon}
      {badge ? (
        <span className="absolute -top-1 -right-1 h-6 min-w-6 px-2 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-border/40 bg-secondary/20 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  )
}

function ProfileHeroCard() {
  return (
    <Card>
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
          {/* Profile image */}
          <div className="shrink-0">
            <div className="relative h-24 w-24 rounded-3xl overflow-hidden bg-secondary border border-primary/50 shadow-sm">
              <Image
                src="/brand/bear"
                alt="Alex"
                fill
                priority
                sizes="96px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-lg sm:text-xl font-semibold">Full 48 Package+</div>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active Member
              </span>
            </div>

            <div className="mt-4">
              <ProgressBar value={40} max={48} />
              <div className="mt-2 text-center text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">40</span> of{" "}
                <span className="font-semibold text-foreground">48</span> sessions
              </div>
              <div className="mt-1 text-center text-sm font-semibold text-primary">
                View Profile
              </div>
            </div>
          </div>
        </div>

        {/* Membership ID block */}
        <div className="mt-6 rounded-3xl border border-border/40 bg-background/20 p-5 sm:p-6">
          <div className="flex items-center justify-center gap-2 text-xs tracking-widest text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            MEMBERSHIP ID
          </div>
          <div className="mt-2 text-center text-3xl font-bold">M00-1</div>
          <div className="mt-1 text-center text-muted-foreground font-semibold">
            Malingap Branch
          </div>

          {/* Badge pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <BadgePill tone="gold" icon={<Trophy className="h-4 w-4" />} label="Top Member" />
            <BadgePill tone="green" icon={<BadgeCheck className="h-4 w-4" />} label="Verified" />
            <BadgePill tone="blue" icon={<Target className="h-4 w-4" />} label="On Target" />
            <BadgePill tone="orange" icon={<Flame className="h-4 w-4" />} label="On Fire" />
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile title="Workout Streak" value="17" sub="Days" chip="Personal Best" />
            <StatTile title="Bearforce Points" value="1540" sub="MP" hint="+120 this month" />
            <StatTile title="Prestige Member" value="2" sub="Season" hint="Since 2023" tone="red" />
            <StatTile title="Fitness Level" value="A+" sub="Tier" hint="Top 5%" tone="green" />
          </div>
        </div>
      </div>
    </Card>
  )
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="w-full">
      <div className="h-3 rounded-full bg-background/40 border border-border/30 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-orange-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function BadgePill({
  tone,
  icon,
  label,
}: {
  tone: "gold" | "green" | "blue" | "orange"
  icon: React.ReactNode
  label: string
}) {
  const toneClasses =
    tone === "gold"
      ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
      : tone === "green"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
      : tone === "blue"
      ? "bg-sky-500/10 text-sky-300 border-sky-500/20"
      : "bg-orange-500/10 text-orange-300 border-orange-500/20"
  return (
    <span className={["inline-flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-semibold", toneClasses].join(" ")}>
      <span className="opacity-90">{icon}</span>
      {label}
    </span>
  )
}

function StatTile({
  title,
  value,
  sub,
  hint,
  chip,
  tone,
}: {
  title: string
  value: string
  sub: string
  hint?: string
  chip?: string
  tone?: "red" | "green"
}) {
  const toneBg =
    tone === "red"
      ? "bg-red-500/15 border-red-500/20"
      : tone === "green"
      ? "bg-emerald-500/12 border-emerald-500/20"
      : "bg-secondary/40 border-border/40"
  return (
    <div className={["rounded-2xl border p-4", toneBg].join(" ")}>
      <div className="text-[11px] text-muted-foreground font-semibold">{title}</div>
      <div className="mt-2 text-2xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground font-semibold">{sub}</div>
      {chip ? (
        <div className="mt-3 inline-flex px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
          {chip}
        </div>
      ) : hint ? (
        <div className="mt-3 text-[11px] text-emerald-400 font-semibold">{hint}</div>
      ) : null}
    </div>
  )
}

function UpcomingSessionsCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Upcoming Sessions</div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-semibold">Filter</span>
        </div>
      </div>

      <Card className="relative">
        <div className="relative h-[230px] sm:h-[260px]">
          <Image
            src="/brand/bear"
            alt="Session background"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  UPCOMING
                </span>
                <div className="mt-3 text-xl font-bold">Weights Sessions</div>
                <div className="mt-1 text-sm text-muted-foreground font-semibold">
                  Malingap Branch · 6:00 - 7:00pm
                </div>
                <div className="mt-1 text-sm text-muted-foreground font-semibold">
                  Coach Joaquin
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
                >
                  <QrCode className="h-4 w-4" />
                  Check In
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/70 border border-border/40 text-foreground font-bold text-sm"
                >
                  <Info className="h-4 w-4" />
                  Details
                </button>
              </div>
            </div>

            <div className="pt-6">
              <div className="text-3xl font-bold tracking-wider tabular-nums">00 : 29 : 35</div>
              <div className="mt-2 flex items-center gap-6 text-[10px] text-muted-foreground font-semibold tracking-widest">
                <span>HOURS</span>
                <span>MINUTES</span>
                <span>SECONDS</span>
                <span className="ml-auto text-primary font-bold tracking-normal">29 min left</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-background/40 overflow-hidden border border-border/30">
                <div className="h-full w-[55%] bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function QuickActionsCard({ role }: { role: Role }) {
  return (
    <Card>
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">Quick Actions</div>
            <div className="text-sm text-muted-foreground font-semibold">
              {role === "Staff" ? "Staff tools" : role === "Leads" ? "Lead tools" : role === "Admin" ? "Admin tools" : "Member tools"}
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm"
          >
            <QrCode className="h-4 w-4" />
            Check In
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ActionTile icon={<QrCode className="h-5 w-5" />} title="Scan QR" subtitle="Fast check-in" />
          <ActionTile icon={<Calendar className="h-5 w-5" />} title="Create Session" subtitle="Add schedule slot" />
          <ActionTile icon={<Users className="h-5 w-5" />} title="Client List" subtitle="View members" />
          <ActionTile icon={<Dumbbell className="h-5 w-5" />} title="Workout Log" subtitle="Record exercises" />
        </div>

        <div className="pt-2">
          <div className="text-sm font-bold">Recent Check-ins</div>
          <div className="mt-3 space-y-2">
            <RecentRow initials="AC" name="Alex Cruz" subtitle="Full 48 Package+" time="10:02 AM" />
            <RecentRow initials="JR" name="John Reyes" subtitle="Staggered 24" time="8:05 AM" />
            <RecentRow initials="MS" name="Maria Santos" subtitle="Personal Training" time="6:00 AM" />
          </div>
        </div>
      </div>
    </Card>
  )
}

function ActionTile({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      className="rounded-2xl border border-border/40 bg-secondary/30 hover:bg-secondary/45 transition p-4 text-left"
    >
      <div className="text-primary">{icon}</div>
      <div className="mt-2 font-bold">{title}</div>
      <div className="text-sm text-muted-foreground font-semibold">{subtitle}</div>
    </button>
  )
}

function RecentRow({ initials, name, subtitle, time }: { initials: string; name: string; subtitle: string; time: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-secondary/25 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-bold truncate">{name}</div>
          <div className="text-sm text-muted-foreground font-semibold truncate">{subtitle}</div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground font-semibold shrink-0">{time}</div>
    </div>
  )
}

function ActivityLogCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Activity Log</div>
        <div className="text-sm text-muted-foreground font-semibold">Transactions</div>
      </div>

      <Card>
        <div className="px-4 sm:px-6 pt-5">
          {/* Top tabs */}
          <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <span className="text-foreground font-bold">Activity Log</span>
            <span>Points</span>
            <span>Payments</span>
            <span>Rewards</span>
          </div>
          <div className="mt-3 h-px bg-border/40" />
        </div>

        {/* Table-ish list */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-12 gap-3 pt-4 text-xs font-semibold text-muted-foreground">
            <div className="col-span-6 sm:col-span-5">Transactions</div>
            <div className="hidden sm:block sm:col-span-2">Details</div>
            <div className="hidden sm:block sm:col-span-3">Time/Date</div>
            <div className="col-span-6 sm:col-span-2 text-primary">Balance</div>
          </div>

          <div className="mt-3 space-y-2">
            <LogRow
              icon={<Dumbbell className="h-4 w-4" />}
              iconBg="bg-orange-500"
              title="Weights Session"
              sub="1 Session Used"
              details="Malingap"
              time="6:00 - 7:00pm"
              balance="20 > 19"
              balanceTone="text-orange-300"
            />
            <LogRow
              icon={<HeartIcon />}
              iconBg="bg-pink-500"
              title="Cardio Session"
              sub="1 Session Used"
              details="E.Rod"
              time="1:00 - 3:00pm"
              balance="48 > 47"
              balanceTone="text-orange-300"
            />
            <LogRow
              icon={<RefreshIcon />}
              iconBg="bg-yellow-600"
              title="Package Renewal"
              sub="+3 Session Added"
              details="Via Gcash"
              time="P48600"
              balance="0 + 48"
              balanceTone="text-emerald-400"
            />
            <LogRow
              icon={<BoltIcon />}
              iconBg="bg-yellow-500"
              title="Cardio Session"
              sub="1 Free Session Used"
              details="E.Rod"
              time="1:00 - 3:00pm"
              balance="48 > 47"
              balanceTone="text-orange-300"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

function LogRow({
  icon,
  iconBg,
  title,
  sub,
  details,
  time,
  balance,
  balanceTone,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  sub: string
  details: string
  time: string
  balance: string
  balanceTone: string
}) {
  return (
    <div className="rounded-2xl border border-border/30 bg-secondary/20 px-4 py-3 flex items-center gap-3">
      <div className={["h-11 w-11 rounded-2xl flex items-center justify-center text-white shrink-0", iconBg].join(" ")}>
        {icon}
      </div>

      <div className="flex-1 grid grid-cols-12 gap-3 items-center min-w-0">
        <div className="col-span-8 sm:col-span-5 min-w-0">
          <div className="font-bold truncate">{title}</div>
          <div className="text-sm text-primary font-semibold truncate">{sub}</div>
        </div>

        <div className="hidden sm:block sm:col-span-2 text-sm text-muted-foreground font-semibold truncate">
          {details}
        </div>
        <div className="hidden sm:block sm:col-span-3 text-sm text-muted-foreground font-semibold truncate">
          {time}
        </div>

        <div className={["col-span-4 sm:col-span-2 text-sm font-bold text-right", balanceTone].join(" ")}>
          {balance}
        </div>
      </div>
    </div>
  )
}

function BottomTabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <BottomTabButton
            active={active === "home"}
            label="Home"
            icon={<Home className="h-5 w-5" />}
            onClick={() => onChange("home")}
          />
          <BottomTabButton
            active={active === "schedule"}
            label="Schedule"
            icon={<Calendar className="h-5 w-5" />}
            onClick={() => onChange("schedule")}
          />
          <BottomTabButton
            active={active === "payment"}
            label="Payment"
            icon={<CreditCard className="h-5 w-5" />}
            onClick={() => onChange("payment")}
          />
          <BottomTabButton
            active={active === "profile"}
            label="Profile"
            icon={<User className="h-5 w-5" />}
            onClick={() => onChange("profile")}
          />
          <BottomTabButton
            active={active === "more"}
            label="More"
            icon={<MoreHorizontal className="h-5 w-5" />}
            onClick={() => onChange("more")}
          />
        </div>
      </div>
    </div>
  )
}

function BottomTabButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-2xl"
    >
      <div className={active ? "text-primary" : "text-muted-foreground"}>{icon}</div>
      <div className={["text-xs font-semibold", active ? "text-primary" : "text-muted-foreground"].join(" ")}>{label}</div>
    </button>
  )
}

function Placeholder({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <Card>
      <div className="p-6 flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <div>
          <div className="text-lg font-bold">{title}</div>
          <div className="text-sm text-muted-foreground font-semibold">
            Placeholder screen — wire this to your real route.
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ================================
   MODAL
================================ */

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-border/40 bg-background/90 backdrop-blur-xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-bold">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-secondary border border-border/40 text-sm font-bold"
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

function NoticeRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-secondary/30 p-4">
      <div className="font-bold">{title}</div>
      <div className="text-sm text-muted-foreground font-semibold">{desc}</div>
    </div>
  )
}

/* ================================
   tiny inline icons for Activity Log
================================ */

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6 9 4.6c-1.6-1.6-4.2-1.6-5.8 0s-1.6 4.2 0 5.8L12 21.2l8.8-10.8c1.6-1.6 1.6-4.2 0-5.8z" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}
