
"use client"

import { useState } from "react"
import { CalendarDays, Clock3, MapPin, User2, Plus } from "lucide-react"
import BookSessionModal from "@/components/bearfit/member/book-session-modal"

const upcomingSessions = [
  {
    id: 1,
    title: "Strength Training",
    coach: "Coach Joaquin",
    date: "Tomorrow",
    time: "6:00 PM",
    location: "Main Floor",
  },
]

export default function MemberScheduleView() {
  const [showBooking, setShowBooking] = useState(false)

  return (
    <div className="space-y-6 px-4 lg:px-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">My Schedule</h2>

        <button
          onClick={() => setShowBooking(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs text-white"
        >
          <Plus className="h-4 w-4" />
          Book Session
        </button>
      </div>

      {upcomingSessions.map((session) => (
        <div key={session.id} className="rounded-xl border border-border/30 bg-[#141414] p-4">
          <p className="text-sm font-semibold">{session.title}</p>
          <div className="text-xs text-muted-foreground mt-2">
            {session.date} • {session.time} • {session.coach}
          </div>
        </div>
      ))}

      {showBooking && (
        <BookSessionModal close={() => setShowBooking(false)} />
      )}
    </div>
  )
}
