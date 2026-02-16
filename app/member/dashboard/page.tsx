'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Dashboard() {
  const supabase = createClientComponentClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Get logged-in user session
  useEffect(() => {
    async function getUser() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      if (!session?.user) {
        // redirect to login if not logged in
        window.location.href = '/login';
        return;
      }

      setUserId(session.user.id);
    }

    getUser();
  }, []);

  // 2️⃣ Fetch all dashboard data once userId is available
  useEffect(() => {
    if (!userId) return;

    async function fetchDashboardData() {
      setLoading(true);

      try {
        const [profileRes, memberRes, paymentsRes, bookingsRes, activityRes, pointsRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('members').select('*').eq('id', userId).single(),
          supabase.from('payments').select('*').eq('member_id', userId).order('payment_date', { ascending: false }),
          supabase.from('session_bookings').select('*').eq('member_id', userId).order('session_date', { ascending: true }),
          supabase.from('activity_log').select('*').eq('member_id', userId).order('activity_date', { ascending: false }),
          supabase.from('points').select('*').eq('member_id', userId).single(),
        ]);

        if (profileRes.error) console.error(profileRes.error);
        else setProfile(profileRes.data);

        if (memberRes.error) console.error(memberRes.error);
        else setMember(memberRes.data);

        if (paymentsRes.error) console.error(paymentsRes.error);
        else setPayments(paymentsRes.data || []);

        if (bookingsRes.error) console.error(bookingsRes.error);
        else setBookings(bookingsRes.data || []);

        if (activityRes.error) console.error(activityRes.error);
        else setActivity(activityRes.data || []);

        if (pointsRes.error) console.error(pointsRes.error);
        else setPoints(pointsRes.data || null);

      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, [userId]);

  if (loading) return <p className="p-4 text-center">Loading your dashboard...</p>;

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
