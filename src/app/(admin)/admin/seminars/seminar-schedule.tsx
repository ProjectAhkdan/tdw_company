"use client"

import React, { useState, useTransition } from "react"
import { CalendarPlus, Trash2, Plus, X, Ticket, Info } from "lucide-react"
import { toast } from "sonner"
import { createSchedule, deleteSchedule, createTicket, deleteTicket } from "@/app/actions/seminar/action"
import { ConfirmDialog } from "@shared/ui/confirm-dialog"

const ORANGE      = "oklch(0.72 0.18 55)"
const ORANGE_BG   = "oklch(0.97 0.04 60)"
const ORANGE_TEXT = "oklch(0.45 0.15 50)"

const inputStyle: React.CSSProperties = {
  background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10,
  color: "#111827", height: 40, padding: "0 14px", fontSize: "0.875rem",
  outline: "none", width: "100%", transition: "border-color 0.15s",
}

type TicketItem  = { id: string; name: string; price: number; quota: number; sold: number }
type ScheduleItem = { id: string; start_date: string; end_date: string; city: string; venue: string; tickets: TicketItem[] }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>{label}</label>
      {children}
    </div>
  )
}

export function ScheduleSection({ seminarId, schedules }: { seminarId: string; schedules: ScheduleItem[] }) {
  const [pending, startTransition] = useTransition()
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [addTicketFor, setAddTicketFor] = useState<string | null>(null)
  const [schedForm, setSchedForm] = useState({ date: "", time: "09:00", end_date: "", end_time: "17:00", city: "", venue: "" })
  const [ticketForm, setTicketForm] = useState({ name: "", price: "", quota: "" })
  const [confirm, setConfirm] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)

  function handleAddSchedule(e: React.FormEvent) {
    e.preventDefault()
    const start_date = `${schedForm.date}T${schedForm.time}:00`
    const end_date   = `${schedForm.end_date || schedForm.date}T${schedForm.end_time}:00`
    startTransition(async () => {
      const r = await createSchedule({ seminar_id: seminarId, start_date, end_date, city: schedForm.city, venue: schedForm.venue })
      if (r && "error" in r) { toast.error(r.error); return }
      toast.success("Jadwal berhasil ditambahkan ✓")
      setSchedForm({ date: "", time: "09:00", end_date: "", end_time: "17:00", city: "", venue: "" })
      setShowAddSchedule(false)
    })
  }

  function handleAddTicket(scheduleId: string, e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const r = await createTicket({ schedule_id: scheduleId, name: ticketForm.name, price: parseInt(ticketForm.price), quota: parseInt(ticketForm.quota) })
      if (r && "error" in r) { toast.error(r.error); return }
      toast.success("Tiket berhasil ditambahkan ✓")
      setTicketForm({ name: "", price: "", quota: "" })
      setAddTicketFor(null)
    })
  }

  return (
    <>
      {confirm && (
        <ConfirmDialog
          title={confirm.title} message={confirm.message} confirmLabel="Hapus"
          onConfirm={() => { confirm.onConfirm(); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div style={{ borderTop: "1px solid #F3F4F6", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {schedules.length === 0 && (
          <div style={{
            border: "2px dashed #E5E7EB", borderRadius: 12, padding: "32px 16px",
            textAlign: "center",
          }}>
            <CalendarPlus style={{ width: 32, height: 32, color: "#D1D5DB", margin: "0 auto 8px" }} />
            <p style={{ fontSize: "0.875rem", color: "#9CA3AF", margin: 0 }}>Belum ada jadwal</p>
          </div>
        )}

        {schedules.map((s, idx) => {
          const totalSold  = s.tickets.reduce((a, t) => a + t.sold,  0)
          const totalQuota = s.tickets.reduce((a, t) => a + t.quota, 0)
          const pct        = totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0
          const isAddingTicket = addTicketFor === s.id

          return (
            <div key={s.id} style={{ background: "#F8F9FA", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
              {/* Schedule header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "12px 16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: ORANGE_BG, color: ORANGE_TEXT, borderRadius: 999, padding: "2px 10px", fontSize: "0.7rem", fontWeight: 700 }}>
                      Jadwal {idx + 1}
                    </span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>
                      {new Date(s.start_date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>📍 {s.city} · {s.venue}</p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>
                    🕐 {new Date(s.start_date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} –{" "}
                    {new Date(s.end_date).toLocaleTimeString("id-ID",   { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151", margin: 0 }}>{totalSold}/{totalQuota} terjual</p>
                    <div style={{ marginTop: 4, height: 6, width: 80, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct >= 90 ? "#EF4444" : pct >= 70 ? "#F59E0B" : ORANGE, borderRadius: 99 }} />
                    </div>
                  </div>
                  <button onClick={() => setConfirm({
                    title: "Hapus Jadwal",
                    message: `Hapus jadwal ${new Date(s.start_date).toLocaleDateString("id-ID")} di ${s.city}?`,
                    onConfirm: () => startTransition(async () => {
                      const r = await deleteSchedule(s.id)
                      if (r && "error" in r) toast.error(r.error)
                      else toast.success("Jadwal dihapus")
                    })
                  })} disabled={pending} style={{ background: "#FEF2F2", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 style={{ width: 13, height: 13, color: "#EF4444" }} />
                  </button>
                </div>
              </div>

              {/* Tickets */}
              <div style={{ borderTop: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9CA3AF", margin: 0 }}>Tiket</p>

                {s.tickets.length === 0 && (
                  <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontStyle: "italic", margin: 0 }}>Belum ada tiket — tambahkan tiket agar peserta bisa mendaftar</p>
                )}

                {s.tickets.map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Ticket style={{ width: 14, height: 14, color: ORANGE }} />
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>{t.name}</span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: ORANGE }}>Rp {t.price.toLocaleString("id-ID")}</span>
                      <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{t.sold}/{t.quota} terjual</span>
                      {t.sold >= t.quota && <span className="dz-badge dz-badge-red">Sold Out</span>}
                    </div>
                    <button onClick={() => setConfirm({
                      title: "Hapus Tiket",
                      message: `Hapus tiket "${t.name}"? Tindakan ini tidak dapat dibatalkan.`,
                      onConfirm: () => startTransition(async () => {
                        const r = await deleteTicket(t.id)
                        if (r && "error" in r) toast.error(r.error)
                        else toast.success("Tiket dihapus")
                      })
                    })} disabled={pending} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
                      <X style={{ width: 14, height: 14, color: "#EF4444" }} />
                    </button>
                  </div>
                ))}

                {!isAddingTicket ? (
                  <button onClick={() => setAddTicketFor(s.id)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: ORANGE, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", padding: 0, marginTop: 4 }}>
                    <Plus style={{ width: 14, height: 14 }} /> Tambah Tipe Tiket
                  </button>
                ) : (
                  <form onSubmit={e => handleAddTicket(s.id, e)} style={{ background: ORANGE_BG, border: `1px solid ${ORANGE}30`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 700, color: ORANGE_TEXT, margin: 0 }}>Tambah Tipe Tiket Baru</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: "0.7rem", color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 4 }}>Nama Tiket *</label>
                        <input required placeholder="Regular, VIP, Early Bird" value={ticketForm.name}
                          onChange={e => setTicketForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ fontSize: "0.7rem", color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 4 }}>Harga (Rp) *</label>
                        <input required type="number" min={0} placeholder="1500000" value={ticketForm.price}
                          onChange={e => setTicketForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.7rem", color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 4 }}>Kuota *</label>
                        <input required type="number" min={1} placeholder="100" value={ticketForm.quota}
                          onChange={e => setTicketForm(f => ({ ...f, quota: e.target.value }))} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" onClick={() => { setAddTicketFor(null); setTicketForm({ name: "", price: "", quota: "" }) }}
                        style={{ height: 36, borderRadius: 8, background: "#fff", border: "1px solid #E5E7EB", color: "#6B7280", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", padding: "0 14px" }}>
                        Batal
                      </button>
                      <button type="submit" disabled={pending}
                        style={{ height: 36, borderRadius: 8, background: ORANGE, border: "none", color: "#1a0a00", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", padding: "0 18px", opacity: pending ? 0.5 : 1 }}>
                        {pending ? "Menyimpan..." : "Simpan Tiket"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )
        })}

        {/* Add schedule toggle */}
        {!showAddSchedule ? (
          <button onClick={() => setShowAddSchedule(true)} style={{
            display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", gap: 8,
            border: `2px dashed ${ORANGE}50`, borderRadius: 12, padding: "12px 0",
            background: "transparent", color: ORANGE, fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
          }}>
            <CalendarPlus style={{ width: 16, height: 16 }} /> Tambah Jadwal Baru
          </button>
        ) : (
          <div style={{ background: ORANGE_BG, border: `1px solid ${ORANGE}30`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: ORANGE_TEXT, margin: 0 }}>Tambah Jadwal Baru</p>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: 2 }}>Isi tanggal, waktu, dan lokasi pelaksanaan</p>
              </div>
              <button onClick={() => setShowAddSchedule(false)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
                <X style={{ width: 16, height: 16, color: "#6B7280" }} />
              </button>
            </div>
            <form onSubmit={handleAddSchedule} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Tanggal Mulai *", key: "date",     type: "date" },
                  { label: "Jam Mulai",       key: "time",     type: "time" },
                  { label: "Tanggal Selesai", key: "end_date", type: "date" },
                  { label: "Jam Selesai",     key: "end_time", type: "time" },
                ].map(f => (
                  <Field key={f.key} label={f.label}>
                    <input type={f.type} required={f.key === "date"} style={inputStyle}
                      value={(schedForm as any)[f.key]} onChange={e => setSchedForm(s => ({ ...s, [f.key]: e.target.value }))} />
                  </Field>
                ))}
                <Field label="Kota *">
                  <input required style={inputStyle} placeholder="Jakarta"
                    value={schedForm.city} onChange={e => setSchedForm(s => ({ ...s, city: e.target.value }))} />
                </Field>
                <Field label="Nama Venue *">
                  <input required style={inputStyle} placeholder="JCC Senayan"
                    value={schedForm.venue} onChange={e => setSchedForm(s => ({ ...s, venue: e.target.value }))} />
                </Field>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => setShowAddSchedule(false)}
                  style={{ height: 38, borderRadius: 10, background: "#fff", border: "1px solid #E5E7EB", color: "#6B7280", fontSize: "0.875rem", cursor: "pointer", padding: "0 16px" }}>
                  Batal
                </button>
                <button type="submit" disabled={pending}
                  style={{ height: 38, borderRadius: 10, background: ORANGE, border: "none", color: "#1a0a00", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", padding: "0 20px", opacity: pending ? 0.5 : 1 }}>
                  {pending ? "Menyimpan..." : "Simpan Jadwal"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
