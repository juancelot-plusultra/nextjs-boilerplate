"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import {
  Home,
  Calendar,
  CreditCard,
  User as UserIcon,
  MoreHorizontal,
  LogOut,
} from "lucide-react"

const supabase = createClient()

type Props = {
  user: User
  member: any | null
}

export default function BearfitDashboardClient({ user, member }: Props) {
  const [activeTab, setActiveTab] = useState("home")

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/welcome"
  }

  const memberNavItems = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Calendar, label: "Schedule", id: "schedule" },
    { icon: CreditCard, label: "Payment", id: "payment" },
    { icon: UserIcon, label: "Profile", id: "profile" },
    { icon: MoreHorizontal, label: "More", id: "more" },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bearfit Dashboard</h1>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>

        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Logged in as</p>
          <p className="font-medium">{user?.email}</p>
        </div>

        <div className="mb-6 grid grid-cols-5 gap-2">
          {memberNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center rounded-lg p-3 text-xs ${
                activeTab === item.id ? "bg-black text-white" : "border bg-white"
              }`}
            >
              <item.icon size={18} />
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          {activeTab === "home" && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Home</h2>
              <p>Welcome to your dashboard.</p>
            </div>
          )}

          {activeTab === "schedule" && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Schedule</h2>
              <p>Your sessions will appear here.</p>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Payment</h2>
              <p>Payment details will appear here.</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Profile</h2>
              <pre className="rounded bg-gray-100 p-3 text-xs">
                {JSON.stringify(member, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === "more" && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">More</h2>
              <p>More features coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
