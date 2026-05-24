import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card'
import Link from 'next/link'
import { RegisterForm } from './register-form'

export default async function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-card-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Daftar</CardTitle>
          <CardDescription>Buat akun TDW Resources baru</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary hover:underline">Masuk</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


