import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card'
import Link from 'next/link'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-card-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Masuk</CardTitle>
          <CardDescription>Masuk ke akun TDW Resources Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
