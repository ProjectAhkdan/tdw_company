# TASK.md — Sprint Backlog Pembangunan Ulang TDW Resources

> **Sumber kebenaran tunggal** untuk semua tugas pengembangan dari kickoff hingga peluncuran produksi.
> Perbarui status tugas secara langsung seiring pekerjaan berlangsung. Jangan menambahkan tugas baru tanpa estimasi dan penugasan fase.

---

## Legenda

### Status

| Simbol | Status | Arti |
|--------|--------|------|
| `[ ]` | **TODO** | Belum dimulai |
| `[~]` | **IN_PROGRESS** | Sedang dikerjakan |
| `[x]` | **DONE** | Selesai dan terverifikasi |
| `[!]` | **BLOCKED** | Tidak bisa dilanjutkan — ada dependensi eksternal atau keputusan yang diperlukan |
| `[-]` | **CANCELLED** | Dihapus dari cakupan |

### Prioritas

| Tag | Level | Arti |
|-----|-------|------|
| `[P1]` | **Kritis** | Menghalangi peluncuran atau tugas lain. Harus dikerjakan. |
| `[P2]` | **Penting** | Fitur atau peningkatan kualitas yang signifikan. Sebaiknya dikerjakan. |
| `[P3]` | **Bagus jika ada** | Peningkatan. Kerjakan jika waktu memungkinkan. |

### Kunci Estimasi
`~1h` = hingga 1 jam · `~2h` = 1–2 jam · `~3h` = 2–3 jam · `~4h` = 3–4 jam

---

## Fase 0: Persiapan Proyek

> **Tujuan:** Repositori berfungsi dengan semua tooling terkonfigurasi, CI/CD aktif, proyek Supabase siap.
> **Estimasi:** ~2 hari

### Repositori & Tooling

- [x] **Inisialisasi proyek Next.js 16.2** dengan TypeScript strict mode, App Router, Turbopack
- [x] **Konfigurasi TypeScript** — strict mode, path aliases (`@/*`), `verbatimModuleSyntax`
- [x] **Install dan konfigurasi Tailwind CSS v4** — `@import "tailwindcss"` di `globals.css`, tanpa `tailwind.config.js`
- [x] **Inisialisasi shadcn/ui** — style new-york, kompatibel Tailwind v4, sistem warna OKLCH
- [ ] **Konfigurasi ESLint** — `eslint-config-next`, `@typescript-eslint/strict`, aturan urutan import
- [ ] **Konfigurasi Prettier** — dengan `prettier-plugin-tailwindcss` untuk pengurutan class
- [ ] **Setup Husky + lint-staged** — pre-commit: ESLint + Prettier + `tsc --noEmit`
- [x] **Konfigurasi `next.config.ts`** — security headers, image `remotePatterns` (Supabase Storage), bundle analyzer

### Supabase & Database

- [x] **Buat proyek Supabase** — project `rgwquajbnjghbyzyxwxc`, region Singapore
- [-] **Inisialisasi Prisma 7** — DIBATALKAN. Project pakai Supabase client langsung, Prisma dihapus dari stack.
- [x] **Konfigurasi environment variables** — `.env.local` dengan semua kunci Supabase; `.env.example` tersedia

### CI/CD & Hosting

- [ ] **Hubungkan repo ke Vercel** — tautkan repo GitHub, konfigurasi pengaturan proyek, set Node.js 22
  `~1h` · [P1]

- [ ] **Konfigurasi environment variables Vercel** — semua variabel dari `.env.example` diatur di dashboard Vercel (preview + production)
  `~1h` · [P1] · *(membutuhkan: Hubungkan repo ke Vercel)*

- [ ] **Setup GitHub Actions** — workflow CI: `tsc --noEmit`, ESLint, Prisma validate pada setiap PR
  `~2h` · [P2] · *(membutuhkan: Hubungkan repo ke Vercel)*

- [ ] **Konfigurasi custom domain** — `tdwresources.id` → Vercel, SSL otomatis
  `~1h` · [P1] · *(membutuhkan: Hubungkan repo ke Vercel)*

**Total Fase 0: ~14 tugas · ~16h**

---


## Fase 1: Fondasi

> **Tujuan:** Auth berfungsi end-to-end, skema DB final dan termigrasi, fondasi UI siap, semua route terlindungi.
> **Estimasi:** ~5 hari

### Sistem Desain & Layout

