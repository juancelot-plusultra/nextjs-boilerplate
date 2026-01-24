"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MemberDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState<string>("Member");

  useEffect(() => {
    setMounted(true);

    (async () => {
      const { data } = await supabase.auth.getUser();
      const n =
        data?.user?.user_metadata?.name ||
        data?.user?.email?.split("@")[0] ||
        "Member";
      setName(n);
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

      <div className="mx-auto w-full max-w-4xl px-5 py-6">
        <div className={`${mounted ? "fade-up" : "opacity-0"}`}>
          <header className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/60">Welcome back</div>
              <h1 className="text-2xl font-bold">{name}</h1>
            </div>
            <button
              onClick={logout}
              className="rounded-full border border-white/20 px-4 py-2 text-sm"
            >
              Log out
            </button>
          </header>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card title="Sessions Left" value="—" hint="Coming from Supabase" />
            <Card title="Next Appointment" value="—" hint="Schedule view next" />
            <Card title="Check-in QR" value="Open" hint="We’ll generate QR next" />
            <Card title="Payments" value="View" hint="Paid / Pending status" />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="font-semibold">Quick actions</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                className="rounded-full bg-[#F37120] px-4 py-2 text-sm font-semibold text-black"
                href="/get-started"
              >
                Book Assessment
              </a>
              <a
                className="rounded-full border border-white/20 px-4 py-2 text-sm"
                href="/onboarding?preview=1"
              >
                View Onboarding
              </a>
            </div>
          </div>

          <div className="mt-8 text-xs text-white/40">
            Next build: real member data + QR check-in + payments status from Supabase.
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="mt-2 text-xs text-white/40">{hint}</div>
    </div>
  );
}
