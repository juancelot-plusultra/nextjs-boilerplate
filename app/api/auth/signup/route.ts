import { NextResponse } from "next/server"
import { createClient, createServiceRoleClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone } = body

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message || "Sign up failed" },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    // Use service role client to bypass RLS for user profile creation
    const serviceSupabase = createServiceRoleClient()

    // Create user record in users table
    const { data: userData, error: userError } = await serviceSupabase
      .from("users")
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        phone: phone || null,
        role: "member",
        is_active: true,
      })
      .select()
      .single()

    if (userError) {
      console.error("[v0] User creation error:", userError)
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      )
    }

    // Create member record in members table
    const { data: memberData, error: memberError } = await serviceSupabase
      .from("members")
      .insert({
        user_id: authData.user.id,
        email,
        phone: phone || null,
        status: "active",
      })
      .select()
      .single()

    if (memberError) {
      console.error("[v0] Member creation error:", memberError)
      // Don't fail completely if member creation fails, user can still login
    }

    return NextResponse.json({
      success: true,
      user: userData,
      member: memberData || null,
      session: authData.session,
    })
  } catch (error) {
    console.error("[v0] Sign up error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
