"use client"

import { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
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
  const [date, setDate] = useState<Date | null>(new Date())
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

        <h3 className="text-lg font-semibold mb-4">
          Book a Session
        </h3>

        {/* Calendar */}
        <Calendar
          onChange={(value) => setDate(value as Date)}
          value={date}
        />

        {/* Time Slots */}
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

        <button
          onClick={bookSession}
          className="w-full mt-5 bg-primary py-2 rounded-lg text-white"
        >
          Confirm Booking
        </button>

      </div>
    </div>
  )
}
