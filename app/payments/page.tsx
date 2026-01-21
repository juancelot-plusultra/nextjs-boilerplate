"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Payment = {
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // LOAD PAYMENTS
  async function loadPayments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPayments(data);
    }

    setLoading(false);
  }

  // MARK AS PAID (THE IMPORTANT PART)
  async function markAsPaid(paymentId: string) {
    const { error } = await supabase
      .from("payments")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Marked as PAID ✅");
      loadPayments();
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Payments (Simple Version)
      </h1>

      {loading && <p>Loading…</p>}

      {!loading && payments.length === 0 && <p>No payments found.</p>}

      {!loading && payments.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Package</th>
              <th style={th}>Stage</th>
              <th style={th}>Amount</th>
              <th style={th}>Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.package_name}</td>
                <td style={td}>{p.stage}</td>
                <td style={td}>₱{p.amount}</td>
                <td style={td}>{p.status}</td>
                <td style={td}>
                  {p.status === "paid" ? (
                    "Paid"
                  ) : (
                    <button
                      onClick={() => markAsPaid(p.id)}
                      style={{
                        padding: "8px 12px",
                        background: "orange",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  borderBottom: "1px solid #ccc",
  padding: 8,
  textAlign: "left",
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: 8,
};
