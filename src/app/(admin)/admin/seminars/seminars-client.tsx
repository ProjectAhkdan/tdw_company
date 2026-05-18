"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, X } from "lucide-react"
import { toast } from "sonner"
import {
  createSeminar, updateSeminar, deleteSeminar,
  createSchedule, deleteSchedule,
  createTicket, deleteTicket,
} from "@/app/actions/seminar/action"
import { uploadSeminarThumbnail } from "@/app/actions/upload/action"
import ImageUpload from "@shared/ui/image-upload/image-upload"

const GOLD = "oklch(0.78 0.16 55)"

type Seminar = {
  id: string; slug: string; title: string; status: string; is_featured: boolean; created_at: string
  category: { name: string } | null
  schedules: { id: string; start_date: string; city: string; tickets: { quota: number; sold: number }[] }[]
}
type Category = { id: string; name: string }

const statusStyle: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/15 text-emerald-400",
  DRAFT: "bg-orange-500/15 text-orange-400",
  ARCHIVED: "bg-muted text-muted-foreground",
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <input {...props} className="h-9 w-full rounded-xl border px-3 text-sm outline-none focus:border-[oklch(0.78_0.16_55)]"
        style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
    </div>
  )
}

function Select({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <select {...props} className="h-9 w-full rounded-xl border px-3 text-sm outline-none"
        style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }}>
        {children}
      </select>
    </div>
  )
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <textarea {...props} rows={3} className="w-full rounded-xl border px-3 py-2 text-sm outline-none resize-none"
        style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
    </div>
  )
}

