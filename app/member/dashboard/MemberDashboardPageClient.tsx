"use client"

import { useState } from "react"
import MemberDashboardView from "@/components/bearfit/views/member-dashboard-view"

interface MemberDashboardPageClientProps {
  user: any
  member: any
}

export default function MemberDashboardPageClient({
  user,
  member,
}: MemberDashboardPageClientProps) {
  const [activeRole] = useState<"Member" | "Staff" | "Admin" | "Leads">("Member")
  const [activeTab, setActiveTab] = useState("home")

  return (
    <MemberDashboardView
      activeRole={activeRole}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={user}
      member={member}
    />
  )
}
