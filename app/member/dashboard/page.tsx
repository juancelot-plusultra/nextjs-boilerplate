import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import BearfitDashboardClient from "./BearfitDashboardClient"

export default async function MemberDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/welcome")
  }

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  return <BearfitDashboardClient user={user} member={member ?? null} />
}
