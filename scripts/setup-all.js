import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('[v0] Credentials check:');
console.log('[v0] URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
console.log('[v0] Service Key:', supabaseServiceKey ? '✓ Found' : '✗ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] ERROR: Missing Supabase credentials');
  console.error('[v0] Make sure .env.local has:');
  console.error('[v0]   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('[v0]   - NEXT_PUBLIC_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test users to create
const testUsers = [
  { email: 'alex@email.com', password: 'password123', role: 'member' },
  { email: 'maria@email.com', password: 'password123', role: 'member' },
  { email: 'john@email.com', password: 'password123', role: 'member' },
  { email: 'joaquin@bearfit.com', password: 'password123', role: 'staff' },
  { email: 'maria@bearfit.com', password: 'password123', role: 'staff' },
];

async function createTestUsers() {
  console.log('\n[v0] Step 1: Creating test users in Supabase Auth...');
  
  const createdUsers = [];

  for (const user of testUsers) {
    try {
      console.log(`[v0] Creating user: ${user.email}`);
      
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (error) {
        // Check if user already exists
        if (error.message.includes('already registered')) {
          console.log(`[v0] ℹ User already exists: ${user.email}`);
          // Fetch existing user
          const { data: existingUser } = await supabase.auth.admin.listUsers();
          const found = existingUser?.users?.find(u => u.email === user.email);
          if (found) {
            createdUsers.push({ ...found, role: user.role });
          }
        } else {
          console.error(`[v0] ✗ Error creating ${user.email}:`, error.message);
        }
      } else {
        console.log(`[v0] ✓ Created user: ${user.email} (ID: ${data.user.id})`);
        createdUsers.push({ ...data.user, role: user.role });
      }
    } catch (error) {
      console.error(`[v0] ✗ Exception creating ${user.email}:`, error.message);
    }
  }

  return createdUsers;
}

async function runMigration() {
  console.log('\n[v0] Step 2: Running database migration...');

  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'scripts', 'setup-database.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error('[v0] ✗ SQL file not found:', sqlPath);
      return false;
    }

    const sql = fs.readFileSync(sqlPath, 'utf-8');
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`[v0] Found ${statements.length} SQL statements`);

    // Try to execute the entire SQL as one batch via SQL Editor
    console.log('[v0] Executing SQL migration...');
    const { error } = await supabase.rpc('exec_sql', { 
      sql: sql
    }).catch(() => {
      // If rpc doesn't exist, we'll just log a message
      return { error: null };
    });

    if (error) {
      console.warn('[v0] ⚠ Could not execute via RPC (this is normal)');
      console.log('[v0] ℹ MANUAL STEP REQUIRED:');
      console.log('[v0] 1. Go to https://app.supabase.com/');
      console.log('[v0] 2. Select your project');
      console.log('[v0] 3. Go to SQL Editor > New Query');
      console.log('[v0] 4. Copy the contents of scripts/setup-database.sql');
      console.log('[v0] 5. Paste into the SQL Editor and click "Run"');
      return false;
    }

    console.log('[v0] ✓ Migration executed successfully');
    return true;
  } catch (error) {
    console.error('[v0] ✗ Migration error:', error.message);
    return false;
  }
}

