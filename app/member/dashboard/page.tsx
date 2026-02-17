export default async function Dashboard() {
  const { data: { user } } = await supabase.auth.getUser();
  const memberId = user?.id;

  // Fetch data from Supabase tables
  const { data: member } = await supabase.from('members').select('*').eq('id', memberId).single();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', memberId).single();
  const { data: points } = await supabase.from('points').select('*').eq('member_id', memberId).single();
  const { data: payments } = await supabase.from('payments').select('*').eq('member_id', memberId).order('payment_date', { ascending: false });
  const { data: sessions } = await supabase.from('session_bookings').select('*').eq('member_id', memberId).order('session_date', { ascending: false });
  const { data: activities } = await supabase.from('activity_log').select('*').eq('member_id', memberId).order('activity_date', { ascending: false });

  console.log('Profile:', profile);
  console.log('Member:', member);
  console.log('Points:', points);
  console.log('Payments:', payments);
  console.log('Sessions:', sessions);
  console.log('Activities:', activities);

  return (
    <main className="p-6 space-y-8">
      {/* Profile Section */}
      <section className="flex items-center gap-6">
        {profile?.avatar_url && (
          <Image src={profile.avatar_url} width={80} height={80} alt="Avatar" className="rounded-full" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{profile?.full_name || 'No Profile'}</h1>
          <p className="text-gray-500 text-lg">{member?.membership_status || 'No Status'}</p>
        </div>
      </section>

      {/* Package Summary */}
      <section className="grid grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Package</h3>
          <p>{member?.package_type || 'No Package'}</p>
        </div>
        <div className="p-5 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Remaining Sessions</h3>
          <p>{member?.remaining_sessions || '0'}</p>
        </div>
      </section>

      {/* Points Section */}
      <section className="p-5 bg-white rounded-lg shadow-md">
        <h3 className="font-semibold text-lg">Points</h3>
        <p>Total: {points?.total_points ?? '0'}</p>
        <p>Tier: {points?.tier ?? 'N/A'}</p>
      </section>

      {/* Payment History */}
      <section>
        <h2 className="font-semibold text-xl">Payment History</h2>
        <ul className="space-y-4">
          {payments?.map(p => (
            <li key={p.id} className="flex justify-between bg-white p-4 rounded-lg shadow-md">
              <span>{p.payment_type}</span>
              <span>{p.amount}</span>
              <span>{new Date(p.payment_date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Session Bookings */}
      <section>
        <h2 className="font-semibold text-xl">Session Bookings</h2>
        <ul className="space-y-4">
          {sessions?.map(s => (
            <li key={s.id} className="flex justify-between bg-white p-4 rounded-lg shadow-md">
              <span>{s.session_type}</span>
              <span>{s.coach_name}</span>
              <span>{new Date(s.session_date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Activity Log */}
      <section>
        <h2 className="font-semibold text-xl">Activity Log</h2>
        <ul className="space-y-4">
          {activities?.map(a => (
            <li key={a.id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-semibold">{a.title}</p>
              <p>{a.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
