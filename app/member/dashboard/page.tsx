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
  logoSrc,
  logoAlt,
}: {
  logoSrc: string
  logoAlt: string
}) {
  return (
    <div className="relative w-[72px] h-[72px] shrink-0 rounded-2xl overflow-hidden bg-secondary/70 ring-1 ring-white/10">
      <Image
        src={logoSrc}
        alt={logoAlt}
        fill
        priority
        sizes="72px"
        className="object-contain p-2"
      />
    </div>
  )
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
    // ✅ visible on mobile + desktop (scrolls if needed)
    <div className="flex items-center gap-1 bg-secondary rounded-full p-1 text-xs overflow-x-auto max-w-full">
      {roles.map((role) => {
        const isActive = role === activeRole
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange?.(role)}
            className={
              isActive
                ? "px-4 py-2 rounded-full bg-primary text-primary-foreground whitespace-nowrap"
                : "px-4 py-2 rounded-full text-muted-foreground whitespace-nowrap hover:text-foreground"
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

/** ================================
 *  MOBILE HEADER (exported as Header)
 *  ================================ */
export function Header({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFitPH Logo",
  onOpenChat,
  onOpenNotifications,
  activeRole = "Member",
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between gap-3 px-4 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />

      <div className="flex-1 min-w-0 flex justify-center">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}

/** ================================
 *  DESKTOP HEADER
 *  ================================ */
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
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />

      <div className="flex-1 flex justify-center">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}