- [x] **Definisikan token warna OKLCH** di `globals.css` — dark luxury theme, gold accent `oklch(0.78 0.16 55)`
- [x] **Install komponen dasar shadcn/ui** — Button, Card, Input, Label, Badge, Separator, Skeleton, Sheet, Dialog, DropdownMenu, Avatar, Tabs, Select, Checkbox, Textarea, Accordion, Switch
- [x] **Install Sonner** dan konfigurasi di root layout
- [x] **Buat root layout** (`app/layout.tsx`) — Inter + Playfair Display fonts, Sonner Toaster, metadata defaults
- [x] **Buat komponen Navbar** — glassmorphism on scroll, active link gold, animated mobile overlay, CTA button
- [ ] **Buat komponen Footer** — links, ikon media sosial, hak cipta, kolom pendaftaran newsletter `[P2]`
- [x] **Buat layout route group** — `(marketing)`, `(auth)`, `(dashboard)`, `(admin)` dengan wrapper yang sesuai
- [ ] **Buat komponen UI bersama** — `PageHeader`, `Section`, `Container`, `EmptyState`, `LoadingSpinner` `[P2]`

### Autentikasi

- [x] **Konfigurasi Supabase Auth** — Email (password), Google OAuth diaktifkan
- [x] **Implementasi `lib/auth/server.ts`** — `createServerClient()`, `getServerSession()`, `requireRole()`
- [x] **Implementasi `lib/auth/client.ts`** — `createSupabaseBrowser()` untuk client components
- [x] **Implementasi `app/proxy.ts`** — proteksi route + enforce role dari `public.users`
- [x] **Buat halaman Login** — form email/password + Google OAuth, validasi RHF + Zod
- [x] **Buat halaman Register** — nama, email, password, telepon; trigger auto-create user di DB
- [x] **Buat handler OAuth callback** (`app/(auth)/callback/route.ts`) — sync user ke `public.users`, redirect by role
- [ ] **Buat halaman Lupa Password** `[P2]`
- [ ] **Buat halaman Reset Password** `[P2]`
- [ ] **Tulis Server Actions auth** (`server/actions/auth.ts`) — `registerUser()`, `updatePassword()`, `signOut()` `[P1]`

### Skema Database & Migrasi

- [x] **Tulis skema database** — semua tabel via SQL migrations di `supabase/migrations/` (tanpa Prisma)
- [x] **Jalankan migrasi ke Supabase production** — semua migration sudah di-push
- [x] **Buat `lib/supabase/client.ts`** — browser client (anon key) + `lib/db/client.ts` (service role)
- [x] **Tulis query helpers** (`lib/supabase/queries.ts`) — semua query dengan TypeScript types
- [x] **Aktifkan RLS dan tulis kebijakan untuk `users` dan `profiles`** — trigger auto-create + policies
- [ ] **Aktifkan RLS untuk `orders`, `order_items`, `payments`** `[P1]`
- [ ] **Aktifkan RLS untuk `affiliates`, `commissions`, `withdrawals`** `[P1]`
- [x] **RLS untuk tabel publik** — `seminars`, `schedules`, `tickets`, `categories`, `testimonials` (public read)
- [ ] **Buat bucket Supabase Storage** — `product-images`, `avatars`, `documents`, `promo-assets`, `certificates` `[P1]`
- [x] **Seed data** — categories, seminars, schedules, tickets, testimonials, faqs, pricing, stats via SQL

**Total Fase 1: ~30 tugas · ~55h**



---

## Fase 2: Fitur Inti

> **Tujuan:** Website publik berfungsi penuh — pengguna dapat menjelajahi seminar dan menyelesaikan pembelian.
> **Estimasi:** ~10 hari

### Halaman Utama

- [x] **Buat Homepage** (`app/(marketing)/page.tsx`) — Hero fullscreen, Why Us, Process, Seminars, Testimonials, Pricing, FAQ, CTA — data dari Supabase
- [x] **Buat halaman Jadwal** (`app/(marketing)/schedule/page.tsx`) — server fetch + client filter bulan/kota/view toggle
- [x] **Buat halaman About** (`app/(marketing)/about/page.tsx`) — storytelling layout, stats, visi/misi, team, media coverage
- [ ] **Buat halaman Daftar Seminar** (`app/(marketing)/seminars/page.tsx`) — grid, filter `[P1]`
- [ ] **Buat halaman Detail Seminar** (`app/(marketing)/seminars/[slug]/page.tsx`) — pemilih jadwal + tiket `[P1]`

### Katalog Seminar

- [ ] **Buat `server/queries/seminars.ts`** — `getFeaturedSeminars()`, `getSeminars()` (dengan filter), `getSeminarBySlug()`, semua dengan `unstable_cache` + tags
  `~3h` · [P1] · *(membutuhkan: Buat lib/db/client.ts, Tulis data seed)*

- [ ] **Buat halaman Daftar Seminar** (`app/(marketing)/seminars/page.tsx`) — layout grid, server-rendered dengan search params untuk filter
  `~3h` · [P1] · *(membutuhkan: Buat server/queries/seminars.ts)*

