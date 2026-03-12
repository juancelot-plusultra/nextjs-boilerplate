"use client"

import { ReactNode } from "react"
import { DesktopHeader, Header } from "@/components/bearfit/header"
import { DraggableChatButton } from "@/components/bearfit/draggable-chat-button"

interface Props {
  children: ReactNode
  role: string
  activeRole: string
  setActiveRole: (role: string) => void
}

export function DashboardShell({
  children,
  role,
  activeRole,
  setActiveRole,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Desktop Header */}
      <div className="hidden md:block">
        <DesktopHeader
          role={role}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
        />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <Header
          role={role}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
        />
      </div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>

      <DraggableChatButton />

    </div>
  )
}
