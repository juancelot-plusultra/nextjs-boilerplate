"use client"

import { ProfileCard } from "@/components/bearfit/profile-card"
import { SessionCard } from "@/components/bearfit/session-card"
import { ActivityLog } from "@/components/bearfit/activity-log"
import { PromoBanner } from "@/components/bearfit/promo-banner"

export default function MemberHomeView() {
  return (
    <div className="space-y-5">
      <ProfileCard />
      <SessionCard />
      <ActivityLog />
      <PromoBanner />
    </div>
  )
}
