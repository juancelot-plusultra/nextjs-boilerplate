"use client"

import { ReactNode } from "react"
import MemberHomeView from "../member/member-home-view"

type Role = "Member" | "Staff" | "Leads" | "Admin"

type Props = {
  role: Role
  activeTab: string
}

export default function MemberDashboardView({ role, activeTab }: Props) {

  return (
    <div className="space-y-6">

      {activeTab === "home" && <MemberHomeView />}

      {activeTab === "payment" && (
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          Payment Section
        </div>
      )}

      {activeTab === "profile" && (
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          Profile Section
        </div>
      )}

      {activeTab === "more" && (
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          More Section
        </div>
      )}

    </div>
  )
}
