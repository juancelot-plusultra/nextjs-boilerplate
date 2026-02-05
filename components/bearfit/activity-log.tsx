"use client"

import { useState } from "react"
import { Dumbbell, Heart, RefreshCw, Zap, HelpCircle, X, CheckCircle, AlertCircle } from "lucide-react"

const tabs = ["Activity Log", "Points", "Payments", "Rewards"]

const activities = [
  {
    icon: Dumbbell,
    iconBg: "bg-primary",
    title: "Weights Session",
    subtitle: "1 Session Used",
    subtitleColor: "text-primary",
    details: "Malingap",
    time: "6:00 - 7:00pm",
    balanceFrom: "20",
    balanceTo: "19",
    balanceColor: "text-primary",
  },
  {
    icon: Heart,
    iconBg: "bg-pink-500",
    title: "Cardio Session",
    subtitle: "1 Session Used",
    subtitleColor: "text-primary",
    details: "E.Rod",
    time: "1:00 - 3:00pm",
    balanceFrom: "48",
    balanceTo: "47",
    balanceColor: "text-primary",
  },
  {
    icon: RefreshCw,
    iconBg: "bg-yellow-600",
    iconColor: "text-white",
    title: "Package Renewal",
    subtitle: "+3 Session Added",
    subtitleColor: "text-green-500",
    details: "Via Gcash",
    time: "P48600",
    balanceFrom: "0",
    balanceTo: "48",
    balanceColor: "text-green-500",
    isAdd: true,
  },
  {
    icon: Zap,
    iconBg: "bg-yellow-500",
    title: "Cardio Session",
    subtitle: "1 Free Session Used",
    subtitleColor: "text-primary",
    details: "E.Rod",
    time: "1:00 - 3:00pm",
    balanceFrom: "48",
    balanceTo: "47",
    balanceColor: "text-primary",
  },
]

const pointsData = [
  { action: "Workout Completed", points: "+50", date: "Today", description: "Earned for completing a full workout session" },
  { action: "7-Day Streak Bonus", points: "+100", date: "Yesterday", description: "Bonus for maintaining a 7-day workout streak" },
  { action: "Referral Bonus", points: "+200", date: "Jan 28", description: "Reward for referring a new member" },
  { action: "Challenge Won", points: "+150", date: "Jan 25", description: "Won the weekly fitness challenge" },
]

const paymentHistory = [
  { description: "Monthly Package Renewal", amount: "P2,500", date: "Feb 3, 2026", status: "completed", method: "GCash" },
  { description: "Personal Training Session", amount: "P1,500", date: "Feb 1, 2026", status: "completed", method: "Bank Transfer" },
  { description: "Pending Renewal", amount: "P2,500", date: "Feb 28, 2026", status: "pending", method: "-" },
  { description: "Full 48 Package+ Upgrade", amount: "P48,600", date: "Jan 15, 2026", status: "completed", method: "Maya" },
]

const pointsInfo = {
  title: "How Points Work",
  description: "Member Points (MP) are earned through various activities at BearFit. You can earn points by completing workouts (+50 MP), maintaining streaks (+100 MP), referring friends (+200 MP), and winning challenges. Points can be redeemed for rewards, discounts, and exclusive perks!"
}

