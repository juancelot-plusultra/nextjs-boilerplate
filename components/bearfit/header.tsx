"use client"

import React from "react"
import { Bell, MessageCircle, User } from "lucide-react"

interface HeaderProps {
  onOpenChat?: () => void
  onOpenNotifications?: () => void
  notificationCount?: number
  chatCount?: number
  activeRole?: "Member" | "Staff" | "Leads" | "Admin"
  onRoleChange?: (role: "Member" | "Staff" | "Leads" | "Admin") => void
  userName?: string
}

export function Header({ 
  onOpenChat, 
  onOpenNotifications, 
  notificationCount = 3, 
  chatCount = 2,
  activeRole = "Member",
  onRoleChange,
  userName = "Alex"
}: HeaderProps) {
  const tabs = ["Member", "Staff", "Leads", "Admin"] as const

  return (
    <header className="flex items-center justify-between px-3 py-3 sticky top-0 bg-background/95 backdrop-blur-md z-40">
      {/* Logo */}
      <div className="flex items-center gap-1 touch-active shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-foreground" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-primary font-bold text-sm tracking-tight">
            BEAR<span className="text-foreground">FIT</span>
          </span>
          <span className="text-[8px] text-primary/70">Better fitness.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-secondary rounded-full p-0.5 mx-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onRoleChange?.(tab)}
            className={`px-1.5 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-medium transition-all touch-active ${
              activeRole === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={onOpenNotifications}
          className="relative p-2 bg-secondary rounded-lg touch-active"
        >
          <Bell className="w-4 h-4 text-foreground" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <button 
          onClick={onOpenChat}
          className="relative p-2 bg-secondary rounded-lg touch-active"
        >
          <MessageCircle className="w-4 h-4 text-foreground" />
          {chatCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {chatCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

// Desktop Header with Welcome message (no camera icon)
export function DesktopHeader({ 
  onOpenChat, 
  onOpenNotifications, 
  notificationCount = 3, 
  chatCount = 2,
  activeRole = "Member",
  onRoleChange,
  userName = "Alex"
}: HeaderProps) {
  const tabs = ["Member", "Staff", "Leads", "Admin"] as const

  return (
    <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-background/95 backdrop-blur-md z-40 border-b border-border/30">
      {/* Logo */}
      <div className="flex items-center gap-2 touch-active shrink-0">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-primary font-bold text-base tracking-tight">
            BEAR<span className="text-foreground">FIT</span>
          </span>
          <span className="text-[9px] text-primary/70">Better fitness.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-secondary rounded-full p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onRoleChange?.(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all touch-active ${
              activeRole === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={onOpenNotifications}
          className="relative p-2.5 bg-secondary rounded-xl touch-active hover:bg-secondary/80 transition-colors"
        >
          <Bell className="w-5 h-5 text-foreground" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <button 
          onClick={onOpenChat}
          className="relative p-2.5 bg-secondary rounded-xl touch-active hover:bg-secondary/80 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-foreground" />
          {chatCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {chatCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