- [ ] **Bangun komponen SeminarCard** — thumbnail, judul, badge kategori, tanggal terdekat, kota, harga, sisa kursi, CTA
  `~2h` · [P1] · *(membutuhkan: Buat halaman Daftar Seminar)*

- [ ] **Bangun komponen SeminarFilter** — tab kategori, select kota, pemilih bulan; memperbarui URL search params (tidak perlu client state)
  `~3h` · [P2] · *(membutuhkan: Buat halaman Daftar Seminar)*

- [ ] **Buat halaman Detail Seminar** (`app/(marketing)/seminars/[slug]/page.tsx`) — metadata dinamis, JSON-LD Event schema
  `~2h` · [P1] · *(membutuhkan: Buat server/queries/seminars.ts)*

- [ ] **Bangun Detail Seminar — bagian Hero** — judul, kategori, tanggal/kota, harga, counter kursi (Realtime), sidebar CTA sticky
  `~3h` · [P1] · *(membutuhkan: Buat halaman Detail Seminar)*

- [ ] **Bangun Detail Seminar — Accordion kurikulum** — shadcn Accordion, breakdown per sesi
  `~2h` · [P2] · *(membutuhkan: Buat halaman Detail Seminar)*

- [ ] **Bangun Detail Seminar — bagian Pembicara** — kartu profil TDW, bio, kredensial
  `~2h` · [P1] · *(membutuhkan: Buat halaman Detail Seminar)*

- [ ] **Bangun Detail Seminar — Pemilih jadwal** — daftar tanggal/kota tersedia untuk seminar ini, pemilihan memicu tampilan tier tiket
  `~3h` · [P1] · *(membutuhkan: Buat halaman Detail Seminar)*

- [ ] **Bangun Detail Seminar — Kartu tier tiket** — perbandingan Regular/VIP/VVIP, badge early bird + countdown, pemilih kuantitas
  `~3h` · [P1] · *(membutuhkan: Bangun Detail Seminar — Pemilih jadwal)*

- [ ] **Implementasi hook `useRealtimeSeats`** — subscription Supabase Realtime pada tabel `tickets` untuk jumlah kursi langsung
  `~2h` · [P2] · *(membutuhkan: Bangun Detail Seminar — Kartu tier tiket)*

- [ ] **Buat halaman Jadwal** (`app/(marketing)/schedule/page.tsx`) — toggle daftar + kalender, filter berdasarkan kategori/kota/bulan
  `~4h` · [P1] · *(membutuhkan: Buat server/queries/seminars.ts)*

### Checkout & Pembayaran

- [ ] **Buat `checkout-store.ts`** (Zustand) — step (1/2/3), selectedTicketId, quantity, affiliateCode, snapToken
  `~1h` · [P1]

- [ ] **Buat halaman Checkout** (`app/checkout/page.tsx`) — layout 3 langkah, auth guard (redirect ke login jika guest)
  `~2h` · [P1] · *(membutuhkan: Buat checkout-store.ts)*

- [ ] **Bangun Checkout Langkah 1** — pemilihan jadwal + tier tiket, pemilih kuantitas, ringkasan pesanan
  `~3h` · [P1] · *(membutuhkan: Buat halaman Checkout)*

- [ ] **Bangun Checkout Langkah 2** — form data peserta (RHF v8 + Zod), kolom kode afiliasi (auto-fill dari cookie jika via link ref)
  `~3h` · [P1] · *(membutuhkan: Bangun Checkout Langkah 1)*

- [ ] **Bangun Checkout Langkah 3** — pemilih metode pembayaran (Bank Transfer, QRIS, GoPay, Credit Card), total pesanan, checkbox S&K
  `~2h` · [P1] · *(membutuhkan: Bangun Checkout Langkah 2)*

- [ ] **Tulis `server/actions/checkout.ts`** — `createOrder()`: validasi kursi, buat Order + OrderItem di DB, panggil Midtrans, kembalikan `snapToken`
  `~4h` · [P1] · *(membutuhkan: Buat halaman Checkout, Tulis validator Zod)*
  > Tahan kursi selama 15 menit via `expiresAt`. Lepaskan saat kedaluwarsa via cron.

- [ ] **Implementasi `lib/midtrans.ts`** — `createTransaction()`, `verifySignature()`, pemetaan metode pembayaran
  `~3h` · [P1] · *(membutuhkan: Tulis server/actions/checkout.ts)*

- [ ] **Integrasi Midtrans Snap** — dynamic import `midtrans-client`, buka popup Snap dari client saat `snapToken` diterima
  `~3h` · [P1] · *(membutuhkan: Implementasi lib/midtrans.ts)*
  > Muat Midtrans Snap JS via `next/script` strategy `lazyOnload` hanya di halaman checkout.

