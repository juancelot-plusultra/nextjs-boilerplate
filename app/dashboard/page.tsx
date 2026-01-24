"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function StaffDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data?.user?.email ?? "");
    })();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp .5s ease-out forwards; }
      `}</style>

      <div className="mx-auto w-full max-w-5xl px-5 py-6">
        <div className={`${mounted ? "fade-up" : "opacity-0"}`}>
          <header className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/60">Staff Dashboard</div>
              <h1 className="text-2xl font-bold">BearFitPH Admin</h1>
              <div className="text-xs text-white/40 mt-1">{email}</div>
            </div>

            <button
              onClick={logout}
              className="rounded-full border border-white/20 px-4 py-2 text-sm"
            >
              Log out
            </button>
          </header>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card title="Members" hint="Search, view, edit" href="/members" />
            <Card title="Payments" hint="Due, Paid, Overdue" href="/payments" />
            <Card title="Check-ins" hint="Scan QR, logs" href="/check-in" />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="font-semibold">Next build</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/70 space-y-1">
              <li>Role guard (prevent members from opening staff pages)</li>
              <li>Hook up Members & Payments tables to Supabase</li>
              <li>QR check-in scanning workflow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, hint, href }: { title: string; hint: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
    >
      <div className="text-lg font-bold">{title}</div>
      <div className="mt-2 text-sm text-white/60">{hint}</div>
      <div className="mt-4 text-xs text-[#F37120] underline underline-offset-4">
        Open
      </div>
    </a>
  );
}
