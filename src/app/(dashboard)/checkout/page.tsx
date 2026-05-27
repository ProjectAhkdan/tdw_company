import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import { CheckoutForm } from "./checkout-form"
import { TransferInstructions } from "./transfer-instructions"

interface Props {
  searchParams: Promise<{ ticket?: string; qty?: string; orderId?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { ticket: ticketId, qty: qtyStr, orderId } = await searchParams

  if (orderId) {
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, unique_amount, expires_at, bank:bank_accounts(id, bank_name, account_no, account_name)")
      .eq("id", orderId)
      .single()

    if (!order) redirect("/seminars")
    
    const o = order as any;

    const orderResult = {
      orderId: o.id,
      uniqueAmount: o.unique_amount,
      expiresAt: o.expires_at,
      bank: Array.isArray(o.bank) ? o.bank[0] : o.bank,
    }

    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="mb-8">
            <div className="mb-2 text-sm font-medium uppercase tracking-widest" style={{ color: "#D9F25D" }}>Langkah 2 dari 2</div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Lakukan Transfer</h1>
          </div>
          <TransferInstructions order={orderResult as any} />
        </div>
      </div>
    )
  }

  const qty = Math.max(1, Math.min(10, parseInt(qtyStr ?? "1") || 1))

  if (!ticketId) redirect("/seminars")

  const [{ data: rawTicket }, { data: rawBanks }] = await Promise.all([
    supabaseAdmin
      .from("tickets")
      .select(`id, name, price, early_bird_price, early_bird_until, quota, sold,
        schedule:schedules!inner(id, start_date, end_date, city, venue,
          seminar:seminars!inner(id, title, thumbnail_url))`)
      .eq("id", ticketId)
      .single(),
    supabaseAdmin
      .from("bank_accounts")
      .select("id, bank_name, account_no, account_name")
      .eq("is_active", true)
      .order("sort_order"),
  ])

  const t = rawTicket as any
  if (!t) redirect("/seminars")

  const now = new Date()
  const isEB = t.early_bird_price && t.early_bird_until && new Date(t.early_bird_until) > now
  const unitPrice: number = isEB ? t.early_bird_price : t.price

  if (t.quota - t.sold < qty) redirect("/seminars")

  const banks = (rawBanks as any[]) ?? []

  if (banks.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-4xl mb-4">🏦</p>
          <h2 className="text-xl font-bold mb-2">Pembayaran Belum Tersedia</h2>
          <p className="text-muted-foreground text-sm">Belum ada rekening tujuan transfer. Hubungi admin untuk informasi lebih lanjut.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <div className="mb-2 text-sm font-medium uppercase tracking-widest" style={{ color: "#D9F25D" }}>Langkah 1 dari 2</div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Data Pemesan</h1>
        </div>
        <CheckoutForm
          ticket={{
            id: t.id,
            name: t.name,
            unitPrice,
            isEarlyBird: !!isEB,
            quantity: qty,
            schedule: {
              startDate: t.schedule.start_date,
              city: t.schedule.city,
              venue: t.schedule.venue,
              seminarTitle: t.schedule.seminar.title,
              thumbnailUrl: t.schedule.seminar.thumbnail_url,
            },
          }}
          banks={banks}
        />
      </div>
    </div>
  )
}



