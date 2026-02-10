"use client"

import Image from "next/image"

export type Role = "Member" | "Staff" | "Leads" | "Admin"

export type HeaderProps = {
  logoSrc?: string
  logoAlt?: string

  // optional: if you still use these in page.tsx
  onOpenChat?: () => void
  onOpenNotifications?: () => void
  activeRole?: Role
  onRoleChange?: (role: Role) => void

  // optional: hide the BEARFIT text if you want logo-only
  showText?: boolean
}

function LogoBlock({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFit Logo",
  showText = true,
}: {
  logoSrc?: string
  logoAlt?: string
  showText?: boolean
}) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      {/* FIXED logo size across all screen sizes */}
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

      {showText && (
        <div className="leading-tight">
          <span className="block text-2xl font-extrabold tracking-wide text-foreground">
            BEARFIT
          </span>
          <span className="block text-sm text-muted-foreground">Better fitness.</span>
        </div>
      )}
    </div>
  )
}

function RightIcons() {
  // keep simple placeholders so you don't break layout
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-secondary" />
      <div className="w-10 h-10 rounded-full bg-secondary" />
    </div>
  )
}

/**
 * ✅ IMPORTANT:
 * Your app/page.tsx imports { Header, DesktopHeader }
 * So we export `Header` (mobile) + `DesktopHeader` (desktop).
 */
export function Header({
  logoSrc,
  logoAlt,
  showText = true,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-border bg-background">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} showText={showText} />
      <RightIcons />
    </header>
  )
}

export function DesktopHeader({
  logoSrc,
  logoAlt,
  showText = true,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} showText={showText} />
      <RightIcons />
    </header>
  )
}
