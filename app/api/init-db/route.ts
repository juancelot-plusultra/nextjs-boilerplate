import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Supabase environment variables.",
        },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from("members")
      .select("*")
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        message: "Members table not found. Create tables in Supabase SQL Editor.",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful and tables exist.",
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    )
  }
}
