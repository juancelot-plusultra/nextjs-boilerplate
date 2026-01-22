"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Member = {
  id: string;
  name: string | null;
  member_code: string | null;
  package_name: string | null;
  sessions_left: number | null;
};

export default function MePage() {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setMsg("");

        // 1) Get session/user
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;

        const user = userData?.user;
        if (!user) {
          setMsg("Not logged in. Please go to /login first.");
          return;
        }

        // 2) Read profile -> get member_id
        const { data: profile, error: profErr } = await supabase
          .from("profiles")
          .select("member_id, role")
          .eq("id", user.id)
          .single();

        if (profErr) throw profErr;

        if (!profile?.member_id) {
          setMsg("No member_id linked to this user yet.");
          return;
        }

        // 3) Fetch member record
        const { data: memberData, error: memErr } = await supabase
          .from("members")
          .select("id, name, member_code, package_name, sessions_left")
          .eq("id", profile.member_id)
          .single();

        if (memErr) throw memErr;

        if (mounted) setMember(memberData as Member);
      } catch (e: any) {
        if (mounted) setMsg(e?.message ?? "Failed to load account.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    // If login happens after page loads, refresh automatically
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-6">Loading your account…</div>;

  if (!member) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-extrabold">My Account</h1>
        <div className="mt-4 rounded-2xl border border-black p-4">
          <div className="font-bold">Not loaded</div>
          <div className="mt-2 text-sm text-gray-700">
            {msg || "Member record not found."}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Tip: Make sure you are logged in, and RLS allows reading profiles + members.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-extrabold">My Account</h1>

      <div className="mt-6 max-w-xl rounded-3xl border-2 border-black p-6">
        <div className="text-lg font-bold">{member.name ?? "—"}</div>
        <div className="text-sm text-gray-600">
          Member ID: {member.member_code ?? "—"}
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500">Package</div>
          <div className="font-semibold">{member.package_name ?? "—"}</div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500">Remaining Sessions</div>
          <div className="text-3xl font-extrabold">{member.sessions_left ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