- [ ] **Implementasi handler webhook Midtrans** (`app/api/webhooks/midtrans/route.ts`) — verifikasi signature, perbarui status Order + Payment, trigger aksi pasca-pembayaran
  `~4h` · [P1] · *(membutuhkan: Implementasi lib/midtrans.ts)*

- [ ] **Buat halaman Sukses Pesanan** (`app/checkout/success/page.tsx`) — ringkasan pesanan, CTA unduh tiket, link "Tambah ke Kalender", tombol bagikan
  `~2h` · [P1] · *(membutuhkan: Implementasi handler webhook Midtrans)*

- [ ] **Implementasi pembersihan pesanan kedaluwarsa** — Vercel Cron (`/api/cron/expire-orders`) setiap 15 menit: batalkan pesanan PENDING yang melewati `expiresAt`, lepaskan jumlah kursi
  `~2h` · [P2] · *(membutuhkan: Tulis server/actions/checkout.ts)*

- [ ] **Setup Cache Components** — terapkan `use cache` ke: `FeaturedSeminars`, `TestimonialsSection`, `ScheduleList`, `SeminarGrid`; konfigurasi tag revalidasi
  `~2h` · [P1] · *(membutuhkan: Bangun bagian Seminar Unggulan, Buat halaman Daftar Seminar)*

**Total Fase 2: ~30 tugas · ~72h**



---

## Fase 3: Fitur Pengguna

> **Tujuan:** Pengguna yang login memiliki pengalaman self-service yang lengkap. Sistem afiliasi beroperasi.
> **Estimasi:** ~7 hari

### Dashboard Pengguna

- [x] **Buat layout Dashboard** (`app/(dashboard)/layout.tsx`) — premium sidebar, bottom nav mobile
- [x] **Buat halaman utama Dashboard** — stats, tiket aktif, rekomendasi seminar
- [x] **Buat halaman Tiket** — tab aktif/riwayat, QR placeholder, tombol unduh
- [x] **Buat halaman Profil** — edit form RHF+Zod, custom toggle notifikasi
- [ ] **Implementasi pembuatan PDF e-ticket** `[P1]`
- [ ] **Buat halaman Riwayat Pesanan** `[P2]`
- [ ] **Buat halaman Dashboard Afiliasi** `[P1]`

### Sistem Afiliasi

- [ ] **Buat `server/queries/affiliates.ts`** — `getAffiliateStats()`, `getCommissions()` (paginasi), `getWithdrawals()`
  `~2h` · [P1] · *(membutuhkan: Jalankan migrasi Prisma awal)*

- [ ] **Buat halaman Pendaftaran Afiliasi** — form: nama lengkap, detail bank, platform/channel; Server Action membuat record `Affiliate` (menunggu persetujuan)
  `~3h` · [P1] · *(membutuhkan: Buat layout Dashboard)*

- [ ] **Implementasi pelacakan link afiliasi** — di `proxy.ts`: deteksi param `?ref=CODE`, set cookie 30 hari `tdw_ref`; di checkout Langkah 2: auto-fill kode afiliasi dari cookie
  `~2h` · [P1] · *(membutuhkan: Implementasi app/proxy.ts)*

- [ ] **Implementasi perhitungan komisi** — di webhook Midtrans: setelah `PAID`, cari `affiliateCode` pada pesanan → temukan `CommissionRate` untuk seminar → buat record `Commission`
  `~2h` · [P1] · *(membutuhkan: Implementasi handler webhook Midtrans)*

- [ ] **Buat halaman Dashboard Afiliasi** — kartu statistik (total klik, konversi, komisi pending, komisi dibayar), grafik performa 30 hari (Recharts)
  `~4h` · [P1] · *(membutuhkan: Buat server/queries/affiliates.ts, Buat halaman Pendaftaran Afiliasi)*

- [ ] **Bangun tabel Komisi** — paginasi, kolom: tanggal, seminar, order ID, jumlah, badge status
  `~2h` · [P2] · *(membutuhkan: Buat halaman Dashboard Afiliasi)*

- [ ] **Buat halaman Permintaan Penarikan** — tampilan saldo tersedia, input jumlah (min Rp 100.000), konfirmasi detail bank, submit → buat record `Withdrawal`
  `~3h` · [P1] · *(membutuhkan: Buat halaman Dashboard Afiliasi)*

- [ ] **Bangun bagian Aset Promo** — grid banner yang bisa diunduh (1:1, 16:9, Story), template caption; file disajikan dari bucket Storage `promo-assets`
  `~2h` · [P3] · *(membutuhkan: Buat halaman Dashboard Afiliasi)*

### Email Transaksional

