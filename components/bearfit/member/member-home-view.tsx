"use client"

import { Calendar, CreditCard, QrCode, Bell, ChevronRight, Dumbbell, Star } from "lucide-react"

export default function MemberHomeView() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#5b3df5] to-[#7b61ff] p-6 text-white shadow-lg">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm/6 text-white/80">Welcome back</p>
                <h1 className="text-2xl font-bold md:text-3xl">BearFit Member Dashboard</h1>
                <p className="mt-2 max-w-xl text-sm text-white/85">
                  Track your sessions, payments, and profile details all in one place.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                  <p className="text-xs text-white/80">Sessions Left</p>
                  <p className="mt-1 text-2xl font-bold">12</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                  <p className="text-xs text-white/80">Membership</p>
                  <p className="mt-1 text-lg font-semibold">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-2xl bg-[#eef2ff] p-3 text-[#5b3df5]">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-500">Upcoming</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Next Session</h3>
              <p className="mt-2 text-sm text-slate-600">Tomorrow • 6:00 PM</p>
              <p className="mt-1 text-sm text-slate-500">Strength & Conditioning</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-2xl bg-[#fff4e8] p-3 text-[#f37120]">
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-500">Billing</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Latest Payment</h3>
              <p className="mt-2 text-sm text-slate-600">₱2,500 received</p>
              <p className="mt-1 text-sm text-slate-500">Updated yesterday</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-2xl bg-[#ecfdf3] p-3 text-[#16a34a]">
                  <QrCode className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-500">Access</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Member QR</h3>
              <p className="mt-2 text-sm text-slate-600">Ready for check-in</p>
              <p className="mt-1 text-sm text-slate-500">Use at front desk</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Today’s Overview</h2>
                <button className="inline-flex items-center gap-1 text-sm font-medium text-[#5b3df5]">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="rounded-2xl bg-[#eef2ff] p-3 text-[#5b3df5]">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Workout Program</p>
                    <p className="text-sm text-slate-500">Push day routine prepared by your coach</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="rounded-2xl bg-[#fff7ed] p-3 text-[#f37120]">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Reminder</p>
                    <p className="text-sm text-slate-500">Please arrive 10 minutes before your session</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="rounded-2xl bg-[#fef2f2] p-3 text-[#e11d48]">
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Rewards</p>
                    <p className="text-sm text-slate-500">You earned 50 BearForce points this week</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Member Status</h2>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Package Progress</span>
                    <span className="font-medium text-slate-900">12 / 24</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-1/2 rounded-full bg-[#5b3df5]" />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Coach</p>
                  <p className="mt-1 font-medium text-slate-900">Coach Joaquin</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Branch</p>
                  <p className="mt-1 font-medium text-slate-900">BearFit Main Studio</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Account Status</p>
                  <p className="mt-1 font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
