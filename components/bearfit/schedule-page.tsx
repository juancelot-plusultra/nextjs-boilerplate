"use client"

import { ChevronLeft, ChevronRight, Clock, MapPin, User, X, Plus, Check } from "lucide-react"
import { useState, useMemo } from "react"

// Helper to get days in a month
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()

// Helper to get first day of month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay()
  // Convert to Monday = 0, Sunday = 6
  return day === 0 ? 6 : day - 1
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const scheduledSessions = [
  {
    time: "6:00 AM",
    title: "Morning Yoga",
    coach: "Coach Maria",
    location: "Malingap Branch",
    duration: "60 min",
    type: "yoga",
    color: "bg-purple-500",
  },
  {
    time: "10:00 AM",
    title: "Weight Training",
    coach: "Coach Joaquin",
    location: "Malingap Branch",
    duration: "90 min",
    type: "weights",
    color: "bg-primary",
  },
  {
    time: "4:00 PM",
    title: "HIIT Cardio",
    coach: "Coach Alex",
    location: "E.Rod Branch",
    duration: "45 min",
    type: "cardio",
    color: "bg-red-500",
  },
]

const availableSessions = [
  { id: 1, title: "Morning Yoga", coach: "Coach Maria", times: ["6:00 AM", "7:00 AM", "8:00 AM"], location: "Malingap Branch", duration: "60 min" },
  { id: 2, title: "Weight Training", coach: "Coach Joaquin", times: ["9:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"], location: "Malingap Branch", duration: "90 min" },
  { id: 3, title: "HIIT Cardio", coach: "Coach Alex", times: ["6:00 AM", "12:00 PM", "5:00 PM"], location: "E.Rod Branch", duration: "45 min" },
  { id: 4, title: "Boxing Training", coach: "Coach Miguel", times: ["3:00 PM", "5:00 PM", "7:00 PM"], location: "Malingap Branch", duration: "60 min" },
  { id: 5, title: "Muay Thai", coach: "Coach Somchai", times: ["6:00 PM", "7:30 PM"], location: "Cubao Branch", duration: "90 min" },
]

