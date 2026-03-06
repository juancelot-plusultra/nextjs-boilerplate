import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Sign in failed' },
        { status: 500 }
      )
    }

    // Fetch or create member profile
    const { data: existingMember, error: fetchError } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', data.user.id)
      .single()

    let memberData = null

    if (existingMember) {
      memberData = existingMember
    } else if (fetchError?.code === 'PGRST116') {
      // Member doesn't exist, create one
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
        .single()

      if (createError) {
        // Log error but don't fail - user is authenticated
        console.error('Member creation error:', createError)
      } else {
        memberData = newMember
      }
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      member: memberData,
    })
  } catch (error: any) {
    console.error('Signin error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