// ── Seminar Form Modal ────────────────────────────────────────────────────────
function SeminarModal({ categories, seminar, onClose }: {
  categories: Category[]
  seminar?: Seminar
  onClose: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({
    title: seminar?.title ?? "",
    slug: seminar?.slug ?? "",
    short_desc: "",
    description: "",
    category_id: categories[0]?.id ?? "",
    status: (seminar?.status ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    is_featured: seminar?.is_featured ?? false,
    thumbnail_url: "",
  })

  function set(k: string, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = seminar
        ? await updateSeminar(seminar.id, form)
        : await createSeminar(form)
      if (result && "error" in result) { toast.error(result.error); return }
      toast.success(seminar ? "Seminar diperbarui" : "Seminar dibuat")
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.7)", backdropFilter: "blur(8px)" }}>
      <div className="glass w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ border: `1px solid ${GOLD}20` }}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold">{seminar ? "Edit Seminar" : "Seminar Baru"}</h2>
          <button onClick={onClose}><X className="size-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Judul *" value={form.title} onChange={e => set("title", e.target.value)} required />
          <Input label="Slug (auto-generate jika kosong)" value={form.slug} onChange={e => set("slug", e.target.value)} />
          <Textarea label="Deskripsi Singkat *" value={form.short_desc} onChange={e => set("short_desc", e.target.value)} required />
          <Textarea label="Deskripsi Lengkap *" value={form.description} onChange={e => set("description", e.target.value)} required />
          <Select label="Kategori *" value={form.category_id} onChange={e => set("category_id", e.target.value)} required>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="Status" value={form.status} onChange={e => set("status", e.target.value as any)}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
          <Input label="URL Thumbnail" value={form.thumbnail_url} onChange={e => set("thumbnail_url", e.target.value)} type="url" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={e => set("is_featured", e.target.checked)} />
            Featured
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-9 rounded-xl border text-sm"
              style={{ borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.65 0 0)" }}>
              Batal
            </button>
            <button type="submit" disabled={pending} className="flex-1 h-9 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
              {pending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Schedule + Ticket inline row ──────────────────────────────────────────────
function SeminarRow({ seminar }: { seminar: Seminar }) {
  const [expanded, setExpanded] = useState(false)
  const [pending, startTransition] = useTransition()
  const [schedForm, setSchedForm] = useState({ start_date: "", end_date: "", city: "", venue: "" })
  const [ticketForms, setTicketForms] = useState<Record<string, { name: string; price: string; quota: string }>>({})

  const totalSold = seminar.schedules.flatMap(s => s.tickets).reduce((a, t) => a + t.sold, 0)
  const totalQuota = seminar.schedules.flatMap(s => s.tickets).reduce((a, t) => a + t.quota, 0)

  function handleDeleteSeminar() {
    if (!confirm("Hapus seminar ini?")) return
    startTransition(async () => {
      const r = await deleteSeminar(seminar.id)
      if (r && "error" in r) toast.error(r.error)
      else toast.success("Seminar dihapus")
    })
  }

  function handleAddSchedule(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const r = await createSchedule({ seminar_id: seminar.id, ...schedForm })
      if (r && "error" in r) toast.error(r.error)
      else { toast.success("Jadwal ditambahkan"); setSchedForm({ start_date: "", end_date: "", city: "", venue: "" }) }
    })
  }

  function handleDeleteSchedule(id: string) {
    startTransition(async () => {
      const r = await deleteSchedule(id)
      if (r && "error" in r) toast.error(r.error)
      else toast.success("Jadwal dihapus")
    })
  }

  function handleAddTicket(scheduleId: string, e: React.FormEvent) {
    e.preventDefault()
    const f = ticketForms[scheduleId]
    if (!f) return
    startTransition(async () => {
      const r = await createTicket({ schedule_id: scheduleId, name: f.name, price: parseInt(f.price), quota: parseInt(f.quota) })
      if (r && "error" in r) toast.error(r.error)
      else { toast.success("Tiket ditambahkan"); setTicketForms(prev => ({ ...prev, [scheduleId]: { name: "", price: "", quota: "" } })) }
    })
  }

  function handleDeleteTicket(id: string) {
    startTransition(async () => {
      const r = await deleteTicket(id)
      if (r && "error" in r) toast.error(r.error)
      else toast.success("Tiket dihapus")
    })
  }

  const [thumbUrl, setThumbUrl] = useState<string | null>((seminar as any).thumbnail_url ?? null)

  async function handleThumbUpload(file: File) {
    const fd = new FormData(); fd.append("file", file)
    const r = await uploadSeminarThumbnail(seminar.id, fd)
    if ("error" in r) { toast.error(r.error); return }
    setThumbUrl(r.url!)
    toast.success("Thumbnail diperbarui")
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <button onClick={() => setExpanded(e => !e)} className="text-muted-foreground">
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        <ImageUpload currentUrl={thumbUrl} onUpload={handleThumbUpload} shape="rect" aspect={16/9} size={48} />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{seminar.title}</p>
          <p className="text-xs text-muted-foreground">{seminar.category?.name} · {seminar.schedules.length} jadwal · {totalSold}/{totalQuota} terjual</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[seminar.status]}`}>{seminar.status}</span>
        <button onClick={handleDeleteSeminar} disabled={pending} className="text-red-400 hover:text-red-300 transition-colors">
          <Trash2 className="size-4" />
        </button>
      </div>

      {/* Expanded: schedules + tickets */}
      {expanded && (
        <div className="border-t px-5 py-4 space-y-5" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>

          {/* Existing schedules */}
          {seminar.schedules.map(s => (
            <div key={s.id} className="rounded-xl border p-4 space-y-3" style={{ borderColor: "oklch(0.22 0.01 55 / 0.3)" }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {new Date(s.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} — {s.city}
                </p>
                <button onClick={() => handleDeleteSchedule(s.id)} disabled={pending} className="text-red-400 hover:text-red-300">
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              {/* Tickets */}
              {s.tickets.length > 0 && (
                <div className="space-y-1">
                  {(s.tickets as any[]).map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs"
                      style={{ background: "oklch(0.13 0.008 55)" }}>
                      <span>{t.name} — Rp {t.price?.toLocaleString("id-ID")} · {t.sold}/{t.quota}</span>
                      <button onClick={() => handleDeleteTicket(t.id)} disabled={pending} className="text-red-400 hover:text-red-300 ml-2">
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add ticket form */}
              <form onSubmit={e => handleAddTicket(s.id, e)} className="flex gap-2">
                <input placeholder="Nama tiket" required value={ticketForms[s.id]?.name ?? ""}
                  onChange={e => setTicketForms(p => ({ ...p, [s.id]: { ...p[s.id], name: e.target.value } }))}
                  className="h-8 flex-1 rounded-lg border px-2 text-xs outline-none"
                  style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
                <input placeholder="Harga" type="number" required value={ticketForms[s.id]?.price ?? ""}
                  onChange={e => setTicketForms(p => ({ ...p, [s.id]: { ...p[s.id], price: e.target.value } }))}
                  className="h-8 w-24 rounded-lg border px-2 text-xs outline-none"
                  style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
                <input placeholder="Kuota" type="number" required value={ticketForms[s.id]?.quota ?? ""}
                  onChange={e => setTicketForms(p => ({ ...p, [s.id]: { ...p[s.id], quota: e.target.value } }))}
                  className="h-8 w-20 rounded-lg border px-2 text-xs outline-none"
                  style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
                <button type="submit" disabled={pending} className="h-8 rounded-lg px-3 text-xs font-medium"
                  style={{ background: `${GOLD}20`, color: GOLD }}>
                  + Tiket
                </button>
              </form>
            </div>
          ))}

          {/* Add schedule form */}
          <form onSubmit={handleAddSchedule} className="rounded-xl border border-dashed p-4 space-y-3"
            style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)" }}>
            <p className="text-xs font-medium text-muted-foreground">Tambah Jadwal Baru</p>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Tanggal Mulai" type="datetime-local" value={schedForm.start_date}
                onChange={e => setSchedForm(f => ({ ...f, start_date: e.target.value }))} required />
              <Input label="Tanggal Selesai" type="datetime-local" value={schedForm.end_date}
                onChange={e => setSchedForm(f => ({ ...f, end_date: e.target.value }))} required />
              <Input label="Kota" value={schedForm.city}
                onChange={e => setSchedForm(f => ({ ...f, city: e.target.value }))} required />
              <Input label="Venue" value={schedForm.venue}
                onChange={e => setSchedForm(f => ({ ...f, venue: e.target.value }))} required />
            </div>
            <button type="submit" disabled={pending} className="h-8 rounded-lg px-4 text-xs font-medium"
              style={{ background: `${GOLD}20`, color: GOLD }}>
              + Tambah Jadwal
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminSeminarsClient({ seminars, categories }: { seminars: Seminar[]; categories: Category[] }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Seminar</h1>
          <p className="mt-1 text-sm text-muted-foreground">{seminars.length} seminar</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-semibold"
          style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
          <Plus className="size-4" /> Seminar Baru
        </button>
      </div>

      <div className="space-y-3">
        {seminars.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center text-muted-foreground">
            Belum ada seminar. Klik &quot;Seminar Baru&quot; untuk membuat.
          </div>
        ) : (
          seminars.map(s => <SeminarRow key={s.id} seminar={s} />)
        )}
      </div>

      {showModal && (
        <SeminarModal categories={categories} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
