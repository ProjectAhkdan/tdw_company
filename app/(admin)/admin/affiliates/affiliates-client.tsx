"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { approveAffiliate, processWithdrawal } from "@/server/actions/affiliate"

const GOLD = "oklch(0.78 0.16 55)"

export default function AdminAffiliatesClient({ affiliates, withdrawals }: { affiliates: any[]; withdrawals: any[] }) {
  const [pending, startTransition] = useTransition()

  function handleApprove(id: string, approve: boolean) {
    startTransition(async () => {
      const r = await approveAffiliate(id, approve)
      if (r && "error" in r) toast.error(r.error)
      else toast.success(approve ? "Afiliator disetujui" : "Afiliator ditolak")
    })
  }

  function handleWithdrawal(id: string, status: "COMPLETED" | "REJECTED") {
    startTransition(async () => {
      const r = await processWithdrawal(id, status)
      if (r && "error" in r) toast.error(r.error)
      else toast.success(status === "COMPLETED" ? "Pencairan dikonfirmasi" : "Pencairan ditolak")
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Afiliasi</h1>
        <p className="mt-1 text-sm text-muted-foreground">{affiliates.length} afiliator terdaftar</p>
      </div>

      {/* Pending withdrawals */}
      {withdrawals.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-orange-400">⏳ Pencairan Pending ({withdrawals.length})</h2>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
                  {["Afiliator", "Kode", "Jumlah", "Tanggal", "Aksi"].map(h => (
                    <th key={h} className="px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w: any) => {
                  const name = w.affiliate?.user?.profiles?.[0]?.full_name ?? w.affiliate?.user?.email ?? "—"
                  return (
                    <tr key={w.id} className="border-b" style={{ borderColor: "oklch(0.18 0.01 55 / 0.3)" }}>
                      <td className="px-5 py-3">{name}</td>
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: GOLD }}>{w.affiliate?.code}</td>
                      <td className="px-5 py-3 font-semibold" style={{ color: GOLD }}>Rp {w.amount.toLocaleString("id-ID")}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(w.created_at).toLocaleDateString("id-ID")}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleWithdrawal(w.id, "COMPLETED")} disabled={pending}
                            className="rounded-lg px-3 py-1 text-xs font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors">
                            Konfirmasi
                          </button>
                          <button onClick={() => handleWithdrawal(w.id, "REJECTED")} disabled={pending}
                            className="rounded-lg px-3 py-1 text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All affiliates */}
      <div>
        <h2 className="mb-3 font-semibold">Semua Afiliator</h2>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
                  {["Afiliator", "Kode", "Total Komisi", "Dicairkan", "Status", "Aksi"].map(h => (
                    <th key={h} className="px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {affiliates.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">Belum ada afiliator</td></tr>
                ) : affiliates.map((a: any) => {
                  const name = a.user?.profiles?.[0]?.full_name ?? a.user?.email ?? "—"
                  return (
                    <tr key={a.id} className="border-b transition-colors hover:bg-white/[0.02]" style={{ borderColor: "oklch(0.18 0.01 55 / 0.3)" }}>
                      <td className="px-5 py-3">
                        <p className="font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">{a.user?.email}</p>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs font-bold" style={{ color: GOLD }}>{a.code}</td>
                      <td className="px-5 py-3 font-semibold" style={{ color: GOLD }}>Rp {a.total_earned.toLocaleString("id-ID")}</td>
                      <td className="px-5 py-3 text-muted-foreground">Rp {a.total_withdrawn.toLocaleString("id-ID")}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${a.is_approved ? "bg-emerald-500/15 text-emerald-400" : "bg-orange-500/15 text-orange-400"}`}>
                          {a.is_approved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {!a.is_approved && (
                          <button onClick={() => handleApprove(a.id, true)} disabled={pending}
                            className="rounded-lg px-3 py-1 text-xs font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors">
                            Setujui
                          </button>
                        )}
                        {a.is_approved && (
                          <button onClick={() => handleApprove(a.id, false)} disabled={pending}
                            className="rounded-lg px-3 py-1 text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
                            Cabut
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
