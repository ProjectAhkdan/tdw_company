"use client"

import { useState } from "react"
import type { Platform } from "@/shared/types/domain.types"

type Item = { id: string; platform: Platform; title: string; embed_id: string; content_url: string; view_count: number; like_count: number; is_featured: boolean; is_active: boolean; published_at: string; sort_order: number }

const PLATFORMS: { key: Platform | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
]

async function toggleField(id: string, field: "is_featured" | "is_active", value: boolean) {
  await fetch("/api/admin/social-media", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [field]: value }) })
}

export function SocialMediaAdmin({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<Platform | "all">("all")
  const [data, setData] = useState(items)

  const filtered = filter === "all" ? data : data.filter(i => i.platform === filter)

  const handleToggle = async (id: string, field: "is_featured" | "is_active") => {
    const item = data.find(i => i.id === id)!
    const newVal = !item[field]
    setData(prev => prev.map(i => i.id === id ? { ...i, [field]: newVal } : i))
    await toggleField(id, field, newVal)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Social Media</h1>
        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: 4 }}>{items.length} konten</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {PLATFORMS.map(p => (
          <button key={p.key} onClick={() => setFilter(p.key)}
            style={{ padding: "6px 14px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 600, border: "none", cursor: "pointer", background: filter === p.key ? "#D9F25D" : "#F3F4F6", color: filter === p.key ? "#0A0A0A" : "#6B7280" }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: "10px 8px", textAlign: "left", color: "#6B7280", fontWeight: 600 }}>Platform</th>
              <th style={{ padding: "10px 8px", textAlign: "left", color: "#6B7280", fontWeight: 600 }}>Title</th>
              <th style={{ padding: "10px 8px", textAlign: "left", color: "#6B7280", fontWeight: 600 }}>Views</th>
              <th style={{ padding: "10px 8px", textAlign: "center", color: "#6B7280", fontWeight: 600 }}>Featured</th>
              <th style={{ padding: "10px 8px", textAlign: "center", color: "#6B7280", fontWeight: 600 }}>Active</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "10px 8px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700, background: item.platform === "youtube" ? "#FF000020" : item.platform === "instagram" ? "#E1306C20" : "#00000020", color: item.platform === "youtube" ? "#FF0000" : item.platform === "instagram" ? "#E1306C" : "#000" }}>
                    {item.platform}
                  </span>
                </td>
                <td style={{ padding: "10px 8px", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</td>
                <td style={{ padding: "10px 8px", color: "#6B7280" }}>{item.view_count.toLocaleString()}</td>
                <td style={{ padding: "10px 8px", textAlign: "center" }}>
                  <button onClick={() => handleToggle(item.id, "is_featured")} style={{ cursor: "pointer", border: "none", background: "none", fontSize: "1.1rem" }}>
                    {item.is_featured ? "⭐" : "☆"}
                  </button>
                </td>
                <td style={{ padding: "10px 8px", textAlign: "center" }}>
                  <button onClick={() => handleToggle(item.id, "is_active")} style={{ cursor: "pointer", border: "none", background: "none", fontSize: "1.1rem" }}>
                    {item.is_active ? "✅" : "❌"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
