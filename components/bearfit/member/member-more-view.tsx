"use client"

import { Settings, HelpCircle, LogOut } from "lucide-react"

export default function MemberMoreView() {
  const items = [
    { label: "Account Settings", icon: Settings },
    { label: "Help & Support", icon: HelpCircle },
    { label: "Logout", icon: LogOut },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">

        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          More
        </h1>

        <div className="space-y-4">

          {items.map((item, i) => {
            const Icon = item.icon

            return (
              <div
                key={i}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium text-slate-900">
                    {item.label}
                  </span>
                </div>
              </div>
            )
          })}

        </div>

      </div>
    </div>
  )
}
