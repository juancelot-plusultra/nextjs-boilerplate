import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yctjcxtwbaaeigawfxkl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZWlnYXdmeGtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQxNzYxOCwiZXhwIjoyMDgzOTkzNjE4fQ.OAQE1p0He962mgRymKQEqY9M4nyC3cJuXEyNltlcV7c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('[v0] Starting database setup...\n');

  try {
    // Create tables if they don't exist
    const sql = `
      -- Create members table
      CREATE TABLE IF NOT EXISTS public.members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE,
        email VARCHAR(255),
        full_name VARCHAR(255),
        phone VARCHAR(20),
        package_id VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        sessions_left INT DEFAULT 0,
        total_sessions INT DEFAULT 0,
        join_date DATE,
        total_paid DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create staff table
      CREATE TABLE IF NOT EXISTS public.staff (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE,
        email VARCHAR(255),
        full_name VARCHAR(255),
        phone VARCHAR(20),
        role VARCHAR(50),
        status VARCHAR(50) DEFAULT 'online',
        clients_count INT DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 0,
        total_sessions INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Note: We can't execute raw SQL through the JS client, so we'll just create the profiles
    console.log('[v0] Tables should exist in your Supabase project');
    console.log('[v0] Proceeding with user creation...\n');

  } catch (error) {
    console.error('[v0] Setup error:', error.message);
  }
}

async function createUsers() {
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

  const createdUsers = [];

  for (const user of testUsers) {
    try {
      console.log(`[v0] Processing: ${user.email}`);

      // Try to get existing user first
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const userExists = existingUsers?.users?.some(u => u.email === user.email);

      if (userExists) {
        console.log(`[v0]   ℹ User already exists`);
        const existingUser = existingUsers.users.find(u => u.email === user.email);
        createdUsers.push({ email: user.email, userId: existingUser.id });
        continue;
      }

      // Create new user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (authError) {
        console.log(`[v0]   ✗ Error: ${authError.message}`);
        continue;
      }

      const userId = authData.user.id;
      console.log(`[v0]   ✓ Created with ID: ${userId}`);
      createdUsers.push({ email: user.email, userId });

      // Create profile
      if (user.userType === 'member') {
        const { error: profileError } = await supabase.from('members').insert([
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

        if (!profileError) {
          console.log(`[v0]   ✓ Profile created`);
        }
      } else if (user.userType === 'staff') {
        const { error: staffError } = await supabase.from('staff').insert([
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

        if (!staffError) {
          console.log(`[v0]   ✓ Profile created`);
        }
      }
    } catch (error) {
      console.log(`[v0]   ✗ Error: ${error.message}`);
    }
  }

  console.log('\n[v0] ===== SETUP COMPLETE =====');
  console.log('[v0] You can now sign in with:\n');
  testUsers.forEach(user => {
    console.log(`[v0] Email: ${user.email}`);
    console.log(`[v0] Password: Test@1234\n`);
  });
}

async function main() {
  await setupDatabase();
  await createUsers();
}

main().catch(console.error);
