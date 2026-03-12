"use client"

import { ReactNode } from "react"

type Role = "Member" | "Staff" | "Leads" | "Admin"

interface StaffDashboardViewProps {
  activeRole: Role
  children: ReactNode
}

export function StaffDashboardView({ activeRole, children }: StaffDashboardViewProps) {
  if (activeRole !== "Staff") return null
  return <>{children}</>
}
