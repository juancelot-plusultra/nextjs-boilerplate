export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="text-xl font-extrabold tracking-tight">
            Bear<span className="text-[#f37120]">Fit</span>PH
          </a>

          <div className="flex items-center gap-2">
            <a
              href="/dashboard"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Dashboard
            </a>
            <a
              href="/login"
              className="rounded-full bg-[#f37120] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Log out
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Payments
            </h1>
            <p className="mt-1 text-slate-600">
              Track payments, staggered balances, and pending renewals.
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Payments Due" value="—" />
          <StatCard title="Paid Today" value="—" />
          <StatCard title="Overdue" value="—" />
          <StatCard title="Renewals Soon" value="—" />
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-bold">Payment Records</h2>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                placeholder="Search member (name / ID)"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f37120]/40 sm:w-64"
              />
              <select className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
                <option>All Packages</option>
                <option>24 Sessions (Full)</option>
                <option>24 Sessions (Staggered)</option>
                <option>48 Sessions (Full)</option>
              </select>
              <select className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Member</th>
                  <th className="px-4 py-3 font-semibold">Package</th>
                  <th className="px-4 py-3 font-semibold">Payment Stage</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <PaymentRow />
                <PaymentRow />
                <PaymentRow />
              </tbody>
            </table>
          </div>
        </section>

        {/* Notes */}
        <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Notes</h2>
          <p className="mt-1 text-sm text-slate-600">
            Next step: connect this page to Supabase so “Mark as Paid” updates
            member balances, sends email receipts, and clears alerts.
          </p>
        </section>
      </main>
    </div>
  );
}

/* Components */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function PaymentRow() {
  return (
    <tr>
      <td className="px-4 py-3 font-semibold">
        Juan Dela Cruz
        <div className="text-xs text-slate-500">ID: M001</div>
      </td>
      <td className="px-4 py-3">24 Sessions (Staggered)</td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
          13th–24th
        </span>
      </td>
      <td className="px-4 py-3 font-bold text-[#f37120]">
        ₱5,800
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
          Pending
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button className="rounded-xl bg-[#f37120] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
          Mark as Paid
        </button>
      </td>
    </tr>
  );
}
