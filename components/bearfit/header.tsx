"use client"

import Image from "next/image"
import clsx from "clsx"

type HeaderProps = {
  logoSrc?: string
  logoAlt?: string
  showText?: boolean
}

function LogoBlock({
  logoSrc = "/brand/Bearfit-Logo-v2.png",
  logoAlt = "BearFit Logo",
  showText = true,
}: HeaderProps) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      {/* Logo container — FIXED SIZE */}
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-secondary">
        <Image
          src={logoSrc}
          alt={logoAlt}
          fill
          priority
          sizes="64px"
          className="object-contain"
        />
      </div>

      {/* Text — FIXED SIZE (does NOT scale down) */}
      {showText && (
        <div className="leading-tight">
          <span className="block text-2xl font-extrabold tracking-wide text-foreground">
            BEARFIT
          </span>
          <span className="block text-sm text-muted-foreground">
            Better fitness.
          </span>
        </div>
      )}
    </div>
  )
}

export function DesktopHeader({
  logoSrc,
  logoAlt,
}: {
  logoSrc?: string
  logoAlt?: string
}) {
  return (
    <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />

      <div className="flex items-center gap-3">
        {/* notifications / profile placeholders */}
        <div className="w-10 h-10 rounded-full bg-secondary" />
        <div className="w-10 h-10 rounded-full bg-secondary" />
      </div>
    </header>
  )
}

export function MobileHeader({
  logoSrc,
  logoAlt,
}: {
  logoSrc?: string
  logoAlt?: string
}) {
  return (
    <header className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-border bg-background">
      <LogoBlock logoSrc={logoSrc} logoAlt={logoAlt} />

      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-secondary" />
        <div className="w-9 h-9 rounded-full bg-secondary" />
      </div>
    </header>
  )
}
