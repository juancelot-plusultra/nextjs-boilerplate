'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const user_id = user.id;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single();
      setProfile(profileData);

      // Fetch member info
      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('id', user_id)
        .single();
      setMember(memberData);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('member_id', user_id)
        .order('payment_date', { ascending: false });
      setPayments(paymentsData || []);

      // Fetch session bookings
      const { data: bookingsData } = await supabase
        .from('session_bookings')
        .select('*')
        .eq('user_id', user_id)
        .order('starts_at', { ascending: true });
      setBookings(bookingsData || []);

      // Fetch points
      const { data: pointsData } = await supabase
        .from('points')
        .select('*')
        .eq('member_id', user_id)
        .single();
      setPoints(pointsData);

      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading your dashboard...</div>;

  // ======================
  // YOUR DESIGNED UI STARTS HERE
  // Replace the JSX below with your full Tailwind layout
  // ======================

  return (
    <div className="p-4 space-y-6">

      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <img
          src={profile?.avatar_url || 'https://ui-avatars.com/api/?name=John+Philip+Gallana'}
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile?.full_name || 'Member'}</h1>
          <p className="text-gray-500">{member?.package_name}</p>
        </div>
      </div>

      {/* Membership Card */}
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="font-semibold text-lg">Membership</h2>
        <p>Package: {member?.package_name}</p>
        <p>Total Sessions: {member?.total_sessions}</p>
        <p>Remaining Sessions: {member?.remaining_sessions}</p>
        <p>Status: {member?.membership_status}</p>
      </div>

      {/* Points Card */}
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="font-semibold text-lg">Rewards & Points</h2>
        <p>Total Points: {points?.total_points}</p>
        <p>Lifetime Points: {points?.lifetime_points}</p>
        <p>Tier: {points?.tier}</p>
      </div>

      {/* Payments */}
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="font-semibold text-lg">Payment History</h2>
        {payments.length === 0 ? <p>No payments yet</p> : (
          <ul className="space-y-2">
            {payments.map(p => (
              <li key={p.id} className="border-b pb-1">
                <span className="font-medium">{p.stage}</span> — {p.amount} — {p.status} ({p.payment_type})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Session Bookings */}
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="font-semibold text-lg">Upcoming & Completed Sessions</h2>
        {bookings.length === 0 ? <p>No sessions booked</p> : (
          <ul className="space-y-2">
            {bookings.map(b => (
              <li key={b.id} className="border-b pb-1">
                <span className="font-medium">{b.title}</span> — {b.session_type} — {b.status} — {new Date(b.starts_at).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
