"use client"

import { ReactNode } from "react"
import { DesktopHeader, Header } from "@/components/bearfit/header"

type Role = "Member" | "Staff" | "Leads" | "Admin"

interface Props {
  children: ReactNode
  activeRole: Role
  setActiveRole: (role: Role) => void
}

export function DashboardShell({
  children,
  activeRole,
  setActiveRole,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <DesktopHeader
          activeRole={activeRole}
          setActiveRole={setActiveRole}
        />
      </div>

      <div className="md:hidden">
        <Header
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
