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
      className={[
        // ✅ show on ALL screen sizes (mobile included)
        "flex items-center gap-1 bg-secondary/80 rounded-full p-1 text-xs",
        // allow wrap on wider cards, allow scroll on very small screens
        "flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar",
        className,
      ].join(" ")}
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
                ? "px-4 py-2 rounded-full bg-primary text-primary-foreground whitespace-nowrap"
                : "px-4 py-2 rounded-full text-muted-foreground hover:text-foreground whitespace-nowrap"
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
        className="relative w-11 h-11 rounded-full bg-secondary/80 flex items-center justify-center"
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
        className="relative w-11 h-11 rounded-full bg-secondary/80 flex items-center justify-center"
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

function LogoBlock({
  logoSrc,
  logoAlt,
}: {
  logoSrc: string
  logoAlt: string
}) {
  return (
    <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-secondary/70 ring-1 ring-white/10">
      <Image
        src={logoSrc}
        alt={logoAlt}
        fill
        priority
        sizes="56px"
        className="object-contain p-2"
      />
    </div>
  )
}

/* ================================
   MOBILE HEADER (Header)
   - No “BEARFIT / Better fitness” text
   - Bigger logo, same size always
   - Role tabs visible on mobile
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
    <header className="w-full flex items-center justify-between gap-3 px-4 py-4 border-b border-border bg-background/70 backdrop-blur-md">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />

      <div className="flex-1 flex items-center justify-center">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} className="max-w-full" />
      </div>

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}

/* ================================
   DESKTOP HEADER (DesktopHeader)
   - No “BEARFIT / Better fitness” text
   - Bigger logo, same size always
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
    <header className="w-full flex items-center justify-between gap-4 px-6 py-5 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}
