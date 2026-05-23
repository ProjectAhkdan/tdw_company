import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi dan penggunaan cookie TDW Resources.',
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 prose prose-invert">
      <h1>Kebijakan Privasi</h1>
      <p>Terakhir diperbarui: Mei 2026</p>

      <h2>1. Informasi yang Kami Kumpulkan</h2>
      <p>
        Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, email, dan
        data pembayaran saat melakukan pembelian tiket seminar.
      </p>

      <h2>2. Penggunaan Informasi</h2>
      <p>
        Informasi digunakan untuk memproses transaksi, mengirim e-tiket, mengirim pengingat
        seminar, dan meningkatkan layanan kami.
      </p>

      <h2 id="cookies">3. Penggunaan Cookie</h2>
      <p>Kami menggunakan beberapa jenis cookie:</p>
      <ul>
        <li>
          <strong>Cookie Esensial</strong> — Diperlukan agar website berfungsi dengan benar
          (autentikasi, sesi, keamanan). Tidak dapat dinonaktifkan.
        </li>
        <li>
          <strong>Cookie Analitik</strong> — Membantu kami memahami cara pengunjung menggunakan
          website (halaman yang dikunjungi, durasi kunjungan). Dapat dinonaktifkan.
        </li>
        <li>
          <strong>Cookie Preferensi</strong> — Menyimpan preferensi Anda seperti bahasa dan tema.
          Dapat dinonaktifkan.
        </li>
      </ul>
      <p>
        Anda dapat mengubah preferensi cookie kapan saja melalui banner cookie di bagian bawah
        halaman, atau dengan menghapus data browser Anda.
      </p>

      <h2>4. Berbagi Data</h2>
      <p>
        pihak ketiga (Supabase, Resend) hanya untuk keperluan operasional.
      </p>

      <h2>5. Kontak</h2>
      <p>
        Pertanyaan terkait privasi dapat dikirim ke{' '}
        <a href="mailto:privacy@tdwresources.id">privacy@tdwresources.id</a>.
      </p>
    </main>
  )
}