export function ActivityLog() {
  const [activeTab, setActiveTab] = useState("Activity Log")
  const [showPointsInfo, setShowPointsInfo] = useState(false)
  const [selectedPointItem, setSelectedPointItem] = useState<typeof pointsData[0] | null>(null)

  return (
    <div className="mt-4 mx-4 bg-[#1a1a1a] rounded-2xl overflow-hidden border border-border/50">
      {/* Tabs */}
      <div className="flex border-b border-border/50 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-max py-2.5 px-3 text-xs font-medium transition-all touch-active whitespace-nowrap ${
              activeTab === tab
                ? "text-foreground border-b-2 border-foreground -mb-[1px]"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Activity Log" && (
        <>
          {/* Table Header - Scrollable */}
          <div className="overflow-x-auto hide-scrollbar">
            <div className="min-w-[400px] flex items-center px-3 py-2 text-[10px] border-b border-border/30">
              <span className="text-primary font-medium w-[160px] shrink-0">Transactions</span>
              <span className="text-muted-foreground w-[80px] text-center shrink-0">Details</span>
              <span className="text-muted-foreground w-[90px] text-center shrink-0">Time/Date</span>
              <span className="text-primary font-medium w-[70px] text-right shrink-0">Balance</span>
            </div>

            {/* Activity Items */}
            <div className="divide-y divide-border/20">
              {activities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="min-w-[400px] flex items-center px-3 py-2.5 touch-active">
                    {/* Transaction - icon + text */}
                    <div className="flex items-center gap-2 w-[160px] shrink-0">
                      <div className={`w-8 h-8 rounded-lg ${activity.iconBg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${activity.iconColor || "text-white"}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground leading-tight">{activity.title}</p>
                        <p className={`text-[10px] ${activity.subtitleColor} leading-tight`}>{activity.subtitle}</p>
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="text-[10px] text-muted-foreground w-[80px] text-center shrink-0">
                      {activity.details}
                    </div>
                    
                    {/* Time/Date */}
                    <div className="text-[10px] text-muted-foreground w-[90px] text-center shrink-0">
                      {activity.time}
                    </div>
                    
                    {/* Balance */}
                    <div className={`text-[10px] font-semibold ${activity.balanceColor} w-[70px] text-right shrink-0`}>
                      {activity.balanceFrom} {activity.isAdd ? "+" : ">"} {activity.balanceTo}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {activeTab === "Points" && (
        <div className="p-3">
          {/* Total Points with Info Button */}
          <div className="text-center mb-4 relative">
            <button 
              onClick={() => setShowPointsInfo(true)}
              className="absolute top-0 right-0 p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </button>
            <p className="text-muted-foreground text-xs">Total Points</p>
            <p className="text-3xl font-bold text-primary mt-1">1,540 MP</p>
          </div>

          {/* Points History */}
          <div className="space-y-2">
            {pointsData.map((item, index) => (
              <button 
                key={index} 
                onClick={() => setSelectedPointItem(item)}
                className="w-full flex items-center justify-between p-2.5 bg-[#252525] rounded-xl touch-active text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.action}</p>
                    <p className="text-[10px] text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-bold text-sm">{item.points}</span>
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>

          {/* Encouraging Note */}
          <div className="mt-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-xs text-center text-primary font-medium">
              Keep up the great work! You're just 460 points away from your next reward tier.
            </p>
          </div>
        </div>
      )}

      {activeTab === "Payments" && (
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Payment History</p>
            <span className="text-[10px] text-muted-foreground">{paymentHistory.length} transactions</span>
          </div>
          <div className="space-y-2">
            {paymentHistory.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-2.5 bg-[#252525] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    payment.status === "completed" ? "bg-green-500/20" : "bg-yellow-500/20"
                  }`}>
                    {payment.status === "completed" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{payment.description}</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] text-muted-foreground">{payment.date}</p>
                      {payment.method !== "-" && (
                        <>
                          <span className="text-[10px] text-muted-foreground">-</span>
                          <p className="text-[10px] text-muted-foreground">{payment.method}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${payment.status === "completed" ? "text-green-500" : "text-yellow-500"}`}>
                    {payment.amount}
                  </p>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${
                    payment.status === "completed" 
                      ? "bg-green-500/20 text-green-500" 
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}>
                    {payment.status === "completed" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Rewards" && (
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">Coming Soon</p>
          <p className="text-[10px] text-muted-foreground mt-1">Rewards redemption feature is on the way!</p>
        </div>
      )}

      {/* Points Info Modal */}
      {showPointsInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-4">
          <div className="w-full max-w-sm bg-[#141414] rounded-2xl p-5 border border-border/50 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">{pointsInfo.title}</h3>
              </div>
              <button 
                onClick={() => setShowPointsInfo(false)}
                className="p-1.5 rounded-full bg-secondary touch-active"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {pointsInfo.description}
            </p>
            <button 
              onClick={() => setShowPointsInfo(false)}
              className="w-full mt-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold touch-active text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Point Item Detail Modal */}
      {selectedPointItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-4">
          <div className="w-full max-w-sm bg-[#141414] rounded-2xl p-5 border border-border/50 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{selectedPointItem.action}</h3>
                  <p className="text-[10px] text-muted-foreground">{selectedPointItem.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPointItem(null)}
                className="p-1.5 rounded-full bg-secondary touch-active"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="bg-secondary rounded-xl p-4 mb-4">
              <p className="text-2xl font-bold text-green-500 text-center">{selectedPointItem.points}</p>
              <p className="text-xs text-center text-muted-foreground mt-1">Points Earned</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedPointItem.description}
            </p>
            <button 
              onClick={() => setSelectedPointItem(null)}
              className="w-full mt-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold touch-active text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
