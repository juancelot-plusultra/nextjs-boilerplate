"use client"
import BookSessionModal from "@/components/bearfit/member/book-session-modal"
import { useState } from "react"
import { CalendarDays, Clock3, MapPin, User2, Plus } from "lucide-react"

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

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">My Schedule</h2>
          <p className="text-xs text-muted-foreground">
            Manage and book your training sessions
          </p>
        </div>

        <button
          onClick={() => setShowBooking(true)}
          className="flex items-center gap-2 text-xs bg-primary px-3 py-2 rounded-full text-white"
        >
          <Plus className="w-4 h-4" />
          Book Session
        </button>
      </div>

      {/* UPCOMING SESSIONS */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Upcoming Sessions
        </h3>

        {upcomingSessions.map((session) => (
          <div
            key={session.id}
            className="bg-[#141414] border border-border/30 rounded-xl p-4"
          >
            <p className="text-sm font-semibold">{session.title}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <User2 className="w-3 h-3" />
              {session.coach}
            </div>

            <div className="mt-3 grid gap-1 text-xs text-muted-foreground">

              <div className="flex items-center gap-2">
                <CalendarDays className="w-3 h-3" />
                {session.date}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="w-3 h-3" />
                {session.time}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {session.location}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* COACH AVAILABILITY */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Coach Availability
        </h3>

        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-[#141414] border border-border/30 rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-semibold">{coach.name}</p>
              <p className="text-xs text-muted-foreground">
                {coach.specialty}
              </p>
              <p className="text-xs text-primary mt-1">
                {coach.availability}
              </p>
            </div>

            <button
              onClick={() => setShowBooking(true)}
              className="text-xs px-3 py-1.5 bg-primary rounded-full text-white"
            >
              Book
            </button>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#141414] p-6 rounded-xl w-[90%] max-w-md">

            <h3 className="text-lg font-semibold mb-4">
              Book a Session
            </h3>

            <div className="space-y-3">

              <input
                placeholder="Choose Coach"
                className="w-full bg-[#1e1e1e] border border-border rounded-lg p-2 text-sm"
              />

              <input
                placeholder="Select Date"
                className="w-full bg-[#1e1e1e] border border-border rounded-lg p-2 text-sm"
              />

              <input
                placeholder="Select Time"
                className="w-full bg-[#1e1e1e] border border-border rounded-lg p-2 text-sm"
              />

            </div>

            <div className="flex gap-3 mt-5">

              <button
                onClick={() => setShowBooking(false)}
                className="flex-1 py-2 text-sm border border-border rounded-lg"
              >
                Cancel
              </button>

              <button
                className="flex-1 py-2 text-sm bg-primary rounded-lg text-white"
              >
                Confirm
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  )
}
