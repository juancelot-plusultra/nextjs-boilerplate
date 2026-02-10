"use client"

import { useMemo, useState } from "react"
import {
  Activity,
  Award,
  CreditCard,
  Flame,
  Heart,
  RefreshCw,
  Zap,
  HelpCircle,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react"

const tabs = ["Activity Log", "Points", "Payments", "Rewards"] as const
type Tab = (typeof tabs)[number]

type ActivityRow = {
  title: string
  subtitle: string
  subtitleColor: string
  details: string
  time: string
  balanceFrom: number
  balanceTo: number
  balanceColor: string
  icon: any
  iconBg: string
  isAdd: boolean
}

const activities: ActivityRow[] = [
  {
    title: "Weights Session",
    subtitle: "1 Session Used",
    subtitleColor: "text-orange-500",
    details: "Malingap",
    time: "6:00 - 7:00pm",
    balanceFrom: 20,
    balanceTo: 19,
    balanceColor: "text-orange-500",
    icon: Activity,
    iconBg: "bg-orange-500",
    isAdd: false,
  },
  {
    title: "Cardio Session",
    subtitle: "1 Session Used",
    subtitleColor: "text-orange-500",
    details: "E.Rod",
    time: "1:00 - 3:00pm",
    balanceFrom: 48,
    balanceTo: 47,
    balanceColor: "text-orange-500",
    icon: Heart,
    iconBg: "bg-pink-500",
    isAdd: false,
  },
  {
    title: "Package Renewal",
    subtitle: "+3 Session Added",
    subtitleColor: "text-green-500",
    details: "Via Gcash",
    time: "₱48600",
    balanceFrom: 0,
    balanceTo: 48,
    balanceColor: "text-green-500",
    icon: RefreshCw,
    iconBg: "bg-yellow-600",
    isAdd: true,
  },
  {
    title: "Cardio Session",
    subtitle: "1 Free Session Used",
    subtitleColor: "text-orange-500",
    details: "E.Rod",
    time: "1:00 - 3:00pm",
    balanceFrom: 48,
    balanceTo: 47,
    balanceColor: "text-orange-500",
    icon: Zap,
    iconBg: "bg-yellow-500",
    isAdd: false,
  },
]

type PointsRow = {
  id: string
  title: string
  subtitle: string
  dateLabel: string
  points: number
  icon: any
  iconBg: string
  detail: string
}

type PaymentRow = {
  id: string
  title: string
  subtitle: string
  amount: string
  status: "Paid" | "Pending"
  statusColor: string
  icon: any
  iconBg: string
  detail: string
}

export function ActivityLog() {
  const [activeTab, setActiveTab] = useState<Tab>("Activity Log")

  // Info modal: supports top-right (?) and per-row (?) details
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoTitle, setInfoTitle] = useState("")
  const [infoBody, setInfoBody] = useState("")

  const openInfo = (title: string, body: string) => {
    setInfoTitle(title)
    setInfoBody(body)
    setInfoOpen(true)
  }

  const pointsRows: PointsRow[] = useMemo(
    () => [
      {
        id: "p1",
        title: "Workout Completed",
        subtitle: "Today",
        dateLabel: "Today",
        points: 50,
        icon: Zap,
        iconBg: "bg-emerald-600",
        detail:
          "Awarded for completing a tracked workout session. Points are added after the session is marked complete.",
      },
      {
        id: "p2",
        title: "7-Day Streak Bonus",
        subtitle: "Yesterday",
        dateLabel: "Yesterday",
        points: 110,
        icon: Flame,
        iconBg: "bg-amber-600",
        detail:
          "Streak bonus for maintaining consistent attendance. Streak resets if no logged activity occurs within the streak window.",
      },
      {
        id: "p3",
        title: "Referral Bonus",
        subtitle: "Jan 28",
        dateLabel: "Jan 28",
        points: 200,
        icon: Award,
        iconBg: "bg-sky-600",
        detail:
          "Referral bonus granted after the referred member completes their first confirmed session/package.",
      },
    ],
    []
  )

  const totalPoints = useMemo(
    () => pointsRows.reduce((sum, r) => sum + r.points, 0),
    [pointsRows]
  )

  const paymentsRows: PaymentRow[] = useMemo(
    () => [
      {
        id: "pay1",
        title: "Monthly Package Renewal",
        subtitle: "Feb 3, 2026  •  GCash",
        amount: "₱2,500",
        status: "Paid",
        statusColor: "text-emerald-400",
        icon: CheckCircle2,
        iconBg: "bg-emerald-700/40",
        detail:
          "Renewal payment confirmed. Package sessions were added to your balance.",
      },
      {
        id: "pay2",
        title: "Personal Training Session",
        subtitle: "Feb 1, 2026  •  Bank Transfer",
        amount: "₱1,500",
        status: "Paid",
        statusColor: "text-emerald-400",
        icon: CheckCircle2,
        iconBg: "bg-emerald-700/40",
        detail:
          "Single-session payment confirmed. Session can be scheduled anytime within gym hours.",
      },
      {
        id: "pay3",
        title: "Pending Renewal",
        subtitle: "Feb 28, 2026",
        amount: "₱2,500",
        status: "Pending",
        statusColor: "text-amber-300",
        icon: Clock3,
        iconBg: "bg-amber-700/35",
        detail:
          "Pending means we haven't confirmed the payment yet. If you already paid, please wait for verification or message the staff.",
      },
      {
        id: "pay4",
        title: "Full 48 Package+ Upgrade",
        subtitle: "Jan 15, 2026  •  Maya",
        amount: "₱48,600",
        status: "Paid",
        statusColor: "text-emerald-400",
        icon: CheckCircle2,
        iconBg: "bg-emerald-700/40",
        detail:
          "Upgrade confirmed. Your membership package was updated and sessions reflected in your account.",
      },
    ],
    []
  )

  const paymentsCount = paymentsRows.length

  return (
    <div className="mt-4 mx-4 bg-[#1a1a1a] rounded-2xl overflow-hidden border border-border/50">
      {/* ✅ Tabs (Evenly Spread) */}
      <div className="grid grid-cols-4 border-b border-border/50">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-4 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? "text-white"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ✅ Activity Log Table */}
      {activeTab === "Activity Log" && (
        <div className="overflow-x-auto">
          {/* HEADER */}
          <div className="min-w-[720px] lg:min-w-0 w-full grid grid-cols-12 px-6 py-3 text-[11px] border-b border-border/30">
            <span className="col-span-6 text-primary font-semibold">
              Transactions
            </span>
            <span className="col-span-2 text-muted-foreground text-center">
              Details
            </span>
            <span className="col-span-2 text-muted-foreground text-center">
              Time/Date
            </span>
            <span className="col-span-2 text-primary font-semibold text-right">
              Balance
            </span>
          </div>

          {/* ROWS */}
          <div className="divide-y divide-border/20">
            {activities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div
                  key={index}
                  className="min-w-[720px] lg:min-w-0 w-full grid grid-cols-12 items-center gap-3 px-6 py-4"
                >
                  {/* Transaction */}
                  <div className="col-span-6 flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl ${activity.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {activity.title}
                      </p>
                      <p className={`text-xs ${activity.subtitleColor}`}>
                        {activity.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="col-span-2 text-xs text-muted-foreground text-center">
                    {activity.details}
                  </div>

                  {/* Time */}
                  <div className="col-span-2 text-xs text-muted-foreground text-center">
                    {activity.time}
                  </div>

                  {/* Balance */}
                  <div
                    className={`col-span-2 text-sm font-semibold ${activity.balanceColor} text-right`}
                  >
                    {activity.balanceFrom} {activity.isAdd ? "+" : ">"}{" "}
                    {activity.balanceTo}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ✅ Points (like your screenshot) */}
      {activeTab === "Points" && (
        <div className="relative p-6">
          {/* Floating (?) top-right */}
          <button
            type="button"
            onClick={() =>
              openInfo(
                "Points (MP)",
                "MP = Member Points. You earn points from workouts, streaks, and promos. Points can later be used for rewards and perks."
              )
            }
            className="absolute right-5 top-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
            aria-label="Points info"
          >
            <HelpCircle className="w-5 h-5 text-white/70" />
          </button>

          {/* Header / Total */}
          <div className="text-center">
            <div className="text-xs text-white/60">Total Points</div>
            <div className="mt-1 text-4xl font-extrabold text-[#F37120] tracking-tight">
              {totalPoints.toLocaleString()} MP
            </div>
          </div>

          {/* List */}
          <div className="mt-6 space-y-3">
            {pointsRows.map((row) => {
              const Icon = row.icon
              return (
                <div
                  key={row.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-4"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl ${row.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white truncate">
                      {row.title}
                    </div>
                    <div className="text-xs text-white/60">{row.subtitle}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-emerald-400">
                      +{row.points}
                    </div>

                    {/* Row (?) on the right like your screenshot */}
                    <button
                      type="button"
                      onClick={() => openInfo(row.title, row.detail)}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
                      aria-label={`${row.title} info`}
                    >
                      <HelpCircle className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ✅ Payments (like your screenshot) */}
      {activeTab === "Payments" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-base font-semibold text-white">
                Payment History
              </div>
            </div>
            <div className="text-xs text-white/60">{paymentsCount} transactions</div>
          </div>

          <div className="space-y-3">
            {paymentsRows.map((row) => {
              const Icon = row.icon
              return (
                <div
                  key={row.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-4"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl ${row.iconBg} flex items-center justify-center shrink-0 border border-white/10`}
                  >
                    <Icon className="w-5 h-5 text-white/80" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white truncate">
                      {row.title}
                    </div>
                    <div className="text-xs text-white/60">{row.subtitle}</div>
                  </div>

                  <div className="text-right">
                    <div className={`text-sm font-semibold ${row.statusColor}`}>
                      {row.amount}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 justify-end">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full border border-white/10 ${
                          row.status === "Paid"
                            ? "bg-emerald-700/20 text-emerald-300"
                            : "bg-amber-700/20 text-amber-200"
                        }`}
                      >
                        {row.status}
                      </span>

                      {/* Row (?) */}
                      <button
                        type="button"
                        onClick={() => openInfo(row.title, row.detail)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
                        aria-label={`${row.title} info`}
                      >
                        <HelpCircle className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ✅ Rewards (keep “Coming Soon” like your screenshot) */}
      {activeTab === "Rewards" && (
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Zap className="w-7 h-7 text-white/60" />
          </div>
          <div className="mt-3 text-base font-semibold text-white/80">
            Coming Soon
          </div>
          <div className="mt-1 text-sm text-white/50">
            Rewards redemption feature is on the way!
          </div>
        </div>
      )}

      {/* ✅ Info Modal */}
      {infoOpen && (
        <div className="fixed inset-0 z-[80]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setInfoOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-base font-semibold text-white truncate">
                  {infoTitle}
                </div>
                <div className="mt-2 text-sm text-white/70 leading-relaxed">
                  {infoBody}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-sm font-semibold text-white"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
