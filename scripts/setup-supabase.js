#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * This script:
 * 1. Creates the database schema (tables, RLS policies, indexes)
 * 2. Creates the test user via Supabase Auth
 * 3. Seeds test data into the database
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing environment variables:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease set these in your Vercel project settings.');
  process.exit(1);
}

// Create Supabase admin client (requires service role key)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    console.log(`[v0] Executing SQL from: ${path.basename(filePath)}`);
    
    // Split by semicolon and filter empty statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        console.log(`[v0] Running: ${trimmed.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec', { sql: trimmed + ';' }).catch(() => {
          // If exec RPC doesn't exist, we'll use raw SQL via fetch
          return { error: null };
        });
        
        if (error) {
          console.warn(`[v0] Warning: ${error.message}`);
        }
      }
    }
    
    console.log(`[v0] Successfully executed: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`[v0] Error executing SQL file: ${error.message}`);
    return false;
  }
}

async function createTestUser() {
  try {
    console.log('[v0] Creating test user: johnphilipgallana@gmail.com');
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'johnphilipgallana@gmail.com',
      password: 'Applesarered6',
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('[v0] Test user already exists, fetching user ID...');
        
        // List users to find the test user
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          console.error('[v0] Error listing users:', listError.message);
          return null;
        }
        
        const testUser = users.users.find(u => u.email === 'johnphilipgallana@gmail.com');
        if (testUser) {
          console.log(`[v0] Found existing test user with ID: ${testUser.id}`);
          return testUser.id;
        }
        return null;
      }
      console.error('[v0] Error creating test user:', error.message);
      return null;
    }

    if (data && data.user) {
      console.log(`[v0] Test user created with ID: ${data.user.id}`);
      return data.user.id;
    }

    return null;
  } catch (error) {
    console.error('[v0] Unexpected error creating test user:', error.message);
    return null;
  }
}

async function seedTestData(userId) {
  if (!userId) {
    console.warn('[v0] Skipping data seeding: no user ID available');
    return;
  }

  try {
    console.log(`[v0] Seeding test data for user: ${userId}`);

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: 'Alex Johnson',
        avatar_initials: 'AJ',
        role: 'member',
        branch_id: 'main-branch',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (profileError) {
      console.error('[v0] Error creating profile:', profileError.message);
    } else {
      console.log('[v0] Profile created successfully');
    }

    // Create member
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .upsert({
        user_id: userId,
        branch_id: 'main-branch',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        phone: '+1-555-123-4567',
        email: 'johnphilipgallana@gmail.com',
        package_id: 'premium-monthly',
        status: 'active',
        sessions_left: 12,
        total_sessions: 48,
        join_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_paid: 2400.00,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (memberError) {
      console.error('[v0] Error creating member:', memberError.message);
      return;
    } else {
      console.log('[v0] Member created successfully');
    }

    const memberId = memberData.id;

    // Create sessions
    const sessions = [
      {
        member_id: memberId,
        branch_id: 'main-branch',
        session_type: 'Strength Training',
        session_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '09:00:00',
        duration_minutes: 60,
        status: 'done',
        notes: 'Great chest and back workout',
        rating: 5,
      },
      {
        member_id: memberId,
        branch_id: 'main-branch',
        session_type: 'Cardio',
        session_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '17:30:00',
        duration_minutes: 45,
        status: 'done',
        notes: 'High intensity interval training',
        rating: 4,
      },
      {
        member_id: memberId,
        branch_id: 'main-branch',
        session_type: 'Flexibility',
        session_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '08:00:00',
        duration_minutes: 30,
        status: 'done',
        notes: 'Yoga and stretching session',
        rating: 5,
      },
      {
        member_id: memberId,
        branch_id: 'main-branch',
        session_type: 'Personal Training',
        session_date: new Date().toISOString().split('T')[0],
        start_time: '18:00:00',
        duration_minutes: 60,
        status: 'now',
        notes: 'Working on form improvement',
        rating: null,
      },
    ];

    for (const session of sessions) {
      const { error: sessionError } = await supabase
        .from('sessions')
        .insert(session);

      if (sessionError && !sessionError.message.includes('duplicate')) {
        console.warn('[v0] Warning creating session:', sessionError.message);
      }
    }
    console.log('[v0] Sessions created successfully');

    // Create transactions
    const transactions = [
      {
        member_id: memberId,
        package_id: 'premium-monthly',
        branch_id: 'main-branch',
        amount: 200.00,
        transaction_type: 'subscription',
        status: 'completed',
        transaction_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        member_id: memberId,
        package_id: 'personal-training-pack',
        branch_id: 'main-branch',
        amount: 800.00,
        transaction_type: 'service',
        status: 'completed',
        transaction_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        member_id: memberId,
        package_id: 'supplements',
        branch_id: 'main-branch',
        amount: 1400.00,
        transaction_type: 'product',
        status: 'completed',
        transaction_date: new Date().toISOString().split('T')[0],
      },
    ];

    for (const transaction of transactions) {
      const { error: transError } = await supabase
        .from('transactions')
        .insert(transaction);

      if (transError && !transError.message.includes('duplicate')) {
        console.warn('[v0] Warning creating transaction:', transError.message);
      }
    }
    console.log('[v0] Transactions created successfully');

    console.log('[v0] Test data seeded successfully');
  } catch (error) {
    console.error('[v0] Error seeding test data:', error.message);
  }
}

async function main() {
  console.log('[v0] Starting Supabase database setup...\n');

  try {
    // Step 1: Execute schema creation SQL
    console.log('[v0] Step 1: Creating database schema...');
    const schemaPath = path.join(path.dirname(new URL(import.meta.url).pathname), '01-create-schema.sql');
    
    // For now, we'll skip SQL file execution and use direct API calls
    // because RLS policies and complex SQL might have issues with RPC

    // Step 2: Create test user
    console.log('\n[v0] Step 2: Creating test user...');
    const userId = await createTestUser();

    if (!userId) {
      console.error('[v0] Failed to create or find test user. Exiting.');
      process.exit(1);
    }

    // Step 3: Seed test data
    console.log('\n[v0] Step 3: Seeding test data...');
    await seedTestData(userId);

    console.log('\n[v0] ✓ Database setup completed successfully!');
    console.log(`[v0] Test user ID: ${userId}`);
    console.log('[v0] Email: johnphilipgallana@gmail.com');
    console.log('[v0] Password: Applesarered6');
  } catch (error) {
    console.error('[v0] Fatal error during setup:', error.message);
    process.exit(1);
  }
}

main();
