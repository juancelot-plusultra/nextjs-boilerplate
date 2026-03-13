"use client"

import { CreditCard, Receipt } from "lucide-react"

export default function MemberPaymentView() {

  const payments = [
    {
      date: "June 10, 2026",
      amount: "₱2,500",
      package: "12 Session Package",
    },
    {
      date: "May 10, 2026",
      amount: "₱2,500",
      package: "12 Session Package",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Payments
          </h1>
          <p className="text-sm text-slate-500">
            Your membership payments and history
          </p>
        </div>

        <div className="space-y-4">

          {payments.map((payment, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="rounded-2xl bg-green-100 p-3 text-green-600">
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {payment.package}
                    </p>

                    <p className="text-sm text-slate-500">
                      {payment.date}
                    </p>
                  </div>

                </div>

                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {payment.amount}
                  </p>

                  <p className="text-sm text-green-600">
                    Paid
                  </p>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  )
}
