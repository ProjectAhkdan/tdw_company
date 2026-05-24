import type { Metadata } from "next"
import { getServerSession } from "@/infrastructure/session/auth-server"
import { redirect } from "next/navigation"
import DashboardLayoutClient from "./layout-client"

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session) redirect("/login")
  if ((session as any)?.role === 'ADMIN') redirect('/admin')

  const profiles = (session as any)?.profiles
  const profile = Array.isArray(profiles) ? profiles[0] : profiles
  const userName = profile?.full_name || session?.email || "Pengguna"
  const avatarUrl = profile?.avatar_url ?? null
  return <DashboardLayoutClient userName={userName} avatarUrl={avatarUrl}>{children}</DashboardLayoutClient>
}
