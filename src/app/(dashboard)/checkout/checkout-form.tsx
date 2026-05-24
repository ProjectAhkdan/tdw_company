"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Calendar, MapPin } from "lucide-react"
import { toast } from "sonner"
import { PillButton } from "@shared/ui/button"
import { createOrder } from "@features/checkout/api/checkout.actions"

const GOLD = "#D9F25D"

const schema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Format: 08xxxxxxxxxx"),
  bankAccountId: z.string().uuid("Pilih rekening tujuan"),
})
type Form = z.infer<typeof schema>

interface Bank { id: string; bank_name: string; account_no: string; account_name: string }
interface TicketInfo {
  id: string; name: string; unitPrice: number; isEarlyBird: boolean; quantity: number
  schedule: { startDate: string; city: string; venue: string; seminarTitle: string; thumbnailUrl: string | null }
}

export function CheckoutForm({ ticket, banks }: { ticket: TicketInfo; banks: Bank[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const total = ticket.unitPrice * ticket.quantity

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { bankAccountId: banks[0]?.id ?? "" },
  })

  const selectedBankId = watch("bankAccountId")

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
      })
      if ("error" in result) { toast.error(result.error); return }
      // Push to URL with orderId to trigger Server Component to render TransferInstructions
      router.push(`/checkout?ticket=${ticket.id}&qty=${ticket.quantity}&orderId=${result.orderId}`)
    } finally {
      setLoading(false)
    }
  }

  const dateStr = new Date(ticket.schedule.startDate).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  return (
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
                className="h-10 w-full rounded-xl border px-4 text-sm outline-none focus:border-[#D9F25D]"
                style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
              {errors[id as keyof Form] && <p className="mt-1 text-xs text-red-400">{errors[id as keyof Form]?.message}</p>}
            </div>
          ))}
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

        <PillButton type="submit" disabled={loading} className="w-full"
          pillColor={GOLD} textColor="#0A0A0A" hoverCircleColor="#120F17" hoverTextColor={GOLD}>
          {loading ? "Memproses..." : "Lanjut ke Instruksi Transfer →"}
        </PillButton>
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
  )
}



