import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          connected: false,
          error: 'Missing Supabase credentials',
          message: 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required',
        },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Try to query the members table
    const { count, error } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json(
        {
          connected: false,
          error: error.message,
          message: 'Failed to connect to members table. Ensure migrations are run.',
          details: error,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        connected: true,
        message: 'Successfully connected to Supabase',
        supabaseUrl,
        membersTableExists: true,
        memberCount: count || 0,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Connection check error:', error)
    return NextResponse.json(
      {
        connected: false,
        error: error.message || 'Unknown error',
        message: 'Failed to verify Supabase connection',
      },
      { status: 500 }
    )
  }
}
