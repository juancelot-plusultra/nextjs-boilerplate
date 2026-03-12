"use client"

export default function MemberHomeView() {
  return (
    <div className="space-y-6">

      {/* Welcome Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold">Welcome back</h2>
        <p className="text-gray-500 text-sm mt-1">
          Here is your account overview.
        </p>
      </div>

      {/* Example Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <p className="text-gray-500 text-sm">Sessions Left</p>
          <h3 className="text-2xl font-bold">12</h3>
        </div>

        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <p className="text-gray-500 text-sm">Next Session</p>
          <h3 className="text-lg font-semibold">Tomorrow</h3>
        </div>

        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <p className="text-gray-500 text-sm">Membership</p>
          <h3 className="text-lg font-semibold">Active</h3>
        </div>

      </div>

    </div>
  )
}