- [ ] **Setup Resend** — install `resend`, buat wrapper `lib/email/send.ts`, verifikasi domain `tdwresources.id` di dashboard Resend
  `~1h` · [P1]*

- [ ] **Buat template email Selamat Datang** (`emails/welcome.tsx`) — React Email, branding TDW, CTA login
  `~2h` · [P2] · *(membutuhkan: Setup Resend)*

- [ ] **Buat template email Konfirmasi Pesanan + E-Ticket** (`emails/ticket-confirmation.tsx`) — tabel ringkasan pesanan, lampiran PDF tiket, link tambah-ke-kalender
  `~3h` · [P1] · *(membutuhkan: Setup Resend, Implementasi pembuatan PDF e-ticket)*

- [ ] **Buat template email Pengingat Seminar** (`emails/seminar-reminder.tsx`) — detail acara, link peta venue, apa yang dibawa, CTA unduh ulang tiket
  `~2h` · [P1] · *(membutuhkan: Setup Resend)*

- [ ] **Buat email Notifikasi Komisi Afiliasi** (`emails/affiliate-commission.tsx`) — jumlah komisi, nama seminar, total berjalan, CTA dashboard
  `~1h` · [P2] · *(membutuhkan: Setup Resend)*

- [ ] **Implementasi cron job pengingat** — Vercel Cron: pengingat H-7 dan H-1; query jadwal, kirim batch via Resend
  `~3h` · [P1] · *(membutuhkan: Buat template email Pengingat Seminar)*

### Notifikasi Realtime

- [ ] **Buat komponen bel Notifikasi** — badge jumlah belum dibaca, daftar dropdown, tandai-sudah-dibaca saat dibuka; subscription Supabase Realtime pada tabel `notifications`
  `~3h` · [P3] · *(membutuhkan: Buat layout Dashboard)*

- [ ] **Tulis helper insert notifikasi** — `createNotification(userId, type, title, body, metadata)` dipanggil dari webhook dan cron jobs
  `~1h` · [P2] · *(membutuhkan: Implementasi handler webhook Midtrans)*

**Total Fase 3: ~25 tugas · ~57h**



---

## Fase 4: Dashboard Admin

> **Tujuan:** Tim internal dapat mengelola semua konten, pesanan, pengguna, dan keuangan tanpa menyentuh kode.
> **Estimasi:** ~7 hari

### Fondasi Admin

- [x] **Buat layout Admin** (`app/(admin)/layout.tsx`) — premium dark sidebar, role guard via `proxy.ts`
- [x] **Buat halaman Ikhtisar Admin** — KPI cards dari Supabase, tabel pesanan terbaru
- [x] **Buat `lib/supabase/queries.ts`** — `getAdminStats()`, `getAdminOrders()`, `getAdminUsers()`
- [x] **Buat halaman Pesanan Admin** — tabel filter search/status, data dari Supabase
- [x] **Buat halaman Pengguna Admin** — tabel filter search/role, data dari Supabase
- [ ] **Buat halaman Daftar Seminar Admin** — CRUD seminar `[P1]`
- [ ] **Buat form Seminar Baru/Edit** `[P1]`
- [ ] **Buat halaman Afiliasi Admin** `[P1]`
- [ ] **Buat halaman Laporan** `[P2]`

### Manajemen Seminar

- [ ] **Buat halaman Daftar Seminar Admin** — tabel dengan judul, kategori, badge status, jumlah jadwal, aksi (edit, arsip, lihat)
  `~2h` · [P1] · *(membutuhkan: Buat layout Admin)*

- [ ] **Buat form Seminar Baru** (`app/(admin)/admin/seminars/new/page.tsx`) — RHF v8 + Zod: judul, slug (auto-generate), kategori, deskripsi singkat, deskripsi lengkap (Tiptap atau textarea), field meta
  `~4h` · [P1] · *(membutuhkan: Buat halaman Daftar Seminar Admin)*

- [ ] **Implementasi upload thumbnail di form Seminar** — drag-and-drop atau input file, upload ke bucket Storage `product-images`, preview, simpan URL publik
  `~3h` · [P1] · *(membutuhkan: Buat form Seminar Baru)*

- [ ] **Buat halaman Edit Seminar** — form yang sudah terisi, sama seperti Seminar Baru; toggle publish/draft/arsip
  `~2h` · [P1] · *(membutuhkan: Buat form Seminar Baru)*

- [ ] **Tulis `server/actions/seminar.ts`** — `createSeminar()`, `updateSeminar()`, `publishSeminar()`, `archiveSeminar()`; masing-masing memanggil `revalidateTag('seminars')` + `revalidatePath`
  `~3h` · [P1] · *(membutuhkan: Buat form Seminar Baru)*

