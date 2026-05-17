const GOLD = '#C9A84C'
const BG = '#0D0D0D'
const CARD = '#161616'
const TEXT = '#E5E5E5'
const MUTED = '#888888'

function base(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${previewText}</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:Arial,sans-serif;color:${TEXT};">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:24px;font-weight:bold;color:${GOLD};">TDW Resources</span>
    </div>
    <!-- Card -->
    <div style="background:${CARD};border-radius:16px;padding:32px;border:1px solid #222;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;font-size:12px;color:${MUTED};">
      © 2026 TDW Resources · <a href="https://tdwresources.id" style="color:${GOLD};text-decoration:none;">tdwresources.id</a>
    </div>
  </div>
</body>
</html>`
}

function btn(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:${GOLD};color:#0D0D0D;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;margin-top:24px;">${text}</a>`
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:${MUTED};font-size:13px;width:40%;">${label}</td>
    <td style="padding:8px 0;color:${TEXT};font-size:13px;font-weight:bold;">${value}</td>
  </tr>`
}

// ── Templates ─────────────────────────────────────────────────────────────────

export interface OrderEmailData {
  customerName: string
  seminarTitle: string
  ticketType: string
  date: string
  venue: string
  city: string
  quantity: number
  totalAmount: number
  orderId: string
  ticketDownloadUrl?: string
}

export function orderConfirmationEmail(data: OrderEmailData): { subject: string; html: string } {
  const subject = `Konfirmasi Pesanan — ${data.seminarTitle}`
  const html = base(`
    <h2 style="margin:0 0 8px;font-size:22px;color:${TEXT};">Pesanan Diterima ✅</h2>
    <p style="margin:0 0 24px;color:${MUTED};font-size:14px;">Halo ${data.customerName}, pesanan Anda sedang diproses.</p>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Seminar', data.seminarTitle)}
      ${row('Tipe Tiket', data.ticketType)}
      ${row('Tanggal', data.date)}
      ${row('Lokasi', `${data.venue}, ${data.city}`)}
      ${row('Jumlah', `${data.quantity} tiket`)}
      ${row('Total', `Rp ${data.totalAmount.toLocaleString('id-ID')}`)}
      ${row('Order ID', data.orderId)}
    </table>
    <div style="margin-top:24px;padding:16px;background:#0D0D0D;border-radius:10px;font-size:13px;color:${MUTED};">
      Tiket akan dikirim ke email ini setelah pembayaran dikonfirmasi.
    </div>
    ${btn('Lihat Dashboard', `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)}
  `, subject)
  return { subject, html }
}

export function ticketSuccessEmail(data: OrderEmailData): { subject: string; html: string } {
  const subject = `Tiket Anda Siap — ${data.seminarTitle}`
  const html = base(`
    <h2 style="margin:0 0 8px;font-size:22px;color:${TEXT};">Pembayaran Berhasil 🎉</h2>
    <p style="margin:0 0 24px;color:${MUTED};font-size:14px;">Halo ${data.customerName}, tiket Anda sudah siap!</p>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Seminar', data.seminarTitle)}
      ${row('Tipe Tiket', data.ticketType)}
      ${row('Tanggal', data.date)}
      ${row('Lokasi', `${data.venue}, ${data.city}`)}
      ${row('Jumlah', `${data.quantity} tiket`)}
    </table>
    <div style="margin-top:24px;padding:16px;background:#0D0D0D;border-radius:10px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:${MUTED};">Tunjukkan tiket ini saat registrasi</p>
    </div>
    ${data.ticketDownloadUrl ? btn('Unduh E-Ticket PDF', data.ticketDownloadUrl) : btn('Lihat Tiket', `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tickets`)}
  `, subject)
  return { subject, html }
}

export function paymentFailedEmail(data: { customerName: string; seminarTitle: string; orderId: string }): { subject: string; html: string } {
  const subject = `Pembayaran Gagal — ${data.seminarTitle}`
  const html = base(`
    <h2 style="margin:0 0 8px;font-size:22px;color:${TEXT};">Pembayaran Gagal ❌</h2>
    <p style="margin:0 0 24px;color:${MUTED};font-size:14px;">Halo ${data.customerName}, pembayaran untuk pesanan <strong style="color:${TEXT};">${data.orderId}</strong> tidak berhasil.</p>
    <p style="color:${MUTED};font-size:14px;">Silakan coba lagi atau hubungi tim kami jika membutuhkan bantuan.</p>
    ${btn('Coba Lagi', `${process.env.NEXT_PUBLIC_APP_URL}/seminars`)}
  `, subject)
  return { subject, html }
}

export function seminarReminderEmail(data: { customerName: string; seminarTitle: string; date: string; venue: string; city: string; ticketUrl: string }): { subject: string; html: string } {
  const subject = `Pengingat: ${data.seminarTitle} besok!`
  const html = base(`
    <h2 style="margin:0 0 8px;font-size:22px;color:${TEXT};">Seminar Anda Besok! 📅</h2>
    <p style="margin:0 0 24px;color:${MUTED};font-size:14px;">Halo ${data.customerName}, jangan lupa seminar Anda besok.</p>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Seminar', data.seminarTitle)}
      ${row('Tanggal', data.date)}
      ${row('Lokasi', `${data.venue}, ${data.city}`)}
    </table>
    <div style="margin-top:24px;padding:16px;background:#0D0D0D;border-radius:10px;font-size:13px;color:${MUTED};">
      💡 Tips: Hadir 30 menit lebih awal untuk registrasi. Bawa e-ticket Anda.
    </div>
    ${btn('Unduh Tiket', data.ticketUrl)}
  `, subject)
  return { subject, html }
}
