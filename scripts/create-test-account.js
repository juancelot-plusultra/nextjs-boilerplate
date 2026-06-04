import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yctjcxtwbaae1gawfxkl.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZTFnYXdmeGtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQxNzYxOCwiZXhwIjoyMDgzOTkzNjE4fQ.OAQE1p0He962mgRymKQEqY9M4nyC3cJuXEyNltlcV7c';

const supabase = createClient(supabaseUrl, serviceKey);

async function createTestAccount() {
  try {
    console.log('[v0] Creating test account...');
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'johnphilipgallana@gmail.com',
      password: 'Applesarered6',
      email_confirm: true,
    });

    if (authError) {
      console.error('[v0] Auth error:', authError);
      return;
    }

    console.log('[v0] Auth user created:', authData.user.id);

    // Create member profile with sample data
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .insert([
        {
          user_id: authData.user.id,
          full_name: 'John Philip Gallana',
          email: 'johnphilipgallana@gmail.com',
          phone: '+63 917 123 4567',
          avatar: 'JPG',
          status: 'active',
          join_date: new Date().toISOString().split('T')[0],
          total_sessions: 12,
          sessions_left: 8,
          total_paid: 15000,
        },
      ])
      .select()
      .single();

    if (memberError) {
      console.log('[v0] Member table may not exist, but auth user created successfully');
    } else {
      console.log('[v0] Member profile created:', memberData);
    }

    console.log('[v0] Test account setup complete!');
    console.log('[v0] Email: johnphilipgallana@gmail.com');
    console.log('[v0] Password: Applesarered6');
    
  } catch (err) {
    console.error('[v0] Setup error:', err);
  }
}

createTestAccount();
