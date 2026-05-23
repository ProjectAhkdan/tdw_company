import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card'
import Link from 'next/link'
import { RegisterForm } from './register-form'
import { getTranslations } from '@shared/lib/i18n'

export default async function RegisterPage() {
  const { t } = await getTranslations()
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-card-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t.auth.register_title}</CardTitle>
          <CardDescription>{t.auth.register_subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t.auth.have_account}{' '}
            <Link href="/login" className="text-primary hover:underline">{t.auth.login_btn}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
