// @/components/bearfit/session-card.tsx

interface SessionCardProps {
  session: any;
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold">{session.title}</h3>
      <p>Type: {session.session_type}</p>
      <p>Coach: {session.coach_name}</p>
      <p>Date: {new Date(session.session_date).toLocaleString()}</p>
      <p>Status: {session.status}</p>
    </div>
  );
}
