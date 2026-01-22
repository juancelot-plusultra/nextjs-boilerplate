"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ProfileRow = {
  role: "staff" | "member";
  member_id: string | null;
};

type MemberRow = {
  id: string;
  member_code: string | null;
  name: string | null;
  package_name?: string | null;
  sessions_left?: number | null;
};

type PaymentRow = {
  id: string;
  package_name: string | null;
  stage: string | null;
  amount: number | null;
  status: string | null;
  created_at: string;
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

export default function MePage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [member, setMember] = useState<MemberRow | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg(null);

      // 1) Must be logged in
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authData?.user) {
        setMsg("Not logged in.");
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // 2) Load profile (role + member_id)
      const { data: p, error: pErr } = await supabase
        .from("profiles")
        .select("role, member_id")
        .eq("id", userId)
        .maybeSingle();

      if (pErr) {
        setMsg("Profile load error: " + pErr.message);
        setLoading(false);
        return;
      }

      if (!p) {
        setMsg("No profile row found for this user.");
        setLoading(false);
        return;
      }

      setProfile(p as ProfileRow);

      if (p.role !== "member") {
        setMsg("This page is for members only. (You are staff)");
        setLoading(false);
        return;
      }

      if (!p.member_id) {
        setMsg("No member_id linked to this account.");
        setLoading(false);
        return;
      }

      // 3) Load member info
      const { data: m, error: mErr } = await supabase
        .from("members")
        .select("id, member_code, name, package_name, sessions_left")
        .eq("id", p.member_id)
        .maybeSingle();

      if (mErr) {
        setMsg("Member load error: " + mErr.message);
        setLoading(false);
        return;
      }

      if (!m) {
        setMsg("Member record not found.");
        setLoading(false);
        return;
      }

      setMember(m as MemberRow);

      // 4) Load this member's payment history (read-only)
      const { data: pay, error: payErr } = await supabase
        .from("payments")
        .select("id, package_name, stage, amount, status, created_at, paid_at")
        .eq("member_id", p.member_id)
        .order("created_at", { ascending: false });

      if (payErr) {
        // If your RLS policy is missing, you'll see an error here.
        setMsg("Payments load error: " + payErr.message);
        setPayments([]);
        setLoading(false);
        return;
      }

      setPayments((pay ?? []) as PaymentRow[]);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-lg font-bold">My Account</div>
        <div className="mt-4">Loading your account…</div>
      </div>
    );
  }

  if (msg) {
    return (
      <div className="p-6">
        <div className="text-lg font-bold">My Account</div>
        <div className="mt-4 rounded-xl border border-black/20 p-4">{msg}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
        <div className="text-xl font-extrabold">
          Bear<span className="text-orange-500">Fit</span>PH
        </div>
        <a
          href="/"
          className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Log out
        </a>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-10">
        <h1 className="text-2xl font-extrabold">My Account</h1>

        {/* Member card */}
        <section className="mt-4 rounded-3xl border-2 border-black p-5">
          <div className="text-xl font-extrabold">{member?.name ?? "—"}</div>
          <div className="text-sm text-gray-600">
            Member ID: {member?.member_code ?? "—"}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-semibold text-gray-600">Package</div>
              <div className="mt-1 font-bold">{member?.package_name ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600">
                Remaining Sessions
              </div>
              <div className="mt-1 text-4xl font-extrabold">
                {member?.sessions_left ?? "—"}
              </div>
            </div>
          </div>
        </section>

        {/* Payment History */}
        <section className="mt-6 rounded-3xl border-2 border-black p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold">Payment History</h2>
            <div className="text-sm text-gray-600">
              {payments.length} record{payments.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-black">
            <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-bold uppercase">
              <div className="col-span-4">Date</div>
              <div className="col-span-3">Package</div>
              <div className="col-span-2">Stage</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1">Status</div>
            </div>

            {payments.length === 0 ? (
              <div className="px-4 py-6 text-sm">No payments yet.</div>
            ) : (
              <div className="divide-y divide-black/10">
                {payments.map((p) => {
                  const st = (p.status ?? "pending").toLowerCase();
                  const isPaid = st === "paid";
                  return (
                    <div
                      key={p.id}
                      className="grid grid-cols-12 items-center px-4 py-4 text-sm"
                    >
                      <div className="col-span-4">
                        <div className="font-semibold">
                          {fmtDate(p.created_at)}
                        </div>
                        <div className="text-xs text-gray-600">
                          Paid at: {fmtDate(p.paid_at)}
                        </div>
                      </div>

                      <div className="col-span-3">{p.package_name ?? "—"}</div>

                      <div className="col-span-2">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                          {p.stage ?? "—"}
                        </span>
                      </div>

                      <div className="col-span-2 font-extrabold text-orange-500">
                        {peso(p.amount)}
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-600">
            *This is read-only. Staff updates payments from the Payments page.
          </div>
        </section>
      </main>
    </div>
  );
}
