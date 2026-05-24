'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@infrastructure/storage/db-client'
import { getServerSession } from '@infrastructure/session/auth-server'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Nomor HP tidak valid').nullable().optional(),
  city: z.string().min(2, 'Wajib diisi').nullable().optional(),
  occupation: z.string().nullable().optional(),
  notify_email: z.boolean().optional(),
  notify_wa: z.boolean().optional(),
})

export async function updateProfile(input: z.infer<typeof profileSchema>) {
  const session = await getServerSession()
  if (!session) return { error: 'Unauthorized' }

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await (supabaseAdmin as any)
    .from('profiles')
    .update(parsed.data)
    .eq('user_id', session.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/profile')
  return { success: true }
}


