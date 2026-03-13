"use client"

import { User, Phone, Mail } from "lucide-react"

export default function MemberProfileView() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">

        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          My Profile
        </h1>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="space-y-6">

            <div className="flex items-center gap-3">
              <User className="text-indigo-500" />
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="font-medium text-slate-900">
                  Juan Dela Cruz
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-indigo-500" />
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">
                  juan@email.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-indigo-500" />
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">
                  +63 912 345 6789
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
