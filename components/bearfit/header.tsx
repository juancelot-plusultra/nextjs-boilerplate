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
  size = 56, // constant visual size
}: {
  logoSrc?: string
  logoAlt?: string
  size?: number
}) {
  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden bg-secondary"
      style={{ width: size, height: size }}
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        fill
        priority
        sizes={`${size}px`}
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
    <div
      className={
        "flex flex-wrap items-center justify-between gap-1 bg-secondary/80 rounded-2xl p-1 text-xs w-full max-w-[520px] " +
        className
      }
    >
      {roles.map((role) => {
        const isActive = role === activeRole
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange?.(role)}
            className={
              "flex-1 min-w-[72px] px-4 py-2 rounded-xl font-medium transition-all " +
              (isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40")
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
    <div className="flex items-center gap-3 shrink-0">
      <button
        type="button"
        onClick={onOpenNotifications}
        className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
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
        <MessageCircle className="w-4.5 h-4.5" />
        <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] rounded-full bg-green-500 text-white flex items-center justify-center">
          2
        </span>
      </button>
    </div>
  )
}

/* ================================
   MOBILE HEADER (Header)
================================ */
export function Header({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFitPH Logo",
  onOpenChat,
  onOpenNotifications,
  activeRole = "Member",
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} size={56} />

      <div className="flex-1 flex justify-center">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}

/* ================================
   DESKTOP HEADER (DesktopHeader)
================================ */
export function DesktopHeader({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFitPH Logo",
  onOpenChat,
  onOpenNotifications,
  activeRole = "Member",
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} size={60} />

      <div className="flex-1 flex justify-center">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}
