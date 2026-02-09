"use client"

import { CheckCircle, Flame, Target, Trophy } from "lucide-react"

type StatusType = "top" | "verified" | "target" | "fire"

const styles: Record<
  StatusType,
  { label: string; icon: any; bg: string; text: string }
> = {
  top: {
    label: "Top Member",
    icon: Trophy,
    bg: "bg-yellow-500/15",
    text: "text-yellow-500",
  },
  verified: {
    label: "Verified",
    icon: CheckCircle,
    bg: "bg-green-500/15",
    text: "text-green-500",
  },
  target: {
    label: "On Target",
    icon: Target,
    bg: "bg-blue-500/15",
    text: "text-blue-500",
  },
  fire: {
    label: "On Fire",
    icon: Flame,
    bg: "bg-orange-500/15",
    text: "text-orange-500",
  },
}

export function StatusBadge({ type }: { type: StatusType }) {
  const Icon = styles[type].icon

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${styles[type].bg} ${styles[type].text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {styles[type].label}
    </div>
  )
}
