import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json()

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

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
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

    await supabase.from("members").upsert({
      id: authData.user.id,
      user_id: authData.user.id,
      email: authData.user.email,
      full_name: fullName,
      phone: phone || null,
      status: "active",
      created_at: new Date().toISOString(),
    })

    // immediately sign in after signup so cookie session is created
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (signInError || !signInData.user) {
      return NextResponse.json(
        {
          error: signInError?.message || "Account created, but auto-login failed",
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      user: {
        id: signInData.user.id,
        email: signInData.user.email,
      },
      message: "Account created successfully",
      redirectTo: "/member/dashboard",
    })
  } catch (err) {
    console.error("Signup error:", err)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
