'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/db/client'
import { getServerSession } from '@/lib/auth/server'

function generateCode(email: string): string {
  const base = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6)
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `${base}${rand}`
}

export async function registerAffiliate() {
  const session = await getServerSession()
  if (!session) return { error: 'Login diperlukan' }

  // Check if already registered
  const { data: existing } = await supabaseAdmin
    .from('affiliates')
    .select('id, code, is_approved')
    .eq('user_id', session.id)
    .single()

  if (existing) return { error: 'Sudah terdaftar sebagai afiliator', existing: existing as any }

  const code = generateCode(session.email)
  const { data, error } = await supabaseAdmin
    .from('affiliates')
    .insert({ user_id: session.id, code } as any)
    .select('id, code')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/dashboard/affiliate')
  return { success: true, code: (data as any).code }
}

export async function getAffiliateStats(userId: string) {
  const { data: affiliate } = await supabaseAdmin
    .from('affiliates')
    .select('id, code, is_approved, total_earned, total_withdrawn')
    .eq('user_id', userId)
    .single()

  if (!affiliate) return null
  const a = affiliate as any

  const { data: commissions } = await supabaseAdmin
    .from('commissions')
    .select('id, amount, status, created_at')
    .eq('affiliate_id', a.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: withdrawals } = await supabaseAdmin
    .from('withdrawals')
    .select('id, amount, status, created_at')
    .eq('affiliate_id', a.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const pending = ((commissions ?? []) as any[]).filter(c => c.status === 'PENDING').reduce((s: number, c: any) => s + c.amount, 0)

  return {
    affiliate: a,
    commissions: (commissions ?? []) as any[],
    withdrawals: (withdrawals ?? []) as any[],
    pendingAmount: pending,
  }
}

export async function requestWithdrawal(amount: number) {
  const session = await getServerSession()
  if (!session) return { error: 'Login diperlukan' }
  if (amount < 100000) return { error: 'Minimum penarikan Rp 100.000' }

  const { data: affiliate } = await supabaseAdmin
    .from('affiliates')
    .select('id, total_earned, total_withdrawn, is_approved')
    .eq('user_id', session.id)
    .single()

  if (!affiliate) return { error: 'Belum terdaftar sebagai afiliator' }
  const a = affiliate as any
  if (!a.is_approved) return { error: 'Akun afiliasi belum disetujui admin' }

  const available = a.total_earned - a.total_withdrawn
  if (amount > available) return { error: `Saldo tidak cukup. Tersedia: Rp ${available.toLocaleString('id-ID')}` }

  const { error } = await supabaseAdmin
    .from('withdrawals')
    .insert({ affiliate_id: a.id, amount, status: 'PENDING' } as any)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/affiliate')
  return { success: true }
}

// Admin: approve/reject affiliate
export async function approveAffiliate(affiliateId: string, approve: boolean) {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  // @ts-expect-error untyped supabase client
  await supabaseAdmin.from('affiliates').update({ is_approved: approve }).eq('id', affiliateId)
  revalidatePath('/admin/affiliates')
  return { success: true }
}

// Admin: process withdrawal
export async function processWithdrawal(withdrawalId: string, status: 'COMPLETED' | 'REJECTED') {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  const { data: wd } = await supabaseAdmin
    .from('withdrawals')
    .select('affiliate_id, amount')
    .eq('id', withdrawalId)
    .single()

  if (!wd) return { error: 'Not found' }
  const w = wd as any

  // @ts-expect-error untyped supabase client
  await supabaseAdmin.from('withdrawals').update({ status, processed_at: new Date().toISOString() }).eq('id', withdrawalId)

  if (status === 'COMPLETED') {
    const { data: aff } = await supabaseAdmin.from('affiliates').select('total_withdrawn').eq('id', w.affiliate_id).single()
    if (aff) {
      // @ts-expect-error untyped supabase client
      await supabaseAdmin.from('affiliates').update({ total_withdrawn: (aff as any).total_withdrawn + w.amount }).eq('id', w.affiliate_id)
    }
  }

  revalidatePath('/admin/affiliates')
  return { success: true }
}
