interface ProfileCardProps {
  profile: any;
  member: any;
  points: any;
}

export function ProfileCard({ profile, member, points }: ProfileCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold">{profile.full_name}</h2>
      <p>Package: {member?.package_name}</p>
      <p>Total Sessions: {member?.total_sessions}</p>
      <p>Remaining Sessions: {member?.remaining_sessions}</p>
      <p>Status: {member?.membership_status}</p>

      <div className="mt-4">
        <h3>Rewards & Points</h3>
        <p>Total Points: {points?.total_points}</p>
        <p>Lifetime Points: {points?.lifetime_points}</p>
        <p>Tier: {points?.tier}</p>
      </div>
    </div>
  );
}
