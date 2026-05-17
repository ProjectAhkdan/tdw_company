import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/db/client"
import CheckoutClient from "./checkout-client"

interface Props {
  searchParams: Promise<{ ticket?: string; qty?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { ticket: ticketId, qty: qtyStr } = await searchParams
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

  return (
    <CheckoutClient
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
      banks={(rawBanks as any[]) ?? []}
    />
  )
}
