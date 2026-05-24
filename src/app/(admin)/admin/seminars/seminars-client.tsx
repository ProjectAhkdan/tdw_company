"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, CalendarPlus, Info } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@shared/ui/confirm-dialog"
import { SeminarRow } from "./seminar-row"
import dynamic from "next/dynamic"

const SeminarModal = dynamic(() => import("./seminar-modal").then(mod => mod.SeminarModal), { ssr: false })

const ORANGE      = "#D9F25D"
const ORANGE_BG   = "rgba(217,242,93,0.12)"

type Category = { id: string; name: string }
type Seminar  = {
  id: string; slug: string; title: string; short_desc: string; description: string
  status: string; is_featured: boolean; thumbnail_url: string | null; created_at: string
  category: Category | null
  schedules: any[]
}

export default function AdminSeminarsClient({ seminars: initialSeminars, categories }: { seminars: Seminar[]; categories: Category[] }) {
  const searchParams = useSearchParams()
  const q = searchParams.get("q")?.toLowerCase() || ""
  const seminars = q 
    ? initialSeminars.filter(s => s.title.toLowerCase().includes(q) || s.short_desc?.toLowerCase().includes(q))
    : initialSeminars

  const [showCreate,   setShowCreate]   = useState(false)
  const [selected,     setSelected]     = useState<Set<string>>(new Set())
  const [bulkPending,  setBulkPending]  = useState(false)
  const [confirm,      setConfirm]      = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)

  const allSelected = seminars.length > 0 && seminars.every(s => selected.has(s.id))

  function toggleAll()       { if (allSelected) setSelected(new Set()); else setSelected(new Set(seminars.map(s => s.id))) }
  function toggleOne(id: string) { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }) }

  function handleBulkDelete() {
    setConfirm({
      title: "Hapus Seminar Terpilih",
      message: `Hapus ${selected.size} seminar secara permanen?`,
      onConfirm: async () => {
        setBulkPending(true)
        const { deleteSeminarsBulk } = await import("@features/seminar/api/seminar.actions")
        const r = await (deleteSeminarsBulk as any)([...selected])
        if (r?.error) toast.error(r.error)
        else { toast.success(`${selected.size} seminar dihapus`); setSelected(new Set()) }
        setBulkPending(false)
      }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Seminar</h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: 4 }}>{seminars.length} seminar terdaftar</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} disabled={bulkPending} className="dz-btn dz-btn-danger dz-btn">
              {bulkPending ? "Menghapus..." : `🗑 Hapus ${selected.size} terpilih`}
            </button>
          )}
          <button onClick={() => setShowCreate(true)} className="dz-btn dz-btn-primary dz-btn">
            <Plus style={{ width: 16, height: 16 }} /> Seminar Baru
          </button>
        </div>
      </div>

      {/* Info tip */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: ORANGE_BG, border: `1px solid ${ORANGE}30`, borderRadius: 10, padding: "10px 14px" }}>
        <Info style={{ width: 14, height: 14, color: ORANGE, marginTop: 2, flexShrink: 0 }} />
        <span style={{ fontSize: "0.8rem", color: "#374151" }}>
          Klik <strong>ikon panah ▼</strong> untuk melihat jadwal & tiket. Klik <strong>ikon pensil</strong> untuk mengedit.
        </span>
      </div>

      {/* Select all */}
      {seminars.length > 0 && (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
          <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ width: 15, height: 15 }} />
          <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Pilih semua</span>
        </label>
      )}

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {seminars.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "64px 24px", textAlign: "center" }}>
            <CalendarPlus style={{ width: 48, height: 48, color: "#E5E7EB", margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 600, color: "#9CA3AF", margin: 0 }}>Belum ada seminar</p>
            <p style={{ fontSize: "0.875rem", color: "#D1D5DB", marginTop: 6 }}>Klik "Seminar Baru" untuk mulai membuat seminar pertama</p>
          </div>
        ) : (
          seminars.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleOne(s.id)}
                style={{ marginTop: 20, width: 15, height: 15, flexShrink: 0, cursor: "pointer" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <SeminarRow seminar={s as any} categories={categories} />
              </div>
            </div>
          ))
        )}
      </div>

      {showCreate && <SeminarModal categories={categories} onClose={() => setShowCreate(false)} />}
      {confirm && (
        <ConfirmDialog
          title={confirm.title} message={confirm.message} confirmLabel="Hapus"
          onConfirm={() => { confirm.onConfirm(); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}



