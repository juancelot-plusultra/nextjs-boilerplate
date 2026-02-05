"use client"

import Image from "next/image"
import { Bell, MessageCircle } from "lucide-react"

export type Role = "Member" | "Staff" | "Leads" | "Admin"

export type HeaderProps = {
  logoSrc?: string
  logoAlt?: string

  // These are used by your dashboard page.tsx
  onOpenChat?: () => void
  onOpenNotifications?: () => void
  activeRole?: Role
  onRoleChange?: (role: Role) => void
}

function RoleTabs({
  activeRole = "Member",
  onRoleChange,
}: {
  activeRole?: Role
  onRoleChange?: (role: Role) => void
}) {
  const roles: Role[] = ["Member", "Staff", "Leads", "Admin"]

  return (
    <div className="hidden md:flex items-center bg-secondary rounded-full p-0.5 text-xs">
      {roles.map((role) => {
        const isActive = role === activeRole
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange?.(role)}
            className={
              isActive
                ? "px-4 py-1.5 rounded-full bg-primary text-primary-foreground"
                : "px-4 py-1.5 rounded-full text-muted-foreground"
            }
          >
            {role}
          </button>
        )
      })}
    </div>
  )
}

function RightIcons({
  onOpenChat,
  onOpenNotifications,
}: {
  onOpenChat?: () => void
  onOpenNotifications?: () => void
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onOpenNotifications}
        className="relative w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] rounded-full bg-orange-500 text-white flex items-center justify-center">
          3
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenChat}
        className="relative w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
        aria-label="Messages"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] rounded-full bg-green-500 text-white flex items-center justify-center">
          2
        </span>
      </button>
    </div>
  )
}

export function Header({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "Bearfit Logo",
  onOpenChat,
  onOpenNotifications,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
          <Image src={logoSrc} alt={logoAlt} width={36} height={36} priority />
        </div>

        <div className="leading-tight">
          <span className="font-semibold text-sm text-foreground">BEARFIT</span>
          <span className="block text-[10px] text-muted-foreground">Better fitness.</span>
        </div>
      </div>

      {/* RIGHT: Icons */}
      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}

export function DesktopHeader({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "Bearfit Logo",
  onOpenChat,
  onOpenNotifications,
  activeRole = "Member",
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
          <Image src={logoSrc} alt={logoAlt} width={36} height={36} priority />
        </div>

        <div className="leading-tight">
          <span className="font-semibold text-sm text-foreground">BEARFIT</span>
          <span className="block text-[10px] text-muted-foreground">Better fitness.</span>
        </div>
      </div>

      {/* CENTER: Tabs */}
      <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />

      {/* RIGHT: Icons */}
      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}
