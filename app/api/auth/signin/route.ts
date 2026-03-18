import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      error: "Deprecated route. Use Supabase auth from /login or /welcome.",
    },
    { status: 410 }
  )
}
