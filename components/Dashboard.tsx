// components/Dashboard.tsx
import React from 'react';
import useProfileData from '@/lib/useProfileData';  // Import the custom hook

// Define the type for profile data
interface ProfileData {
  full_name: string;
  membership_id: string;
  branch: string;
}

function Dashboard() {
  const userId = "89cb1b22-b510-4cf8-904b-b6be640708e2";  // Replace with actual user ID
  const { profileData, error } = useProfileData(userId);  // Call the hook to fetch data

  if (error) {
    return <div>Error: {error}</div>;  // If there's an error, display it
  }

  if (!profileData) {
    return <div>Loading...</div>;  // If data is still loading, show loading state
  }

  // TypeScript now knows profileData is of type ProfileData
  return (
    <div className="dashboard-data">
      <h2>Profile: {profileData.full_name}</h2>
      <p>Membership: {profileData.membership_id}</p>
      <p>Branch: {profileData.branch}</p>
      {/* Render more data here */}
    </div>
  );
}

export default Dashboard;
