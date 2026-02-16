'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Types
type Profile = {
  id: string;
  role: string;
  full_name: string;
  avatar_url: string | null;
  membership_id: string | null;
  branch: string | null;
};

type Member = {
  id: string;
  name: string;
  email: string;
  package_type: string;
  total_sessions: number;
  sessions_used: number;
  remaining_sessions: number;
  membership_status: string;
};

type Payment = {
  id: string;
  member_id: string;
  amount: number;
  payment_type: string;
  status: string;
  payment_date: string;
};

type Booking = {
  id: string;
  member_id: string;
  session_type: string;
  session_date: string;
  coach_name: string;
  status: string;
};

type Point = {
  member_id: string;
  total_points: number;
  lifetime_points: number;
  tier: string;
};

export default function Dashboard() {
  const supabase = createClientComponentClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [points, setPoints] = useState<Point | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        console.log('No session found or error', sessionError);
        setLoading(false);
        return;
      }

      const user_id = session.user.id;
      setUserId(user_id);

      // Fetch profile
      const { data: profileData } = await supabase
        .from<Profile>('profiles')
        .select('*')
        .eq('id', user_id)
        .single();
      setProfile(profileData || null);

      // Fetch member
      const { data: memberData } = await supabase
        .from<Member>('members')
        .select('*')
        .eq('id', user_id)
        .single();
      setMember(memberData || null);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from<Payment>('payments')
        .select('*')
        .eq('member_id', user_id)
        .order('payment_date', { ascending: false });
      setPayments(paymentsData || []);

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from<Booking>('session_bookings')
        .select('*')
        .eq('member_id', user_id)
        .order('session_date', { ascending: true });
      setBookings(bookingsData || []);

      // Fetch points
      const { data: pointsData } = await supabase
        .from<Point>('points')
        .select('*')
        .eq('member_id', user_id)
        .single();
      setPoints(pointsData || null);

      setLoading(false);
    };

    fetchDashboard();
  }, [supabase]);

  if (loading) {
    return <p className="text-center mt-20 text-lg">Loading your dashboard...</p>;
  }

  if (!userId) {
    return <p className="text-center mt-20 text-red-500">You must be logged in to view the dashboard.</p>;
  }

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
