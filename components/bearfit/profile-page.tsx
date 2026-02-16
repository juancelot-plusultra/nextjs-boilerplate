// @/components/bearfit/profile-page.tsx

interface ProfilePageProps {
  profile: any;
}

export function ProfilePage({ profile }: ProfilePageProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">{profile.full_name}</h2>
      <p>Role: {profile.role}</p>
      <p>Branch: {profile.branch}</p>
      <p>Membership ID: {profile.membership_id}</p>
      {/* Add any other profile details you want displayed */}
    </div>
  );
}
