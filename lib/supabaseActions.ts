import { supabase } from './supabase';  // Import the supabase client

// Function to sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { user: null, error };
  }

  return { user: data.user, error: null };
}

// Function to save profile data to Supabase
export async function saveProfileToSupabase(profileData: { id: string, full_name: string, membership_id: string, branch: string }) {
  const { data, error } = await supabase
    .from('profiles')  // Table name in Supabase
    .upsert({  // `upsert` will insert or update the record
      id: profileData.id,
      full_name: profileData.full_name,
      membership_id: profileData.membership_id,
      branch: profileData.branch
    });

  if (error) {
    console.error("Error saving profile data:", error);
    return { error: error.message };
  }

  return { data };  // Return the data in case you want to use it
}
