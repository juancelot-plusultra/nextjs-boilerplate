"use client"

import { ReactNode } from "react"

type Role = "Member" | "Staff" | "Leads" | "Admin"

interface LeadsDashboardViewProps {
  activeRole: Role
  children: ReactNode
}

export function LeadsDashboardView({ activeRole, children }: LeadsDashboardViewProps) {
  if (activeRole !== "Leads") return null
  return <>{children}</>
}
