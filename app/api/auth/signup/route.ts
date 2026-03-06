import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Use anon key for auth, service key for data operations if available
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }



    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      );
    }

    // Create member record using admin client if available
    let memberData = null;
    const adminClient = supabaseAdmin || supabase;
    
    try {
      const { data: member, error: memberError } = await adminClient
        .from('members')
        .insert([
          {
            user_id: authData.user.id,
            full_name: fullName,
            email,
            phone: phone || null,
            status: 'active',
            join_date: new Date().toISOString().split('T')[0],
            total_sessions: 0,
            sessions_left: 0,
            total_paid: 0,
          },
        ])
        .select()
        .single();

      if (member) {
        memberData = member;
      }
      
      if (memberError) {
        console.log('[v0] Member creation error:', memberError.message);
        // This is non-critical - allow signup to succeed even if member record isn't created
      }
    } catch (err) {
      console.log('[v0] Member creation skipped:', err);
      // Non-critical error - continue with signup
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      member: memberData,
      session: authData.session,
    });
  } catch (error: any) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
