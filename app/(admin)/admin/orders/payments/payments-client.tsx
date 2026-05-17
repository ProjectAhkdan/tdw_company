"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { verifyPayment } from "@/server/actions/checkout"

const GOLD = "oklch(0.78 0.16 55)"

export default function AdminPaymentsClient({ orders }: { orders: any[] }) {
  const [pending, startTransition] = useTransition()

  function handle(orderId: string, approve: boolean) {
    startTransition(async () => {
      const r = await verifyPayment(orderId, approve)
      if (r && "error" in r) toast.error(r.error)
      else toast.success(approve ? "Pembayaran dikonfirmasi ✅" : "Pembayaran ditolak")
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Verifikasi Pembayaran
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} pesanan menunggu verifikasi
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="glass rounded-2xl py-16 text-center text-muted-foreground">
          Tidak ada pembayaran yang perlu diverifikasi 🎉
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o: any) => {
            const name = o.user?.profiles?.[0]?.full_name ?? o.user?.email ?? "—"
            const item = o.order_items?.[0]
            const sched = item?.ticket?.schedule
            const seminar = sched?.seminar
            const uploadedAt = new Date(o.updated_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

            return (
              <div key={o.id} className="glass rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Order info */}
                  <div className="space-y-1">
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">{o.user?.email}</p>
                    {seminar && (
                      <p className="text-sm text-muted-foreground">
                        {seminar.title} · {item?.ticket?.name} × {item?.quantity}
                      </p>
                    )}
                    {sched && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(sched.start_date).toLocaleDateString("id-ID")} · {sched.city}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Nominal transfer</p>
                    <p className="text-xl font-bold" style={{ color: GOLD }}>
                      Rp {o.unique_amount?.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (base: Rp {o.total_amount?.toLocaleString("id-ID")})
                    </p>
                    {o.bank && (
                      <p className="text-xs text-muted-foreground mt-1">
                        → {o.bank.bank_name} {o.bank.account_no}
                      </p>
                    )}
                  </div>
                </div>

                {/* Proof + actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4"
                  style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
                  <div className="flex items-center gap-3">
                    {o.proof_url ? (
                      <a href={o.proof_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
                        style={{ background: `${GOLD}15`, color: GOLD }}>
                        <ExternalLink className="size-3.5" /> Lihat Bukti Transfer
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">Belum ada bukti</span>
                    )}
                    <span className="text-xs text-muted-foreground">Upload: {uploadedAt}</span>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handle(o.id, false)} disabled={pending}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 bg-red-500/15 text-red-400 hover:bg-red-500/25">
                      <XCircle className="size-4" /> Tolak
                    </button>
                    <button onClick={() => handle(o.id, true)} disabled={pending}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40 hover:opacity-90"
                      style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
                      <CheckCircle className="size-4" /> Konfirmasi Lunas
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
