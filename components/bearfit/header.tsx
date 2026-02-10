"use client"

import Image from "next/image"

export type Role = "Member" | "Staff" | "Leads" | "Admin"

export type HeaderProps = {
  logoSrc?: string
  logoAlt?: string
}

/* ===============================
   LOGO (FIXED SIZE – NEVER SHRINKS)
================================ */
function LogoBlock({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFit Logo",
}: {
  logoSrc?: string
  logoAlt?: string
}) {
  return (
    <div className="flex items-center shrink-0">
      {/* 
        FIXED SIZE:
        - w-20 h-20 = 80px
        - shrink-0 prevents scaling down
        - same size on mobile & desktop
      */}
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
    </div>
  )
}

/* ===============================
   RIGHT ICON PLACEHOLDERS
================================ */
function RightIcons() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-secondary" />
      <div className="w-11 h-11 rounded-full bg-secondary" />
    </div>
  )
}

/* ===============================
   MOBILE HEADER (Header)
================================ */
export function Header({ logoSrc, logoAlt }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-4 border-b border-border bg-background">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
      <RightIcons />
    </header>
  )
}

/* ===============================
   DESKTOP HEADER
================================ */
export function DesktopHeader({ logoSrc, logoAlt }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-5 border-b border-border bg-background">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
      <RightIcons />
    </header>
  )
}
