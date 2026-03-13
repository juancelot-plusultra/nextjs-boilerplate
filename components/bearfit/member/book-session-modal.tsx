"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

const coaches = [
  "Coach Joaquin",
  "Coach Mika",
  "Coach Luis",
]

const timeSlots = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
]

export default function BookSessionModal({
  close,
}: {
  close: () => void
}) {
  const [coach, setCoach] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(false)

  async function bookSession() {
    if (!coach || !date || !time) return

    setLoading(true)

    const { error } = await supabase.from("bookings").insert({
      coach_name: coach,
      session_date: date,
      session_time: time,
      session_type: "Personal Training",
    })

    setLoading(false)

    if (!error) {
      close()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-3xl bg-[#141414] p-6 border border-border/40 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">
          Book a Session
        </h3>

        <div className="space-y-4">
          <select
            value={coach}
            onChange={(e) => setCoach(e.target.value)}
            className="w-full rounded-2xl border border-border bg-[#1d1d1d] px-4 py-4 text-sm text-white outline-none"
          >
            <option value="">Choose Coach</option>
            {coaches.map((coachName) => (
              <option key={coachName} value={coachName}>
                {coachName}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-border bg-[#1d1d1d] px-4 py-4 text-sm text-white outline-none"
          />

          <div>
            <p className="mb-3 text-sm font-medium text-white">Select Time</p>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`rounded-xl border px-3 py-3 text-xs font-medium transition ${
                    time === slot
                      ? "bg-primary text-white border-primary"
                      : "bg-[#1d1d1d] text-slate-300 border-border hover:border-primary/60"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={close}
            className="flex-1 rounded-2xl border border-border bg-transparent py-4 text-white"
          >
            Cancel
          </button>

          <button
            onClick={bookSession}
            disabled={!coach || !date || !time || loading}
            className="flex-1 rounded-2xl bg-primary py-4 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  )
}
