"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Check, Upload, ShieldCheck, Clock } from "lucide-react"
import { toast } from "sonner"
import { uploadPaymentProof } from "@features/checkout/api/checkout.actions"
import { PillButton } from "@shared/ui/button"

const GOLD = "#D9F25D"

interface Bank { id: string; bank_name: string; account_no: string; account_name: string }
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

export function TransferInstructions({ order }: { order: OrderResult }) {
  const router = useRouter()
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
      router.push(`/checkout/success?order=${order.orderId}&status=pending`)
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

          <PillButton type="submit" disabled={!file || uploading} className="w-full"
            pillColor={GOLD} textColor="#0A0A0A" hoverCircleColor="#120F17" hoverTextColor={GOLD}>
            {uploading ? "Mengirim..." : "Kirim Bukti Transfer"}
          </PillButton>
        </form>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" style={{ color: GOLD }} />
        Bukti transfer Anda disimpan secara aman dan hanya dapat diakses oleh tim verifikasi kami.
      </div>
    </div>
  )
}
