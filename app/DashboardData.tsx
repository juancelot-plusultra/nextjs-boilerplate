"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js"; // Import Supabase client

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardData() {
  const [profileData, setProfileData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [pointsData, setPointsData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      const userId = "89cb1b22-b510-4cf8-904b-b6be640708e2"; // Alex's UID

      // Fetch Profile Data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (profileError) {
        setError(profileError.message);
      } else {
        setProfileData(profile);
      }

      // Fetch Member Data
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("*")
        .eq("id", userId)
        .single();
      if (memberError) {
        setError(memberError.message);
      } else {
        setMemberData(member);
      }

      // Fetch Points Data
      const { data: points, error: pointsError } = await supabase
        .from("points")
        .select("*")
        .eq("member_id", userId)
        .single();
      if (pointsError) {
        setError(pointsError.message);
      } else {
        setPointsData(points);
      }
    }

    fetchData();
  }, []);

  // Only render data once it's loaded
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profileData || !memberData || !pointsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-data">
      <h2>Profile: {profileData.full_name}</h2>
      <p>Membership: {profileData.membership_id}</p>
      <p>Branch: {profileData.branch}</p>
      <p>
        Sessions: {memberData.remaining_sessions}/{memberData.total_sessions}
      </p>
      <p>Points: {pointsData.total_points}</p>
      <p>Tier: {pointsData.tier}</p>
    </div>
  );
}
