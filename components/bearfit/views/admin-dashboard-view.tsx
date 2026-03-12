"use client"

import { ReactNode } from "react"

type Role = "Member" | "Staff" | "Leads" | "Admin"

interface AdminDashboardViewProps {
  activeRole: Role
  children: ReactNode
}

export function AdminDashboardView({ activeRole, children }: AdminDashboardViewProps) {
  if (activeRole !== "Admin") return null
  return <>{children}</>
}
