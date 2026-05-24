'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@infrastructure/storage/db-client'
import { getServerSession } from '@infrastructure/session/auth-server'

export async function uploadAvatar(formData: FormData) {
  const session = await getServerSession()
  if (!session) return { error: 'Unauthorized' }

  const file = formData.get('file') as File
  if (!file) return { error: 'File tidak ditemukan' }
  if (file.size > 5 * 1024 * 1024) return { error: 'Maksimal 5MB' }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) return { error: 'Format tidak didukung. Gunakan JPG, PNG, atau WebP.' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${session.id}.${ext}`

  const { error: uploadErr } = await supabaseAdmin.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadErr) return { error: uploadErr.message }

  const { data } = supabaseAdmin.storage.from('avatars').getPublicUrl(path)
  const url = `${data.publicUrl}?t=${Date.now()}`

  await (supabaseAdmin as any).from('profiles').update({ avatar_url: url }).eq('user_id', session.id)

  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard')
  return { url }
}

export async function uploadSeminarThumbnail(seminarId: string, formData: FormData) {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  const file = formData.get('file') as File
  if (!file) return { error: 'File tidak ditemukan' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${seminarId}.${ext}`

  const { error: uploadErr } = await supabaseAdmin.storage
    .from('seminars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadErr) return { error: uploadErr.message }

  const { data } = supabaseAdmin.storage.from('seminars').getPublicUrl(path)
  const url = `${data.publicUrl}?t=${Date.now()}`

  await (supabaseAdmin as any).from('seminars').update({ thumbnail_url: url }).eq('id', seminarId)

  revalidatePath('/admin/seminars')
  return { url }
}


