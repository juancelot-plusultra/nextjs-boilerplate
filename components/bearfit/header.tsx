"use client"

import Image from "next/image"

export type Role = "Member" | "Staff" | "Leads" | "Admin"

type HeaderProps = {
  logoSrc?: string
  logoAlt?: string
  activeRole?: Role
  onRoleChange?: (role: Role) => void
}

/* ================================
   SHARED LOGO (BIG, FIXED SIZE)
================================ */
function LogoBlock({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFit Logo",
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
   ROLE TABS
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
   MOBILE HEADER
================================ */
export function Header({
  logoSrc,
  logoAlt,
  activeRole,
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-4 border-b border-border bg-background lg:hidden">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
      <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
    </header>
  )
}

/* ================================
   DESKTOP HEADER
================================ */
export function DesktopHeader({
  logoSrc,
  logoAlt,
  activeRole,
  onRoleChange,
}: HeaderProps) {
  return (
    <header className="hidden lg:flex w-full items-center justify-between px-6 py-5 border-b border-border bg-background">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />
      <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />
    </header>
  )
}
