"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "staff") router.replace("/dashboard");
      else router.replace("/me");
    })();
  }, [router]);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-md">
        <div className="text-2xl font-extrabold">
          Bear<span className="text-orange-500">Fit</span>PH
        </div>

        <h1 className="mt-8 text-3xl font-extrabold leading-tight">
          Science-driven coaching.
          <br />
          Real results.
        </h1>

        <p className="mt-3 text-gray-700">
          Start with a FREE assessment + consultation so we can build the right plan for you.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => router.push("/get-started")}
            className="rounded-2xl bg-orange-500 px-5 py-3 text-base font-bold text-white"
          >
            Let’s Get Started (Free Assessment)
          </button>

          <button
            onClick={() => router.push("/login")}
            className="rounded-2xl border border-black px-5 py-3 text-base font-bold"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
