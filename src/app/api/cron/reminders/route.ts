import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@infrastructure/storage/db-client'
import { sendEmail } from '@infrastructure/email/send'
import { seminarReminderEmail } from '@infrastructure/email/templates'

// Vercel Cron: runs daily at 08:00 WIB (01:00 UTC)
// vercel.json: { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 1 * * *" }] }

export async function GET(req: NextRequest) {
  // Simple auth check for cron
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const start = new Date(tomorrow)
  start.setHours(0, 0, 0, 0)
  const end = new Date(tomorrow)
  end.setHours(23, 59, 59, 999)

  // Find all PAID orders for seminars happening tomorrow
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select(`id, midtrans_order_id, eticket_url,
      user:users!inner(email, profiles(full_name)),
      order_items(ticket:tickets!inner(
        schedule:schedules!inner(start_date, city, venue,
          seminar:seminars!inner(title))))`)
    .eq('status', 'PAID')

  if (!orders) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const order of orders as any[]) {
    const item = order.order_items?.[0]
    const sched = item?.ticket?.schedule
    if (!sched) continue

    const schedDate = new Date(sched.start_date)
    if (schedDate < start || schedDate > end) continue

    const email = order.user?.email
    const name = order.user?.profiles?.[0]?.full_name ?? 'Peserta'
    if (!email) continue

    const dateStr = schedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const ticketUrl = order.eticket_url
      ? order.eticket_url
      : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tickets`

    const { subject, html } = seminarReminderEmail({
      customerName: name,
      seminarTitle: sched.seminar.title,
      date: dateStr,
      venue: sched.venue,
      city: sched.city,
      ticketUrl,
    })

    await sendEmail(email, subject, html)
    sent++
  }

  return NextResponse.json({ sent })
}
