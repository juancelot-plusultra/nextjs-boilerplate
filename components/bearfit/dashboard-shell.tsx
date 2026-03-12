"use client"

import { ReactNode } from "react"
import { DesktopHeader, Header } from "@/components/bearfit/header"

type Role = "Member" | "Staff" | "Leads" | "Admin"

interface Props {
  children: ReactNode
  role: Role
  activeRole: Role
  setActiveRole: (role: Role) => void
}

export function DashboardShell({
  children,
  role,
  activeRole,
  setActiveRole,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <DesktopHeader
          role={role}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
        />
      </div>

      <div className="md:hidden">
        <Header
          role={role}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
        />
      </div>

      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>
    </div>
  )
}
