"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

const timeSlots = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
]

export default function BookSessionModal({ close }: { close: () => void }) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState<string | null>(null)

  async function bookSession() {
    if (!date || !time) return

    const { error } = await supabase.from("bookings").insert({
      session_date: date,
      session_time: time,
      session_type: "Personal Training",
      coach_name: "TBD",
    })

    if (!error) close()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#141414] p-6 rounded-xl w-[90%] max-w-md">
        <h3 className="text-lg font-semibold mb-4">Book a Session</h3>

        <div className="space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-border rounded-lg p-2 text-sm"
          />

          <div className="grid grid-cols-3 gap-2 mt-4">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setTime(slot)}
                className={`text-xs py-2 rounded-lg border ${
                  time === slot
                    ? "bg-primary text-white"
                    : "border-border"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={close}
            className="flex-1 py-2 text-sm border border-border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={bookSession}
            className="flex-1 py-2 text-sm bg-primary rounded-lg text-white"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  )
}
