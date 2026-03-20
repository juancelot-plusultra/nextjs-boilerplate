import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message || "Authentication failed" },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Fetch user details from users table
    let { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle()

    // If user doesn't exist (first login after signup), create user record
    if (!userData && !userError) {
      const fullName = authData.user.user_metadata?.full_name || authData.user.email?.split("@")[0] || "User"
      const phone = authData.user.user_metadata?.phone || null

      const { data: newUserData, error: createError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          full_name: fullName,
          phone,
          role: "member",
          is_active: true,
        })
        .select()
        .single()

      if (createError) {
        console.error("[v0] Failed to create user on first login:", createError)
        // Return auth data even if profile creation fails
        return NextResponse.json({
          success: true,
          user: {
            id: authData.user.id,
            email: authData.user.email,
            full_name: fullName,
            phone,
            role: "member",
            is_active: true,
          },
          session: authData.session,
        })
      }

      userData = newUserData
    } else if (userError) {
      console.error("[v0] Fetch user error:", userError)
      // Return auth data if fetch fails
      return NextResponse.json({
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: authData.user.user_metadata?.full_name || authData.user.email?.split("@")[0],
        },
        session: authData.session,
      })
    }

    return NextResponse.json({
      success: true,
      user: userData,
      session: authData.session,
    })
  } catch (error) {
    console.error("[v0] Sign in error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
