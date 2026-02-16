"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { ProfileCard } from "@/components/bearfit/profile-card";
import { SessionCard } from "@/components/bearfit/session-card";
import { ActivityLog } from "@/components/bearfit/activity-log";
import { PaymentPage } from "@/components/bearfit/payment-page";
import { ProfilePage } from "@/components/bearfit/profile-page";
import { PromoBanner } from "@/components/bearfit/promo-banner";

const supabase = createClientComponentClient();

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Data states
  const [member, setMember] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [points, setPoints] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
  const loadDashboard = async () => {
    // get logged user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const uid = user.id

    // PROFILE
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single()

    setProfile(profileData)

    // MEMBER
    const { data: memberData } = await supabase
      .from("members")
      .select("*")
      .eq("id", uid)
      .single()

    setMember(memberData)

    // SESSIONS
    const { data: sessionsData } = await supabase
      .from("session_bookings")
      .select("*")
      .eq("member_id", uid)
      .order("start_time", { ascending: false })

    setSessions(sessionsData || [])

    // PAYMENTS
    const { data: paymentsData } = await supabase
      .from("payments")
      .select("*")
      .eq("member_id", uid)
      .order("created_at", { ascending: false })

    setPayments(paymentsData || [])

    // ACTIVITY
    const { data: activityData } = await supabase
      .from("activity_log")
      .select("*")
      .eq("member_id", uid)
      .order("activity_date", { ascending: false })

    setActivity(activityData || [])
  }

  loadDashboard()
}, []);

  if (loading) return <div className="p-8 text-center text-lg">Loading your dashboard...</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <PromoBanner />

      {/* Profile Section */}
      {profile && member && <ProfileCard profile={profile} member={member} points={points} />}

      {/* Sessions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming & Completed Sessions</h2>
        {sessions.length > 0 ? (
          <div className="grid gap-4">
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        ) : (
          <p>No sessions booked</p>
        )}
      </div>

      {/* Payments */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        {payments.length > 0 ? <PaymentPage payments={payments} /> : <p>No payments yet</p>}
      </div>

      {/* Activity Log */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
        {activity.length > 0 ? <ActivityLog activity={activity} /> : <p>No activity yet</p>}
      </div>

      {/* Profile Settings */}
      <div className="mt-8">
        {profile && <ProfilePage profile={profile} />}
      </div>
    </div>
  );
}
