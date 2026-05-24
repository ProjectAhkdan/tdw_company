import Link from "next/link"
import type { AdminUser } from "@/infrastructure/storage/supabase-queries"
import { UsersSearch } from "./users-search"
import { UsersTable } from "./users-table"

const ORANGE      = "#D9F25D"
const ORANGE_BG   = "rgba(217,242,93,0.12)"
const ORANGE_TEXT = "#0A0A0A"

const FALLBACK: AdminUser[] = [
  { id: "1", email: "budi@example.com",  role: "USER",      created_at: "2026-01-10T00:00:00Z", profiles: [{ full_name: "Budi Santoso",   phone: "081234567890", city: "Jakarta"  }] },
  { id: "2", email: "sari@example.com",  role: "USER",      created_at: "2026-02-15T00:00:00Z", profiles: [{ full_name: "Sari Dewi",      phone: "082345678901", city: "Surabaya" }] },
  { id: "3", email: "rudi@example.com",  role: "USER", created_at: "2026-03-05T00:00:00Z", profiles: [{ full_name: "Rudi Hartono",   phone: "083456789012", city: "Bandung"  }] },
  { id: "4", email: "maya@example.com",  role: "USER",      created_at: "2026-03-20T00:00:00Z", profiles: [{ full_name: "Maya Sari",      phone: null,           city: "Medan"    }] },
  { id: "5", email: "agus@example.com",  role: "USER", created_at: "2026-04-01T00:00:00Z", profiles: [{ full_name: "Agus Setiawan", phone: "085678901234", city: "Jakarta"  }] },
  { id: "6", email: "admin@tdwresources.id", role: "ADMIN", created_at: "2026-01-01T00:00:00Z", profiles: [{ full_name: "Admin TDW",      phone: null,           city: "Jakarta"  }] },
]

export default function AdminUsersContent({ 
  users, 
  searchQuery, 
  roleFilter 
}: { 
  users: AdminUser[];
  searchQuery: string;
  roleFilter: string;
}) {
  const data = users.length ? users : FALLBACK

  const filtered = data.filter(u => {
    const name = u.profiles?.[0]?.full_name ?? ""
    const matchSearch = !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole   = roleFilter === "ALL" || u.role === roleFilter
    return matchSearch && matchRole
  })

  // Role stats
  const roleCounts = [
    { key: "ALL",       label: "Semua",    count: data.length },
    { key: "USER",      label: "User",     count: data.filter(u => u.role === "USER").length },
    { key: "ADMIN",     label: "Admin",    count: data.filter(u => u.role === "ADMIN").length },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Pengguna</h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: 4 }}>{data.length} pengguna terdaftar</p>
        </div>
      </div>

      {/* Role stat pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {roleCounts.map(r => {
          const isActive = roleFilter === r.key
          return (
            <Link key={r.key} href={`?${new URLSearchParams({ ...(searchQuery ? { q: searchQuery } : {}), role: r.key }).toString()}`}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                height: 36, borderRadius: 999, padding: "0 14px", textDecoration: "none",
                border: isActive ? `1.5px solid ${ORANGE}` : "1.5px solid #E5E7EB",
                background: isActive ? ORANGE_BG : "#fff",
                color: isActive ? ORANGE_TEXT : "#6B7280",
                fontSize: "0.8rem", fontWeight: isActive ? 700 : 500,
                transition: "all 0.15s",
              }}>
              {r.label}
              <span style={{
                background: isActive ? ORANGE : "#F3F4F6",
                color: isActive ? "#fff" : "#9CA3AF",
                borderRadius: 999, padding: "0 7px", fontSize: "0.7rem", fontWeight: 700, height: 18, display: "flex", alignItems: "center",
              }}>{r.count}</span>
            </Link>
          )
        })}
      </div>

      <UsersSearch />
      
      <UsersTable users={filtered} />
    </div>
  )
}


