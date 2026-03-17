import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import BearfitDashboardClient from "./BearfitDashboardClient"

export default async function MemberDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/welcome")
  }

  const { data: memberData, error: memberError } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (memberError && memberError.code !== "PGRST116") {
    console.error("[dashboard] member fetch error:", memberError)
  }

  return (
    <BearfitDashboardClient
      user={user}
      member={memberData ?? null}
    />
  )
}
