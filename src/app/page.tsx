import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("perfiles")
    .select("tipo_cuenta, onboarding_completado")
    .eq("id", user.id)
    .single()

  if (!profile?.onboarding_completado) {
    redirect("/onboarding")
  }

  if (profile.tipo_cuenta === "gobierno") {
    redirect("/gobierno")
  }

  // For ranch users, show dashboard (handled by (dashboard) group)
  redirect("/dashboard")
}
