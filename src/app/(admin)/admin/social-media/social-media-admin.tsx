"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Platform } from "@/shared/types/domain.types"

type Item = { id: string; platform: Platform; title: string; caption: string | null; embed_id: string; content_url: string; thumbnail_url: string | null; view_count: number; like_count: number; is_featured: boolean; is_active: boolean; published_at: string; sort_order: number }
type FormData = Omit<Item, "id"> & { id?: string }

const PLATFORMS: { key: Platform | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
]

const emptyForm: FormData = { platform: "youtube", title: "", caption: "", embed_id: "", content_url: "", thumbnail_url: "", view_count: 0, like_count: 0, is_featured: false, is_active: true, published_at: new Date().toISOString().slice(0, 16), sort_order: 0 }

export function SocialMediaAdmin({ items }: { items: Item[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<Platform | "all">("all")
  const [data, setData] = useState(items)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [loading, setLoading] = useState(false)

  const filtered = filter === "all" ? data : data.filter(i => i.platform === filter)

  const handleToggle = async (id: string, field: "is_featured" | "is_active") => {
    const item = data.find(i => i.id === id)!
    const newVal = !item[field]
    setData(prev => prev.map(i => i.id === id ? { ...i, [field]: newVal } : i))
    await fetch("/api/admin/social-media", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [field]: newVal }) })
  }

  const handleEdit = (item: Item) => {
    setForm({ ...item, published_at: item.published_at.slice(0, 16) })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus konten ini?")) return
    setData(prev => prev.filter(i => i.id !== id))
    await fetch("/api/admin/social-media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const method = form.id ? "PUT" : "POST"
    const res = await fetch("/api/admin/social-media", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, published_at: new Date(form.published_at).toISOString() }) })
    if (res.ok) {
      setShowForm(false)
      setForm(emptyForm)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Social Media</h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: 4 }}>{data.length} konten</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowForm(true) }}
          style={{ height: 40, borderRadius: 999, padding: "0 18px", background: "#D9F25D", color: "#0A0A0A", fontSize: "0.875rem", fontWeight: 700, border: "none", cursor: "pointer" }}>
          + Tambah Konten
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{form.id ? "Edit" : "Tambah"} Konten</h2>

            <label style={labelStyle}>Platform</label>
            <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as Platform }))} style={inputStyle} required>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>

            <label style={labelStyle}>Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} required />

            <label style={labelStyle}>Caption</label>
            <textarea value={form.caption ?? ""} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} style={{ ...inputStyle, minHeight: 60 }} />

            <label style={labelStyle}>Content URL</label>
            <input value={form.content_url} onChange={e => setForm(f => ({ ...f, content_url: e.target.value }))} style={inputStyle} required />

            <label style={labelStyle}>Embed ID</label>
            <input value={form.embed_id} onChange={e => setForm(f => ({ ...f, embed_id: e.target.value }))} style={inputStyle} required />

            <label style={labelStyle}>Thumbnail URL (opsional)</label>
            <input value={form.thumbnail_url ?? ""} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value || null }))} style={inputStyle} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Views</label>
                <input type="number" value={form.view_count} onChange={e => setForm(f => ({ ...f, view_count: +e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Likes</label>
                <input type="number" value={form.like_count} onChange={e => setForm(f => ({ ...f, like_count: +e.target.value }))} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Published At</label>
                <input type="datetime-local" value={form.published_at} onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}>
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} /> Featured
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}>
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
              </label>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button type="submit" disabled={loading} style={{ flex: 1, height: 38, borderRadius: 8, background: "#D9F25D", color: "#0A0A0A", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>
                {loading ? "..." : form.id ? "Update" : "Simpan"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ height: 38, borderRadius: 8, padding: "0 16px", background: "#F3F4F6", color: "#374151", fontWeight: 600, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
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
              <th style={thStyle}>Platform</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Views</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Featured</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Active</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={tdStyle}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700, background: item.platform === "youtube" ? "#FF000020" : item.platform === "instagram" ? "#E1306C20" : "#00000020", color: item.platform === "youtube" ? "#FF0000" : item.platform === "instagram" ? "#E1306C" : "#000" }}>
                    {item.platform}
                  </span>
                </td>
                <td style={{ ...tdStyle, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</td>
                <td style={{ ...tdStyle, color: "#6B7280" }}>{item.view_count.toLocaleString()}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button onClick={() => handleToggle(item.id, "is_featured")} style={btnIcon}>{item.is_featured ? "⭐" : "☆"}</button>
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button onClick={() => handleToggle(item.id, "is_active")} style={btnIcon}>{item.is_active ? "✅" : "❌"}</button>
                </td>
                <td style={{ ...tdStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                  <button onClick={() => handleEdit(item)} style={{ ...btnIcon, fontSize: "0.75rem" }}>✏️</button>
                  <button onClick={() => handleDelete(item.id)} style={{ ...btnIcon, fontSize: "0.75rem" }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { fontSize: "0.75rem", fontWeight: 600, color: "#374151" }
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: "0.85rem", outline: "none" }
const thStyle: React.CSSProperties = { padding: "10px 8px", textAlign: "left", color: "#6B7280", fontWeight: 600 }
const tdStyle: React.CSSProperties = { padding: "10px 8px" }
const btnIcon: React.CSSProperties = { cursor: "pointer", border: "none", background: "none", fontSize: "1.1rem", padding: "2px 4px" }
