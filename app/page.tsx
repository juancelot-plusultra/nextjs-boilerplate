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
    <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-secondary">
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

function RoleTabs({
  activeRole = "Member",
  onRoleChange,
}: {
  activeRole?: Role
  onRoleChange?: (role: Role) => void
}) {
  const roles: Role[] = ["Member", "Staff", "Leads", "Admin"]

  return (
    <div className="flex items-center gap-1 bg-secondary/80 rounded-2xl p-1 text-xs overflow-x-auto no-scrollbar">
      {roles.map((role) => {
        const isActive = role === activeRole
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange?.(role)}
            className={
              isActive
                ? "shrink-0 px-4 py-2 rounded-2xl bg-primary text-primary-foreground font-semibold"
                : "shrink-0 px-4 py-2 rounded-2xl text-muted-foreground hover:text-foreground"
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
        className="relative w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
          3
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenChat}
        className="relative w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center"
        aria-label="Messages"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
          2
        </span>
      </button>
    </div>
  )
}

/* ================================
   MOBILE HEADER (Header)
   - Bigger logo
   - Role tabs visible on mobile
   - No "BEARFIT / Better fitness" text
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
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
        <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
        <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
      </div>

      <div className="px-4 pb-4">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>
    </header>
  )
}

/* ================================
   DESKTOP HEADER (DesktopHeader)
   - Bigger logo
   - Tabs centered
   - Icons right
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
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
        </div>

        <div className="flex-1 flex justify-center">
          <div className="max-w-[680px] w-full">
            <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
          </div>
        </div>

        <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
      </div>
    </header>
  )
}

/* Optional: hide scrollbar on the RoleTabs strip (mobile) */
declare global {
  // eslint-disable-next-line no-unused-vars
  interface HTMLElementTagNameMap {
    style: any
  }
}
