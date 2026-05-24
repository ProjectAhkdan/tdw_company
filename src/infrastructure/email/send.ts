import { Resend } from 'resend'

const FROM = process.env.EMAIL_FROM ?? 'TDW Resources <noreply@tdwresources.id>'

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.log(`[email] RESEND_API_KEY not set — skipping: ${subject} → ${to}`)
    return
  }
  const resend = new Resend(key)
  const { error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) console.error('[email] send failed:', error)
}

