export default function DashboardPage() {
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
              href="/"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Home
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
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Dashboard
            </h1>
            <p className="mt-1 text-slate-600">
              BearFit PH admin dashboard (UI skeleton).
            </p>
          </div>

          {/* 🔴 THIS IS STEP 3 — CHECK-IN LINK */}
          <div className="flex gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
              Add Member
            </button>

            <a
              href="/checkin"
              className="rounded-xl bg-[#f37120] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Record Check-in
            </a>
          </div>
        </div>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Members" value="—" />
          <StatCard title="Check-ins Today" value="—" />
          <StatCard title="Payments Due" value="—" />
          <StatCard title="Low Sessions" value="—" />
        </section>

        {/* Main grid */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold">Recent Activity</h2>

            <div className="mt-4 overflow-hidden rounded-xl border">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Member</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">When</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <Row />
                  <Row />
                  <Row />
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Alerts</h2>

            <div className="mt-4 space-y-3">
              <AlertItem title="Low sessions" />
              <AlertItem title="Payment pending" />
              <AlertItem title="Renewal soon" />
            </div>

            <button className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              Send Reminders
            </button>
          </div>
        </section>

        {/* Members */}
        <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Members</h2>

          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Member</th>
                  <th className="px-4 py-3 font-semibold">Package</th>
                  <th className="px-4 py-3 font-semibold">Sessions Left</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <MemberRow />
                <MemberRow />
              </tbody>
            </table>
          </div>
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

function Row() {
  return (
    <tr>
      <td className="px-4 py-3 font-semibold">—</td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3">—</td>
    </tr>
  );
}

function AlertItem({ title }: { title: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-1 text-sm text-slate-600">—</p>
    </div>
  );
}

function MemberRow() {
  return (
    <tr>
      <td className="px-4 py-3 font-semibold">—</td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3 font-bold text-[#f37120]">—</td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3 text-right">
        <a
          href="/members/M001"
          className="rounded-lg border px-3 py-1 text-xs font-semibold hover:bg-slate-50"
        >
          View
        </a>
      </td>
    </tr>
  );
}
