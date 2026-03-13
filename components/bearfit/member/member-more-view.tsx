"use client"

import { ChevronRight, Gift, HelpCircle, Shield, Globe, Bell, Info } from "lucide-react"

type Props = {
  onOpenNotifications?: () => void
}

const memberMoreItems = [
  { icon: Gift, label: "Referral Program", description: "Earn points by referring friends", id: "referral" },
  { icon: HelpCircle, label: "Help & Support", description: "FAQs and contact support", id: "help" },
  { icon: Shield, label: "Privacy & Security", description: "Manage your data", id: "privacy" },
  { icon: Globe, label: "Language", description: "English", id: "language" },
  { icon: Bell, label: "Notifications", description: "Manage alerts", id: "notifications" },
  { icon: Info, label: "About BearFit", description: "Version 2.0.1", id: "about" },
]

export default function MemberMoreView({ onOpenNotifications }: Props) {
  const handleClick = (id: string) => {
    if (id === "notifications" && onOpenNotifications) {
      onOpenNotifications()
    }
  }

  return (
    <div className="px-4 lg:px-0 space-y-2 pb-4">
      {memberMoreItems.map((item, i) => {
        const Icon = item.icon

        return (
          <button
            key={i}
            onClick={() => handleClick(item.id)}
            className="w-full flex items-center justify-between p-3 lg:p-4 bg-[#141414] rounded-xl border border-border/30 touch-active card-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs lg:text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] lg:text-[11px] text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </button>
        )
      })}
    </div>
  )
}
