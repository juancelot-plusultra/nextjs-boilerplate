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
  {
    id: 2,
    title: "Reformer Pilates",
    coach: "Coach Mika",
    date: "Thursday",
    time: "4:00 PM",
    location: "Pilates Studio",
  },
]

const coaches = [
  {
    id: 1,
    name: "Coach Joaquin",
    availability: "Today 5PM - 9PM",
    specialty: "Strength & Conditioning",
  },
  {
    id: 2,
    name: "Coach Mika",
    availability: "Tomorrow 3PM - 7PM",
    specialty: "Pilates Reformer",
  },
  {
    id: 3,
    name: "Coach Luis",
    availability: "Saturday 8AM - 12PM",
    specialty: "Sports Conditioning",
  },
]

export default function MemberScheduleView() {
  const [showBooking, setShowBooking] = useState(false)

  return (
    <div className="space-y-6 px-4 lg:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">My Schedule</h2>
          <p className="text-xs text-muted-foreground">
            Manage and book your training sessions
          </p>
        </div>

        <button
          onClick={() => setShowBooking(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs text-white"
        >
          <Plus className="h-4 w-4" />
          Book Session
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Upcoming Sessions
        </h3>

        {upcomingSessions.map((session) => (
          <div
            key={session.id}
            className="rounded-xl border border-border/30 bg-[#141414] p-4"
          >
            <p className="text-sm font-semibold text-foreground">
              {session.title}
            </p>

            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <User2 className="h-3 w-3" />
              {session.coach}
            </div>

            <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3 w-3" />
                {session.date}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-3 w-3" />
                {session.time}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {session.location}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Coach Availability
        </h3>

        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="flex items-center justify-between rounded-xl border border-border/30 bg-[#141414] p-4"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                {coach.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {coach.specialty}
              </p>
              <p className="mt-1 text-xs text-primary">
                {coach.availability}
              </p>
            </div>

            <button
              onClick={() => setShowBooking(true)}
              className="rounded-full bg-primary px-3 py-1.5 text-xs text-white"
            >
              Book
            </button>
          </div>
        ))}
      </div>

      {showBooking && (
        <BookSessionModal close={() => setShowBooking(false)} />
      )}
    </div>
  )
}
