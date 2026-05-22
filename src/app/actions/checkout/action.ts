'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@infrastructure/storage/db-client'
import { getServerSession } from '@infrastructure/session/auth-server'
import { cookies } from 'next/headers'
import { sendEmail } from '@infrastructure/email/send'
import { orderConfirmationEmail } from '@infrastructure/email/templates'
import { rateLimit } from '@shared/lib/rate-limit'

const orderSchema = z.object({
  ticketId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/),
  bankAccountId: z.string().uuid(),
  affiliateCode: z.string().optional(),
})

export type CreateOrderInput = z.infer<typeof orderSchema>

/** Generate nominal unik: tambah 3 digit acak (1–999) ke total.
 *  Aman karena: setiap order punya nominal berbeda → admin bisa match otomatis.
 *  Jika collision, coba ulang max 5x. */
async function generateUniqueAmount(baseAmount: number): Promise<number> {
  for (let i = 0; i < 5; i++) {
    const suffix = Math.floor(Math.random() * 999) + 1
    const unique = baseAmount + suffix
    const { count } = await supabaseAdmin
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('unique_amount', unique)
      .eq('status', 'PENDING')
    if (count === 0) return unique
  }
  // Fallback: pakai timestamp suffix
  return baseAmount + (Date.now() % 999) + 1
}

export async function createOrder(input: CreateOrderInput) {
  const session = await getServerSession()
  if (!session) return { error: 'Silakan login terlebih dahulu' }

  // Rate limit: 3 orders per minute per user
  const { ok } = rateLimit(session.id, 'checkout', 3, 60)
  if (!ok) return { error: 'Terlalu banyak permintaan. Tunggu sebentar.' }

  const parsed = orderSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const data = parsed.data

  // Fetch ticket
  const { data: ticket } = await supabaseAdmin
    .from('tickets')
    .select(`id, name, price, early_bird_price, early_bird_until, quota, sold,
      schedule:schedules!inner(id, start_date, city, venue,
        seminar:seminars!inner(id, title))`)
    .eq('id', data.ticketId)
    .single()

  if (!ticket) return { error: 'Tiket tidak ditemukan' }
  const t = ticket as any

  const remaining = t.quota - t.sold
  if (remaining < data.quantity) return { error: `Sisa kursi hanya ${remaining}` }

  const now = new Date()
  const isEB = t.early_bird_price && t.early_bird_until && new Date(t.early_bird_until) > now
  const unitPrice: number = isEB ? t.early_bird_price : t.price
  const totalAmount = unitPrice * data.quantity

  // Verify bank account exists
  const { data: bank } = await supabaseAdmin
    .from('bank_accounts')
    .select('id, bank_name, account_no, account_name')
    .eq('id', data.bankAccountId)
    .eq('is_active', true)
    .single()

  if (!bank) return { error: 'Rekening bank tidak valid' }

  // Generate unique amount
  const uniqueAmount = await generateUniqueAmount(totalAmount)

  // Affiliate code
  const cookieStore = await cookies()
  const affiliateCode = data.affiliateCode || cookieStore.get('tdw_ref')?.value || null

  // Create order — expires in 24 hours
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const orderId = crypto.randomUUID()

  const { error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({
      id: orderId,
      user_id: session.id,
      status: 'PENDING',
      total_amount: totalAmount,
      unique_amount: uniqueAmount,
      bank_account_id: data.bankAccountId,
      affiliate_code: affiliateCode,
      expires_at: expiresAt,
    } as any)

  if (orderErr) return { error: 'Gagal membuat pesanan' }

  await supabaseAdmin.from('order_items').insert({
    order_id: orderId,
    ticket_id: data.ticketId,
    quantity: data.quantity,
    unit_price: unitPrice,
    subtotal: totalAmount,
  } as any)

  // Reserve seats
  // @ts-ignore
  await supabaseAdmin.from('tickets').update({ sold: t.sold + data.quantity }).eq('id', data.ticketId)

  // Send confirmation email
  const sched = t.schedule
  const dateStr = new Date(sched.start_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const { subject, html } = orderConfirmationEmail({
    customerName: data.fullName,
    seminarTitle: sched.seminar.title,
    ticketType: t.name,
    date: dateStr,
    venue: sched.venue,
    city: sched.city,
    quantity: data.quantity,
    totalAmount,
    orderId,
  })
  sendEmail(data.email, subject, html).catch(console.error)

  return {
    orderId,
    uniqueAmount,
    bank: bank as any,
    expiresAt,
  }
}

export async function uploadPaymentProof(orderId: string, file: FormData) {
  const session = await getServerSession()
  if (!session) return { error: 'Unauthorized' }

  // Verify order belongs to user and is still PENDING
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id, status, user_id, expires_at')
    .eq('id', orderId)
    .single()

  if (!order) return { error: 'Order tidak ditemukan' }
  const o = order as any
  if (o.user_id !== session.id) return { error: 'Forbidden' }
  if (o.status !== 'PENDING') return { error: 'Order sudah diproses' }
  if (new Date(o.expires_at) < new Date()) return { error: 'Order sudah kadaluarsa' }

  const imageFile = file.get('proof') as File
  if (!imageFile) return { error: 'File tidak ditemukan' }

  // Validate file type and size (max 5MB)
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  if (!allowed.includes(imageFile.type)) return { error: 'Format file tidak didukung (JPG/PNG/PDF)' }
  if (imageFile.size > 5 * 1024 * 1024) return { error: 'Ukuran file maksimal 5MB' }

  const ext = imageFile.name.split('.').pop()
  const path = `payment-proofs/${orderId}/proof.${ext}`

  const { error: uploadErr } = await supabaseAdmin.storage
    .from('documents')
    .upload(path, imageFile, { upsert: true, contentType: imageFile.type })

  if (uploadErr) return { error: uploadErr.message }

  const { data: urlData } = await supabaseAdmin.storage
    .from('documents')
    .createSignedUrl(path, 60 * 60 * 24 * 30) // 30 days

  if (!urlData) return { error: 'Gagal membuat URL' }

  // Update order with proof URL and change status to CONFIRMED (waiting admin)
  // @ts-ignore
  await supabaseAdmin.from('orders').update({
    proof_url: urlData.signedUrl,
    status: 'CONFIRMED', // waiting admin verification
    updated_at: new Date().toISOString(),
  }).eq('id', orderId)

  revalidatePath('/dashboard/tickets')
  return { success: true }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }
  const allowed = ['PAID', 'PENDING', 'CANCELLED', 'REFUNDED', 'CONFIRMED']
  if (!allowed.includes(status)) return { error: 'Status tidak valid' }
  // @ts-ignore
  const { error } = await supabaseAdmin.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId)
  if (error) return { error: error.message }
  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  return { success: true }
}

