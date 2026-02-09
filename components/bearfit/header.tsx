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
        "flex flex-wrap items-center gap-1 bg-secondary rounded-xl p-1 text-xs " +
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
              isActive
                ? "px-3 py-1.5 rounded-lg bg-primary text-primary-foreground"
                : "px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground"
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
  logoAlt = "BearFitPH Logo",
  onOpenChat,
  onOpenNotifications,
  activeRole = "Member",
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full bg-background/80 backdrop-blur-md border-b border-border">
      {/* top row */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
            <Image src={logoSrc} alt={logoAlt} width={36} height={36} priority />
          </div>
        </div>

        {/* RIGHT: Icons */}
        <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
      </div>

      {/* mobile role tabs (shows on ALL sizes, but looks great on mobile) */}
      <div className="px-4 pb-3">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>
    </header>
  )
}

export function DesktopHeader({
  logoSrc = "/brand/bearfit-logo-v2.png",
  logoAlt = "BearFitPH Logo",
  onOpenChat,
  onOpenNotifications,
  activeRole = "Member",
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-secondary">
  <Image
    src={logoSrc}
    alt={logoAlt ?? "BearFit Logo"}
    fill
    priority
    sizes="56px"
    className="object-contain"
  />
</div>

      {/* CENTER: Tabs */}
      <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} className="rounded-full px-1" />

      {/* RIGHT: Icons */}
      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}
