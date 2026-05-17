import Link from "next/link"
import { CheckCircle, Clock, Calendar, ArrowRight } from "lucide-react"
import { supabaseAdmin } from "@/lib/db/client"

const GOLD = "oklch(0.78 0.16 55)"

type OrderSummary = { midtrans_order_id: string | null; total_amount: number }

interface Props {
  searchParams: Promise<{ order?: string; status?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderId, status } = await searchParams
  const isPending = status === "pending"

  let order: OrderSummary | null = null
  if (orderId) {
    const { data } = await supabaseAdmin
      .from("orders")
      .select("midtrans_order_id, total_amount")
      .eq("id", orderId)
      .single()
    if (data) order = data as unknown as OrderSummary
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: isPending ? `${GOLD}15` : "oklch(0.55 0.18 145 / 0.15)" }}>
          {isPending
            ? <Clock className="size-10" style={{ color: GOLD }} />
            : <CheckCircle className="size-10 text-emerald-400" />}
        </div>

        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          {isPending ? "Menunggu Pembayaran" : "Pembayaran Berhasil!"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isPending
            ? "Pesanan Anda sedang menunggu konfirmasi. Kami akan mengirim email setelah pembayaran dikonfirmasi."
            : "Terima kasih! Tiket Anda sedang diproses dan akan dikirim ke email Anda."}
        </p>

        {order !== null && (
          <div className="glass mt-6 rounded-2xl p-5 text-left space-y-2 text-sm">
            {order.midtrans_order_id && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-medium">{order.midtrans_order_id}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold" style={{ color: GOLD }}>
                Rp {order.total_amount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/dashboard/tickets"
            className="flex h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
            <Calendar className="size-4" /> Lihat Tiket Saya
          </Link>
          <Link href="/seminars"
            className="flex h-11 items-center justify-center gap-2 rounded-xl border text-sm transition-colors hover:bg-white/5"
            style={{ borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.65 0 0)" }}>
            Jelajahi Seminar Lain <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
