"use client"

import Image from "next/image"
import { Bell, MessageCircle } from "lucide-react"

export type Role = "Member" | "Staff" | "Leads" | "Admin"

type RoleTabsProps = {
  activeRole: Role
  onRoleChange: (role: Role) => void
  className?: string
}

function RoleTabs({ activeRole, onRoleChange, className }: RoleTabsProps) {
  const roles: Role[] = ["Member", "Staff", "Leads", "Admin"]

  return (
    <div
      className={[
        "flex flex-wrap items-center gap-1 rounded-2xl bg-secondary p-1 text-xs",
        className || "",
      ].join(" ")}
    >
      {roles.map((role) => {
        const isActive = role === activeRole
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange(role)}
            className={[
              "px-4 py-2 rounded-xl font-semibold transition",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-background/30",
            ].join(" ")}
          >
            {role}
          </button>
        )
      })}
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
  // BIG and consistent (same size across breakpoints)
  return (
    <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-secondary border border-border/40">
      <Image
        src={logoSrc}
        alt={logoAlt}
        fill
        priority
        sizes="80px"
        className="object-contain p-2"
      />
    </div>
  )
}

/* =================================
   MOBILE HEADER (Header)
   - Logo only (NO "BEARFIT / Better fitness." text)
   - Role tabs stay visible
================================= */
export type HeaderProps = {
  logoSrc?: string
  logoAlt?: string
  activeRole: Role
  onRoleChange: (role: Role) => void
  onOpenChat?: () => void
  onOpenNotifications?: () => void
}

export function Header({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFit Logo",
  activeRole,
  onRoleChange,
  onOpenChat,
  onOpenNotifications,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between gap-3 px-4 py-4 border-b border-border bg-background">
      <div className="flex items-center gap-3 min-w-0">
        <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
      </div>

      <div className="flex-1 flex items-center justify-center min-w-0">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenNotifications}
          className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center border border-border/30 hover:bg-secondary/70 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-foreground" />
        </button>

        <button
          type="button"
          onClick={onOpenChat}
          className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center border border-border/30 hover:bg-secondary/70 transition"
          aria-label="Messages"
        >
          <MessageCircle className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  )
}

/* =================================
   DESKTOP HEADER
   - Logo only (NO "BEARFIT / Better fitness." text)
   - Accepts the props your dashboard is passing
================================= */
export function DesktopHeader({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFit Logo",
  activeRole,
  onRoleChange,
  onOpenChat,
  onOpenNotifications,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between gap-4 px-6 py-5 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenNotifications}
          className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border/30 hover:bg-secondary/70 transition relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-foreground" />
        </button>

        <button
          type="button"
          onClick={onOpenChat}
          className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border/30 hover:bg-secondary/70 transition"
          aria-label="Messages"
        >
          <MessageCircle className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  )
}
