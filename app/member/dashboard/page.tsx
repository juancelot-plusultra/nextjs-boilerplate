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
    async function fetchDashboard() {
      setLoading(true);
      try {
        const johnUID = "ec3652a2-2645-423a-9a07-fca29889ddb3";

        // Fetch member info
        const { data: memberData } = await supabase
          .from("members")
          .select("*")
          .eq("id", johnUID)
          .single();
        setMember(memberData);

        // Fetch profile info
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("member_id", johnUID)
          .single();
        setProfile(profileData);

        // Fetch payments
        const { data: paymentsData } = await supabase
          .from("payments")
          .select("*")
          .eq("member_id", johnUID)
          .order("payment_date", { ascending: false });
        setPayments(paymentsData || []);

        // Fetch sessions
        const { data: sessionsData } = await supabase
          .from("session_bookings")
          .select("*")
          .eq("member_id", johnUID)
          .order("session_date", { ascending: true });
        setSessions(sessionsData || []);

        // Fetch points
        const { data: pointsData } = await supabase
          .from("points")
          .select("*")
          .eq("member_id", johnUID)
          .single();
        setPoints(pointsData);

        // Fetch activity log
        const { data: activityData } = await supabase
          .from("activity_log")
          .select("*")
          .eq("member_id", johnUID)
          .order("activity_date", { ascending: false });
        setActivity(activityData || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
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
