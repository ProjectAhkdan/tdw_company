"use client"

import React, { useState, useTransition } from "react"
import { X, Info } from "lucide-react"
import { toast } from "sonner"
import { createSeminar, updateSeminar } from "@/app/actions/seminar/action"

const ORANGE      = "oklch(0.72 0.18 55)"

const inputStyle: React.CSSProperties = {
  background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10,
  color: "#111827", height: 40, padding: "0 14px", fontSize: "0.875rem",
  outline: "none", width: "100%", transition: "border-color 0.15s",
}
const taStyle: React.CSSProperties = { ...inputStyle, height: "auto", padding: "10px 14px", resize: "vertical", lineHeight: 1.6 }

type Category = { id: string; name: string }
type Seminar  = {
  id: string; slug: string; title: string; short_desc: string; description: string
  status: string; is_featured: boolean; thumbnail_url: string | null; created_at: string
  category: { id: string; name: string } | null
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>{label}</label>
        {hint && (
          <span style={{ position: "relative", cursor: "help" }} className="group">
            <Info style={{ width: 12, height: 12, color: "#9CA3AF" }} />
            <span style={{
              position: "absolute", left: 20, top: 0, zIndex: 10,
              width: 200, background: "#111827", color: "#F9FAFB",
              fontSize: "0.7rem", padding: "6px 10px", borderRadius: 8,
              opacity: 0, pointerEvents: "none", transition: "opacity 0.15s",
              lineHeight: 1.5,
            }} className="group-hover:opacity-100">
              {hint}
            </span>
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export function SeminarModal({ categories, seminar, onClose }: { categories: Category[]; seminar?: Seminar; onClose: () => void }) {
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({
    title: seminar?.title ?? "",
    slug:  seminar?.slug  ?? "",
    short_desc:   seminar?.short_desc   ?? "",
    description:  seminar?.description  ?? "",
    category_id:  seminar?.category?.id ?? categories[0]?.id ?? "",
    status:      (seminar?.status ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    is_featured:  seminar?.is_featured ?? false,
    thumbnail_url: seminar?.thumbnail_url ?? "",
  })
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = seminar ? await updateSeminar(seminar.id, form) : await createSeminar(form)
      if (result && "error" in result) { toast.error(result.error); return }
      toast.success(seminar ? "Seminar diperbarui ✓" : "Seminar berhasil dibuat ✓")
      onClose()
    })
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)",
    }}>
      <div data-lenis-prevent="true" style={{
        width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
        background: "#fff", borderRadius: 20, border: "1px solid #E5E7EB",
        boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
      }}>
        {/* Modal header */}
        <div style={{
          position: "sticky", top: 0, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "18px 24px",
          background: "#fff", borderBottom: "1px solid #F3F4F6", borderRadius: "20px 20px 0 0",
        }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
              {seminar ? "Edit Seminar" : "Buat Seminar Baru"}
            </h2>
            <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: 3 }}>
              {seminar ? "Ubah informasi seminar" : "Isi detail seminar. Jadwal & tiket ditambahkan setelah dibuat."}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X style={{ width: 16, height: 16, color: "#6B7280" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Judul Seminar *" hint="Nama yang tampil di halaman publik">
            <input style={inputStyle} required value={form.title}
              onChange={e => set("title", e.target.value)} placeholder="contoh: Property Revolution 2026" />
          </Field>

          <Field label="Slug URL" hint="Otomatis dibuat dari judul jika dikosongkan">
            <input style={inputStyle} value={form.slug}
              onChange={e => set("slug", e.target.value)} placeholder="property-revolution-2026 (opsional)" />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Kategori *">
              <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} required
                value={form.category_id} onChange={e => set("category_id", e.target.value)}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Status Publikasi">
              <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                value={form.status} onChange={e => set("status", e.target.value as any)}>
                <option value="DRAFT">🔒 Draft (tersembunyi)</option>
                <option value="PUBLISHED">✅ Published (tampil)</option>
                <option value="ARCHIVED">📦 Archived</option>
              </select>
            </Field>
          </div>

          <Field label="Deskripsi Singkat *" hint="Muncul di kartu seminar (maks 200 karakter)">
            <textarea rows={2} required style={taStyle} value={form.short_desc}
              onChange={e => set("short_desc", e.target.value)}
              placeholder="Ringkasan singkat yang menarik perhatian calon peserta..." maxLength={200} />
            <p style={{ fontSize: "0.7rem", color: "#9CA3AF", textAlign: "right", margin: 0 }}>{form.short_desc.length}/200</p>
          </Field>

          <Field label="Deskripsi Lengkap *" hint="Mendukung Markdown. Tampil di halaman detail seminar.">
            <textarea rows={6} required style={{ ...taStyle, fontFamily: "monospace" }} value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder={"# Tentang Seminar Ini\n\nTulis deskripsi lengkap di sini..."} />
          </Field>

          <Field label="URL Thumbnail">
            <input style={inputStyle} type="url" value={form.thumbnail_url}
              onChange={e => set("thumbnail_url", e.target.value)} placeholder="https://..." />
          </Field>

          <label style={{
            display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            background: "#F8F9FA", borderRadius: 10, padding: "12px 14px", border: "1px solid #E5E7EB",
          }}>
            <input type="checkbox" checked={form.is_featured} onChange={e => set("is_featured", e.target.checked)} style={{ width: 16, height: 16 }} />
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>Tampilkan sebagai Featured</p>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: 0 }}>Seminar muncul di bagian unggulan halaman utama</p>
            </div>
          </label>

          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, height: 42, borderRadius: 10, background: "#F3F4F6", color: "#6B7280", border: "none",
              fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
            }}>
              Batal
            </button>
            <button type="submit" disabled={pending} style={{
              flex: 1, height: 42, borderRadius: 10, background: ORANGE, color: "#1a0a00", border: "none",
              fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", opacity: pending ? 0.5 : 1,
            }}>
              {pending ? "Menyimpan..." : seminar ? "Simpan Perubahan" : "Buat Seminar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
