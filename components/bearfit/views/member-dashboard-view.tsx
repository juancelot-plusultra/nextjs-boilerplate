"use client"

import { ReactNode } from "react"

type Role = "Member" | "Staff" | "Leads" | "Admin"

interface MemberDashboardViewProps {
  activeRole: Role
  children: ReactNode
}

export function MemberDashboardView({ activeRole, children }: MemberDashboardViewProps) {
  if (activeRole !== "Member") return null
  return <>{children}</>
}
