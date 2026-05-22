'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseBrowser } from '@infrastructure/session/auth-client'
import { PillButton } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Card, CardContent } from '@shared/ui/card'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Nomor HP tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type RegisterInput = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName, phone: data.phone },
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      })
      if (error) {
        toast.error(error.message)
        return
      }
      setSuccess(true)
    } catch {
      toast.error('Terjadi kesalahan, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md border-card-border bg-card">
          <CardContent className="py-8 text-center space-y-2">
            <h2 className="text-xl font-bold">Cek Email Anda</h2>
            <p className="text-muted-foreground">
              Link verifikasi telah dikirim ke email Anda. Klik link tersebut untuk mengaktifkan akun.
            </p>
            <p className="text-sm text-muted-foreground">
              Sudah verifikasi?{' '}
              <Link href="/login" className="text-primary hover:underline">Masuk</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nama Lengkap</Label>
        <Input id="fullName" placeholder="Nama lengkap" {...register('fullName')} />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="nama@email.com" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Nomor HP</Label>
        <Input id="phone" placeholder="08xxxxxxxxxx" {...register('phone')} />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <PillButton
        type="submit"
        className="w-full"
        disabled={loading}
        pillColor="oklch(0.78 0.16 55)"
        textColor="oklch(0.08 0 0)"
        hoverCircleColor="#120F17"
        hoverTextColor="oklch(0.78 0.16 55)"
      >
        {loading ? 'Memproses...' : 'Daftar'}
      </PillButton>
    </form>
  )
}
