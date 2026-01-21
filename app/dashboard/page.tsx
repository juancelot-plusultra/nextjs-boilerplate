"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type PaymentRow = {
  id: string;
  member_id: string;
  package_name: string | null;
  stage: string | null;
  amount: number | null;
  status: string | null;
  created_at: string;
  paid_at: string | null;

  // ✅ FIX: Supabase join often returns an ARRAY
  members?: { member_code: string | null; name: string | null }[] | null;
};

function peso(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(dateIso?: string | null) {
  if (!dateIso) return false;
  const d = new Date(dateIso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function DashboardPage() {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRecentPayments() {
    setLoading(true);
    setError(null);

    // NOTE: "members:members(...)" returns members as array sometimes
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        id,
        member_id,
        package_name,
        stage,
        amount,
        status,
        created_at,
        paid_at,
        members:members ( member_code, name )
      `
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      setError(error.message);
      setRows([]);
      setLoading(false);
      return;
    }

    // ✅ Normalize to PaymentRow[]
    setRows((data ?? []) as unknown as PaymentRow[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchRecentPayments();
  }, []);

  const stats = useMemo(() => {
    const pending = rows.filter((r) => (r.status ?? "").toLowerCase() !== "paid");
    const paidToday = rows.filter(
      (r) => (r.status ?? "").toLowerCase() === "paid" && isToday(r.paid_at)
    );

    const overdue = pending.filter((r) => {
      const created = new Date(r.created_at).getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      return Date.now() - created > sevenDays;
    });

    return {
      paymentsDue: pending.length,
      paidToday: paidToday.length,
      overdue: overdue.length,
      renewalsSoon: 0,
    };
  }, [rows]);

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div className="text-xl font-extrabold">
          Bear<span className="text-orange-500">Fit</span>PH
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/payments"
            className="rounded-full border border-black px-4 py-2 text-sm font-semibold"
          >
            Payments
          </a>
          <a
            href="/"
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Log out
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-10">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard title="Payments Due" value={stats.paymentsDue} />
          <StatCard title="Paid Today" value={stats.paidToday} />
          <StatCard title="Overdue" value={stats.overdue} />
          <StatCard title="Renewals Soon" value={stats.renewalsSoon} />
        </div>

        {/* Recent Payments */}
        <section className="mt-6 rounded-3xl border-2 border-black p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">Recent Payments</h2>
            <button
              onClick={fetchRecentPayments}
              className="rounded-2xl border border-black px-4 py-2 text-sm font-semibold"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 overflow-hidden rounded-2xl border border-black">
            <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-bold uppercase">
              <div className="col-span-3">Member</div>
              <div className="col-span-3">Package</div>
              <div className="col-span-2">Stage</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">When</div>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-sm">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="px-4 py-6 text-sm">No payments found.</div>
            ) : (
              <div className="divide-y divide-black/10">
                {rows.map((r) => {
                  const status = (r.status ?? "pending").toLowerCase();
                  const isPaid = status === "paid";

                  // ✅ take the first joined member
                  const m = r.members?.[0] ?? null;
                  const code = m?.member_code ?? "";

                  return (
                    <div
                      key={r.id}
                      className="grid grid-cols-12 items-center px-4 py-4 text-sm"
                    >
                      <div className="col-span-3">
                        <div className="font-bold">{m?.name ?? "—"}</div>
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                          <span>ID: {code || "—"}</span>
                          {code ? (
                            <a
                              className="text-orange-600 underline"
                              href={`/members/${encodeURIComponent(code)}`}
                            >
                              View
                            </a>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-span-3">{r.package_name ?? "—"}</div>

                      <div className="col-span-2">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                          {r.stage ?? "—"}
                        </span>
                      </div>

                      <div className="col-span-2 font-extrabold text-orange-500">
                        {peso(r.amount)}
                      </div>

                      <div className="col-span-1">
                        <span
                          className={
                            "rounded-full px-3 py-1 text-xs font-bold " +
                            (isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800")
                          }
                        >
                          {isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>

                      <div className="col-span-1 text-right text-xs text-gray-700">
                        {isPaid ? fmtDate(r.paid_at) : fmtDate(r.created_at)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-black/20 bg-white p-4">
            <div className="font-bold">Notes</div>
            <div className="text-sm text-gray-700">
              This dashboard pulls real payment status from Supabase (payments table).
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border-2 border-black p-4">
      <div className="text-sm font-semibold text-gray-700">{title}</div>
      <div className="mt-2 text-3xl font-extrabold">{value ?? 0}</div>
    </div>
  );
}
