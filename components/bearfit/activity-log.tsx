"use client"

import { useState } from "react"
import {
  Activity,
  Award,
  CreditCard,
  Flame,
  Heart,
  RefreshCw,
  Zap,
  HelpCircle,
} from "lucide-react"

const tabs = ["Activity Log", "Points", "Payments", "Rewards"]

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

export function ActivityLog() {
  const [activeTab, setActiveTab] = useState("Activity Log")

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
                    {activity.balanceFrom}{" "}
                    {activity.isAdd ? "+" : ">"} {activity.balanceTo}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Placeholder other tabs */}
      {activeTab !== "Activity Log" && (
        <div className="p-6 text-muted-foreground text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          {activeTab} coming next…
        </div>
      )}
    </div>
  )
}
