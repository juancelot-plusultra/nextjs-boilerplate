"use client"

import Image from "next/image"
import { Bell, MessageCircle } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
          <Image
            src="/Bearfit-Logo.png"
            alt="Bearfit Logo"
            width={36}
            height={36}
            priority
          />
        </div>

        <div className="leading-tight">
          <span className="font-semibold text-sm text-foreground">
            BEARFIT
          </span>
          <span className="block text-[10px] text-muted-foreground">
            Better fitness.
          </span>
        </div>
      </div>

      {/* CENTER: Role Tabs */}
      <div className="hidden md:flex items-center bg-secondary rounded-full p-0.5 text-xs">
        <button className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground">
          Member
        </button>
        <button className="px-4 py-1.5 rounded-full text-muted-foreground">
          Staff
        </button>
        <button className="px-4 py-1.5 rounded-full text-muted-foreground">
          Leads
        </button>
        <button className="px-4 py-1.5 rounded-full text-muted-foreground">
          Admin
        </button>
      </div>

      {/* RIGHT: Icons */}
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] rounded-full bg-orange-500 text-white flex items-center justify-center">
            3
          </span>
        </button>

        <button className="relative w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <MessageCircle className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] rounded-full bg-green-500 text-white flex items-center justify-center">
            2
          </span>
        </button>
      </div>
    </header>
  )
}
