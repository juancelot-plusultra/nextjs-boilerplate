'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Hardcoded test user ID for Juan Dela Cruz
const TEST_USER_ID = '9bee38d3-7511-4603-a33c-1aa2031b53eb';

export default function Dashboard() {
  const supabase = createClientComponentClient();

  const [profile, setProfile] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const user_id = TEST_USER_ID;

      // Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single();
      setProfile(profileData || null);

      // Member
      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('id', user_id)
        .single();
      setMember(memberData || null);

      // Payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('member_id', user_id)
        .order('payment_date', { ascending: false });
      setPayments(paymentsData || []);

      // Bookings
      const { data: bookingsData } = await supabase
        .from('session_bookings')
        .select('*')
        .eq('member_id', user_id)
        .order('session_date', { ascending: true });
      setBookings(bookingsData || []);

      // Points
      const { data: pointsData } = await supabase
        .from('points')
        .select('*')
        .eq('member_id', user_id)
        .single();
      setPoints(pointsData || null);

      setLoading(false);
    };

    fetchDashboard();
  }, [supabase]);

  if (loading) return <p className="text-center mt-20 text-lg">Loading your dashboard...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center mb-6">
        <img
          src={profile?.avatar_url || '/default-avatar.png'}
          alt="Avatar"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile?.full_name || member?.name}</h1>
          <p className="text-gray-600">{profile?.role}</p>
        </div>
      </div>

      {/* Membership Card */}
      <div className="p-4 mb-6 border rounded shadow">
        <h2 className="font-bold mb-2">Membership</h2>
        <p>Package: {member?.package_type || '-'}</p>
        <p>Remaining Sessions: {member?.remaining_sessions ?? '-'}</p>
        <p>Status: {member?.membership_status || '-'}</p>
      </div>

      {/* Upcoming Bookings */}
      <div className="p-4 mb-6 border rounded shadow">
        <h2 className="font-bold mb-2">Upcoming Sessions</h2>
        {bookings.length === 0 ? (
          <p>No upcoming sessions.</p>
        ) : (
          <ul>
            {bookings.map((b) => (
              <li key={b.id} className="mb-1">
                {b.session_type} with {b.coach_name} on {new Date(b.session_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payment History */}
      <div className="p-4 mb-6 border rounded shadow">
        <h2 className="font-bold mb-2">Payments</h2>
        {payments.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <ul>
            {payments.map((p) => (
              <li key={p.id} className="mb-1">
                {p.payment_type} - ${p.amount} on {new Date(p.payment_date).toLocaleDateString()} ({p.status})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Points */}
      <div className="p-4 border rounded shadow">
        <h2 className="font-bold mb-2">Rewards</h2>
        <p>Total Points: {points?.total_points ?? 0}</p>
        <p>Lifetime Points: {points?.lifetime_points ?? 0}</p>
        <p>Tier: {points?.tier || 'N/A'}</p>
      </div>
    </div>
  );
}
