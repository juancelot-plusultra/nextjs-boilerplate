"use client"

export default function MemberScheduleView() {
  return (
    <div className="space-y-6">

      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h2 className="text-xl font-semibold">Schedule</h2>
        <p className="text-gray-500 text-sm mt-1">
          View and manage your upcoming sessions.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <p className="text-gray-500">
          Your scheduled sessions will appear here.
        </p>
      </div>

    </div>
  )
}
