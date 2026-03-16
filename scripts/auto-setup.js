import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const supabaseUrl = 'https://yctjcxtwbaaeigawfxkl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZWlnYXdmeGtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQxNzYxOCwiZXhwIjoyMDgzOTkzNjE4fQ.OAQE1p0He962mgRymKQEqY9M4nyC3cJuXEyNltlcV7c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testUsers = [
  {
    email: 'alex@email.com',
    password: 'Test@1234',
    fullName: 'Alex Cruz',
    phone: '0917-123-4567',
    userType: 'member'
  },
  {
    email: 'maria@email.com',
    password: 'Test@1234',
    fullName: 'Maria Santos',
    phone: '0917-234-5678',
    userType: 'member'
  },
  {
    email: 'john@email.com',
    password: 'Test@1234',
    fullName: 'John Doe',
    phone: '0917-345-6789',
    userType: 'member'
  },
  {
    email: 'joaquin@bearfit.com',
    password: 'Test@1234',
    fullName: 'Joaquin Garcia',
    phone: '0917-456-7890',
    userType: 'staff'
  },
  {
    email: 'maria@bearfit.com',
    password: 'Test@1234',
    fullName: 'Maria Lopez',
    phone: '0917-567-8901',
    userType: 'staff'
  }
];

async function createTestUsers() {
  console.log('[v0] Starting test user creation...\n');

  for (const user of testUsers) {
    try {
      console.log(`[v0] Creating user: ${user.email}`);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (authError) {
        console.error(`[v0] Auth error for ${user.email}:`, authError.message);
        continue;
      }

      const userId = authData.user.id;
      console.log(`[v0]   ✓ Auth user created with ID: ${userId}`);

      // Create profile in members or staff table
      if (user.userType === 'member') {
        const { error: profileError } = await supabase
          .from('members')
          .insert([
            {
              user_id: userId,
              email: user.email,
              full_name: user.fullName,
              phone: user.phone,
              package_id: 'full48',
              status: 'active',
              sessions_left: 48,
              total_sessions: 48,
              join_date: new Date().toISOString().split('T')[0],
              total_paid: 47500
            }
          ]);

        if (profileError) {
          console.error(`[v0]   ✗ Profile error:`, profileError.message);
        } else {
          console.log(`[v0]   ✓ Member profile created`);
        }
      } else if (user.userType === 'staff') {
        const { error: staffError } = await supabase
          .from('staff')
          .insert([
            {
              user_id: userId,
              email: user.email,
              full_name: user.fullName,
              phone: user.phone,
              role: 'instructor',
              status: 'online',
              clients_count: 5,
              rating: 4.8,
              total_sessions: 120
            }
          ]);

        if (staffError) {
          console.error(`[v0]   ✗ Staff error:`, staffError.message);
        } else {
          console.log(`[v0]   ✓ Staff profile created`);
        }
      }

      console.log(`[v0] ✓ User ${user.email} ready to use!\n`);
    } catch (error) {
      console.error(`[v0] Unexpected error for ${user.email}:`, error.message);
    }
  }

  console.log('[v0] Test user setup complete!');
  console.log('\n[v0] You can now sign in with:');
  testUsers.forEach(user => {
    console.log(`[v0]   - ${user.email} / Test@1234`);
  });
}

createTestUsers().catch(console.error);
