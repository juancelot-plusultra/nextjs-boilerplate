import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Initializing database...')

    // Create members table
    const { error: membersError } = await supabase
      .from('members')
      .select('id')
      .limit(1)
      .then(async () => {
        // Table exists, no need to create
        return { error: null }
      })
      .catch(async (err) => {
        // Table doesn't exist, we need to create it via SQL
        // Since we can't execute raw SQL via the JS client, this must be done in Supabase dashboard
        console.log('[v0] Members table needs to be created via Supabase SQL editor')
        return { error: 'Table creation requires Supabase dashboard access' }
      })

    return NextResponse.json({
      success: false,
      message: 'Database initialization requires manual setup',
      instructions: {
        step1: 'Go to your Supabase dashboard (https://app.supabase.com)',
        step2: 'Select your project',
        step3: 'Go to SQL Editor',
        step4: 'Run the SQL migrations from /scripts folder',
        step5: 'Verify tables are created successfully',
      },
      currentStatus: {
        url: supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
      },
    })
  } catch (error: any) {
    console.error('[v0] Database init error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
