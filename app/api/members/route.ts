import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - Fetch all members with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const branch = searchParams.get('branch')
    const limit = searchParams.get('limit') || '100'

    let query = supabase.from('members').select('*')

    if (status) {
      query = query.eq('status', status)
    }

    if (branch) {
      query = query.eq('branch_id', branch)
    }

    const { data, error, count } = await query.limit(parseInt(limit))

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[v0] GET /api/members error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// POST - Create a new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.full_name || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: full_name and email',
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('members')
      .insert([body])
      .select()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        data: data?.[0],
        message: 'Member created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] POST /api/members error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// PUT - Update a member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing member ID',
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('members')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data?.[0],
      message: 'Member updated successfully',
    })
  } catch (error: any) {
    console.error('[v0] PUT /api/members error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete a member
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing member ID',
        },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('members').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully',
    })
  } catch (error: any) {
    console.error('[v0] DELETE /api/members error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
