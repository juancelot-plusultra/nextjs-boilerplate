// lib/useProfileData.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';  // Import the Supabase client

// Custom hook to fetch profile data
function useProfileData(userId: string) {
  const [profileData, setProfileData] = useState(null);  // Store the fetched profile data
  const [error, setError] = useState('');  // Store any errors that occur

  useEffect(() => {
    // Function to fetch profile data from Supabase
    async function fetchProfileData() {
      const { data, error } = await supabase
        .from('profiles')  // Make sure 'profiles' is the correct table name
        .select('*')  // Select all columns
        .eq('id', userId)  // Filter by user ID
        .single();  // Fetch a single row (since we expect only one profile per user)

      if (error) {
        setError(error.message);  // Set the error message if there's an error
      } else {
        setProfileData(data);  // Set the profile data
      }
    }

    fetchProfileData();  // Call the function when the component is mounted
  }, [userId]);  // Only run the effect when the userId changes

  return { profileData, error };  // Return the profile data and any errors
}

export default useProfileData;
