// lib/useProfileData.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';  // Import Supabase client

// Define the ProfileData interface
interface ProfileData {
  full_name: string;
  membership_id: string;
  branch: string;
}

function useProfileData(userId: string) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);  // Initialize the profileData state
  const [error, setError] = useState<string>('');  // State for handling error messages

  useEffect(() => {
    // Function to fetch profile data
    async function fetchProfileData() {
      const { data, error } = await supabase
        .from('profiles')  // Fetch data from the 'profiles' table
        .select('*')  // Select all columns
        .eq('id', userId)  // Filter by the user ID
        .single();  // Get a single record (since we expect only one profile per user)

      if (error) {
        setError(error.message);  // If there's an error, set the error message
      } else {
        setProfileData(data);  // If successful, update profile data
      }
    }

    fetchProfileData();  // Fetch profile data on initial load

    // Subscribe to real-time updates for the 'profiles' table
    const profileSubscription = supabase
      .channel('profiles')  // Create a new subscription channel for the 'profiles' table
      .on('postgres_changes', {
        event: 'UPDATE',  // Listen for UPDATE events
        schema: 'public',
        table: 'profiles',  // Table to subscribe to
        filter: `id=eq.${userId}`,  // Only subscribe to updates for the current user
      }, (payload) => {
        // Update the profile data when it changes
        const updatedProfile: ProfileData = {
          full_name: payload.new.full_name,
          membership_id: payload.new.membership_id,
          branch: payload.new.branch,
        };

        setProfileData(updatedProfile);  // Update state with the latest profile data
      })
      .subscribe();  // Start the subscription

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeSubscription(profileSubscription);  // Remove the subscription
    };
  }, [userId]);  // Run the effect whenever the userId changes

  return { profileData, error };  // Return the profile data and error message
}

export default useProfileData;