- [ ] **Buat UI manajemen Jadwal** — bersarang di halaman edit seminar: tambah/edit/hapus jadwal (tanggal, kota, venue); form inline
  `~3h` · [P1] · *(membutuhkan: Buat halaman Edit Seminar)*

- [ ] **Buat UI manajemen Tier Tiket** — per jadwal: tambah/edit tier tiket (nama, harga, harga early bird/tanggal, kuota)
  `~3h` · [P1] · *(membutuhkan: Buat UI manajemen Jadwal)*

- [ ] **Tulis `server/actions/schedule.ts`** — `createSchedule()`, `updateSchedule()`, `deleteSchedule()`, `createTicket()`, `updateTicket()`
  `~2h` · [P1] · *(membutuhkan: Buat UI manajemen Jadwal)*

### Manajemen Pesanan & Pengguna

- [ ] **Buat halaman Pesanan Admin** — tabel yang bisa difilter: order ID, pengguna, seminar, jumlah, status, metode pembayaran, tanggal; pencarian berdasarkan email/order ID
  `~3h` · [P1] · *(membutuhkan: Buat layout Admin, Buat server/queries/admin.ts)*

- [ ] **Buat halaman Detail Pesanan** — info pesanan lengkap, detail pembayaran, data peserta, override status manual (untuk pembayaran offline)
  `~2h` · [P2] · *(membutuhkan: Buat halaman Pesanan Admin)*

- [ ] **Implementasi ekspor daftar peserta** — per seminar/jadwal: ekspor CSV dengan nama, email, telepon, tipe tiket; `server/actions/export.ts`
  `~2h` · [P1] · *(membutuhkan: Buat halaman Pesanan Admin)*

- [ ] **Buat halaman Pengguna Admin** — tabel: nama, email, role, tanggal bergabung, jumlah pesanan; pencarian; dropdown ubah role
  `~2h` · [P2] · *(membutuhkan: Buat layout Admin)*

- [ ] **Tulis `server/actions/admin.ts`** — `updateUserRole()`, `manualConfirmOrder()`, `addManualOrder()`
  `~2h` · [P2] · *(membutuhkan: Buat halaman Pengguna Admin)*

### Manajemen Afiliasi

- [ ] **Buat halaman Afiliasi Admin** — tabel: nama, kode, status (pending/disetujui), total pendapatan, penarikan pending; aksi setujui/tolak
  `~2h` · [P1] · *(membutuhkan: Buat layout Admin)*

- [ ] **Buat halaman Manajemen Penarikan** — daftar penarikan pending dengan detail bank afiliasi; tandai sebagai diproses / selesai; tambah catatan bukti pembayaran
  `~2h` · [P1] · *(membutuhkan: Buat halaman Afiliasi Admin)*

- [ ] **Buat pengaturan Tarif Komisi** — input persentase komisi per-seminar; disimpan ke tabel `commission_rates`
  `~2h` · [P2] · *(membutuhkan: Buat halaman Afiliasi Admin)*

### Laporan

- [ ] **Buat halaman Laporan Pendapatan** — pemilih rentang tanggal, pendapatan per seminar / per kategori / per metode pembayaran; grafik garis (Recharts); kartu ringkasan total
  `~4h` · [P2] · *(membutuhkan: Buat halaman Ikhtisar Admin)*

- [ ] **Implementasi ekspor CSV pendapatan** — difilter berdasarkan rentang tanggal, mencakup: order ID, seminar, jumlah, metode, kode afiliasi, tanggal
  `~2h` · [P2] · *(membutuhkan: Buat halaman Laporan Pendapatan)*

**Total Fase 4: ~21 tugas · ~54h**



---

## Fase 5: Konten & SEO

> **Tujuan:** Blog aktif, semua halaman teroptimasi SEO, i18n berfungsi untuk ID + EN.
> **Estimasi:** ~3 hari

### Blog / MDX

- [ ] **Setup pipeline MDX** — install `@next/mdx`, `next-mdx-remote` atau `contentlayer2`; konfigurasi di `next.config.ts`; definisikan skema frontmatter dengan Zod
  `~2h` · [P2]

- [ ] **Buat halaman Daftar Blog** (`app/(marketing)/blog/page.tsx`) — grid kartu post, filter kategori, paginasi; Cache Component (1h)
  `~2h` · [P2] · *(membutuhkan: Setup pipeline MDX)*

- [ ] **Buat halaman Detail Blog** (`app/(marketing)/blog/[slug]/page.tsx`) — render MDX, penulis, tanggal, waktu baca, post terkait, tombol bagikan sosial
  `~3h` · [P2] · *(membutuhkan: Buat halaman Daftar Blog)*

