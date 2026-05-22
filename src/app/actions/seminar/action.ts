'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@infrastructure/storage/db-client'
import { getServerSession } from '@infrastructure/session/auth-server'

async function requireAdmin() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') throw new Error('Unauthorized')
  return session
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ── Seminar ───────────────────────────────────────────────────────────────────

const seminarSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).optional(),
  short_desc: z.string().min(10),
  description: z.string().min(20),
  category_id: z.string().uuid(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  is_featured: z.boolean().default(false),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
})

export async function createSeminar(input: z.infer<typeof seminarSchema>) {
  await requireAdmin()
  const data = seminarSchema.parse(input)
  const slug = data.slug || slugify(data.title)

  const { data: seminar, error } = await supabaseAdmin
    .from('seminars')
    .insert({ ...data, slug } as any)
    .select('id, slug')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/seminars')
  revalidatePath('/seminars')
  revalidatePath('/', 'layout')
  return { id: (seminar as any).id, slug: (seminar as any).slug }
}

export async function updateSeminar(id: string, input: Partial<z.infer<typeof seminarSchema>>) {
  await requireAdmin()
  const { error } = await supabaseAdmin
    .from('seminars')
    .update({ ...input, updated_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/seminars')
  revalidatePath('/seminars')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteSeminarsBulk(ids: string[]) {
  await requireAdmin()
  if (!ids.length) return { error: 'Tidak ada seminar dipilih' }

  // Cek apakah ada order aktif di seminar manapun
  const { data: schedules } = await supabaseAdmin
    .from('schedules').select('id, tickets(id)').in('seminar_id', ids)

  const ticketIds = (schedules as any[] ?? []).flatMap(s => s.tickets?.map((t: any) => t.id) ?? [])
  if (ticketIds.length > 0) {
    const { data: orderItems } = await supabaseAdmin
      .from('order_items').select('order_id').in('ticket_id', ticketIds)
    if (orderItems && orderItems.length > 0) {
      const orderIds = (orderItems as any[]).map(oi => oi.order_id)
      const { count } = await supabaseAdmin
        .from('orders').select('id', { count: 'exact', head: true })
        .in('id', orderIds).in('status', ['PAID', 'PENDING'])
      if (count && count > 0)
        return { error: `Tidak bisa hapus: ada ${count} pesanan aktif di seminar yang dipilih.` }
    }
  }

  const { error } = await supabaseAdmin.from('seminars').delete().in('id', ids)
  if (error) return { error: error.message }
  revalidatePath('/admin/seminars')
  revalidatePath('/seminars')
  revalidatePath('/', 'layout')
}

export async function deleteSeminar(id: string) {
  await requireAdmin()

  // Cek apakah ada order aktif untuk seminar ini
  const { data: schedules } = await supabaseAdmin
    .from('schedules')
    .select('id, tickets(id)')
    .eq('seminar_id', id)

  if (schedules && schedules.length > 0) {
    const ticketIds = (schedules as any[]).flatMap(s => s.tickets?.map((t: any) => t.id) ?? [])
    if (ticketIds.length > 0) {
      // Ambil order_items dulu, lalu cek status order-nya secara terpisah
      const { data: orderItems } = await supabaseAdmin
        .from('order_items')
        .select('order_id')
        .in('ticket_id', ticketIds)

      if (orderItems && orderItems.length > 0) {
        const orderIds = orderItems.map((oi: any) => oi.order_id)
        const { count } = await supabaseAdmin
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .in('id', orderIds)
          .in('status', ['PAID', 'PENDING'])

        if (count && count > 0) {
          return { error: `Seminar tidak bisa dihapus karena sudah ada ${count} pesanan aktif. Ubah status menjadi "Archived" untuk menyembunyikannya.` }
        }
      }
    }
  }

  const { error } = await supabaseAdmin.from('seminars').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/seminars')
  revalidatePath('/seminars')
  revalidatePath('/', 'layout')
  return { success: true }
}

// ── Schedule ──────────────────────────────────────────────────────────────────

const scheduleSchema = z.object({
  seminar_id: z.string().uuid(),
  start_date: z.string(),
  end_date: z.string(),
  city: z.string().min(2),
  venue: z.string().min(3),
  address: z.string().optional(),
})

export async function createSchedule(input: z.infer<typeof scheduleSchema>) {
  await requireAdmin()
  const data = scheduleSchema.parse(input)
  const { data: schedule, error } = await supabaseAdmin
    .from('schedules')
    .insert(data as any)
    .select('id')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/seminars')
  revalidatePath('/schedule')
  revalidatePath('/', 'layout')
  return { id: (schedule as any).id }
}

export async function deleteSchedule(id: string) {
  await requireAdmin()

  const { data: tickets } = await supabaseAdmin
    .from('tickets')
    .select('id')
    .eq('schedule_id', id)

  if (tickets && tickets.length > 0) {
    const ticketIds = (tickets as any[]).map((t) => t.id)
    const { data: orderItems } = await supabaseAdmin
      .from('order_items')
      .select('order_id')
      .in('ticket_id', ticketIds)

    if (orderItems && orderItems.length > 0) {
      const orderIds = (orderItems as any[]).map((oi) => oi.order_id)
      const { count } = await supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .in('id', orderIds)
        .in('status', ['PAID', 'PENDING'])

      if (count && count > 0) {
        return { error: `Jadwal tidak bisa dihapus karena sudah ada ${count} pesanan aktif. Arsipkan seminar jika ingin menyembunyikannya.` }
      }
    }
  }

  const { error } = await supabaseAdmin.from('schedules').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/seminars')
  revalidatePath('/schedule')
  revalidatePath('/', 'layout')
  return { success: true }
}

// ── Ticket ────────────────────────────────────────────────────────────────────

const ticketSchema = z.object({
  schedule_id: z.string().uuid(),
  name: z.string().min(2),
  price: z.number().int().positive(),
  early_bird_price: z.number().int().positive().optional(),
  early_bird_until: z.string().optional(),
  quota: z.number().int().positive(),
})

export async function createTicket(input: z.infer<typeof ticketSchema>) {
  await requireAdmin()
  const data = ticketSchema.parse(input)
  const { data: ticket, error } = await supabaseAdmin
    .from('tickets')
    .insert({ ...data, sold: 0 } as any)
    .select('id')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/seminars')
  revalidatePath('/schedule')
  revalidatePath('/', 'layout')
  return { id: (ticket as any).id }
}

export async function updateTicketQuota(id: string, quota: number) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('tickets').update({ quota } as never).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/seminars')
  revalidatePath('/schedule')
  return { success: true }
}

export async function deleteTicket(id: string) {
  await requireAdmin()

  // Cek apakah tiket dipakai di order yang masih aktif (PAID/PENDING)
  const { data: orderItems } = await supabaseAdmin
    .from('order_items')
    .select('order_id')
    .eq('ticket_id', id)

  if (orderItems && orderItems.length > 0) {
    const orderIds = (orderItems as any[]).map((oi) => oi.order_id)
    const { count } = await supabaseAdmin
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .in('id', orderIds)
      .in('status', ['PAID', 'PENDING'])

    if (count && count > 0) {
      return { error: `Tiket tidak bisa dihapus karena sudah ada ${count} pesanan aktif yang menggunakan tiket ini. Ubah kuota menjadi 0 untuk menutup penjualan.` }
    }
  }

  const { error } = await supabaseAdmin.from('tickets').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/seminars')
  revalidatePath('/schedule')
  revalidatePath('/', 'layout')
  return { success: true }
}
