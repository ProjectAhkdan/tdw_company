# Setup Guide — TDW Resources

Panduan lengkap untuk menjalankan project dari nol hingga production.

---

## Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Supabase](#2-supabase)
3. [Database (Supabase CLI)](#3-database-supabase-cli)
4. [Midtrans](#4-midtrans)
5. [Resend (Email)](#5-resend-email)
6. [Environment Variables](#6-environment-variables)
7. [Menjalankan Lokal](#7-menjalankan-lokal)
8. [Deploy ke Vercel](#8-deploy-ke-vercel)
9. [Checklist Sebelum Live](#9-checklist-sebelum-live)

---

## 1. Prasyarat

Pastikan sudah terinstall di komputer:

| Tool | Versi | Cek |
|------|-------|-----|
| Node.js | 22+ | `node -v` |
| npm | 10+ | `npm -v` |
| Git | terbaru | `git -v` |

Install dependencies project:
```bash
npm install
```

---

## 2. Supabase

Supabase adalah backend-as-a-service yang menyediakan database PostgreSQL, autentikasi, storage, dan realtime.

### 2.1 Buat Project

1. Buka **https://supabase.com** → Sign Up / Login
2. Klik **New Project**
3. Isi:
   - **Name**: `tdw-resources`
   - **Database Password**: buat password kuat, **simpan baik-baik**
   - **Region**: `Southeast Asia (Singapore)`
4. Tunggu ~2 menit hingga project siap

### 2.2 Ambil API Keys

Buka **Project Settings → API**:

```
Project URL     → NEXT_PUBLIC_SUPABASE_URL
anon public     → NEXT_PUBLIC_SUPABASE_ANON_KEY
service_role    → SUPABASE_SERVICE_ROLE_KEY  ⚠️ jangan expose ke client
```

### 2.3 Ambil Database URL

Buka **Project Settings → Database → Connection string → URI**:

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres
```

Ganti `[YOUR-PASSWORD]` dengan password yang dibuat tadi.

> **Catatan:** Gunakan **Transaction pooler** (port 6543) jika deploy ke Vercel/serverless untuk menghindari connection limit.
> ```
> postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
> ```

### 2.4 Aktifkan Google OAuth (Opsional)

Untuk fitur "Login dengan Google":

1. Buka **https://console.cloud.google.com**
2. Buat project baru → **APIs & Services → Credentials**
3. Buat **OAuth 2.0 Client ID** (tipe: Web application)
4. Tambahkan Authorized redirect URI:
   ```
   https://xxxx.supabase.co/auth/v1/callback
   ```
5. Salin **Client ID** dan **Client Secret**
6. Di Supabase: **Authentication → Providers → Google** → paste Client ID & Secret → Enable

### 2.5 Konfigurasi Auth Settings

Di Supabase: **Authentication → URL Configuration**:
```
Site URL:           https://tdwresources.id
Redirect URLs:      https://tdwresources.id/callback
                    http://localhost:3000/callback   (untuk dev)
```

---

## 3. Database (Supabase CLI)

Semua migrasi dan query database dikelola langsung via Supabase — tidak ada ORM tambahan.

### 3.1 Konsep

```
supabase/migrations/*.sql  →  SQL yang mendefinisikan struktur tabel
supabase/seed.sql          →  data awal
```

### 3.2 Login Supabase CLI

```bash
npx supabase login
```

Browser akan terbuka, login dan authorize. Token tersimpan otomatis.

### 3.3 Link ke Project Supabase

```bash
npx supabase link
```

Pilih project dari daftar yang muncul. Masukkan database password saat diminta.

### 3.4 Deploy Migrasi ke Database

```bash
# Push semua migration files ke remote database
npx supabase db push

# Push sekaligus isi seed data
npx supabase db push --include-seed
```

### 3.5 Membuat Migration Baru (saat ada perubahan schema)

```bash
# 1. Buat file migration baru
npx supabase migration new nama_perubahan

# 2. Tulis SQL di file yang terbuat (supabase/migrations/<timestamp>_nama_perubahan.sql)

# 3. Push ke database
npx supabase db push
```

### 3.6 Perintah yang Sering Dipakai

| Perintah | Fungsi |
|----------|--------|
| `npx supabase login` | Login ke Supabase CLI |
| `npx supabase link` | Hubungkan ke project Supabase |
| `npx supabase db push` | Deploy migrasi ke database |
| `npx supabase db push --include-seed` | Deploy migrasi + isi seed data |
| `npx supabase migration new <nama>` | Buat file migration baru |
| `npx supabase migration list` | Cek status migrasi |
| `npx supabase db pull` | Tarik schema dari remote ke migration file |

---

## 4. Midtrans

Midtrans adalah payment gateway Indonesia yang mendukung Transfer Bank, QRIS, GoPay, dan Kartu Kredit.

### 4.1 Daftar Akun

1. Buka **https://dashboard.midtrans.com**
2. Daftar dengan email bisnis
3. Verifikasi email
4. Pilih **Sandbox** untuk testing (gratis, tidak ada uang nyata)

### 4.2 Ambil API Keys

Buka **Settings → Access Keys**:

```
Sandbox:
  Server Key:  SB-Mid-server-xxxxxxxxxxxx
  Client Key:  SB-Mid-client-xxxxxxxxxxxx

Production:
  Server Key:  Mid-server-xxxxxxxxxxxx
  Client Key:  Mid-client-xxxxxxxxxxxx
```

> **Perbedaan Sandbox vs Production:**
> - Sandbox: untuk testing, gunakan nomor kartu/rekening dummy
> - Production: uang nyata, butuh verifikasi dokumen bisnis (KTP, NPWP, rekening)

### 4.3 Daftarkan Webhook URL

Webhook = Midtrans akan mengirim notifikasi ke server kita setiap ada transaksi.

Buka **Settings → Configuration**:
```
Payment Notification URL:  https://tdwresources.id/api/webhooks/midtrans
```

Untuk testing lokal, gunakan **ngrok**:
```bash
# Install ngrok: https://ngrok.com
ngrok http 3000

# Gunakan URL yang diberikan ngrok, contoh:
# https://abc123.ngrok.io/api/webhooks/midtrans
```

### 4.4 Test Pembayaran di Sandbox

Gunakan data dummy berikut:

**Transfer Bank BCA:**
- Tidak perlu data khusus, langsung konfirmasi di simulator

**Kartu Kredit:**
```
Nomor: 4811 1111 1111 1114
CVV:   123
Exp:   01/25
OTP:   112233
```

**GoPay:**
- Scan QR di aplikasi Midtrans Simulator

---

## 5. Resend (Email)

Resend adalah layanan pengiriman email transaksional modern.

### 5.1 Daftar & Setup

1. Buka **https://resend.com** → Sign Up
2. Buka **Domains → Add Domain**
3. Masukkan domain: `tdwresources.id`
4. Tambahkan DNS records yang diberikan ke domain registrar (Niagahoster, Cloudflare, dll):
   ```
   TXT  resend._domainkey  v=DKIM1; k=rsa; p=...
   ```
5. Tunggu verifikasi (~5-30 menit)

### 5.2 Ambil API Key

Buka **API Keys → Create API Key**:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### 5.3 Test Kirim Email

Sebelum domain terverifikasi, gunakan email `onboarding@resend.dev` sebagai pengirim untuk testing.

---

## 6. Environment Variables

Buat file `.env.local` di root project (jangan di-commit ke Git):

```bash
# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# DATABASE (dari Supabase)
# ============================================
DATABASE_URL=postgresql://postgres:[password]@db.xxxx.supabase.co:5432/postgres

# ============================================
# MIDTRANS
# ============================================
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx
MIDTRANS_IS_PRODUCTION=false

# ============================================
# RESEND (EMAIL)
# ============================================
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=noreply@tdwresources.id

# ============================================
# APP
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Aturan penamaan:**
> - `NEXT_PUBLIC_` → aman diakses di browser (client-side)
> - Tanpa prefix → hanya di server, **tidak boleh** dikirim ke browser

---

## 7. Menjalankan Lokal

```bash
# 1. Install dependencies
npm install

# 2. Isi .env.local (lihat bagian 6)

# 3. Jalankan migrasi database via Supabase CLI
npx supabase db push

# 4. Jalankan seed users
node scripts/seed-users.mjs

# 5. Jalankan development server
npm run dev
```

Buka **http://localhost:3000**

### Akun Admin Default (setelah seed)

```
Email:    admin@tdwresources.id
Password: admin123456
```

---

## 8. Deploy ke Vercel

### 8.1 Hubungkan Repository

1. Push code ke GitHub
2. Buka **https://vercel.com** → New Project
3. Import repository dari GitHub
4. Framework: **Next.js** (auto-detected)
5. Klik **Deploy**

### 8.2 Isi Environment Variables di Vercel

Buka **Project → Settings → Environment Variables**, tambahkan semua variabel dari `.env.local`.

Untuk production, ubah:
```
MIDTRANS_IS_PRODUCTION=true
MIDTRANS_SERVER_KEY=Mid-server-xxxx      (bukan SB-)
MIDTRANS_CLIENT_KEY=Mid-client-xxxx      (bukan SB-)
NEXT_PUBLIC_APP_URL=https://tdwresources.id
DATABASE_URL=[gunakan Transaction Pooler dari Supabase]
```

### 8.3 Jalankan Migrasi di Production

Setelah deploy pertama, jalankan migrasi ke database production:
```bash
# Push semua migrations ke Supabase production
npx supabase db push

# Buat akun admin & user
node scripts/seed-users.mjs
```

### 8.4 Custom Domain

Di Vercel: **Project → Settings → Domains** → tambahkan `tdwresources.id`

Tambahkan DNS record di domain registrar:
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

---

## 9. Checklist Sebelum Live

### Database
- [ ] Migrasi berhasil dijalankan (`npx supabase db push`)
- [ ] Data seed sudah diisi
- [ ] Bisa login dengan akun admin

### Autentikasi
- [ ] Register dengan email berfungsi
- [ ] Login dengan email berfungsi
- [ ] Google OAuth berfungsi (jika diaktifkan)
- [ ] Email verifikasi terkirim

### Pembayaran
- [ ] Checkout flow berjalan end-to-end di Sandbox
- [ ] Webhook Midtrans menerima notifikasi
- [ ] Status order berubah setelah pembayaran
- [ ] E-ticket tergenerate dan terkirim via email
- [ ] Ganti ke Production keys saat siap live

### Email
- [ ] Domain terverifikasi di Resend
- [ ] Email konfirmasi pesanan terkirim
- [ ] Email reminder seminar berfungsi

### Deployment
- [ ] Semua env vars diisi di Vercel
- [ ] Custom domain aktif dengan SSL
- [ ] Tidak ada error di Vercel deployment logs

---

## Troubleshooting

### Error: `PrismaClientInitializationError`
Database URL salah atau database tidak bisa diakses.
```bash
# Cek koneksi
npx supabase db pull                   # Pull schema dari Supabase ke migrations
```

### Error: `Invalid API key` (Midtrans)
Pastikan menggunakan key yang sesuai (Sandbox vs Production).

### Email tidak terkirim
- Cek domain sudah terverifikasi di Resend
- Cek `RESEND_API_KEY` sudah benar
- Lihat log di **https://resend.com/emails**

### Supabase Auth tidak bekerja
- Pastikan `Site URL` dan `Redirect URLs` sudah diisi di Supabase Auth settings
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar

---

*Dokumen ini dibuat untuk tim TDW Resources. Update terakhir: Mei 2026.*
