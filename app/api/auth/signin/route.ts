import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  let response = NextResponse.json({ success: false });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
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

    console.log('[v0] User signed in:', data.user.id);

    // Fetch or create member profile
    const { data: existingMember, error: fetchError } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    let memberData = null;

    if (existingMember) {
      memberData = existingMember;
      console.log('[v0] Found existing member:', memberData.id);
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
        return NextResponse.json(
          { error: 'Failed to create member profile' },
          { status: 500 }
        );
      } else {
        memberData = newMember;
        console.log('[v0] Member created:', memberData.id);
      }
    } else if (fetchError) {
      console.error('[v0] Member fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch member profile' },
        { status: 500 }
      );
    }

    response = NextResponse.json({
      success: true,
      user: data.user,
      member: memberData,
    });

    return response;
  } catch (error: any) {
    console.error('[v0] Signin error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
