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
}: {
  activeRole?: Role
  onRoleChange?: (role: Role) => void
}) {
  const roles: Role[] = ["Member", "Staff", "Leads", "Admin"]

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-1 bg-secondary/80 rounded-2xl p-1 text-xs min-w-max">
        {roles.map((role) => {
          const isActive = role === activeRole
          return (
            <button
              key={role}
              type="button"
              onClick={() => onRoleChange?.(role)}
              className={
                isActive
                  ? "px-4 py-2 rounded-xl bg-primary text-primary-foreground whitespace-nowrap"
                  : "px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground whitespace-nowrap"
              }
            >
              {role}
            </button>
          )
        })}
      </div>
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

function LogoBlock({
  logoSrc,
  logoAlt,
}: {
  logoSrc: string
  logoAlt: string
}) {
  return (
    <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-secondary flex items-center justify-center">
      <Image
        src={logoSrc}
        alt={logoAlt}
        fill
        priority
        sizes="56px"
        className="object-contain"
      />
    </div>
  )
}

/* ================================
   MOBILE HEADER (Header)
   - Bigger logo (always 56px)
   - Removes "BEARFIT / Better fitness."
   - Shows Role Tabs on mobile
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
    <header className="w-full px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between">
        <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
        <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
      </div>

      {/* Mobile role tabs */}
      <div className="mt-3 md:hidden">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>
    </header>
  )
}

/* ================================
   DESKTOP HEADER (DesktopHeader)
   - Same logo size (56px)
   - Tabs centered
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
    <header className="w-full flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />

      <div className="hidden md:block w-[420px]">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}
