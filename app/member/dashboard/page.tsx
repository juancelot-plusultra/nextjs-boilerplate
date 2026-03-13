"use client"

import { useState } from "react"
import MemberDashboardView from "@/components/bearfit/views/member-dashboard-view"

export default function MemberDashboardPage() {
  const [activeRole] = useState<"Member" | "Staff" | "Admin" | "Leads">("Member")
  const [activeTab, setActiveTab] = useState("home")

  return (
    <MemberDashboardView
      activeRole={activeRole}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  )
}
