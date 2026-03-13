"use client"

import { CalendarDays, Clock, MapPin } from "lucide-react"

export default function MemberScheduleView() {
  const sessions = [
    {
      date: "Tomorrow",
      time: "6:00 PM",
      coach: "Coach Joaquin",
      type: "Strength Training",
      location: "Main Studio",
    },
    {
      date: "Thursday",
      time: "5:00 PM",
      coach: "Coach Mika",
      type: "Reformer Pilates",
      location: "Pilates Studio",
    },
    {
      date: "Saturday",
      time: "9:00 AM",
      coach: "Coach Joaquin",
      type: "Strength & Conditioning",
      location: "Main Studio",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            My Schedule
          </h1>
          <p className="text-sm text-slate-500">
            View your upcoming training sessions
          </p>
        </div>

        <div className="space-y-4">

          {sessions.map((session, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {session.type}
                    </p>

                    <p className="text-sm text-slate-500">
                      {session.coach}
                    </p>
                  </div>

                </div>

                <span className="text-sm text-slate-500">
                  {session.date}
                </span>

              </div>

              <div className="mt-4 flex gap-6 text-sm text-slate-600">

                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  {session.time}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {session.location}
                </div>

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