export async function verifyPayment(orderId: string, approve: boolean) {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  const newStatus = approve ? 'PAID' : 'PENDING'

  // @ts-ignore
  await supabaseAdmin.from('orders').update({
    status: newStatus,
    verified_at: approve ? new Date().toISOString() : null,
    verified_by: approve ? session.id : null,
    updated_at: new Date().toISOString(),
  }).eq('id', orderId)

  if (approve) {
    // Upsert payment record
    await supabaseAdmin.from('payments').insert({
      order_id: orderId,
      status: 'SUCCESS',
      method: 'BANK_TRANSFER',
      paid_at: new Date().toISOString(),
    } as any)

    // Generate e-ticket async
    const { generateETicket } = await import('@shared/lib/eticket')
    generateETicket(orderId).catch(console.error)
  } else {
    // Rejected: release seats
    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('ticket_id, quantity')
      .eq('order_id', orderId)

    for (const item of (items ?? []) as any[]) {
      const { data: tk } = await supabaseAdmin.from('tickets').select('sold').eq('id', item.ticket_id).single()
      if (tk) {
        // @ts-ignore
        await supabaseAdmin.from('tickets').update({ sold: Math.max(0, (tk as any).sold - item.quantity) }).eq('id', item.ticket_id)
      }
    }
  }

  revalidatePath('/admin/orders')
  return { success: true }
}


export async function deleteOrder(orderId: string) {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  // Hapus order_items dulu (FK constraint)
  await supabaseAdmin.from('order_items').delete().eq('order_id', orderId)
  await supabaseAdmin.from('payments').delete().eq('order_id', orderId)
  const { error } = await supabaseAdmin.from('orders').delete().eq('id', orderId)
  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/seminars')
  revalidatePath('/admin')
  return { success: true }
}


export async function deleteOrdersBulk(orderIds: string[]) {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }
  if (!orderIds.length) return { error: 'Tidak ada order dipilih' }

  await supabaseAdmin.from('order_items').delete().in('order_id', orderIds)
  await supabaseAdmin.from('payments').delete().in('order_id', orderIds)
  const { error } = await supabaseAdmin.from('orders').delete().in('id', orderIds)
  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/seminars')
  revalidatePath('/admin')
  return { success: true }
}
