import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default async function Dashboard() {
  const memberId = '9bee38d3-7511-4603-a33c-1aa2031b53eb'; // replace with auth user ID

  const { data: member } = await supabase.from('members').select('*').eq('id', memberId).single();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', memberId).single();
  const { data: points } = await supabase.from('points').select('*').eq('member_id', memberId).single();
  const { data: payments } = await supabase.from('payments').select('*').eq('member_id', memberId).order('payment_date', { ascending: false });
  const { data: sessions } = await supabase.from('session_bookings').select('*').eq('member_id', memberId).order('session_date', { ascending: false });
  const { data: activities } = await supabase.from('activity_log').select('*').eq('member_id', memberId).order('activity_date', { ascending: false });

  return (
    <main className="p-4 space-y-6">
      {/* Profile */}
      <section className="flex items-center gap-4">
        {profile?.avatar_url && (
          <Image src={profile.avatar_url} width={64} height={64} alt="Avatar" className="rounded-full" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
          <p className="text-gray-500">{member?.membership_status}</p>
        </div>
      </section>

      {/* Package Summary */}
      <section className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Package</h3>
          <p>{member?.package_type}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Remaining Sessions</h3>
          <p>{member?.remaining_sessions}</p>
        </div>
      </section>

      {/* Points */}
      <section className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold">Points</h3>
        <p>Total: {points?.total_points ?? 0}</p>
        <p>Tier: {points?.tier ?? 'N/A'}</p>
      </section>

      {/* Payments */}
      <section>
        <h2 className="font-semibold text-lg">Payment History</h2>
        <ul className="space-y-2">
          {payments?.map(p => (
            <li key={p.id} className="flex justify-between bg-white p-3 rounded shadow">
              <span>{p.payment_type}</span>
              <span>{p.amount}</span>
              <span>{new Date(p.payment_date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sessions */}
      <section>
        <h2 className="font-semibold text-lg">Session Bookings</h2>
        <ul className="space-y-2">
          {sessions?.map(s => (
            <li key={s.id} className="flex justify-between bg-white p-3 rounded shadow">
              <span>{s.session_type}</span>
              <span>{s.coach_name}</span>
              <span>{new Date(s.session_date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Activity Log */}
      <section>
        <h2 className="font-semibold text-lg">Activity Log</h2>
        <ul className="space-y-2">
          {activities?.map(a => (
            <li key={a.id} className="bg-white p-3 rounded shadow">
              <p className="font-semibold">{a.title}</p>
              <p>{a.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
