"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role, member_id")
        .eq("id", userData.user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Account</h1>

      <pre className="mt-4 rounded bg-gray-100 p-4">
        {JSON.stringify(profile, null, 2)}
      </pre>
    </div>
  );
}
