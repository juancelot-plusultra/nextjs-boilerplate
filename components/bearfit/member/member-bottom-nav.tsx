"use client"

import {
  Home,
  CalendarDays,
  CreditCard,
  User,
  MoreHorizontal,
} from "lucide-react"

type Props = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function MemberBottomNav({ activeTab, setActiveTab }: Props) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "profile", label: "Profile", icon: User },
    { id: "more", label: "More", icon: MoreHorizontal },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
      <div className="flex justify-around py-2">

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 text-xs ${
                isActive
                  ? "text-indigo-600"
                  : "text-slate-500"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          )
        })}

      </div>
    </div>
  )
}
