"use client"

import { useState, useTransition } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { createPost, updatePost } from "@features/blog/api/blog.actions"

const ORANGE      = "oklch(0.72 0.18 55)"
const ORANGE_BG   = "oklch(0.97 0.04 60)"
const ORANGE_TEXT = "oklch(0.45 0.15 50)"

type Post = { id: string; slug: string; title: string; category: string | null; is_published: boolean; published_at: string | null; created_at: string }

const inputStyle: React.CSSProperties = {
  background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10,
  color: "#111827", height: 40, padding: "0 14px", fontSize: "0.875rem", outline: "none", width: "100%",
}
const taStyle: React.CSSProperties = { ...inputStyle, height: "auto", padding: "10px 14px", resize: "vertical" as const }

export function PostModal({ post, onClose }: { post?: Post; onClose: () => void }) {
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({
    title:         post?.title    ?? "",
    slug:          post?.slug     ?? "",
    excerpt:       "",
    content:       "",
    category:      post?.category ?? "",
    thumbnail_url: "",
    is_published:  post?.is_published ?? false,
    read_time:     5,
  })
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = post ? await updatePost(post.id, form) : await createPost(form)
      if (result && "error" in result) { toast.error(result.error); return }
      toast.success(post ? "Artikel diperbarui ✓" : "Artikel dibuat ✓")
      onClose()
    })
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)",
    }}>
      <div data-lenis-prevent="true" style={{
        width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto",
        background: "#fff", borderRadius: 20, border: "1px solid #E5E7EB",
        boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{
          position: "sticky", top: 0, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "18px 24px",
          background: "#fff", borderBottom: "1px solid #F3F4F6", borderRadius: "20px 20px 0 0",
        }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
              {post ? "Edit Artikel" : "Artikel Baru"}
            </h2>
            <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: 3 }}>
              {post ? "Perbarui konten artikel" : "Tulis artikel baru untuk blog TDW Resources"}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X style={{ width: 16, height: 16, color: "#6B7280" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Title */}
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>Judul *</label>
            <input required style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Tulis judul artikel yang menarik..." />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>Slug URL</label>
              <input style={inputStyle} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="judul-artikel (opsional)" />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>Kategori</label>
              <input style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)} placeholder="Properti, Investasi, dll." />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>Excerpt *</label>
            <textarea rows={2} required style={taStyle} value={form.excerpt} onChange={e => set("excerpt", e.target.value)}
              placeholder="Ringkasan singkat artikel (tampil di halaman blog)..." />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>
              Konten (Markdown) *
            </label>
            <textarea rows={12} required style={{ ...taStyle, fontFamily: "monospace", fontSize: "0.8rem" }}
              value={form.content} onChange={e => set("content", e.target.value)}
              placeholder={"# Judul\n\nTulis konten artikel dalam format Markdown..."} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>URL Thumbnail</label>
            <input type="url" style={inputStyle} value={form.thumbnail_url} onChange={e => set("thumbnail_url", e.target.value)} placeholder="https://..." />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>Estimasi Baca (menit)</label>
              <input type="number" min={1} max={60} style={inputStyle} value={form.read_time} onChange={e => set("read_time", parseInt(e.target.value))} />
            </div>
            <label style={{
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
              background: form.is_published ? ORANGE_BG : "#F3F4F6",
              border: `1px solid ${form.is_published ? ORANGE + "40" : "#E5E7EB"}`,
              borderRadius: 10, padding: "10px 14px", marginTop: 22, whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}>
              <input type="checkbox" checked={form.is_published} onChange={e => set("is_published", e.target.checked)} style={{ width: 15, height: 15 }} />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: form.is_published ? ORANGE_TEXT : "#6B7280" }}>
                Publish sekarang
              </span>
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, height: 42, borderRadius: 10, background: "#F3F4F6", color: "#6B7280", border: "none", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer" }}>
              Batal
            </button>
            <button type="submit" disabled={pending}
              style={{ flex: 1, height: 42, borderRadius: 10, background: ORANGE, color: "#1a0a00", border: "none", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", opacity: pending ? 0.5 : 1 }}>
              {pending ? "Menyimpan..." : post ? "Simpan Perubahan" : "Publikasikan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
