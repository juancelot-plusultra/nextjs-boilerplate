"use client";

import { useMemo, useState } from "react";

type Member = {
  id: string;
  name: string;
  packageName: string;
  totalSessions: number;
  used: number;
  left: number;
  lastCheckIn?: string;
};

type CheckInLog = {
  id: string;
  ts: string;
  type: "check-in";
  leftAfter: number;
  staff: string;
};

export default function CheckInPage() {
  // Mock members (replace later with Supabase)
  const [members, setMembers] = useState<Record<string, Member>>({
    M001: {
      id: "M001",
      name: "Juan Dela Cruz",
      packageName: "24 Sessions (Staggered)",
      totalSessions: 24,
      used: 23,
      left: 1,
      lastCheckIn: "2026-01-11 10:15",
    },
    M002: {
      id: "M002",
      name: "Belle",
      packageName: "24 Sessions (Full)",
      totalSessions: 24,
      used: 10,
      left: 14,
      lastCheckIn: "2026-01-18 18:02",
    },
  });

  const [logs, setLogs] = useState<CheckInLog[]>([]);
  const [memberId, setMemberId] = useState("");
  const [staff, setStaff] = useState("Coach/Staff");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const normalizedId = useMemo(() => memberId.trim().toUpperCase(), [memberId]);
  const found = members[normalizedId];

  function nowStamp() {
    const d = new Date();
    // simple local time string
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  }

  function handleCheckIn() {
    setMsg(null);
    setErr(null);

    if (!normalizedId) return setErr("Enter a Member ID (ex: M001).");
    const m = members[normalizedId];
    if (!m) return setErr(`No member found for ID: ${normalizedId}`);

    if (m.left <= 0) {
      return setErr("This member has 0 sessions left. Renew package before check-in.");
    }

    const leftAfter = m.left - 1;

    // update member
    setMembers((prev) => ({
      ...prev,
      [normalizedId]: {
        ...m,
        used: m.used + 1,
        left: leftAfter,
        lastCheckIn: nowStamp(),
      },
    }));

    // add log
    setLogs((prev) => [
      {
        id: crypto.randomUUID(),
        ts: nowStamp(),
        type: "check-in",
        leftAfter,
        staff: staff.trim() || "Staff",
      },
      ...prev,
    ]);

    setMsg(`✅ Check-in success for ${m.name}. Sessions left: ${leftAfter}`);
  }

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
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Dashboard
            </a>
            <a
              href="/members/M001"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Member Profile
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Staff Tool</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
              Check-in
              <span className="text-[#f37120]"> Station</span>
            </h1>
            <p className="mt-2 text-slate-600">
              Enter / scan Member ID, then tap <span className="font-semibold">Check in</span>.
            </p>
          </div>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Back to Home
          </a>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Input card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold">Scan / Enter</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Member ID
                </label>
                <input
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="M001"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#f37120]/40"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Tip: QR can contain the Member ID (we’ll add QR scan later).
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Staff Name
                </label>
                <input
                  value={staff}
                  onChange={(e) => setStaff(e.target.value)}
                  placeholder="Coach/Staff"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#f37120]/40"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleCheckIn}
                className="rounded-xl bg-[#f37120] px-5 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                Check in (deduct 1)
              </button>
              <button
                onClick={() => {
                  setMemberId("");
                  setMsg(null);
                  setErr(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Clear
              </button>
            </div>

            {err && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {err}
              </div>
            )}
            {msg && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                {msg}
              </div>
            )}
          </div>

          {/* Member preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Member Preview</h2>

            {!normalizedId ? (
              <p className="mt-3 text-sm text-slate-600">
                Enter a Member ID to preview details.
              </p>
            ) : !found ? (
              <p className="mt-3 text-sm font-semibold text-red-700">
                No member found for <span className="font-extrabold">{normalizedId}</span>
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Name</p>
                  <p className="mt-1 text-sm font-extrabold">{found.name}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold text-slate-500">Package</p>
                  <p className="mt-1 text-sm font-semibold">{found.packageName}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniStat label="Used" value={String(found.used)} />
                  <MiniStat label="Left" value={String(found.left)} highlight />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold text-slate-500">Last Check-in</p>
                  <p className="mt-1 text-sm font-semibold">
                    {found.lastCheckIn ?? "—"}
                  </p>
                </div>

                <a
                  href={`/members/${found.id}`}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Open Profile
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Logs */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Recent Check-ins</h2>
            <span className="text-xs font-semibold text-slate-500">
              Mock logs (Supabase next)
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Member</th>
                  <th className="px-4 py-3 font-semibold">Sessions Left After</th>
                  <th className="px-4 py-3 font-semibold">Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate-600" colSpan={4}>
                      No check-ins yet. Try Member ID <b>M001</b>.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id} className="bg-white">
                      <td className="px-4 py-3 text-slate-700">{l.ts}</td>
                      <td className="px-4 py-3 font-semibold">{normalizedId || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-[#f37120]/10 px-3 py-1 text-xs font-bold text-[#f37120]">
                          {l.leftAfter}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{l.staff}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function MiniStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p
        className={
          "mt-1 text-2xl font-extrabold " + (highlight ? "text-[#f37120]" : "")
        }
      >
        {value}
      </p>
    </div>
  );
}
