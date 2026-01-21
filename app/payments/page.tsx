"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Payment = {
  id: string;
  member_id: string;
  package_name: string | null;
  stage: string | null;
  amount: number | null;
  status: string | null;
  created_at: string | null;
  paid_at: string | null;
};

function peso(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PaymentsPage() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // track which payment is currently being updated
  const [savingId, setSavingId] = useState<string | null>(null);

  async function fetchPayments() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("payments")
      .select("id, member_id, package_name, stage, amount, status, created_at, paid_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows((data ?? []) as Payment[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  const pendingCount = useMemo(
    () => rows.filter((r) => (r.status ?? "pending").toLowerCase() !== "paid").length,
    [rows]
  );

  async function markAsPaid(paymentId: string) {
    setError(null);
    setSavingId(paymentId);

    // ✅ Optimistic UI update (instant row change)
    const nowIso = new Date().toISOString();

    // keep a backup in case we need rollback
    const before = rows;

    setRows((prev) =>
      prev.map((r) =>
        r.id === paymentId ? { ...r, status: "paid", paid_at: nowIso } : r
      )
    );

    const { error } = await supabase
      .from("payments")
      .update({ status: "paid", paid_at: nowIso })
      .eq("id", paymentId);

    if (error) {
      // ❌ rollback if update failed
      setRows(before);
      setError(error.message);
      setSavingId(null);
      return;
    }

    // ✅ optional: re-fetch to ensure DB is source of truth (safe)
    // await fetchPayments();

    setSavingId(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Payments (Auto-Refresh ✅)</h1>
      <p style={{ marginTop: 6, opacity: 0.8 }}>
        Pending payments: <b>{pendingCount}</b>
      </p>

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button onClick={fetchPayments} style={{ padding: "8px 12px" }}>
          Refresh
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            border: "1px solid #ffb3b3",
            background: "#fff0f0",
            borderRadius: 8,
            color: "#a10000",
          }}
        >
          <b>Error:</b> {error}
        </div>
      )}

      <div style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ textAlign: "left", padding: 12 }}>ID</th>
              <th style={{ textAlign: "left", padding: 12 }}>Package</th>
              <th style={{ textAlign: "left", padding: 12 }}>Stage</th>
              <th style={{ textAlign: "left", padding: 12 }}>Amount</th>
              <th style={{ textAlign: "left", padding: 12 }}>Status</th>
              <th style={{ textAlign: "left", padding: 12 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 14 }}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 14 }}>
                  No payments found.
                </td>
              </tr>
            ) : (
              rows.map((p) => {
                const status = (p.status ?? "pending").toLowerCase();
                const isPaid = status === "paid";
                const busy = savingId === p.id;

                return (
                  <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ padding: 12, fontFamily: "monospace" }}>{p.id}</td>
                    <td style={{ padding: 12 }}>{p.package_name ?? "—"}</td>
                    <td style={{ padding: 12 }}>{p.stage ?? "—"}</td>
                    <td style={{ padding: 12, fontWeight: 800 }}>{peso(p.amount)}</td>
                    <td style={{ padding: 12 }}>
                      {isPaid ? (
                        <span style={{ padding: "4px 10px", borderRadius: 999, background: "#e7ffe7" }}>
                          paid
                        </span>
                      ) : (
                        <span style={{ padding: "4px 10px", borderRadius: 999, background: "#fff4d6" }}>
                          pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      {isPaid ? (
                        <span style={{ opacity: 0.7 }}>Paid</span>
                      ) : (
                        <button
                          onClick={() => markAsPaid(p.id)}
                          disabled={busy}
                          style={{
                            padding: "8px 12px",
                            background: busy ? "#f0b37a" : "#f97316",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            cursor: busy ? "wait" : "pointer",
                            fontWeight: 800,
                          }}
                        >
                          {busy ? "Saving…" : "Mark as Paid"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 14, opacity: 0.7 }}>
        ✅ No popup. Row updates instantly. If Supabase fails, it rolls back + shows error.
      </p>
    </div>
  );
}
