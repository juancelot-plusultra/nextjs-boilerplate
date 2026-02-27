// components/Dashboard.tsx

import React from 'react';
import useProfileData from '@/lib/useProfileData';  // Import the custom hook to fetch profile data

function Dashboard() {
  const userId = "89cb1b22-b510-4cf8-904b-b6be640708e2";  // Replace this with the actual user ID
  const { profileData, error } = useProfileData(userId);  // Call the hook to fetch data

  // Error handling: If there's an error fetching the data, show it
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Loading state: If data is still being fetched, show a loading message
  if (!profileData) {
    return <div>Loading...</div>;
  }

  // Render the profile data once fetched
  return (
    <div className="dashboard-data">
      <h2>Profile: {profileData.full_name}</h2>
      <p>Membership: {profileData.membership_id}</p>
      <p>Branch: {profileData.branch}</p>
      {/* Render more data here as needed */}
    </div>
  );
}

export default Dashboard;
