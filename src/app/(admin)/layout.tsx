import type { Metadata } from "next"
import { getServerSession } from "@/infrastructure/session/auth-server"
import { redirect } from "next/navigation"
import AdminLayoutClient from "./layout-client"

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session: any = null
  try {
    session = await getServerSession()
  } catch {
    redirect("/login")
  }
  if (!session) redirect("/login")
  if (session?.role !== 'ADMIN') redirect('/dashboard')

  const profiles = session?.profiles
  const profile = Array.isArray(profiles) ? profiles[0] : profiles
  const userName = profile?.full_name || session?.email || "Admin"
  return <AdminLayoutClient userName={userName}>{children}</AdminLayoutClient>
}