export function SchedulePage() {
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(1) // February (0-indexed)
  const [selectedDay, setSelectedDay] = useState(3) // Default to 3rd (today in Feb 2026)
  const [showBooking, setShowBooking] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedSession, setSelectedSession] = useState<typeof availableSessions[0] | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  // Calculate week days to display based on selected day
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  
  // Get the week containing the selected day
  const getWeekDays = useMemo(() => {
    const dayOfWeek = new Date(currentYear, currentMonth, selectedDay).getDay()
    // Convert to Monday = 0, Sunday = 6
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    
    // Calculate the Monday of the current week
    const monday = selectedDay - adjustedDayOfWeek
    
    const weekDays: { day: string; date: number; isCurrentMonth: boolean }[] = []
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    for (let i = 0; i < 7; i++) {
      const date = monday + i
      let actualDate = date
      let isCurrentMonth = true
      
      if (date < 1) {
        // Previous month
        const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1)
        actualDate = prevMonthDays + date
        isCurrentMonth = false
      } else if (date > daysInMonth) {
        // Next month
        actualDate = date - daysInMonth
        isCurrentMonth = false
      }
      
      weekDays.push({
        day: dayNames[i],
        date: actualDate,
        isCurrentMonth
      })
    }
    
    return weekDays
  }, [currentYear, currentMonth, selectedDay, daysInMonth])

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDay(1) // Reset to first day of new month
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDay(1) // Reset to first day of new month
  }

  const handleSelectSession = (session: typeof availableSessions[0]) => {
    setSelectedSession(session)
    setBookingStep(2)
  }

  const handleSelectTime = (time: string) => {
    setSelectedTime(time)
  }

  const handleConfirmBooking = () => {
    setBookingConfirmed(true)
    setTimeout(() => {
      setShowBooking(false)
      setBookingStep(1)
      setSelectedSession(null)
      setSelectedTime("")
      setBookingConfirmed(false)
    }, 2000)
  }

  const resetBooking = () => {
    setShowBooking(false)
    setBookingStep(1)
    setSelectedSession(null)
    setSelectedTime("")
    setBookingConfirmed(false)
  }

  const handleDayClick = (weekDay: { day: string; date: number; isCurrentMonth: boolean }) => {
    if (weekDay.isCurrentMonth) {
      setSelectedDay(weekDay.date)
    }
  }

  const weekDays = useMemo(() => {
    const dayOfWeek = new Date(currentYear, currentMonth, selectedDay).getDay()
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const monday = selectedDay - adjustedDayOfWeek
    const weekDays: { day: string; date: number; isCurrentMonth: boolean }[] = []
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    for (let i = 0; i < 7; i++) {
      const date = monday + i
      let actualDate = date
      let isCurrentMonth = true
      
      if (date < 1) {
        const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1)
        actualDate = prevMonthDays + date
        isCurrentMonth = false
      } else if (date > daysInMonth) {
        actualDate = date - daysInMonth
        isCurrentMonth = false
      }
      
      weekDays.push({
        day: dayNames[i],
        date: actualDate,
        isCurrentMonth
      })
    }
    
    return weekDays
  }, [currentYear, currentMonth, selectedDay, daysInMonth])

  return (
    <div className="px-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground tracking-tight">Schedule</h1>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 bg-secondary rounded-lg touch-active" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold px-2">{monthNames[currentMonth]} {currentYear}</span>
          <button className="p-1.5 bg-secondary rounded-lg touch-active" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto hide-scrollbar pb-1">
        {weekDays.map((weekDay, index) => (
          <button
            key={weekDay.day}
            onClick={() => handleDayClick(weekDay)}
            className={`flex flex-col items-center py-2 px-3 rounded-xl min-w-[48px] touch-active transition-all ${
              selectedDay === weekDay.date && weekDay.isCurrentMonth
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <span className="text-[10px] font-medium">{weekDay.day}</span>
            <span className="text-base font-bold mt-0.5">{weekDay.date}</span>
          </button>
        ))}
      </div>

      {/* Sessions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Today's Sessions</h2>
        
        {scheduledSessions.map((session, index) => (
          <div
            key={index}
            className="bg-[#141414] rounded-xl p-3 border border-border/30 touch-active card-press"
          >
            <div className="flex gap-3">
              <div className={`w-1 self-stretch ${session.color} rounded-full shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground font-medium">{session.time}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-muted-foreground shrink-0">
                    {session.duration}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mt-0.5 truncate">{session.title}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span className="truncate">{session.coach}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{session.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Book */}
      <button 
        onClick={() => setShowBooking(true)}
        className="w-full mt-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold touch-active flex items-center justify-center gap-2 text-sm"
      >
        <Plus className="w-4 h-4" />
        Book New Session
      </button>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] rounded-t-3xl lg:rounded-2xl overflow-hidden border border-border/50 animate-slide-up max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-[#141414] z-10">
              <div className="flex items-center gap-3">
                {bookingStep > 1 && !bookingConfirmed && (
                  <button 
                    onClick={() => {
                      setBookingStep(1)
                      setSelectedSession(null)
                      setSelectedTime("")
                    }}
                    className="p-1 rounded-full bg-secondary touch-active"
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <h3 className="text-base font-semibold text-foreground">
                  {bookingConfirmed ? "Booking Confirmed" : bookingStep === 1 ? "Select Session" : "Select Time"}
                </h3>
              </div>
              <button 
                onClick={resetBooking}
                className="p-1.5 rounded-full bg-secondary touch-active"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {bookingConfirmed ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground">Session Booked!</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedSession?.title} at {selectedTime}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedSession?.location} with {selectedSession?.coach}
                  </p>
                </div>
              ) : bookingStep === 1 ? (
                <div className="space-y-2">
                  {availableSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className="w-full bg-secondary rounded-xl p-3 text-left touch-active card-press"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{session.title}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{session.coach}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-primary font-medium">{session.times.length} slots</p>
                          <p className="text-[10px] text-muted-foreground">{session.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : selectedSession && (
                <div>
                  {/* Selected Session Info */}
                  <div className="bg-secondary rounded-xl p-3 mb-4">
                    <h4 className="text-sm font-semibold text-foreground">{selectedSession.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {selectedSession.coach} - {selectedSession.location}
                    </p>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Selected Date</p>
                    <div className="bg-secondary rounded-xl p-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {monthNames[currentMonth]} {selectedDay}, {currentYear}
                      </span>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Available Times</p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedSession.times.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleSelectTime(time)}
                          className={`py-2.5 rounded-xl text-xs font-semibold touch-active transition-all ${
                            selectedTime === time
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <button 
                    onClick={handleConfirmBooking}
                    disabled={!selectedTime}
                    className="w-full mt-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold touch-active disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
