"use client"

export default function MemberPaymentView() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h2 className="text-xl font-semibold">Payment</h2>
        <p className="text-gray-500 text-sm mt-1">
          View your billing details and payment history.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <p className="text-gray-500">
          Your payment records and invoices will appear here.
        </p>
      </div>
    </div>
  )
}
