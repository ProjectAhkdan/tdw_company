'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseBrowser } from '@infrastructure/session/auth-client'
import { PillButton } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginInput = z.infer<typeof loginSchema>

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      const { error: signInError } = await supabase.auth.signInWithPassword(data)
      if (signInError) {
        toast.error(signInError.message === 'Invalid login credentials' ? 'Email atau password salah' : signInError.message)
        return
      }
      const { data: role } = await supabase.rpc('get_my_role')
      const destination = role === 'ADMIN' ? '/admin' : '/dashboard'
      window.location.href = `/callback?_login=1&next=${destination}`
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  async function loginWithGoogle() {
    try {
      const supabase = createSupabaseBrowser()
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/callback` },
      })
    } catch {
      toast.error('Gagal login dengan Google')
    }
  }

  return (
    <>
      <PillButton
        className="w-full"
        onClick={loginWithGoogle}
        pillColor="#1a1a2e"
        textColor="#fff"
        hoverCircleColor="#D9F25D"
        hoverTextColor="#fff"
      >
        Masuk dengan Google
      </PillButton>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">atau</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="nama@email.com" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <PillButton
          type="submit" className="w-full" disabled={loading}
          pillColor="#D9F25D" textColor="#0A0A0A"
          hoverCircleColor="#120F17" hoverTextColor="#D9F25D"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </PillButton>
      </form>
    </>
  )
}


