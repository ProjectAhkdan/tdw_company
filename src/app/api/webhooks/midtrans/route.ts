import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@infrastructure/storage/db-client'
import { verifyMidtransSignature } from '@infrastructure/payment/midtrans'
import { generateETicket } from '@shared/lib/eticket'
import { sendEmail } from '@infrastructure/email/send'
import { ticketSuccessEmail, paymentFailedEmail } from '@infrastructure/email/templates'
import { rateLimit } from '@shared/lib/rate-limit'

// Map Midtrans transaction_status → OrderStatus enum
function mapStatus(transactionStatus: string, fraudStatus?: string): string | null {
  if (transactionStatus === 'capture') {
    return fraudStatus === 'accept' ? 'PAID' : null
  }
  const map: Record<string, string> = {
    settlement: 'PAID',
    pending: 'PENDING',
    deny: 'CANCELLED',
    cancel: 'CANCELLED',
    expire: 'CANCELLED',
    refund: 'REFUNDED',
  }
  return map[transactionStatus] ?? null
}

export async function POST(req: NextRequest) {
  // Rate limit: 60 req/min per IP
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { ok } = rateLimit(ip, 'webhook', 60, 60)
  if (!ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
    payment_type,
  } = body

  // 1. Verify signature
  if (!verifyMidtransSignature(order_id, status_code, gross_amount, signature_key)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // 2. Map status
  const newStatus = mapStatus(transaction_status, fraud_status)
  if (!newStatus) {
    // Unknown status — acknowledge but do nothing
    return NextResponse.json({ received: true })
  }

  // 3. Find order by midtrans_order_id
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id, status, total_amount')
    .eq('midtrans_order_id', order_id)
    .single()

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const o = order as unknown as { id: string; status: string; total_amount: number }

  // 4. Skip if already in terminal state
  if (['PAID', 'REFUNDED', 'CANCELLED'].includes(o.status)) {
    return NextResponse.json({ received: true })
  }

  // 5. Update order status
  // @ts-expect-error untyped supabase client
  await supabaseAdmin.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', o.id)

  // 6. Update payment record
  const paymentUpdate: Record<string, unknown> = { status: newStatus === 'PAID' ? 'SUCCESS' : newStatus === 'PENDING' ? 'PENDING' : 'FAILED' }
  if (payment_type) paymentUpdate.method = payment_type.toUpperCase().replace('-', '_')
  if (newStatus === 'PAID') paymentUpdate.paid_at = new Date().toISOString()

  const { data: existingPayment } = await supabaseAdmin
    .from('payments')
    .select('id')
    .eq('order_id', o.id)
    .single()

  if (existingPayment) {
    // @ts-expect-error untyped supabase client
    await supabaseAdmin.from('payments').update(paymentUpdate).eq('order_id', o.id)
  } else {
    // @ts-expect-error untyped supabase client
    await supabaseAdmin.from('payments').insert({ order_id: o.id, amount: o.total_amount, ...paymentUpdate })
  }

  // 7. If paid → release seat reservation lock (already reserved at checkout)
  //    and trigger e-ticket generation (TASK 5)
  if (newStatus === 'PAID') {
    generateETicket(o.id).then(async (result) => {
      const { data: od } = await supabaseAdmin
        .from('orders')
        .select(`midtrans_order_id, total_amount,
          user:users!inner(email, profiles(full_name)),
          order_items(quantity, ticket:tickets!inner(name,
            schedule:schedules!inner(start_date, city, venue,
              seminar:seminars!inner(title))))`)
        .eq('id', o.id)
        .single()
      if (!od) return
      const d = od as any
      const email = d.user?.email
      const name = d.user?.profiles?.[0]?.full_name ?? 'Peserta'
      const item = d.order_items?.[0]
      const sched = item?.ticket?.schedule
      if (!email || !sched) return
      const dateStr = new Date(sched.start_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      const ticketUrl = 'url' in result ? result.url : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tickets`
      const { subject, html } = ticketSuccessEmail({
        customerName: name, seminarTitle: sched.seminar.title, ticketType: item.ticket.name,
        date: dateStr, venue: sched.venue, city: sched.city, quantity: item.quantity,
        totalAmount: d.total_amount, orderId: d.midtrans_order_id ?? o.id, ticketDownloadUrl: ticketUrl,
      })
      await sendEmail(email, subject, html)
    }).catch(err => console.error('[webhook] post-payment tasks failed:', err))
  }

  // 8. If cancelled → release reserved seats + send failure email
  if (newStatus === 'CANCELLED') {
    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('ticket_id, quantity')
      .eq('order_id', o.id)

    if (items) {
      for (const item of items as unknown as { ticket_id: string; quantity: number }[]) {
        const { data: ticket } = await supabaseAdmin
          .from('tickets')
          .select('sold')
          .eq('id', item.ticket_id)
          .single()
        if (ticket) {
          const t = ticket as unknown as { sold: number }
          // @ts-expect-error untyped supabase client
          await supabaseAdmin.from('tickets').update({ sold: Math.max(0, t.sold - item.quantity) }).eq('id', item.ticket_id)
        }
      }
    }

    // Send failure email
    const { data: od } = await supabaseAdmin
      .from('orders')
      .select(`midtrans_order_id, user:users!inner(email, profiles(full_name)),
        order_items(ticket:tickets!inner(schedule:schedules!inner(seminar:seminars!inner(title))))`)
      .eq('id', o.id)
      .single()
    if (od) {
      const d = od as any
      const email = d.user?.email
      const name = d.user?.profiles?.[0]?.full_name ?? 'Peserta'
      const title = d.order_items?.[0]?.ticket?.schedule?.seminar?.title ?? 'Seminar'
      if (email) {
        const { subject, html } = paymentFailedEmail({ customerName: name, seminarTitle: title, orderId: d.midtrans_order_id ?? o.id })
        sendEmail(email, subject, html).catch(console.error)
      }
    }
  }

  return NextResponse.json({ received: true })
}
