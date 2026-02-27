// lib/useProfileData.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';  // Import Supabase client

// Define the type for profile data
interface ProfileData {
  full_name: string;
  membership_id: string;
  branch: string;
}

function useProfileData(userId: string) {
  // State to store the profile data or error message
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfileData() {
      // Fetch profile data from the "profiles" table in Supabase
      const { data, error } = await supabase
        .from('profiles')  // Make sure 'profiles' is the correct table name in Supabase
        .select('*')  // Select all columns
        .eq('id', userId)  // Filter by user ID
        .single();  // Fetch a single record

      if (error) {
        setError(error.message);  // Set error if any
      } else {
        setProfileData(data);  // Set the fetched profile data
      }
    }

    fetchProfileData();  // Fetch data when the component is mounted
  }, [userId]);  // Refetch if the userId changes

  return { profileData, error };  // Return the data and error
}

export default useProfileData;
