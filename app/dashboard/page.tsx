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
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Dashboard
            </h1>
            <p className="mt-1 text-slate-600">
              Gym admin view (UI skeleton). We’ll connect real data + auth next.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
              Add Member
            </button>
            <button className="rounded-xl bg-[#f37120] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              Record Check-in
            </button>
          </div>
        </div>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Members" value="—" hint="Connect Supabase later" />
          <StatCard title="Check-ins Today" value="—" hint="Will come from logs" />
          <StatCard title="Payments Due" value="—" hint="From member balances" />
          <StatCard title="Low Sessions" value="—" hint="Alert list (≤3)" />
        </section>

        {/* Main grid */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Recent activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Activity</h2>
              <button className="text-sm font-semibold text-[#f37120] hover:opacity-80">
                View all
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Member</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">When</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <Row member="—" action="Check-in" when="—" status="Placeholder" />
                  <Row member="—" action="Payment" when="—" status="Placeholder" />
                  <Row member="—" action="Package" when="—" status="Placeholder" />
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Next: this table will be powered by Supabase (check-ins + payments).
            </p>
          </div>

          {/* Alerts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Alerts</h2>
            <p className="mt-1 text-sm text-slate-600">
              Members with low sessions / payment follow-ups.
            </p>

            <div className="mt-4 space-y-3">
              <AlertItem title="Low sessions" desc="— (connect data later)" />
              <AlertItem title="Payment due" desc="— (connect data later)" />
              <AlertItem title="Renewal soon" desc="— (connect data later)" />
            </div>

            <button className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              Send Reminder Emails
            </button>
          </div>
        </section>

        {/* Members quick view */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-bold">Members</h2>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none ring-[#f37120] focus:ring-2 sm:w-72"
                placeholder="Search members (name, ID, email)"
              />
              <select className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm">
                <option>All Packages</option>
                <option>24 Sessions (Full)</option>
                <option>24 Sessions (Staggered)</option>
                <option>48 Sessions (Full)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
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
              <tbody className="divide-y divide-slate-200">
                <MemberRow
                  name="—"
                  sub="Member ID —"
                  pkg="—"
                  left="—"
                  pay="—"
                />
                <MemberRow
                  name="—"
                  sub="Member ID —"
                  pkg="—"
                  left="—"
                  pay="—"
                />
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Next: hook this to your real “Members” data (Supabase), and the button will open a member profile page.
          </p>
        </section>
      </main>
    </div>
  );
}

/** Small components (same file for now) */

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function Row({
  member,
  action,
  when,
  status,
}: {
  member: string;
  action: string;
  when: string;
  status: string;
}) {
  return (
    <tr className="bg-white">
      <td className="px-4 py-3 font-semibold">{member}</td>
      <td className="px-4 py-3">{action}</td>
      <td className="px-4 py-3 text-slate-600">{when}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {status}
        </span>
      </td>
    </tr>
  );
}

function AlertItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function MemberRow({
  name,
  sub,
  pkg,
  left,
  pay,
}: {
  name: string;
  sub: string;
  pkg: string;
  left: string;
  pay: string;
}) {
  return (
    <tr className="bg-white">
      <td className="px-4 py-3">
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </td>
      <td className="px-4 py-3 text-slate-700">{pkg}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-[#f37120]/10 px-3 py-1 text-xs font-bold text-[#f37120]">
          {left}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-700">{pay}</td>
      <td className="px-4 py-3 text-right">
        <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50">
          View
        </button>
      </td>
    </tr>
  );
}
