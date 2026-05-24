"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Users, UserCheck, Shield } from "lucide-react"
import { updateUserRole } from "@features/dashboard/api/user.actions"
import type { AdminUser } from "@/infrastructure/storage/supabase-queries"
import { ConfirmDialog } from "@shared/ui/confirm-dialog"

const ORANGE      = "#D9F25D"
const ORANGE_BG   = "rgba(217,242,93,0.12)"

const roleConfig: Record<string, { badgeClass: string; icon: typeof Users; color: string; bg: string }> = {
  ADMIN:     { badgeClass: "dz-badge dz-badge-purple", icon: Shield,    color: "#6D28D9", bg: "#F5F3FF" },
  AFFILIATE: { badgeClass: "dz-badge dz-badge-blue",   icon: UserCheck, color: "#1D4ED8", bg: "#EFF6FF" },
  USER:      { badgeClass: "dz-badge dz-badge-green",  icon: Users,     color: "#065F46", bg: "#ECFDF5" },
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
      style={{
        height: 32, borderRadius: 8, border: "1.5px solid #E5E7EB",
        padding: "0 10px", fontSize: "0.8rem", cursor: "pointer",
        background: "#fff", color: "#374151", outline: "none",
        opacity: pending ? 0.5 : 1,
      }}>
      <option value="USER">USER</option>
      <option value="AFFILIATE">AFFILIATE</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  )
}

export function UsersTable({ users }: { users: AdminUser[] }) {
  const [selected,     setSelected]     = useState<Set<string>>(new Set())
  const [bulkPending,  setBulkPending]  = useState(false)
  const [confirm,      setConfirm]      = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)

  const allSelected = users.length > 0 && users.every(u => selected.has(u.id))

  function toggleAll()          { if (allSelected) setSelected(new Set()); else setSelected(new Set(users.map(u => u.id))) }
  function toggleOne(id: string){ setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }) }

  function handleBulkDelete() {
    setConfirm({
      title: "Hapus Pengguna Terpilih",
      message: `Hapus ${selected.size} pengguna secara permanen?`,
      onConfirm: async () => {
        setBulkPending(true)
        const { deleteUsersBulk } = await import("@features/dashboard/api/user.actions")
        const r = await (deleteUsersBulk as any)([...selected])
        if (r?.error) toast.error(r.error)
        else { toast.success(`${selected.size} pengguna dihapus`); setSelected(new Set()) }
        setBulkPending(false)
      }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {selected.size > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleBulkDelete} disabled={bulkPending}
            style={{ display: "flex", alignItems: "center", gap: 8, height: 40, borderRadius: 999, padding: "0 18px", background: "#FEF2F2", color: "#991B1B", border: "none", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", opacity: bulkPending ? 0.5 : 1 }}>
            {bulkPending ? "Menghapus..." : `🗑 Hapus ${selected.size} terpilih`}
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                <th style={{ padding: "12px 16px", width: 40, background: "#F8F9FA" }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer", width: 15, height: 15 }} />
                </th>
                {["Pengguna", "Role", "Kota", "Bergabung", "Ubah Role"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9CA3AF", background: "#F8F9FA", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "56px 20px", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>Tidak ada data</td></tr>
              ) : users.map(u => {
                const name   = u.profiles?.[0]?.full_name ?? "—"
                const city   = u.profiles?.[0]?.city ?? "—"
                const joined = new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                const rc     = roleConfig[u.role] ?? roleConfig.USER
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid #F3F4F6", transition: "background 0.1s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F8F9FA"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}>
                    <td style={{ padding: "14px 16px" }}>
                      <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleOne(u.id)} style={{ cursor: "pointer", width: 15, height: 15 }} />
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                          background: ORANGE_BG, color: ORANGE,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.85rem", fontWeight: 800,
                        }}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>{name}</p>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#9CA3AF" }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span className={rc.badgeClass}>{u.role}</span>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "#6B7280" }}>{city}</td>
                    <td style={{ padding: "14px 20px", fontSize: "0.8rem", color: "#9CA3AF" }}>{joined}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <RoleSelect userId={u.id} currentRole={u.role} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog title={confirm.title} message={confirm.message} confirmLabel="Hapus"
          onConfirm={() => { confirm.onConfirm(); setConfirm(null) }}
          onCancel={() => setConfirm(null)} />
      )}
    </div>
  )
}

