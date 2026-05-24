import type { Metadata } from "next"
import { getServerSession } from "@/infrastructure/session/auth-server"
import { redirect } from "next/navigation"
import AdminLayoutClient from "./layout-client"

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session) redirect("/login")
  if ((session as any)?.role !== 'ADMIN') redirect('/dashboard')

  const profiles = (session as any)?.profiles
  const profile = Array.isArray(profiles) ? profiles[0] : profiles
  const userName = profile?.full_name || session?.email || "Admin"
  return <AdminLayoutClient userName={userName}>{children}</AdminLayoutClient>
}
