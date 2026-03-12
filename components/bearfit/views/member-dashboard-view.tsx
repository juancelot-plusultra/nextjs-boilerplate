"use client"

import { ReactNode } from "react"
import MemberHomeView from "../member/member-home-view"
import MemberScheduleView from "../member/member-schedule-view"
import MemberPaymentView from "../member/member-payment-view"
import MemberProfileView from "../member/member-profile-view"
import MemberMoreView from "../member/member-more-view"

type Role = "Member" | "Staff" | "Leads" | "Admin"

type Props = {
  activeRole: Role
  activeTab?: string
  children?: ReactNode
}

export default function MemberDashboardView({
  activeRole,
  activeTab = "home",
  children,
}: Props) {
  if (children) {
    return <>{children}</>
  }

  if (activeRole !== "Member") {
    return null
  }

  return (
    <div className="space-y-6">
      {activeTab === "home" && <MemberHomeView />}
      {activeTab === "schedule" && <MemberScheduleView />}
      {activeTab === "payment" && <MemberPaymentView />}
      {activeTab === "profile" && <MemberProfileView />}
      {activeTab === "more" && <MemberMoreView />}
    </div>
  )
}