- [ ] **Buat manajemen Blog Admin** — daftar, form post baru (judul, slug, excerpt, textarea konten MDX, upload thumbnail, toggle publish)
  `~3h` · [P3] · *(membutuhkan: Buat halaman Detail Blog, Buat layout Admin)*

- [ ] **Tulis `server/actions/blog.ts`** — `createPost()`, `updatePost()`, `publishPost()` dengan `revalidateTag('blog')`
  `~1h` · [P3] · *(membutuhkan: Buat manajemen Blog Admin)*

### SEO

- [ ] **Implementasi metadata dinamis** — `generateMetadata()` untuk detail seminar, post blog, halaman jadwal; title, description, OG image, canonical URL
  `~3h` · [P1] · *(membutuhkan: Buat halaman Detail Seminar, Buat halaman Detail Blog)*

- [ ] **Implementasi JSON-LD structured data** — skema `Event` di halaman detail seminar, skema `Person` di halaman About, `Organization` di homepage, `Article` di post blog
  `~3h` · [P1] · *(membutuhkan: Implementasi metadata dinamis)*

- [ ] **Generate `sitemap.xml`** — `app/sitemap.ts` dalam format Next.js 16; sertakan semua seminar yang dipublikasikan, post blog, halaman statis; auto-regenerate saat publish
  `~2h` · [P1] · *(membutuhkan: Buat server/queries/seminars.ts)*

- [ ] **Buat `robots.txt`** — blokir `/admin`, `/dashboard`, `/checkout`, `/api`; izinkan semua halaman publik; referensi URL sitemap
  `~1h` · [P1]*

- [ ] **Buat halaman About** (`app/(marketing)/about/page.tsx`) — biografi TDW, pencapaian, logo liputan media, riwayat pembicara, CTA
  `~3h` · [P2]*

### i18n

- [ ] **Setup next-intl v4** — install, konfigurasi `i18n.ts`, buat `messages/id.json` dan `messages/en.json`, bungkus root layout dengan `NextIntlClientProvider`
  `~2h` · [P2]*
  > next-intl v4 menggunakan format konfigurasi baru. Referensi dokumentasi resmi v4 — ada breaking changes dari v3.

- [ ] **Ekstrak semua string UI** — pindahkan semua teks hardcoded Indonesia/Inggris ke file pesan; perbarui komponen untuk menggunakan `useTranslations()`
  `~4h` · [P2] · *(membutuhkan: Setup next-intl v4)*

- [ ] **Implementasi pemilih bahasa** — dropdown di Navbar, menyimpan pilihan di cookie, memperbarui atribut `<html lang>`
  `~2h` · [P2] · *(membutuhkan: Ekstrak semua string UI)*

**Total Fase 5: ~13 tugas · ~31h**



---

## Fase 6: Penyempurnaan & Peluncuran

> **Tujuan:** Siap produksi. Semua metrik hijau. Monitoring aktif. Soft launch dieksekusi.
> **Estimasi:** ~5 hari

### Performa

- [ ] **Jalankan audit Lighthouse** pada semua halaman kunci (homepage, detail seminar, checkout, dashboard); dokumentasikan skor baseline
  `~1h` · [P1]*

- [ ] **Optimasi LCP** — tambahkan prop `priority` ke semua `next/image` di atas fold, verifikasi preload links di `<head>`, periksa TTFB via Vercel Analytics
  `~2h` · [P1] · *(membutuhkan: Jalankan audit Lighthouse)*

- [ ] **Optimasi CLS** — tambahkan `width`/`height` eksplisit ke semua gambar, tambahkan skeleton loader untuk konten async, audit pemuatan font (`font-display: swap`)
  `~2h` · [P1] · *(membutuhkan: Jalankan audit Lighthouse)*

- [ ] **Optimasi INP** — profil interaksi lambat di Chrome DevTools, verifikasi React Compiler menghilangkan re-render yang tidak perlu, tunda JS non-kritis
  `~2h` · [P1] · *(membutuhkan: Jalankan audit Lighthouse)*

- [ ] **Implementasi View Transitions** (React 19.2) — transisi kartu seminar → halaman detail, tambahkan wrapper `<ViewTransition name>`
  `~2h` · [P3]*

- [ ] **Audit dan kurangi bundle JS** — `@next/bundle-analyzer`, identifikasi dependensi besar, tambahkan import `dynamic()` untuk komponen berat (calendar, PDF renderer, Midtrans Snap)
  `~2h` · [P2]*

### Pengujian

- [ ] **Tulis unit test** — `vitest` + `@testing-library/react`; test: validator Zod, `verifyMidtransSignature()`, `calculateCommission()`, fungsi utilitas
  `~4h` · [P1]*

- [ ] **Tulis E2E test** — Playwright: alur pembelian happy path (jelajah → detail → checkout → pembayaran → halaman sukses → tiket di dashboard)
  `~4h` · [P1]*

