"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js"; // Import Supabase client

// Define types for the data
interface MemberData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  status: string;
  sessions_left: number;
  total_sessions: number;
  join_date: string;
  total_paid: number;
  branch_id?: string;
  avatar?: string;
  package_id?: string;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardData() {
  // Define state with proper types
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Get user ID from localStorage or Supabase auth
        let userId = localStorage.getItem("user_id");
        
        if (!userId) {
          // Try to get from Supabase auth session
          const { data: { session } } = await supabase.auth.getSession();
          userId = session?.user?.id;
        }

        if (!userId) {
          setError("No user logged in");
          setLoading(false);
          return;
        }

        console.log("[v0] Fetching member data for user:", userId);

        // Fetch Member Data
        const { data: member, error: memberError } = await supabase
          .from("members")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (memberError) {
          console.error("[v0] Member fetch error:", memberError);
          setError(memberError.message);
        } else if (member) {
          console.log("[v0] Member data fetched:", member);
          setMemberData(member as MemberData);
        }
      } catch (err: any) {
        console.error("[v0] Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Only render data once it's loaded
  if (loading) {
    return <div className="p-6 text-center">Loading your profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!memberData) {
    return <div className="p-6 text-center">No member data found</div>;
  }

  return (
    <div className="dashboard-data p-6 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{memberData.full_name}</h2>
          <p className="text-gray-600">{memberData.email}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-semibold capitalize">{memberData.status}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Sessions</p>
            <p className="text-lg font-semibold">{memberData.sessions_left}/{memberData.total_sessions}</p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-lg font-semibold">₱{memberData.total_paid}</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-semibold">{memberData.join_date}</p>
          </div>
        </div>

        {memberData.phone && (
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold">{memberData.phone}</p>
          </div>
        )}

        {memberData.branch_id && (
          <div>
            <p className="text-sm text-gray-600">Branch</p>
            <p className="font-semibold capitalize">{memberData.branch_id}</p>
          </div>
        )}
      </div>
    </div>
  );
}
