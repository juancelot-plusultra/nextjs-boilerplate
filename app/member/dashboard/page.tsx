"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Bell,
  MessageCircle,
  Home,
  Calendar,
  CreditCard,
  User,
  MoreHorizontal,
} from "lucide-react"

import { ProfileCard } from "@/components/bearfit/profile-card"
import { SessionCard } from "@/components/bearfit/session-card"
import { ActivityLog } from "@/components/bearfit/activity-log"

type Role = "Member" | "Staff" | "Leads" | "Admin"
const roles: Role[] = ["Member", "Staff", "Leads", "Admin"]

type TabKey = "Home" | "Schedule" | "Payment" | "Profile" | "More"

function BottomTabs({
  active = "Home",
  onChange,
}: {
  active?: TabKey
  onChange?: (t: TabKey) => void
}) {
  const items: { key: TabKey; label: string; Icon: any }[] = [
    { key: "Home", label: "Home", Icon: Home },
    { key: "Schedule", label: "Schedule", Icon: Calendar },
    { key: "Payment", label: "Payment", Icon: CreditCard },
    { key: "Profile", label: "Profile", Icon: User },
    { key: "More", label: "More", Icon: MoreHorizontal },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/80 backdrop-blur">
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-6">
        <div className="grid grid-cols-5 items-stretch py-2">
          {items.map(({ key, label, Icon }) => {
            const isActive = key === active
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange?.(key)}
                className={[
                  "flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px] font-medium">{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<Role>("Member")
  const [activeTab, setActiveTab] = useState<TabKey>("Home")

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* ======================
            LEFT SIDEBAR (desktop)
            LOGO ONLY — NO TEXT
        ====================== */}
        <aside className="hidden lg:flex w-28 xl:w-32 flex-col items-center py-6 border-r border-border/40">
          <div className="relative w-20 h-20 xl:w-24 xl:h-24 rounded-2xl overflow-hidden bg-secondary/60 ring-1 ring-border/50">
            <Image
              src="/brand/Bearfit-Logo-v2.png"
              alt="BearFit Logo"
              fill
              priority
              sizes="96px"
              className="object-contain p-2"
            />
          </div>
        </aside>

        {/* ======================
            MAIN
        ====================== */}
        <main className="flex-1 min-w-0">
          {/* ======================
              TOP BAR (ALL SIZES)
              Logo-only + Role tabs + icons
              NO "BEARFIT / Better fitness." text
          ====================== */}
          <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
            <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
              <div className="flex items-center gap-3 py-4">
                {/* Mobile logo */}
                <div className="lg:hidden">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl overflow-hidden bg-secondary/60 ring-1 ring-border/50">
                    <Image
                      src="/brand/Bearfit-Logo-v2.png"
                      alt="BearFit Logo"
                      fill
                      priority
                      sizes="64px"
                      className="object-contain p-2"
                    />
                  </div>
                </div>

                {/* Role tabs (always visible) */}
                <div className="flex-1 min-w-0">
                  <div className="mx-auto w-full max-w-xl">
                    <div className="flex w-full items-center gap-1 rounded-2xl bg-secondary/60 p-1 ring-1 ring-border/40">
                      {roles.map((r) => {
                        const active = r === activeRole
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setActiveRole(r)}
                            className={[
                              "flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition",
                              active
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/40",
                            ].join(" ")}
                          >
                            {r}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/60 ring-1 ring-border/40 hover:bg-secondary"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-primary px-1 text-[11px] font-semibold leading-5 text-primary-foreground">
                      3
                    </span>
                  </button>

                  <button
                    type="button"
                    className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/60 ring-1 ring-border/40 hover:bg-secondary"
                    aria-label="Messages"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-green-500 px-1 text-[11px] font-semibold leading-5 text-white">
                      2
                    </span>
                  </button>
                </div>
              </div>

              {/* Single welcome line only */}
              <div className="pb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-lg">Welcome,</span>
                  <span className="text-lg font-semibold text-foreground">Alex</span>
                </div>
              </div>
            </div>
          </header>

          {/* ======================
              CONTENT
              (extra bottom padding so bottom tabs don't cover content)
          ====================== */}
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-6 pb-28 space-y-6">
            <ProfileCard />
            <SessionCard />
            <ActivityLog />
          </div>
        </main>
      </div>

      {/* ======================
          BOTTOM TABS (ALL SIZES)
          Spread evenly, fixed bottom
      ====================== */}
      <BottomTabs active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
