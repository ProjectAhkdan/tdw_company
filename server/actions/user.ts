'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/db/client'
import { getServerSession } from '@/lib/auth/server'

export async function updateUserRole(userId: string, role: 'USER' | 'AFFILIATE' | 'ADMIN') {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }
  if (session.id === userId) return { error: 'Tidak bisa mengubah role sendiri' }

  const { error } = await (supabaseAdmin as any)
    .from('users')
    .update({ role })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}
