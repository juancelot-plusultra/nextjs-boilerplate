"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Member = {
  id: string;
  name: string;
  member_code: string;
  package_name: string | null;
  sessions_left: number | null;
};

export default function MePage() {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    async function loadMember() {
      // 1. Get logged-in user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      // 2. Get profile (to find member_id)
      const { data: profile } = await supabase
        .from("profiles")
        .select("member_id")
        .eq("id", userData.user.id)
        .single();

      if (!profile?.member_id) return;

      // 3. Fetch member record
      const { data: memberData } = await supabase
        .from("members")
        .select("id, name, member_code, package_name, sessions_left")
        .eq("id", profile.member_id)
        .single();

      setMember(memberData);
      setLoading(false);
    }

    loadMember();
  }, []);

  if (loading) {
    return <div className="p-6">Loading your account…</div>;
  }

  if (!member) {
    return <div className="p-6">Member record not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-extrabold">My Account</h1>

      <div className="mt-6 rounded-3xl border-2 border-black p-6 max-w-xl">
        <div className="text-lg font-bold">{member.name}</div>
        <div className="text-sm text-gray-600">
          Member ID: {member.member_code}
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500">Package</div>
          <div className="font-semibold">
            {member.package_name ?? "—"}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500">Remaining Sessions</div>
          <div className="text-3xl font-extrabold">
            {member.sessions_left ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
