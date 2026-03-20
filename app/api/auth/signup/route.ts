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

    // Sign up with Supabase
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

    // Create member profile in database
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName,
        phone: phone || null,
        status: "active",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (memberError) {
      console.error("Error creating member profile:", memberError)
      // Member was created in auth but profile creation failed
      // This isn't critical, the user can still sign in
    }

    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      message: "Account created successfully. Please sign in.",
    })
  } catch (err) {
    console.error("Signup error:", err)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
