import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card'
import Link from 'next/link'
import { LoginForm } from './login-form'
import { getTranslations } from '@shared/lib/i18n'

export default async function LoginPage() {
  const { t } = await getTranslations()
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-card-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t.auth.login_title}</CardTitle>
          <CardDescription>{t.auth.login_subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            {t.auth.no_account}{' '}
            <Link href="/register" className="text-primary hover:underline">{t.auth.register_btn}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
