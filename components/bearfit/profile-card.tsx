"use client"

import Image from "next/image"
import { StatusBadge } from "@/components/bearfit/StatusBadge"

type ProfileCardProps = {
  name?: string
  avatarSrc?: string
}

export function ProfileCard({
  name = "Alex",
  avatarSrc = "/avatars/default.jpg",
}: ProfileCardProps) {
  return (
    <div className="w-full rounded-2xl border border-border bg-background p-5">
      {/* Top Row */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-secondary shrink-0">
          <Image
            src={avatarSrc}
            alt="Profile picture"
            width={56}
            height={56}
            className="object-cover"
            priority
          />
        </div>

        {/* Name + badges */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">
            {name}
          </h3>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            <StatusBadge type="top" />
            <StatusBadge type="verified" />
            <StatusBadge type="target" />
            <StatusBadge type="fire" />
          </div>
        </div>
      </div>
    </div>
  )
}
