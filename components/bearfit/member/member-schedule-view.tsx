"use client"

import { CalendarDays, Clock3, MapPin, User2 } from "lucide-react"

const sessions = [
  {
    id: 1,
    title: "Strength Training",
    coach: "Coach Joaquin",
    date: "Tomorrow",
    time: "6:00 PM",
    location: "Main Floor",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Reformer Pilates",
    coach: "Coach Mika",
    date: "Thursday",
    time: "4:00 PM",
    location: "Pilates Studio",
    status: "Confirmed",
  },
  {
    id: 3,
    title: "Conditioning Session",
    coach: "Coach Joaquin",
    date: "Saturday",
    time: "9:00 AM",
    location: "Performance Zone",
    status: "Upcoming",
  },
]

export default function MemberScheduleView() {
  return (
    <div className="space-y-5">
      <div className="px-4 lg:px-0">
        <h2 className="text-lg font-bold text-foreground">My Schedule</h2>
        <p className="text-xs text-muted-foreground mt-1">
          View your upcoming training sessions
        </p>
      </div>

      <div className="space-y-3 px-4 lg:px-0">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-[#141414] border border-border/30 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {session.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                  <User2 className="w-3.5 h-3.5" />
                  <span>{session.coach}</span>
                </div>
              </div>

              <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium">
                {session.status}
              </span>
            </div>

            <div className="mt-4 grid gap-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{session.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="w-3.5 h-3.5" />
                <span>{session.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{session.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
