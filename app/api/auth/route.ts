import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, fullName, role } = await request.json()

    if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (error) return NextResponse.json({ error: error.message }, { status: 400 })

      // Create user profile in public schema
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user?.id,
            email,
            full_name: fullName,
            role,
            avatar_initials: fullName
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 4),
          },
        ])
        .select()

      if (userError) return NextResponse.json({ error: userError.message }, { status: 400 })

      return NextResponse.json({ data: userData[0], user: data.user })
    }

    if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return NextResponse.json({ error: error.message }, { status: 400 })

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user?.id)
        .single()

      if (userError) return NextResponse.json({ error: userError.message }, { status: 400 })

      return NextResponse.json({ session: data.session, user: userData })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