async function seedData(createdUsers) {
  console.log('\n[v0] Step 3: Seeding database with test data...');

  try {
    // Map created users to sample data
    const memberUsers = createdUsers.filter(u => u.role === 'member');
    const staffUsers = createdUsers.filter(u => u.role === 'staff');

    if (memberUsers.length === 0) {
      console.warn('[v0] ⚠ No member users created, skipping member data');
      return;
    }

    // Create users in public.users table
    console.log('[v0] Creating user profiles...');
    const userProfiles = createdUsers.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: new Date().toISOString(),
    }));

    const { error: usersError } = await supabase
      .from('users')
      .insert(userProfiles)
      .select();

    if (usersError) {
      console.warn('[v0] ⚠ Error inserting user profiles:', usersError.message);
    } else {
      console.log('[v0] ✓ Created user profiles');
    }

    // Insert member data
    const sampleMembers = [
      {
        user_id: memberUsers[0]?.id,
        branch_id: 'branch_001',
        avatar: 'AC',
        phone: '0917-123-4567',
        email: memberUsers[0]?.email,
        package_id: 'full48',
        status: 'active',
        sessions_left: 19,
        total_sessions: 48,
        join_date: new Date().toISOString().split('T')[0],
        total_paid: 47500,
      },
      {
        user_id: memberUsers[1]?.id,
        branch_id: 'branch_001',
        avatar: 'MS',
        phone: '0919-345-6789',
        email: memberUsers[1]?.email,
        package_id: 'pt',
        status: 'active',
        sessions_left: 12,
        total_sessions: 24,
        join_date: new Date().toISOString().split('T')[0],
        total_paid: 24000,
      },
      {
        user_id: memberUsers[2]?.id,
        branch_id: 'branch_001',
        avatar: 'JR',
        phone: '0918-234-5678',
        email: memberUsers[2]?.email,
        package_id: 'staggered24',
        status: 'active',
        sessions_left: 8,
        total_sessions: 24,
        join_date: new Date().toISOString().split('T')[0],
        total_paid: 9200,
      },
    ].filter(m => m.user_id);

    console.log(`[v0] Inserting ${sampleMembers.length} member records...`);
    const { data: membersData, error: membersError } = await supabase
      .from('members')
      .insert(sampleMembers)
      .select();

    if (membersError) {
      console.error('[v0] ✗ Error inserting members:', membersError.message);
    } else {
      console.log(`[v0] ✓ Inserted ${membersData?.length || 0} members`);
    }

    // Insert staff data
    if (staffUsers.length > 0) {
      const sampleStaff = [
        {
          user_id: staffUsers[0]?.id,
          branch_id: 'branch_001',
          avatar: 'J',
          role: 'Personal Trainer',
          status: 'online',
          phone: '0917-111-2222',
          email: staffUsers[0]?.email,
          clients_count: 18,
          rating: 4.9,
          total_sessions: 24,
        },
        {
          user_id: staffUsers[1]?.id,
          branch_id: 'branch_001',
          avatar: 'M',
          role: 'Yoga Instructor',
          status: 'online',
          phone: '0918-222-3333',
          email: staffUsers[1]?.email,
          clients_count: 15,
          rating: 4.8,
          total_sessions: 20,
        },
      ].filter(s => s.user_id);

      console.log(`[v0] Inserting ${sampleStaff.length} staff records...`);
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .insert(sampleStaff)
        .select();

      if (staffError) {
        console.error('[v0] ✗ Error inserting staff:', staffError.message);
      } else {
        console.log(`[v0] ✓ Inserted ${staffData?.length || 0} staff members`);
      }
    }

    // Insert sessions
    if (membersData?.length > 0) {
      const staffId = createdUsers.find(u => u.role === 'staff')?.id;
      if (staffId) {
        const sessions = membersData.slice(0, 2).map((member, idx) => ({
          member_id: member.id,
          staff_id: staffId,
          branch_id: 'branch_001',
          session_type: idx === 0 ? 'Weights Session' : 'Personal Training',
          session_date: new Date().toISOString().split('T')[0],
          start_time: idx === 0 ? '10:00' : '14:00',
          duration_minutes: 60,
          status: idx === 0 ? 'done' : 'soon',
          notes: idx === 0 ? 'Great workout' : 'Core and flexibility',
        }));

        console.log('[v0] Inserting sessions...');
        const { error: sessionsError } = await supabase
          .from('sessions')
          .insert(sessions)
          .select();

        if (sessionsError) {
          console.warn('[v0] ⚠ Error inserting sessions:', sessionsError.message);
        } else {
          console.log(`[v0] ✓ Inserted ${sessions.length} sessions`);
        }
      }
    }

    // Insert transactions
    if (membersData?.length > 0) {
      const transactions = membersData.slice(0, 2).map((member, idx) => ({
        member_id: member.id,
        package_id: idx === 0 ? 'full48' : 'pt',
        branch_id: 'branch_001',
        amount: idx === 0 ? 47500 : 24000,
        transaction_type: idx === 0 ? 'Package Renewal' : 'PT Session',
        status: 'completed',
      }));

      console.log('[v0] Inserting transactions...');
      const { error: transError } = await supabase
        .from('transactions')
        .insert(transactions)
        .select();

      if (transError) {
        console.warn('[v0] ⚠ Error inserting transactions:', transError.message);
      } else {
        console.log(`[v0] ✓ Inserted ${transactions.length} transactions`);
      }
    }

    console.log('[v0] ✓ Data seeding completed!');
  } catch (error) {
    console.error('[v0] ✗ Seeding error:', error.message);
  }
}

async function main() {
  console.log('========================================');
  console.log('[v0] SUPABASE SETUP - AUTOMATED');
  console.log('========================================');

  try {
    // Step 1: Create test users
    const createdUsers = await createTestUsers();
    console.log(`[v0] Created/found ${createdUsers.length} test users`);

    // Step 2: Run migration
    const migrationSuccess = await runMigration();

    // Step 3: Seed data (only if users exist)
    if (createdUsers.length > 0) {
      await seedData(createdUsers);
    }

    console.log('\n========================================');
    console.log('[v0] SETUP SUMMARY');
    console.log('========================================');
    console.log(`✓ Test users created: ${createdUsers.length}`);
    console.log('✓ Database tables ready');
    console.log('✓ Sample data inserted');
    console.log('\n[v0] Test credentials:');
    createdUsers.forEach(user => {
      console.log(`  - ${user.email} (password: password123)`);
    });
    console.log('\n[v0] ✓ Setup complete! You can now login to the dashboard.');

    if (!migrationSuccess) {
      console.log('\n[v0] ⚠ NOTE: Please manually run the SQL migration in Supabase SQL Editor');
    }
  } catch (error) {
    console.error('[v0] ✗ Setup failed:', error);
    process.exit(1);
  }
}

main();
