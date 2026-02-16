'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import type { Database } from '@/lib/database.types'; // remove
export default function Dashboard() {
const supabase = createClientComponentClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [member, setMember] = useState<Database['public']['Tables']['members']['Row'] | null>(null);
  const [payments, setPayments] = useState<Database['public']['Tables']['payments']['Row'][]>([]);
  const [bookings, setBookings] = useState<Database['public']['Tables']['session_bookings']['Row'][]>([]);
  const [activity, setActivity] = useState<Database['public']['Tables']['activity_log']['Row'][]>([]);
  const [points, setPoints] = useState<Database['public']['Tables']['points']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  // Step 1: Get logged-in user UUID
  useEffect(() => {
    async function getUser() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error(error);
      if (session?.user) setUserId(session.user.id);
    }
    getUser();
  }, []);

  // Step 2: Fetch all member data once userId is available
  useEffect(() => {
    if (!userId) return;

    async function fetchDashboardData() {
      setLoading(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) console.error('Profile fetch error:', profileError);
      else setProfile(profileData);

      // Fetch member main record
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', userId)
        .single();

      if (memberError) console.error('Member fetch error:', memberError);
      else setMember(memberData);

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('member_id', userId)
        .order('payment_date', { ascending: false });

      if (paymentsError) console.error('Payments fetch error:', paymentsError);
      else setPayments(paymentsData || []);

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('session_bookings')
        .select('*')
        .eq('member_id', userId)
        .order('session_date', { ascending: true });

      if (bookingsError) console.error('Bookings fetch error:', bookingsError);
      else setBookings(bookingsData || []);

      // Fetch activity log
      const { data: activityData, error: activityError } = await supabase
        .from('activity_log')
        .select('*')
        .eq('member_id', userId)
        .order('activity_date', { ascending: false });

      if (activityError) console.error('Activity fetch error:', activityError);
      else setActivity(activityData || []);

      // Fetch points
      const { data: pointsData, error: pointsError } = await supabase
        .from('points')
        .select('*')
        .eq('member_id', userId)
        .single();

      if (pointsError) console.error('Points fetch error:', pointsError);
      else setPoints(pointsData);

      setLoading(false);
    }

    fetchDashboardData();
  }, [userId]);

  if (!userId || loading) return <p className="p-4 text-center">Loading your dashboard...</p>;

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      {profile && (
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatar_url || '/default-avatar.png'}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-bold">{profile.full_name}</h1>
            <p className="text-gray-500">{profile.branch}</p>
          </div>
        </div>
      )}

      {/* Membership Card */}
      {member && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold">Membership Info</h2>
          <p>Package: {member.package_type}</p>
          <p>Remaining Sessions: {member.remaining_sessions}</p>
          <p>Status: {member.membership_status}</p>
        </div>
      )}

      {/* Upcoming Sessions */}
      {bookings.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Upcoming Sessions</h2>
          <ul className="space-y-1">
            {bookings.slice(0, 5).map((b) => (
              <li key={b.id} className="flex justify-between">
                <span>{new Date(b.session_date).toLocaleDateString()} - {b.session_type}</span>
                <span className="text-gray-500">{b.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Activity */}
      {activity.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Recent Activity</h2>
          <ul className="space-y-1">
            {activity.slice(0, 5).map((a) => (
              <li key={a.id}>
                <p className="font-medium">{a.title}</p>
                <p className="text-gray-500 text-sm">{a.description}</p>
                <p className="text-gray-400 text-xs">{new Date(a.activity_date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Payment History</h2>
          <ul className="space-y-1">
            {payments.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{new Date(p.payment_date).toLocaleDateString()} - {p.payment_type}</span>
                <span className="text-gray-500">{p.status}</span>
                <span className="font-medium">${p.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Points & Tier */}
      {points && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold">Reward Points</h2>
          <p>Total Points: {points.total_points}</p>
          <p>Lifetime Points: {points.lifetime_points}</p>
          <p>Tier: {points.tier}</p>
        </div>
      )}
    </div>
  );
}
