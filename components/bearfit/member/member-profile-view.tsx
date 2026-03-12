"use client"

export default function MemberProfileView() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your personal details and account information.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <p className="text-gray-500">
          Your profile information will appear here.
        </p>
      </div>
    </div>
  )
}
