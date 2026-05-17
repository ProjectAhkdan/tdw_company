"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Copy, Check, Upload, ShieldCheck, Clock } from "lucide-react"
import { toast } from "sonner"
import { createOrder, uploadPaymentProof } from "@/server/actions/checkout"

const GOLD = "oklch(0.78 0.16 55)"

const schema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Format: 08xxxxxxxxxx"),
  bankAccountId: z.string().uuid("Pilih rekening tujuan"),
  affiliateCode: z.string().optional(),
})
type Form = z.infer<typeof schema>

interface Bank { id: string; bank_name: string; account_no: string; account_name: string }
interface TicketInfo {
  id: string; name: string; unitPrice: number; isEarlyBird: boolean; quantity: number
  schedule: { startDate: string; city: string; venue: string; seminarTitle: string; thumbnailUrl: string | null }
}

type OrderResult = { orderId: string; uniqueAmount: number; bank: Bank; expiresAt: string }

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all"
      style={{ background: `${GOLD}20`, color: GOLD }}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

// ── Step 2: Transfer instructions + proof upload ──────────────────────────────
function TransferInstructions({ order, onDone }: { order: OrderResult; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const expires = new Date(order.expiresAt)
  const expiresStr = expires.toLocaleString("id-ID", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("proof", file)
      const result = await uploadPaymentProof(order.orderId, fd)
      if ("error" in result) { toast.error(result.error); return }
      toast.success("Bukti transfer berhasil dikirim! Admin akan memverifikasi dalam 1×24 jam.")
      onDone()
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Expiry warning */}
      <div className="flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-400">
        <Clock className="size-4 shrink-0" />
        Selesaikan pembayaran sebelum <strong>{expiresStr}</strong>
      </div>

      {/* Transfer details */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">Instruksi Transfer</h2>

        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: `${GOLD}25`, background: `${GOLD}05` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Bank Tujuan</p>
              <p className="font-bold text-lg">{order.bank.bank_name}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Nomor Rekening</p>
              <p className="font-mono font-bold text-lg">{order.bank.account_no}</p>
            </div>
            <CopyButton text={order.bank.account_no} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Atas Nama</p>
            <p className="font-medium">{order.bank.account_name}</p>
          </div>
        </div>

        {/* Unique amount — most important */}
        <div className="rounded-xl border-2 p-4" style={{ borderColor: GOLD, background: `${GOLD}08` }}>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
            ⚠️ Transfer TEPAT sebesar
          </p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold" style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}>
              Rp {order.uniqueAmount.toLocaleString("id-ID")}
            </p>
            <CopyButton text={String(order.uniqueAmount)} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Nominal ini unik untuk pesanan Anda. Transfer dengan jumlah berbeda tidak akan terdeteksi otomatis.
          </p>
        </div>
      </div>

      {/* Upload proof */}
      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4 font-semibold">Upload Bukti Transfer</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 transition-colors hover:border-[oklch(0.78_0.16_55)]"
            style={{ borderColor: file ? GOLD : "oklch(0.22 0.01 55 / 0.5)" }}>
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <Upload className="size-8 mb-2" style={{ color: file ? GOLD : "oklch(0.45 0 0)" }} />
            {file ? (
              <p className="text-sm font-medium" style={{ color: GOLD }}>{file.name}</p>
            ) : (
              <>
                <p className="text-sm font-medium">Klik untuk upload bukti transfer</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF — maks 5MB</p>
              </>
            )}
          </label>

          <button type="submit" disabled={!file || uploading}
            className="h-11 w-full rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
            {uploading ? "Mengirim..." : "Kirim Bukti Transfer"}
          </button>
        </form>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" style={{ color: GOLD }} />
        Bukti transfer Anda disimpan secara aman dan hanya dapat diakses oleh tim verifikasi kami.
      </div>
    </div>
  )
}

// ── Main checkout form ────────────────────────────────────────────────────────
export default function CheckoutClient({ ticket, banks }: { ticket: TicketInfo; banks: Bank[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)
  const total = ticket.unitPrice * ticket.quantity

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { bankAccountId: banks[0]?.id ?? "" },
  })

  const selectedBankId = watch("bankAccountId")
  const selectedBank = banks.find(b => b.id === selectedBankId)

  async function onSubmit(data: Form) {
    setLoading(true)
    try {
      const result = await createOrder({
        ticketId: ticket.id,
        quantity: ticket.quantity,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        bankAccountId: data.bankAccountId,
        affiliateCode: data.affiliateCode || undefined,
      })
      if ("error" in result) { toast.error(result.error); return }
      setOrderResult(result)
    } finally {
      setLoading(false)
    }
  }

  const dateStr = new Date(ticket.schedule.startDate).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  if (orderResult) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="mb-8">
            <div className="mb-2 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>Langkah 2 dari 2</div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Lakukan Transfer</h1>
          </div>
          <TransferInstructions order={orderResult} onDone={() => router.push(`/checkout/success?order=${orderResult.orderId}&status=pending`)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <div className="mb-2 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>Langkah 1 dari 2</div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Data Pemesan</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal info */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold">Informasi Pemesan</h2>
              {[
                { id: "fullName", label: "Nama Lengkap", placeholder: "Sesuai KTP", type: "text" },
                { id: "email", label: "Email", placeholder: "nama@email.com", type: "email" },
                { id: "phone", label: "Nomor HP", placeholder: "08xxxxxxxxxx", type: "tel" },
              ].map(({ id, label, placeholder, type }) => (
                <div key={id}>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">{label}</label>
                  <input type={type} placeholder={placeholder} {...register(id as keyof Form)}
                    className="h-10 w-full rounded-xl border px-4 text-sm outline-none focus:border-[oklch(0.78_0.16_55)]"
                    style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
                  {errors[id as keyof Form] && <p className="mt-1 text-xs text-red-400">{errors[id as keyof Form]?.message}</p>}
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Kode Afiliasi <span className="text-xs opacity-60">(opsional)</span>
                </label>
                <input placeholder="Kode afiliasi" {...register("affiliateCode")}
                  className="h-10 w-full rounded-xl border px-4 text-sm outline-none"
                  style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
              </div>
            </div>

            {/* Bank selection */}
            <div className="glass rounded-2xl p-6 space-y-3">
              <h2 className="font-semibold">Pilih Rekening Tujuan Transfer</h2>
              {banks.map(b => (
                <label key={b.id} className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all"
                  style={{
                    borderColor: selectedBankId === b.id ? GOLD : "oklch(0.22 0.01 55 / 0.4)",
                    background: selectedBankId === b.id ? `${GOLD}08` : "transparent",
                  }}>
                  <input type="radio" value={b.id} {...register("bankAccountId")} className="hidden" />
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 shrink-0"
                    style={{ borderColor: selectedBankId === b.id ? GOLD : "oklch(0.35 0.01 55)" }}>
                    {selectedBankId === b.id && <div className="h-2.5 w-2.5 rounded-full" style={{ background: GOLD }} />}
                  </div>
                  <div>
                    <p className="font-semibold">{b.bank_name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{b.account_no} · {b.account_name}</p>
                  </div>
                </label>
              ))}
              {errors.bankAccountId && <p className="text-xs text-red-400">{errors.bankAccountId.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="h-12 w-full rounded-xl text-base font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: GOLD, color: "oklch(0.08 0 0)", boxShadow: `0 0 30px ${GOLD}35` }}>
              {loading ? "Memproses..." : "Lanjut ke Instruksi Transfer →"}
            </button>
          </form>

          {/* Order summary */}
          <div className="glass rounded-2xl p-6 h-fit" style={{ border: `1px solid ${GOLD}20` }}>
            <h2 className="mb-4 font-semibold">Ringkasan Pesanan</h2>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-base">{ticket.schedule.seminarTitle}</p>
              <div className="space-y-1.5 text-muted-foreground">
                <p className="flex items-center gap-2"><Calendar className="size-3.5 shrink-0" style={{ color: GOLD }} />{dateStr}</p>
                <p className="flex items-center gap-2"><MapPin className="size-3.5 shrink-0" style={{ color: GOLD }} />{ticket.schedule.venue}, {ticket.schedule.city}</p>
              </div>
              <div className="divider-gold my-3" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">{ticket.name} × {ticket.quantity}</span>
                {ticket.isEarlyBird && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400">Early Bird</span>}
              </div>
              <div className="divider-gold my-3" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg" style={{ color: GOLD }}>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <p className="text-xs text-muted-foreground">+ nominal unik (1–999) akan ditambahkan untuk verifikasi otomatis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
