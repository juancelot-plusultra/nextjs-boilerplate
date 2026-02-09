"use client"

import { CheckCircle, Flame, Target, Star } from "lucide-react"

type BadgeType = "top" | "verified" | "target" | "fire"

const badgeConfig: Record<BadgeType, {
  label: string
  icon: any
  color: string
}> = {
  top: {
    label: "Top Member",
    icon: Star,
    color: "text-yellow-400 bg-yellow-400/10 ring-yellow-400/30",
  },
  verified: {
    label: "Verified",
    icon: CheckCircle,
    color: "text-blue-400 bg-blue-400/10 ring-blue-400/30",
  },
  target: {
    label: "On Target",
    icon: Target,
    color: "text-green-400 bg-green-400/10 ring-green-400/30",
  },
  fire: {
    label: "On Fire",
    icon: Flame,
    color: "text-orange-400 bg-orange-400/10 ring-orange-400/30",
  },
}

export function StatusBadge({ type }: { type: BadgeType }) {
  const { label, icon: Icon, color } = badgeConfig[type]

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ring-1 ${color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="font-medium">{label}</span>
    </div>
  )
}
