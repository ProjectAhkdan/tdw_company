import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/server"
import { getUserProfile } from "@/lib/supabase/queries"
import ProfileClient from "./profile-client"

export default async function ProfilePage() {
  const session = await getServerSession()
  if (!session) redirect("/login")

  const { data: profile } = await getUserProfile(session.id)

  return <ProfileClient profile={profile} email={session.email} />
}
