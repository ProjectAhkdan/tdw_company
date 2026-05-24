"use client"

import React, { useState, useTransition } from "react"
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteSeminar } from "@features/seminar/api/seminar.actions"
import { uploadSeminarThumbnail } from "@features/dashboard/api/upload.actions"
import ImageUpload from "@shared/ui/image-upload"
import { ConfirmDialog } from "@shared/ui/confirm-dialog"
import { SeminarModal } from "./seminar-modal"
import { ScheduleSection } from "./seminar-schedule"

const statusMap: Record<string, { cls: string }> = {
  PUBLISHED: { cls: "dz-badge dz-badge-green"  },
  DRAFT:     { cls: "dz-badge dz-badge-orange" },
  ARCHIVED:  { cls: "dz-badge dz-badge-gray"   },
}

type TicketItem  = { id: string; name: string; price: number; quota: number; sold: number }
type ScheduleItem = { id: string; start_date: string; end_date: string; city: string; venue: string; tickets: TicketItem[] }
type Category = { id: string; name: string }
type Seminar  = {
  id: string; slug: string; title: string; short_desc: string; description: string
  status: string; is_featured: boolean; thumbnail_url: string | null; created_at: string
  category: Category | null
  schedules: ScheduleItem[]
}

export function SeminarRow({ seminar, categories }: { seminar: Seminar; categories: Category[] }) {
  const [expanded,  setExpanded]  = useState(false)
  const [showEdit,  setShowEdit]  = useState(false)
  const [pending,   startTransition] = useTransition()
  const [thumbUrl,  setThumbUrl]  = useState<string | null>(seminar.thumbnail_url)
  const [confirm,   setConfirm]   = useState(false)

  const totalSold  = seminar.schedules.flatMap(s => s.tickets).reduce((a, t) => a + t.sold,  0)
  const totalQuota = seminar.schedules.flatMap(s => s.tickets).reduce((a, t) => a + t.quota, 0)

  async function handleThumbUpload(file: File) {
    const fd = new FormData(); fd.append("file", file)
    const r = await uploadSeminarThumbnail(seminar.id, fd)
    if ("error" in r) { toast.error(r.error); return }
    setThumbUrl(r.url!); toast.success("Thumbnail diperbarui ✓")
  }

  const st = statusMap[seminar.status] ?? { cls: "dz-badge dz-badge-gray" }

  return (
    <>
      {confirm && (
        <ConfirmDialog
          title="Hapus Seminar"
          message={`Hapus seminar "${seminar.title}"? Semua jadwal dan tiket akan ikut terhapus.`}
          confirmLabel="Ya, Hapus"
          onConfirm={() => { setConfirm(false); startTransition(async () => { const r = await deleteSeminar(seminar.id); if (r && "error" in r) toast.error(r.error); else toast.success("Seminar dihapus") }) }}
          onCancel={() => setConfirm(false)}
        />
      )}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
          <button onClick={() => setExpanded(e => !e)} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {expanded ? <ChevronUp style={{ width: 14, height: 14, color: "#6B7280" }} /> : <ChevronDown style={{ width: 14, height: 14, color: "#6B7280" }} />}
          </button>

          <ImageUpload currentUrl={thumbUrl} onUpload={handleThumbUpload} shape="rect" aspect={16 / 9} size={48} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{seminar.title}</p>
            <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: 2 }}>
              {seminar.category?.name ?? "—"} · {seminar.schedules.length} jadwal · {totalSold}/{totalQuota} terjual
            </p>
          </div>

          <span className={st.cls}>
            {seminar.status === "PUBLISHED" ? "Published" : seminar.status === "DRAFT" ? "Draft" : "Archived"}
          </span>

          <button onClick={() => setShowEdit(true)} disabled={pending} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Pencil style={{ width: 14, height: 14, color: "#6B7280" }} />
          </button>
          <button onClick={() => setConfirm(true)} disabled={pending} style={{ background: "#FEF2F2", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trash2 style={{ width: 14, height: 14, color: "#EF4444" }} />
          </button>
        </div>

        {expanded && <ScheduleSection seminarId={seminar.id} schedules={seminar.schedules} />}
      </div>

      {showEdit && <SeminarModal categories={categories} seminar={seminar as any} onClose={() => setShowEdit(false)} />}
    </>
  )
}



