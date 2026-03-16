import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST() {
  try {
    console.log('[v0] Checking database tables...')

    // Check if members table exists
    const { error } = await supabase
      .from('members')
      .select('*')
      .limit(1)

    if (error) {
      console.log(
        '[v0] Members table likely does not exist yet. Please create it via Supabase SQL Editor.'
      )

      return NextResponse.json({
        success: false,
        message:
          'Members table not found. Create tables in Supabase SQL Editor.',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful and tables exist.',
    })
  } catch (err: any) {
    console.error('[v0] Database initialization error:', err)

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    )
  }
}
