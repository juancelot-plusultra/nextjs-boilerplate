import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      )
    }

    const userId = authData.user.id

    const avatarInitials = fullName
      .trim()
      .split(/\s+/)
      .map((name: string) => name[0])
      .join('')
      .slice(0, 4)
      .toUpperCase()

    const { error: userInsertError } = await supabase.from('users').insert([
      {
        id: userId,
        email,
        full_name: fullName,
        avatar_initials: avatarInitials,
        role: 'member',
        phone: phone || null,
        is_active: true,
      },
    ])

    if (userInsertError) {
      return NextResponse.json(
        { error: userInsertError.message },
        { status: 400 }
      )
    }

    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .insert([
        {
          user_id: userId,
          phone: phone || null,
          email,
          status: 'active',
          sessions_left: 0,
          total_sessions: 0,
          total_paid: 0,
        },
      ])
      .select()
      .single()

    if (memberError) {
      return NextResponse.json(
        { error: memberError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      member: memberData,
      session: authData.session,
    })
  } catch (error: any) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      )
    }

    const userId = authData.user.id

    // 1) Create app user profile row
    const { error: userInsertError } = await supabase.from('users').insert([
      {
        id: userId,
        email,
        full_name: fullName,
        avatar_initials: fullName
          .split(' ')
          .map((name: string) => name[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        role: 'member',
        phone: phone || null,
        is_active: true,
      },
    ])

    if (userInsertError) {
      return NextResponse.json(
        { error: userInsertError.message },
        { status: 400 }
      )
    }

    // 2) Create member row
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .insert([
        {
          user_id: userId,
          phone: phone || null,
          email,
          status: 'active',
          sessions_left: 0,
          total_sessions: 0,
          total_paid: 0,
        },
      ])
      .select()
      .single()

    if (memberError) {
      return NextResponse.json(
        { error: memberError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      member: memberData,
      session: authData.session,
    })
  } catch (error: any) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
