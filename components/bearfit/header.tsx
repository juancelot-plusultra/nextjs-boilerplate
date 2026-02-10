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

/* ================================
   BIG LOGO (fixed size, never shrinks)
================================ */
function LogoBlock({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFit Logo",
}: {
  logoSrc?: string
  logoAlt?: string
}) {
  return (
    <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-secondary">
      <Image
        src={logoSrc}
        alt={logoAlt}
        fill
        priority
        sizes="80px"
        className="object-contain"
      />
    </div>
  )
}

/* ================================
   ROLE TABS (always visible)
================================ */
function RoleTabs({
  activeRole = "Member",
  onRoleChange,
}: {
  activeRole?: Role
  onRoleChange?: (role: Role) => void
}) {
  const roles: Role[] = ["Member", "Staff", "Leads", "Admin"]

  return (
    <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
      {roles.map((role) => {
        const active = role === activeRole
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange?.(role)}
            className={`px-4 py-1.5 text-sm rounded-full transition
              ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {role}
          </button>
        )
      })}
    </div>
  )
}

/* ================================
   RIGHT ICONS (chat + notif)
================================ */
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
        className="relative w-11 h-11 rounded-full bg-secondary flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] rounded-full bg-orange-500 text-white flex items-center justify-center">
          3
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenChat}
        className="relative w-11 h-11 rounded-full bg-secondary flex items-center justify-center"
        aria-label="Messages"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] rounded-full bg-green-500 text-white flex items-center justify-center">
          2
        </span>
      </button>
    </div>
  )
}

/* ================================
   MOBILE HEADER (exported as Header)
   ✅ NO "BEARFIT / Better fitness." text
================================ */
export function Header({
  logoSrc,
  logoAlt,
  onOpenChat,
  onOpenNotifications,
  activeRole,
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-4 border-b border-border bg-background lg:hidden">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />

      <div className="flex items-center gap-3">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
        <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
      </div>
    </header>
  )
}

/* ================================
   DESKTOP HEADER
   ✅ NO "BEARFIT / Better fitness." text
================================ */
export function DesktopHeader({
  logoSrc,
  logoAlt,
  onOpenChat,
  onOpenNotifications,
  activeRole,
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="hidden lg:flex w-full items-center justify-between px-6 py-5 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}
