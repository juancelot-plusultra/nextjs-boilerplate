import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Create member record
    const { data: memberData, error: memberError } = await supabase
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

    if (memberError) {
      console.error('[v0] Member creation error:', memberError);
      return NextResponse.json(
        { error: 'Failed to create member profile' },
        { status: 500 }
      );
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
