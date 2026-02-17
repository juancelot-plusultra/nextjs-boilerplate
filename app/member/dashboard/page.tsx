
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// SUPABASE CLIENT
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ===============================
   TYPES (simple safe typing)
================================ */

type Profile = {
  id: string;
  full_name: string;
  membership_id: string;
  branch: string;
};

type Member = {
  id: string;
  name: string;
  remaining_sessions: number;
  total_sessions: number;
};

type Points = {
  total_points: number;
  lifetime_points: number;
  tier: string;
};

type Activity = {
  id: string;
  title: string;
  description: string;
  activity_date: string;
};

/* ===============================
   COMPONENTS
================================ */

function ProfileCard({
  profile,
  member,
  points,
}: {
  profile: Profile;
  member: Member;
  points: Points;
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
  );
}

function SessionCard({ member }: { member: Member }) {
  return (
    <div className="p-5 rounded-2xl shadow bg-white">
      <h3 className="font-semibold">Sessions Remaining</h3>
      <p className="text-2xl font-bold">{member.remaining_sessions}</p>
    </div>
  );
}

function ActivityLog({ activities }: { activities: Activity[] }) {
  return (
    <div className="p-5 rounded-2xl shadow bg-white">
      <h3 className="font-semibold mb-2">Activity</h3>

      {activities.length === 0 && (
        <p className="text-sm text-gray-400">No activity yet</p>
      )}

      {activities.map((activity) => (
        <div key={activity.id}>
          <h4 className="text-lg">{activity.title}</h4>
          <p>{activity.description}</p>
          <p>{activity.activity_date}</p>
        </div>
      ))}
    </div>
  );
}

function PromoBanner() {
  return (
    <div className="p-5 rounded-2xl shadow bg-white">
      <p className="text-center">Special promotion coming soon!</p>
    </div>
  );
}

/* ===============================
   MAIN COMPONENT
================================ */

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [points, setPoints] = useState<Points | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const user = await supabase.auth.getUser();

      // PROFILE
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        alert("Profile fetch error: " + profileError.message);
      }
      setProfile(profileData);

      // MEMBER
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .select("*")
        .eq("id", user.id)
        .single();

      if (memberError) {
        alert("Member fetch error: " + memberError.message);
      }
      setMember(memberData);

      // POINTS
      const { data: pointsData, error: pointsError } = await supabase
        .from("points")
        .select("*")
        .eq("member_id", user.id)
        .single();

      if (pointsError) {
        alert("Points fetch error: " + pointsError.message);
      }
      setPoints(pointsData);

      // ACTIVITY LOG
      const { data: activityData, error: activityError } = await supabase
        .from("activity_log")
        .select("*")
        .eq("member_id", user.id)
        .order("activity_date", { ascending: false });

      if (activityError) {
        alert("Activity fetch error: " + activityError.message);
      }
      setActivities(activityData || []);

      setLoading(false);
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading dashboard...
      </div>
    );
  }

  if (!profile || !member || !points) {
    return (
      <div className="p-10 text-center">
        No member profile found.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5 p-5">
      <ProfileCard profile={profile} member={member} points={points} />
      <SessionCard member={member} />
      <ActivityLog activities={activities} />
      <PromoBanner />
    </div>
  );
}
