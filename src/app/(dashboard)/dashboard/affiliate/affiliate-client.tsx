"use client"

import { useState, useTransition } from "react"
import { Copy, Check, TrendingUp, Wallet, Clock, Link2 } from "lucide-react"
import { toast } from "sonner"
import { registerAffiliate, requestWithdrawal } from "@/app/actions/affiliate/action"

const GOLD = "oklch(0.78 0.16 55)"

type Stats = Awaited<ReturnType<typeof import("@/app/actions/affiliate/action").getAffiliateStats>>

const statusStyle: Record<string, string> = {
  PENDING: "bg-orange-500/15 text-orange-400",
  APPROVED: "bg-emerald-500/15 text-emerald-400",
  PAID: "bg-blue-500/15 text-blue-400",
  REJECTED: "bg-red-500/15 text-red-400",
  COMPLETED: "bg-emerald-500/15 text-emerald-400",
  PROCESSING: "bg-blue-500/15 text-blue-400",
}

export default function AffiliateDashboardClient({ stats, appUrl }: { stats: Stats; appUrl: string }) {
  const [pending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")

  const refLink = stats ? `${appUrl}?ref=${stats.affiliate.code}` : ""
  const available = stats ? stats.affiliate.total_earned - stats.affiliate.total_withdrawn : 0

  function copyLink() {
    navigator.clipboard.writeText(refLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRegister() {
    startTransition(async () => {
      const r = await registerAffiliate()
      if (r && "error" in r) toast.error(r.error)
      else toast.success("Berhasil mendaftar sebagai afiliator!")
    })
  }

  function handleWithdraw(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseInt(withdrawAmount)
    startTransition(async () => {
      const r = await requestWithdrawal(amount)
      if (r && "error" in r) toast.error(r.error)
      else { toast.success("Permintaan penarikan dikirim"); setWithdrawAmount("") }
    })
  }

  // Not registered yet
  if (!stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Program Afiliasi</h1>
        <div className="glass rounded-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: `${GOLD}15` }}>
            <Link2 className="size-8" style={{ color: GOLD }} />
          </div>
          <h2 className="text-xl font-semibold">Bergabung sebagai Afiliator</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Dapatkan komisi hingga 15% untuk setiap tiket yang terjual melalui link referral Anda.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center max-w-xs mx-auto">
            {[["15%", "Komisi"], ["Real-time", "Tracking"], ["Rp 100rb", "Min. Cairkan"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-lg font-bold" style={{ color: GOLD }}>{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
          <button onClick={handleRegister} disabled={pending}
            className="mt-6 h-11 rounded-xl px-8 text-sm font-semibold disabled:opacity-50"
            style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
            {pending ? "Mendaftar..." : "Daftar Sekarang — Gratis"}
          </button>
        </div>
      </div>
    )
  }

  const { affiliate, commissions, withdrawals, pendingAmount } = stats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Program Afiliasi</h1>
        {!affiliate.is_approved && (
          <p className="mt-1 text-sm text-orange-400">⏳ Akun Anda sedang menunggu persetujuan admin.</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: TrendingUp, label: "Total Komisi", value: `Rp ${affiliate.total_earned.toLocaleString("id-ID")}` },
          { icon: Wallet, label: "Saldo Tersedia", value: `Rp ${available.toLocaleString("id-ID")}` },
          { icon: Clock, label: "Pending", value: `Rp ${pendingAmount.toLocaleString("id-ID")}` },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ background: `${GOLD}15` }}>
              <s.icon className="size-5" style={{ color: GOLD }} />
            </div>
            <p className="text-xl font-bold" style={{ color: GOLD }}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <div className="glass rounded-2xl p-5">
        <p className="mb-3 text-sm font-medium">Link Referral Anda</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-xl border px-3 py-2 text-sm font-mono truncate text-muted-foreground"
            style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.11 0.008 55)" }}>
            {refLink}
          </div>
          <button onClick={copyLink}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all"
            style={{ background: `${GOLD}20`, color: GOLD }}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Kode: <span className="font-mono font-bold" style={{ color: GOLD }}>{affiliate.code}</span></p>
      </div>

      {/* Withdraw */}
      {affiliate.is_approved && available >= 100000 && (
        <div className="glass rounded-2xl p-5">
          <p className="mb-3 text-sm font-medium">Cairkan Komisi</p>
          <form onSubmit={handleWithdraw} className="flex gap-2">
            <input type="number" min={100000} max={available} step={10000}
              value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
              placeholder={`Min. Rp 100.000 (tersedia Rp ${available.toLocaleString("id-ID")})`}
              className="h-9 flex-1 rounded-xl border px-3 text-sm outline-none"
              style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }}
              required />
            <button type="submit" disabled={pending}
              className="h-9 rounded-xl px-4 text-sm font-semibold disabled:opacity-50"
              style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
              Cairkan
            </button>
          </form>
        </div>
      )}

      {/* Commission history */}
      {commissions.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="border-b px-5 py-3 text-sm font-medium" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
            Riwayat Komisi
          </div>
          <div className="divide-y" style={{ borderColor: "oklch(0.18 0.01 55 / 0.3)" }}>
            {commissions.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString("id-ID")}</span>
                <span className="font-semibold" style={{ color: GOLD }}>+Rp {c.amount.toLocaleString("id-ID")}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[c.status] ?? ""}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Withdrawal history */}
      {withdrawals.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="border-b px-5 py-3 text-sm font-medium" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
            Riwayat Pencairan
          </div>
          <div className="divide-y" style={{ borderColor: "oklch(0.18 0.01 55 / 0.3)" }}>
            {withdrawals.map((w: any) => (
              <div key={w.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-muted-foreground">{new Date(w.created_at).toLocaleDateString("id-ID")}</span>
                <span className="font-semibold">Rp {w.amount.toLocaleString("id-ID")}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[w.status] ?? ""}`}>{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
