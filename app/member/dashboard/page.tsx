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
        error: userError,
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
  // Here is where you put your **existing UI components** exactly as you designed
  // Replace placeholders like {profile.full_name}, {member.remaining_sessions}, etc.
  // ======================

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {profile?.full_name || 'Member'}</h1>

      {/* Membership Card */}
      <div className="p-4 border rounded">
        <h2 className="font-semibold">Membership</h2>
        <p>Package: {member?.package_name}</p>
        <p>Remaining Sessions: {member?.remaining_sessions}</p>
        <p>Status: {member?.membership_status}</p>
      </div>

      {/* Points Card */}
      <div className="p-4 border rounded">
        <h2 className="font-semibold">Rewards</h2>
        <p>Total Points: {points?.total_points}</p>
        <p>Lifetime Points: {points?.lifetime_points}</p>
        <p>Tier: {points?.tier}</p>
      </div>

      {/* Payments */}
      <div className="p-4 border rounded">
        <h2 className="font-semibold">Payments</h2>
        {payments.length === 0 ? <p>No payments yet</p> : (
          <ul>
            {payments.map(p => (
              <li key={p.id}>
                {p.stage} — {p.amount} — {p.status} ({p.payment_type})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Session Bookings */}
      <div className="p-4 border rounded">
        <h2 className="font-semibold">Sessions</h2>
        {bookings.length === 0 ? <p>No sessions yet</p> : (
          <ul>
            {bookings.map(b => (
              <li key={b.id}>
                {b.title} — {b.session_type} — {b.status} — {new Date(b.starts_at).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
