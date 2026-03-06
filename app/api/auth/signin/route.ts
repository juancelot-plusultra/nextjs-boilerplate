import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[v0] Auth error:', error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Sign in failed' },
        { status: 500 }
      );
    }

    // Fetch or create member profile
    let memberData = null;
    
    // First try to fetch existing member
    const { data: existingMember, error: fetchError } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (existingMember) {
      memberData = existingMember;
    } else if (fetchError?.code === 'PGRST116') {
      // Member doesn't exist, create one
      console.log('[v0] Creating new member profile for user:', data.user.id);
      
      const { data: newMember, error: createError } = await supabase
        .from('members')
        .insert([
          {
            user_id: data.user.id,
            full_name: data.user.email?.split('@')[0] || 'Member',
            email: data.user.email,
            phone: '',
            status: 'active',
            join_date: new Date().toISOString().split('T')[0],
            total_sessions: 0,
            sessions_left: 0,
            total_paid: 0,
            branch_id: 'default',
            avatar: '',
            package_id: '',
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error('[v0] Member creation error:', createError);
      } else {
        memberData = newMember;
      }
    } else if (fetchError) {
      console.error('[v0] Member fetch error:', fetchError);
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      member: memberData,
      session: data.session,
    });
  } catch (error: any) {
    console.error('[v0] Signin error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
