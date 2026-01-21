"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
};

export default function PaymentsPage() {
  const router = useRouter();

  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadPayments() {
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
      setRows((data ?? []) as PaymentRow[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPayments();
  }, []);

  async function markAsPaid(paymentId: string) {
    setPayingId(paymentId);
    setError(null);

    // optimistic UI (instant feedback)
    setRows((prev) =>
      prev.map((r) =>
        r.id === paymentId
          ? { ...r, status: "paid", paid_at: new Date().toISOString() }
          : r
      )
    );

    const { error } = await supabase
      .from("payments")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (error) {
      // rollback if failed
      await loadPayments();
      setError(error.message);
    } else {
      // reload so totals + data are 100% from DB
      await loadPayments();
      router.refresh();
    }

    setPayingId(null);
  }

  const summary = useMemo(() => {
    const paymentsDue = rows.filter((r) => (r.status ?? "").toLowerCase() !== "paid").length;
    const paidToday = rows.filter((r) => {
      if (!r.paid_at) return false;
      const d = new Date(r.paid_at);
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }).length;

    const overdue = rows.filter((r) => (r.status ?? "").toLowerCase() === "overdue").length;

    return { paymentsDue, paidToday, overdue };
  }, [rows]);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Payments</h1>

      {error && (
        <div style={{ background: "#ffecec", padding: 12, borderRadius: 10, marginBottom: 12 }}>
          <b>Error:</b> {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 18 }}>
        <StatCard title="Payments Due" value={loading ? "—" : String(summary.paymentsDue)} />
        <StatCard title="Paid Today" value={loading ? "—" : String(summary.paidToday)} />
        <StatCard title="Overdue" value={loading ? "—" : String(summary.overdue)} />
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: 14, borderBottom: "1px solid #eee", fontWeight: 700 }}>
          Payment Records
        </div>

        {loading ? (
          <div style={{ padding: 14 }}>Loading…</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 14 }}>No payments found.</div>
        ) : (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafafa" }}>
                  <Th>Payment ID</Th>
                  <Th>Member ID</Th>
                  <Th>Package</Th>
                  <Th>Stage</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isPaid = (r.status ?? "").toLowerCase() === "paid";
                  return (
                    <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                      <Td>{r.id}</Td>
                      <Td>{r.member_id}</Td>
                      <Td>{r.package_name ?? "—"}</Td>
                      <Td>{r.stage ?? "—"}</Td>
                      <Td>{r.amount != null ? `₱${Number(r.amount).toLocaleString()}` : "—"}</Td>
                      <Td>{r.status ?? "—"}</Td>
                      <Td>
                        <button
                          onClick={() => markAsPaid(r.id)}
                          disabled={isPaid || payingId === r.id}
                          style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            cursor: isPaid ? "not-allowed" : "pointer",
                            fontWeight: 700,
                          }}
                        >
                          {isPaid ? "Paid" : payingId === r.id ? "Saving…" : "Mark as Paid"}
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 14, padding: 14 }}>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: "left", padding: 12, fontSize: 12, borderBottom: "1px solid #eee" }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: 12, fontSize: 13 }}>{children}</td>;
}
