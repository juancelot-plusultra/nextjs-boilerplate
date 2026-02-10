"use client"

import Image from "next/image"
import { Bell, MessageCircle } from "lucide-react"

export type Role = "Member" | "Staff" | "Leads" | "Admin"

export type HeaderProps = {
  logoSrc?: string
  logoAlt?: string

  onOpenChat?: () => void
  onOpenNotifications?: () => void
  activeRole?: Role
  onRoleChange?: (role: Role) => void
}

function LogoBlock({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFitPH Logo",
}: {
  logoSrc?: string
  logoAlt?: string
}) {
  return (
    <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-secondary">
      <Image
        src={logoSrc}
        alt={logoAlt}
        fill
        priority
        sizes="64px"
        className="object-contain"
      />
    </div>
  )
}

function RoleTabs({
  activeRole = "Member",
  onRoleChange,
  className = "",
}: {
  activeRole?: Role
  onRoleChange?: (role: Role) => void
  className?: string
}) {
  const roles: Role[] = ["Member", "Staff", "Leads", "Admin"]

  return (
    <div className={`flex flex-wrap gap-1 items-center bg-secondary rounded-xl p-1 text-xs ${className}`}>
      {roles.map((role) => {
        const isActive = role === activeRole
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange?.(role)}
            className={
              isActive
                ? "px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                : "px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground"
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
        className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
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
        className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
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

/* =========================
   MOBILE HEADER (Header)
========================= */
export function Header({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFitPH Logo",
  onOpenChat,
  onOpenNotifications,
  activeRole = "Member",
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-4 border-b border-border bg-background/80 backdrop-blur-md">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
      <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} className="mx-3 flex-1 justify-center" />
      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}

/* =========================
   DESKTOP HEADER (DesktopHeader)
========================= */
export function DesktopHeader({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFitPH Logo",
  onOpenChat,
  onOpenNotifications,
  activeRole = "Member",
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
      </div>

      <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}