- [ ] **Tulis E2E test** — Playwright: alur auth (register → verifikasi email → login → logout → lupa password)
  `~2h` · [P1] · *(membutuhkan: Tulis E2E test — alur pembelian)*

- [ ] **Tulis E2E test** — Playwright: alur afiliasi (register → dapatkan link → simulasi konversi → cek komisi di dashboard)
  `~2h` · [P2] · *(membutuhkan: Tulis E2E test — alur pembelian)*

- [ ] **Test di perangkat mobile nyata** — iOS Safari (iPhone 13+), Android Chrome (perangkat mid-range); verifikasi checkout, pembayaran, unduh PDF
  `~2h` · [P1]*

### Monitoring & Analitik

- [ ] **Setup Sentry** — install `@sentry/nextjs`, konfigurasi DSN, aktifkan upload source maps pada build Vercel, setup alert Slack untuk issue baru
  `~2h` · [P1]*

- [ ] **Implementasi pelacakan event PostHog** — instrumentasi semua event kunci: `seminar_viewed`, `checkout_started`, `checkout_step_completed`, `purchase_completed`, `affiliate_link_clicked` (lihat `ARCHITECTURE.md` Bagian 10.3)
  `~2h` · [P1]*

- [ ] **Konfigurasi Vercel Analytics** — aktifkan di dashboard Vercel, verifikasi data Web Vitals mengalir
  `~1h` · [P1]*

- [ ] **Setup funnel PostHog** — buat funnel konversi: Homepage → Detail Seminar → Checkout → Pembelian; tetapkan target CVR baseline (4%)
  `~1h` · [P2] · *(membutuhkan: Implementasi pelacakan event PostHog)*

### Checklist Peluncuran

- [ ] **Audit keamanan** — verifikasi RLS aktif di semua tabel, tidak ada service role key yang terekspos ke client, CSP headers aktif, rate limiting pada endpoint auth
  `~2h` · [P1]*

- [ ] **Konfigurasi environment produksi Vercel** — semua env vars diatur, SSL custom domain aktif, region Edge Functions diatur ke `sin1` (Singapore)
  `~1h` · [P1]*

- [ ] **Submit sitemap ke Google Search Console** — verifikasi kepemilikan domain, submit `sitemap.xml`, periksa error crawl
  `~1h` · [P2] · *(membutuhkan: Generate sitemap.xml)*

- [ ] **Soft launch** — deploy ke produksi, smoke test semua alur kritis, monitor Sentry selama 24 jam, periksa Vercel Analytics
  `~2h` · [P1] · *(membutuhkan: semua tugas P1 selesai)*

- [ ] **Pasca-peluncuran: perbaiki bug kritis** — triase issue Sentry dari 48 jam pertama, hotfix bug P1
  `~4h` · [P1] · *(membutuhkan: Soft launch)*

**Total Fase 6: ~20 tugas · ~42h**

---

## Ringkasan

| Fase | Tugas | Est. Jam | Est. Hari |
|------|-------|----------|-----------|
| Fase 0: Persiapan Proyek | 14 | ~16h | ~2 hari |
| Fase 1: Fondasi | 30 | ~55h | ~7 hari |
| Fase 2: Fitur Inti | 30 | ~72h | ~9 hari |
| Fase 3: Fitur Pengguna | 25 | ~57h | ~7 hari |
| Fase 4: Dashboard Admin | 21 | ~54h | ~7 hari |
| Fase 5: Konten & SEO | 13 | ~31h | ~4 hari |
| Fase 6: Penyempurnaan & Peluncuran | 20 | ~42h | ~5 hari |
| **TOTAL** | **153** | **~327h** | **~41 hari** |

> Mengasumsikan 1 developer full-stack dengan ~8h/hari kerja fokus.
> Dengan tim 2 developer yang membagi frontend/backend, target adalah **~20–22 hari kerja** hingga peluncuran produksi.

### Jumlah Tugas P1 per Fase

| Fase | Tugas P1 | Tugas P2 | Tugas P3 |
|------|----------|----------|----------|
| Fase 0 | 9 | 5 | 0 |
| Fase 1 | 22 | 7 | 1 |
| Fase 2 | 22 | 7 | 1 |
| Fase 3 | 14 | 8 | 3 |
| Fase 4 | 13 | 7 | 1 |
| Fase 5 | 5 | 7 | 1 |
| Fase 6 | 13 | 5 | 2 |
| **Total** | **98** | **46** | **9** |

---

*Terakhir diperbarui: 2026-05-14 · Dikelola oleh: Engineering Lead*
*Jangan mengubah urutan fase. Dependensi mengalir dari atas ke bawah.*
