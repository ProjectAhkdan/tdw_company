"use client"

import { useState, useMemo, useTransition } from "react"
import { toast } from "sonner"
import { updateUserRole } from "@/server/actions/user"
import type { AdminUser } from "@/lib/supabase/queries"

const GOLD = "oklch(0.78 0.16 55)"

const FALLBACK: AdminUser[] = [
  { id: "1", email: "budi@example.com", role: "USER", created_at: "2026-01-10T00:00:00Z", profiles: [{ full_name: "Budi Santoso", phone: "081234567890", city: "Jakarta" }] },
  { id: "2", email: "sari@example.com", role: "USER", created_at: "2026-02-15T00:00:00Z", profiles: [{ full_name: "Sari Dewi", phone: "082345678901", city: "Surabaya" }] },
  { id: "3", email: "rudi@example.com", role: "AFFILIATE", created_at: "2026-03-05T00:00:00Z", profiles: [{ full_name: "Rudi Hartono", phone: "083456789012", city: "Bandung" }] },
  { id: "4", email: "maya@example.com", role: "USER", created_at: "2026-03-20T00:00:00Z", profiles: [{ full_name: "Maya Sari", phone: null, city: "Medan" }] },
  { id: "5", email: "agus@example.com", role: "AFFILIATE", created_at: "2026-04-01T00:00:00Z", profiles: [{ full_name: "Agus Setiawan", phone: "085678901234", city: "Jakarta" }] },
  { id: "6", email: "admin@tdwresources.id", role: "ADMIN", created_at: "2026-01-01T00:00:00Z", profiles: [{ full_name: "Admin TDW", phone: null, city: "Jakarta" }] },
]

const roleStyle: Record<string, string> = {
  ADMIN: "bg-purple-500/15 text-purple-400",
  AFFILIATE: "bg-blue-500/15 text-blue-400",
  USER: "bg-emerald-500/15 text-emerald-400",
}

function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [pending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as "USER" | "AFFILIATE" | "ADMIN"
    startTransition(async () => {
      const r = await updateUserRole(userId, newRole)
      if (r && "error" in r) toast.error(r.error)
      else toast.success("Role berhasil diubah")
    })
  }

  return (
    <select value={currentRole} onChange={handleChange} disabled={pending}
      className="h-7 rounded-lg border px-2 text-xs outline-none disabled:opacity-50"
      style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }}>
      <option value="USER">USER</option>
      <option value="AFFILIATE">AFFILIATE</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  )
}

export default function AdminUsersClient({ users }: { users: AdminUser[] }) {
  const data = users.length ? users : FALLBACK
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")

  const filtered = useMemo(() => data.filter((u) => {
    const name = u.profiles?.[0]?.full_name ?? ""
    const matchSearch = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "ALL" || u.role === roleFilter
    return matchSearch && matchRole
  }), [data, search, roleFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Pengguna</h1>
        <p className="mt-1 text-sm text-muted-foreground">{data.length} pengguna terdaftar</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 rounded-xl border px-4 text-sm outline-none"
          style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)", minWidth: 240 }}
        />
        <div className="flex gap-1 rounded-xl border p-1"
          style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
          {["ALL", "USER", "AFFILIATE", "ADMIN"].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className="rounded-lg px-3 py-1 text-xs font-medium transition-all"
              style={roleFilter === r ? { background: GOLD, color: "oklch(0.08 0 0)" } : { color: "oklch(0.55 0.01 60)" }}>
              {r === "ALL" ? "Semua" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground"
                style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
                {["Pengguna", "Role", "Kota", "Bergabung", "Ubah Role"].map(h => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Tidak ada data</td></tr>
              ) : filtered.map((u) => {
                const name = u.profiles?.[0]?.full_name ?? "—"
                const city = u.profiles?.[0]?.city ?? "—"
                const joined = new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                return (
                  <tr key={u.id} className="border-b transition-colors hover:bg-white/[0.02]"
                    style={{ borderColor: "oklch(0.18 0.01 55 / 0.3)" }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                          style={{ background: `${GOLD}20`, color: GOLD }}>
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyle[u.role] ?? "bg-muted text-muted-foreground"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{city}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{joined}</td>
                    <td className="px-5 py-3">
                      <RoleSelect userId={u.id} currentRole={u.role} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
