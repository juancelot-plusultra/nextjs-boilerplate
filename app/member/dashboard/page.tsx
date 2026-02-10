"use client"

import Image from "next/image"
import { useState } from "react"
import { Bell, MessageCircle } from "lucide-react"

import { ProfileCard } from "@/components/bearfit/profile-card"
import { SessionCard } from "@/components/bearfit/session-card"
import { ActivityLog } from "@/components/bearfit/activity-log"

type Role = "Member" | "Staff" | "Leads" | "Admin"
const roles: Role[] = ["Member", "Staff", "Leads", "Admin"]

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<Role>("Member")

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
              NO "BEARFIT / Better fitness." text anywhere
          ====================== */}
          <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
            <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
              <div className="flex items-center gap-3 py-4">
                {/* Mobile logo (bigger, consistent size) */}
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

                {/* Role tabs (always visible; never missing on mobile) */}
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

              {/* Single welcome line only (prevents "Welcome, Alex" appearing twice) */}
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
              Wider on desktop (uses space)
          ====================== */}
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-6 space-y-6">
            <ProfileCard />
            <SessionCard />
            <ActivityLog />
          </div>
        </main>
      </div>
    </div>
  )
}
