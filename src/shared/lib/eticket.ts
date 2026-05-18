import QRCode from 'qrcode'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { supabaseAdmin } from '@infrastructure/storage/db-client'
import { ETicketDocument } from '@/features/seminar/ui/eticket-document'

function generateTicketCode(orderId: string): string {
  return `TDW-${orderId.slice(0, 8).toUpperCase()}`
}

export async function generateETicket(orderId: string): Promise<{ url: string } | { error: string }> {
  // 1. Fetch order data
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select(`
      id, midtrans_order_id,
      user:users!inner(profiles(full_name)),
      order_items(
        ticket:tickets!inner(
          name,
          schedule:schedules!inner(
            start_date, city, venue,
            seminar:seminars!inner(title)
          )
        )
      )
    `)
    .eq('id', orderId)
    .single()

  if (!order) return { error: 'Order not found' }

  const o = order as any
  const profile = o.user?.profiles?.[0]
  const item = o.order_items?.[0]
  const ticket = item?.ticket
  const schedule = ticket?.schedule
  const seminar = schedule?.seminar

  if (!ticket || !schedule || !seminar) return { error: 'Incomplete order data' }

  const ticketCode = generateTicketCode(orderId)
  const attendeeName: string = profile?.full_name ?? 'Peserta'
  const dateStr = new Date(schedule.start_date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // 2. Generate QR code as base64 PNG data URL
  const qrDataUrl = await QRCode.toDataURL(ticketCode, {
    width: 200,
    margin: 1,
    color: { dark: '#000000', light: '#FFFFFF' },
  })

  // 3. Render PDF to buffer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(
    createElement(ETicketDocument, {
      data: {
        ticketCode,
        attendeeName,
        seminarTitle: seminar.title,
        ticketType: ticket.name,
        date: dateStr,
        venue: schedule.venue,
        city: schedule.city,
        qrDataUrl,
      },
    }) as any
  )

  // 4. Upload to Supabase Storage
  const fileName = `tickets/${orderId}/${ticketCode}.pdf`
  const { error: uploadErr } = await supabaseAdmin.storage
    .from('documents')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadErr) return { error: uploadErr.message }

  // 5. Get public URL (signed URL valid 1 year)
  const { data: signedUrl } = await supabaseAdmin.storage
    .from('documents')
    .createSignedUrl(fileName, 60 * 60 * 24 * 365)

  if (!signedUrl) return { error: 'Failed to create signed URL' }

  // 6. Store eticket URL in dedicated column
  // @ts-expect-error untyped supabase client
  await supabaseAdmin.from('orders').update({ eticket_url: signedUrl.signedUrl }).eq('id', orderId)

  return { url: signedUrl.signedUrl }
}
