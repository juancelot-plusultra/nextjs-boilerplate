"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

/* ===============================
   SUPABASE CLIENT
================================ */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/* ===============================
   TYPES (simple safe typing)
================================ */

type Profile = {
  id: string
  full_name: string
  membership_id: string
  branch: string
}

type Member = {
  id: string
  name: string
  remaining_sessions: number
  total_sessions: number
}

type Points = {
  total_points: number
  lifetime_points: number
  tier: string
}

/* ===============================
   COMPONENTS
================================ */

function ProfileCard({
  profile,
  member,
  points,
}: {
  profile: Profile
  member: Member
  points: Points
}) {
  return (
    <div className="p-5 rounded-2xl shadow bg-white space-y-2">
      <h2 className="text-xl font-bold">{profile.full_name}</h2>
      <p>Membership: {profile.membership_id}</p>
      <p>Branch: {profile.branch}</p>
      <p>
        Sessions: {member.remaining_sessions}/{member.total_sessions}
      </p>
      <p>Points: {points.total_points}</p>
      <p>Tier: {points.tier}</p>
    </div>
  )
}

function SessionCard({ member }: { member: Member }) {
  return (
    <div className="p-5 rounded-2xl shadow bg-white">
      <h3 className="font-semibold">Sessions Remaining</h3>
      <p className="text-2xl font-bold">
        {member.remaining_sessions}
      </p>
    </div>
  )
}

function ActivityLog({ activities }: { activities: any[] }) {
  return (
    <div className="p-5 rounded-2xl shadow bg-white">
      <h3 className="font-semibold mb-2">Activity</h3>

      {activities.length === 0 && (
        <p className="text-sm text-gray-400">No activity yet</p>
      )}

      {activities.map((a) => (
        <div key={a.id} className="text-sm border-b py-2">
          <p className="font-medium">{a.title}</p>
          <p className="text-gray-500">{a.description}</p>
        </div>
      ))}
    </div>
  )
}

function PromoBanner() {
  return (
    <div className="p-5 rounded-2xl bg-black text-white">
      🔥 February Promo — Earn double Bearforce points!
    </div>
  )
}

/* ===============================
   MAIN DASHBOARD
================================ */

export default function BearfitApp() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [points, setPoints] = useState<Points | null>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function loadDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Log user data to check if we have a logged-in user
    console.log('User:', user);

    /* PROFILE */
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log('Profile Data:', profileData); // Check profile data
    setProfile(profileData);

    /* MEMBER */
    const { data: memberData } = await supabase
      .from("members")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log('Member Data:', memberData); // Check member data
    setMember(memberData);

    /* POINTS */
    const { data: pointsData } = await supabase
      .from("points")
      .select("*")
      .eq("member_id", user.id)
      .single();

    console.log('Points Data:', pointsData); // Check points data
    setPoints(pointsData);

    /* ACTIVITY */
    const { data: activityData } = await supabase
      .from("activity_log")
      .select("*")
      .eq("member_id", user.id)
      .order("activity_date", { ascending: false });

    console.log('Activity Data:', activityData); // Check activity data
    setActivities(activityData || []);

    setLoading(false);
  }

  loadDashboard();
}, []);


  /* ===============================
     LOADING STATE
  ================================= */

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading dashboard...
      </div>
    )
  }

  if (!profile || !member || !points) {
    return (
      <div className="p-10 text-center">
        No member profile found.
      </div>
    )
  }

  /* ===============================
     DASHBOARD UI
  ================================= */

  return (
    <div className="max-w-xl mx-auto space-y-5 p-5">
      <ProfileCard
        profile={profile}
        member={member}
        points={points}
      />

      <SessionCard member={member} />

      <ActivityLog activities={activities} />

      <PromoBanner />
    </div>
  )
}
