"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function GetStartedPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [schedule, setSchedule] = useState("");

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setStatus(null);

    const { error } = await supabase.from("assessments").insert({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      goal: goal.trim() || null,
      preferred_schedule: schedule.trim() || null,
    });

    if (error) {
      setStatus("❌ " + error.message);
      setBusy(false);
      return;
    }

    setStatus("✅ Submitted! We’ll contact you to confirm your free assessment.");
    setBusy(false);

    // optional: auto-redirect after submit
    setTimeout(() => router.push("/login"), 1200);
  }

  const canSubmit = name.trim().length >= 2 && phone.trim().length >= 7 && !busy;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto min-h-screen w-full sm:max-w-[720px] lg:max-w-[520px]">
        <div className="min-h-screen w-full lg:border-x lg:border-white/10">
          <div className="p-6">
            <div className="text-lg font-extrabold">
              Bear<span className="text-orange-500">Fit</span>PH
            </div>

            <h1 className="mt-8 text-3xl font-extrabold leading-tight">
              Free Assessment
            </h1>
            <p className="mt-2 text-white/75">
              Fill this out and we’ll message you to confirm your appointment.
            </p>

            <div className="mt-8 space-y-3">
              <Field
                label="Full Name"
                placeholder="Juan Dela Cruz"
                value={name}
                setValue={setName}
              />
              <Field
                label="Phone"
                placeholder="09xx..."
                value={phone}
                setValue={setPhone}
              />
              <Field
                label="Email (optional)"
                placeholder="you@email.com"
                value={email}
                setValue={setEmail}
              />
              <Field
                label="Goal (optional)"
                placeholder="Fat loss / Strength / MMA conditioning"
                value={goal}
                setValue={setGoal}
              />
              <Field
                label="Preferred Schedule (optional)"
                placeholder="Sat 3pm / Weeknights after 6pm"
                value={schedule}
                setValue={setSchedule}
              />

              <button
                disabled={!canSubmit}
                onClick={submit}
                className="mt-3 w-full rounded-2xl bg-orange-500 px-5 py-4 text-base font-extrabold text-white disabled:opacity-50"
              >
                {busy ? "Submitting…" : "Submit"}
              </button>

              <button
                onClick={() => router.push("/login")}
                className="w-full rounded-2xl border border-white/20 px-5 py-4 text-base font-bold text-white/90"
              >
                I already have an account → Log in
              </button>

              {status && (
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm">
                  {status}
                </div>
              )}

              <p className="pt-2 text-xs text-white/55">
                By submitting, you agree to be contacted for scheduling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-white/70">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
      />
    </div>
  );
}
