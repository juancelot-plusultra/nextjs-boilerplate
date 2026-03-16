import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { supabaseConfig } from '@/lib/config';

const testUsers = [
  {
    email: 'alex@email.com',
    password: 'Test@1234',
    fullName: 'Alex Cruz',
    userMetadata: { role: 'member' }
  },
  {
    email: 'maria@email.com',
    password: 'Test@1234',
    fullName: 'Maria Garcia',
    userMetadata: { role: 'member' }
  },
  {
    email: 'john@email.com',
    password: 'Test@1234',
    fullName: 'John Smith',
    userMetadata: { role: 'member' }
  },
  {
    email: 'joaquin@bearfit.com',
    password: 'Test@1234',
    fullName: 'Joaquin Rodriguez',
    userMetadata: { role: 'staff' }
  },
  {
    email: 'maria@bearfit.com',
    password: 'Test@1234',
    fullName: 'Maria Santos',
    userMetadata: { role: 'staff' }
  }
];

export async function POST() {
  try {
    console.log('[v0] Starting test user creation...');
    
    const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceKey);
    const results = [];

    for (const user of testUsers) {
      try {
        console.log(`[v0] Creating user: ${user.email}`);
        
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          user_metadata: user.userMetadata,
          email_confirm: true
        });

        if (error) {
          console.log(`[v0] User ${user.email} already exists or error:`, error.message);
          results.push({
            email: user.email,
            status: 'exists_or_error',
            message: error.message
          });
        } else {
          console.log(`[v0] Successfully created user: ${user.email}`);
          results.push({
            email: user.email,
            status: 'created',
            userId: data.user?.id
          });
        }
      } catch (err: any) {
        console.error(`[v0] Error creating user ${user.email}:`, err.message);
        results.push({
          email: user.email,
          status: 'error',
          message: err.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Test user creation completed',
      results
    });
  } catch (error: any) {
    console.error('[v0] Setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to create test users',
    testUsers: testUsers.map(u => ({ email: u.email, password: u.password, fullName: u.fullName }))
  });
}
