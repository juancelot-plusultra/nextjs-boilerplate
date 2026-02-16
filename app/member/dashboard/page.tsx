import { supabase } from '@/lib/supabase';

export default async function Dashboard() {
  const memberId = "9bee38d3-7511-4603-a33c-1aa2031b53eb"; // Replace with authenticated user ID

  // Fetch necessary data from Supabase
  const { data: member } = await supabase.from("members").select("*").eq("id", memberId).single();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", memberId).single();
  const { data: points } = await supabase.from("points").select("*").eq("member_id", memberId).single();
  const { data: payments } = await supabase.from("payments").select("*").eq("member_id", memberId).order("payment_date", { ascending: false });
  const { data: sessions } = await supabase.from("session_bookings").select("*").eq("member_id", memberId).order("session_date", { ascending: false });
  const { data: activities } = await supabase.from("activity_log").select("*").eq("member_id", memberId).order("activity_date", { ascending: false });

  return (
    <div>
      <img src={profile.avatar_url} alt="Avatar" className="avatar" />
      <h1>{profile.full_name}</h1>
      <p>Status: {member.membership_status}</p>
      
      {/* Package summary */}
      <div>
        <h2>{member.package_type}</h2>
        <p>Total: {member.total_sessions}</p>
        <p>Used: {member.sessions_used}</p>
        <p>Remaining: {member.remaining_sessions}</p>
      </div>

      {/* Points */}
      <div>
        <p>Points: {points.total_points}</p>
        <p>Tier: {points.tier}</p>
      </div>

      {/* Payments */}
      <div>
        {payments.map(p => (
          <div key={p.id}>
            <span>{p.payment_type}</span>
            <span>{p.amount}</span>
            <span>{new Date(p.payment_date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>

      {/* Sessions */}
      <div>
        {sessions.map(s => (
          <div key={s.id}>
            <span>{s.session_type} with {s.coach_name}</span>
            <span>{new Date(s.session_date).toLocaleDateString()}</span>
            <span>{s.status}</span>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div>
        {activities.map(a => (
          <div key={a.id}>
            <strong>{a.title}</strong>
            <span>{a.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
