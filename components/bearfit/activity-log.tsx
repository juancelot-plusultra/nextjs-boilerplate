"use client"

import { InfoTooltip } from "@/components/bearfit/info-tooltip"
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
  Gift,
  CheckCircle2,
  Clock3,
} from "lucide-react"

const tabs = ["Activity Log", "Points", "Payments", "Rewards"] as const
type Tab = (typeof tabs)[number]

 const activities = [
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

type PointsEntry = {
  title: string
  subtitle: string
  amount: number
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
}

type PaymentEntry = {
  title: string
  date: string
  method?: string
  amountPhp: number
  status: "Paid" | "Pending"
}

type RewardEntry = {
  title: string
  subtitle: string
  cost: number
  available: boolean
  icon: React.ComponentType<{ className?: string }>
}

const pointsLedger: PointsEntry[] = [
  {
    title: "Workout Completed",
    subtitle: "Today",
    amount: 50,
    icon: Zap,
    iconBg: "bg-emerald-500/15",
  },
  {
    title: "7-Day Streak Bonus",
    subtitle: "Yesterday",
    amount: 100,
    icon: Flame,
    iconBg: "bg-emerald-500/15",
  },
  {
    title: "Referral Bonus",
    subtitle: "Jan 28",
    amount: 200,
    icon: Award,
    iconBg: "bg-emerald-500/15",
  },
]

const paymentHistory: PaymentEntry[] = [
  {
    title: "Monthly Package Renewal",
    date: "Feb 3, 2026",
    method: "GCash",
    amountPhp: 2500,
    status: "Paid",
  },
  {
    title: "Personal Training Session",
    date: "Feb 1, 2026",
    method: "Bank Transfer",
    amountPhp: 1500,
    status: "Paid",
  },
  {
    title: "Pending Renewal",
    date: "Feb 28, 2026",
    amountPhp: 2500,
    status: "Pending",
  },
  {
    title: "Full 48 Package+ Upgrade",
    date: "Jan 15, 2026",
    method: "Maya",
    amountPhp: 48600,
    status: "Paid",
  },
]

const rewardsCatalog: RewardEntry[] = [
  {
    title: "Free 1 Session",
    subtitle: "Redeem a bonus training session",
    cost: 500,
    available: true,
    icon: Gift,
  },
  {
    title: "10% Off Renewal",
    subtitle: "Applies to your next package renewal",
    cost: 800,
    available: true,
    icon: Award,
  },
  {
    title: "BearFit Merch",
    subtitle: "Shirt / Towel / Bottle (limited)",
    cost: 1200,
    available: false,
    icon: Heart,
  },
]

function formatPhp(n: number) {
  // simple display (matches your UI vibe)
  return `₱${n.toLocaleString("en-PH")}`
}

export function ActivityLog() {
  const [activeTab, setActiveTab] = useState<Tab>("Activity Log")
  const [showPointsInfo, setShowPointsInfo] = useState(false)

  const totalPoints = useMemo(
    () => pointsLedger.reduce((sum, x) => sum + x.amount, 0),
    []
  )

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

      {/* ✅ Points */}
      {activeTab === "Points" && (
  <div className="relative">

    {/* TOP-RIGHT ? (this is Step 2) */}
    <div className="absolute top-4 right-4 z-10">
      <InfoTooltip content="MP (Member Points) are earned through workouts, streaks, referrals, and promotions. Points reflect your engagement and progress at BearFit." />
    </div>

    {/* Existing Points UI — DO NOT REMOVE */}
    <div className="p-6">
      <p className="text-white/60 text-sm text-center">Total Points</p>
      <p className="text-center text-4xl font-bold text-[#F37120]">
        1,540 MP
      </p>

      {/* Your existing list goes here */}
    </div>

)}

    {/* Header / Total */}
    <div className="text-center">
      <p className="text-xs text-muted-foreground">Total Points</p>
      <div className="mt-2 text-[42px] sm:text-[46px] leading-none font-extrabold text-orange-500">
        {totalPoints.toLocaleString("en-US")} MP
      </div>
    </div>

    {/* Ledger list (matches screenshot rows) */}
    <div className="mt-6 space-y-3">
      {pointsLedger.map((p, i) => {
        const Icon = p.icon
        return (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl bg-black/20 border border-border/30 px-4 py-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {p.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {p.subtitle}
                </p>
              </div>
            </div>

            <div className="text-sm font-semibold text-emerald-400">
              +{p.amount}
            </div>
          </div>
        )
      })}
    </div>

    {/* Info modal */}
    {showPointsInfo && (
      <div className="fixed inset-0 z-[80]">
        <div
          className="absolute inset-0 bg-black/70"
          onClick={() => setShowPointsInfo(false)}
        />
        <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-white/10 shadow-2xl">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">MP</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Points (MP)</p>
                <p className="text-xs text-white/60">
                  How you earn & use points in BearFit
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPointsInfo(false)}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-5 space-y-4 text-sm">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="font-semibold text-white">What are MP?</p>
              <p className="mt-1 text-white/70 text-sm leading-relaxed">
                MP (Member Points) are rewards you earn by completing workouts,
                being consistent, and participating in gym activities.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="font-semibold text-white">How to earn</p>
              <ul className="mt-2 space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Workout completed: <span className="text-white/90">+50 MP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  7-day streak bonus: <span className="text-white/90">+100 MP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Referral bonus: <span className="text-white/90">+200 MP</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="font-semibold text-white">How to use</p>
              <p className="mt-1 text-white/70 text-sm leading-relaxed">
                Redeem MP for perks like free sessions, discounts, or merch.
                (You’ll see these under the <span className="text-white/90">Rewards</span> tab.)
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="font-semibold text-white">Notes</p>
              <p className="mt-1 text-white/70 text-sm leading-relaxed">
                Points are demo values for now. Once we connect Supabase, this modal
                can show your real rules per branch/package.
              </p>
            </div>
          </div>

          <div className="p-5 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowPointsInfo(false)}
              className="w-full rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold py-3 transition"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

      {/* ✅ Payments */}
      {activeTab === "Payments" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">
              Payment History
            </p>
            <p className="text-xs text-muted-foreground">
              {paymentHistory.length} transactions
            </p>
          </div>

          <div className="space-y-3">
            {paymentHistory.map((p, i) => {
              const paid = p.status === "Paid"
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl bg-black/20 border border-border/30 px-4 py-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        paid
                          ? "bg-emerald-500/15 border-emerald-500/20"
                          : "bg-yellow-500/15 border-yellow-500/20"
                      }`}
                    >
                      {paid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock3 className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.date}
                        {p.method ? ` • ${p.method}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end flex-col gap-1">
                    <div
                      className={`text-sm font-semibold ${
                        paid ? "text-emerald-400" : "text-yellow-400"
                      }`}
                    >
                      {formatPhp(p.amountPhp)}
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        paid
                          ? "text-emerald-300 border-emerald-500/20 bg-emerald-500/10"
                          : "text-yellow-300 border-yellow-500/20 bg-yellow-500/10"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ✅ Rewards */}
      {activeTab === "Rewards" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">Rewards</p>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Award className="w-4 h-4" />
              Redeem using MP
            </div>
          </div>

          <div className="space-y-3">
            {rewardsCatalog.map((r, i) => {
              const Icon = r.icon
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl bg-black/20 border border-border/30 px-4 py-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-border/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {r.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end flex-col gap-2">
                    <div className="text-sm font-semibold text-orange-400">
                      {r.cost} MP
                    </div>
                    <button
                      type="button"
                      disabled={!r.available}
                      className={`text-[11px] px-3 py-1 rounded-full border transition ${
                        r.available
                          ? "text-white border-white/15 bg-white/10 hover:bg-white/15"
                          : "text-white/40 border-white/10 bg-white/5 cursor-not-allowed"
                      }`}
                    >
                      {r.available ? "Redeem" : "Unavailable"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* If you still want the old "Coming Soon" style, keep this block instead of the catalog above */}
          {/* <div className="mt-6 rounded-2xl bg-black/20 border border-border/30 p-8 text-center text-muted-foreground">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/5 border border-border/30 flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-white/60" />
            </div>
            <p className="text-sm font-semibold text-foreground">Coming Soon</p>
            <p className="text-xs text-muted-foreground mt-1">
              Rewards redemption feature is on the way!
            </p>
          </div> */}
        </div>
      )}

      {/* Safety fallback (should never show) */}
      {!tabs.includes(activeTab) && (
        <div className="p-6 text-muted-foreground text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Tab coming next…
        </div>
      )}
    </div>
  )
}
