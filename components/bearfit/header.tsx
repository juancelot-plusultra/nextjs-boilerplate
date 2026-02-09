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
        // ✅ show on ALL screen sizes (no hidden md:flex)
        "flex items-center gap-1 bg-secondary/80 rounded-full p-1 text-xs",
        // ✅ keeps it nice on small screens too
        "w-full max-w-[520px] overflow-hidden",
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
            className={[
              "flex-1 min-w-0 px-3 py-1.5 rounded-full transition",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            <span className="truncate">{role}</span>
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
  showText = true,
}: {
  logoSrc: string
  logoAlt: string
  showText?: boolean
}) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      {/* ✅ fixed size logo on ALL screens */}
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

      {showText && (
        <div className="leading-tight">
          <span className="font-semibold text-sm text-foreground">BEARFIT</span>
          <span className="block text-[10px] text-muted-foreground">Better fitness.</span>
        </div>
      )}
    </div>
  )
}

export function Header({
  // ✅ MUST match your GitHub file EXACTLY (case-sensitive)
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFitPH Logo",
  onOpenChat,
  onOpenNotifications,
  activeRole = "Member",
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      {/* Mobile layout: logo + icons, tabs under */}
      <div className="flex items-center justify-between gap-3">
        <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} showText={false} />
        <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
      </div>

      {/* ✅ tabs visible on mobile */}
      <div className="mt-3">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>
    </header>
  )
}

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
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} showText />

      {/* Desktop: tabs centered */}
      <div className="flex-1 flex justify-center">
        <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>

      <RightIcons onOpenChat={onOpenChat} onOpenNotifications={onOpenNotifications} />
    </header>
  )
}
