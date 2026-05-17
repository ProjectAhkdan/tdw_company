# PRD — Rebuild Website TDW Resources (tdwresources.id)

**Versi:** 1.0  
**Tanggal:** 14 Mei 2026  
**Author:** Product Team  
**Status:** Draft

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Target Pengguna & Persona](#2-target-pengguna--persona)
3. [Cerita Pengguna](#3-cerita-pengguna)
4. [Daftar Fitur](#4-daftar-fitur)
5. [Kebutuhan Fungsional](#5-kebutuhan-fungsional)
6. [Kebutuhan Non-Fungsional](#6-kebutuhan-non-fungsional)
7. [Di Luar Cakupan](#7-di-luar-cakupan)
8. [Jadwal & Milestone](#8-jadwal--milestone)
9. [Risiko & Mitigasi](#9-risiko--mitigasi)

---

## 1. Ringkasan Eksekutif

### 1.1 Latar Belakang

TDW Resources adalah platform Event Organizer dan Seminar milik Tung Desem Waringin — salah satu pelatih sukses, motivator bisnis, dan pakar properti terkemuka di Indonesia. Website saat ini (tdwresources.id) berfungsi sebagai kanal utama penjualan tiket seminar dan training, namun menghadapi sejumlah hambatan signifikan: tampilan visual yang outdated, pengalaman mobile yang buruk, struktur informasi yang membingungkan, dan proses checkout yang tidak optimal — yang secara langsung berdampak pada konversi dan kepercayaan pengguna.

Rebuild ini bukan sekadar redesign visual, melainkan rekonstruksi penuh platform dengan fondasi teknologi modern untuk mendukung pertumbuhan bisnis jangka panjang.

### 1.2 Visi Produk

> Menjadikan tdwresources.id sebagai platform seminar dan pelatihan online terpercaya, tercepat, dan paling mudah digunakan di Indonesia — yang mengkonversi pengunjung menjadi peserta setia program TDW.

### 1.3 Tujuan Bisnis

| # | Tujuan | Target |
|---|--------|--------|
| 1 | Meningkatkan conversion rate pembelian tiket | Dari ~1.5% → 4%+ |
| 2 | Meningkatkan revenue dari channel digital | +40% dalam 6 bulan post-launch |
| 3 | Menurunkan bounce rate homepage | Dari ~70% → <45% |
| 4 | Meningkatkan jumlah member aktif terdaftar | +60% dalam 3 bulan |
| 5 | Meningkatkan performa program afiliasi | +50% affiliate-driven revenue |
| 6 | Mempercepat waktu checkout | Dari rata-rata 8 menit → <3 menit |

### 1.4 Metrik Keberhasilan (KPI)

#### KPI Bisnis
- **Conversion Rate (CVR):** % pengunjung yang menyelesaikan pembelian tiket ≥ 4%
- **Average Order Value (AOV):** Nilai rata-rata transaksi per user
- **Monthly Recurring Visitors:** Jumlah unique visitor per bulan
- **Affiliate Revenue Share:** % revenue yang datang dari program afiliasi
- **Cart Abandonment Rate:** Target < 30%

#### KPI Produk
- **Time to Purchase:** Waktu dari landing ke checkout selesai < 3 menit
- **Mobile Conversion Rate:** CVR di mobile ≥ desktop CVR
- **Session Duration:** Rata-rata durasi sesi > 3 menit
- **Pages per Session:** > 3 halaman per sesi

#### KPI Teknis
- **Largest Contentful Paint (LCP):** < 2.5 detik
- **Cumulative Layout Shift (CLS):** < 0.1
- **Interaction to Next Paint (INP):** < 200ms
- **Uptime:** 99.9% SLA
- **Lighthouse Score:** ≥ 90 (Performance, Accessibility, SEO)

---

## 2. Target Pengguna & Persona

### Persona 1 — Budi Santoso, "Si Pengusaha Ambisius"

| Atribut | Detail |
|---------|--------|
| **Usia** | 35–45 tahun |
| **Pekerjaan** | Pemilik UKM / Pengusaha skala menengah |
| **Lokasi** | Kota besar (Jakarta, Surabaya, Medan) |
| **Device** | Smartphone Android (70%), Laptop (30%) |
| **Income** | Rp 15–50 juta/bulan |

**Tujuan:**
- Mencari strategi bisnis dan sales yang terbukti untuk scale-up usahanya
- Mendapatkan network dengan sesama pengusaha sukses
- Investasi pada diri sendiri melalui seminar berkualitas

**Titik Masalah:**
- Sulit menemukan informasi lengkap tentang materi seminar sebelum membeli
- Tidak yakin apakah seminar ini worth the price tanpa testimoni yang kuat
- Proses pendaftaran yang panjang dan membingungkan
- Tidak ada reminder otomatis untuk seminar yang sudah dibeli

**Perilaku:**
- Browsing di malam hari setelah jam kerja (20.00–23.00)
- Membaca review dan testimoni sebelum memutuskan
- Sering membandingkan dengan seminar kompetitor
- Responsif terhadap urgency (early bird, seat terbatas)

**Perjalanan Pengguna:**
```
Awareness (Instagram/YouTube Ad)
  → Landing di Homepage
  → Cek halaman seminar Business/Sales
  → Baca detail materi & speaker
  → Cek jadwal & lokasi
  → Lihat testimoni peserta
  → Klik "Daftar Sekarang"
  → Checkout & bayar via Transfer/QRIS
  → Terima konfirmasi email + WhatsApp
  → Hadir seminar
  → Jadi member aktif & repeat buyer
```

---

### Persona 2 — Sari Dewi, "Profesional yang Ingin Naik Level"

| Atribut | Detail |
|---------|--------|
| **Usia** | 25–35 tahun |
| **Pekerjaan** | Karyawan profesional / Manager |
| **Lokasi** | Jabodetabek, Bandung |
| **Device** | iPhone (60%), MacBook (40%) |
| **Income** | Rp 8–20 juta/bulan |

**Tujuan:**
- Meningkatkan skill leadership dan personal development
- Membangun mindset sukses untuk transisi ke dunia wirausaha
- Mendapatkan sertifikat pelatihan yang diakui

**Titik Masalah:**
- Jadwal seminar tidak fleksibel, sulit menyesuaikan dengan jam kerja
- Tidak ada opsi cicilan untuk seminar premium
- Informasi tentang apa yang akan didapat (outcome) tidak jelas
- Website lambat saat diakses dari mobile

**Perilaku:**
- Aktif di LinkedIn dan Instagram
- Riset mendalam sebelum membeli (baca semua halaman)
- Tertarik pada konten edukasi gratis sebagai "taste test"
- Membeli berdasarkan rekomendasi teman atau influencer

**Perjalanan Pengguna:**
```
Awareness (LinkedIn post / rekomendasi teman)
  → Cari info di Google → Landing di halaman seminar spesifik
  → Baca detail program & kurikulum
  → Cek profil Tung Desem Waringin
  → Cari testimoni & social proof
  → Bandingkan jadwal dengan kalender pribadi
  → Tanya via chatbot/WhatsApp
  → Daftar & bayar via kartu kredit / cicilan
  → Terima e-ticket & reminder
  → Hadir & share pengalaman di media sosial
```

---

### Persona 3 — Rudi Hartono, "Afiliator Aktif"

| Atribut | Detail |
|---------|--------|
| **Usia** | 22–40 tahun |
| **Pekerjaan** | Content creator / Marketer / Alumni TDW |
| **Lokasi** | Seluruh Indonesia |
| **Device** | Smartphone (80%), Laptop (20%) |
| **Income** | Variabel (komisi afiliasi sebagai income tambahan) |

**Tujuan:**
- Mendapatkan komisi dari setiap tiket yang terjual melalui link afiliasinya
- Memantau performa link dan komisi secara real-time
- Mendapatkan materi promosi (banner, copy) yang siap pakai

**Titik Masalah:**
- Dashboard afiliasi yang tidak informatif dan sulit digunakan
- Proses pencairan komisi yang tidak transparan dan lambat
- Tidak ada notifikasi saat ada konversi dari link-nya
- Materi promosi tidak tersedia atau tidak menarik

**Perilaku:**
- Aktif share konten di WhatsApp Group, Instagram, TikTok
- Memantau dashboard setiap hari
- Sangat responsif terhadap program bonus dan kompetisi afiliasi
- Merekrut afiliator baru (multi-level)

**Perjalanan Pengguna:**
```
Daftar program afiliasi
  → Verifikasi akun & terima link unik
  → Download materi promosi dari dashboard
  → Share ke komunitas / media sosial
  → Monitor klik & konversi di dashboard
  → Terima notifikasi saat ada penjualan
  → Ajukan pencairan komisi
  → Terima pembayaran via transfer bank
```

---


## 3. Cerita Pengguna

### 3.1 Pengunjung Umum (Guest)

| # | Cerita Pengguna | Prioritas |
|---|----------------|-----------|
| US-01 | Sebagai pengunjung, saya ingin melihat semua program seminar yang tersedia di homepage, agar saya bisa langsung memilih yang relevan tanpa harus navigasi jauh. | P1 |
| US-02 | Sebagai pengunjung, saya ingin membaca deskripsi lengkap setiap seminar (materi, pembicara, outcome, jadwal, harga), agar saya bisa membuat keputusan pembelian yang informed. | P1 |
| US-03 | Sebagai pengunjung, saya ingin melihat jadwal seminar dalam tampilan kalender atau list yang bisa difilter berdasarkan kategori, kota, dan bulan, agar saya mudah menemukan seminar yang sesuai jadwal saya. | P1 |
| US-04 | Sebagai pengunjung, saya ingin melihat testimoni dan review dari peserta sebelumnya, agar saya yakin bahwa seminar ini berkualitas dan worth the investment. | P1 |
| US-05 | Sebagai pengunjung, saya ingin bisa mendaftar dan membayar tiket seminar dalam kurang dari 3 menit, agar proses pembelian tidak terasa melelahkan. | P1 |
| US-06 | Sebagai pengunjung, saya ingin melihat berapa sisa kursi yang tersedia untuk setiap seminar, agar saya terdorong untuk segera mendaftar. | P1 |
| US-07 | Sebagai pengunjung, saya ingin bisa membaca profil lengkap Tung Desem Waringin beserta track record dan pencapaiannya, agar saya percaya pada kredibilitas pembicara. | P2 |
| US-08 | Sebagai pengunjung, saya ingin bisa mencari seminar berdasarkan kata kunci, agar saya cepat menemukan program yang saya cari. | P2 |
| US-09 | Sebagai pengunjung, saya ingin website bisa diakses dengan cepat dan nyaman di smartphone saya, agar saya tidak frustrasi saat browsing di mobile. | P1 |
| US-10 | Sebagai pengunjung, saya ingin bisa menghubungi tim TDW Resources via WhatsApp atau chat langsung dari website, agar pertanyaan saya bisa dijawab cepat sebelum membeli. | P2 |

### 3.2 Member Terdaftar (Authenticated User)

| # | Cerita Pengguna | Prioritas |
|---|----------------|-----------|
| US-11 | Sebagai member, saya ingin bisa login menggunakan Google atau email, agar proses masuk ke akun lebih cepat dan mudah. | P1 |
| US-12 | Sebagai member, saya ingin melihat semua tiket seminar yang sudah saya beli di dashboard, agar saya bisa mengakses e-ticket kapan saja. | P1 |
| US-13 | Sebagai member, saya ingin menerima reminder otomatis via email dan WhatsApp H-7, H-3, dan H-1 sebelum seminar, agar saya tidak lupa hadir. | P1 |
| US-14 | Sebagai member, saya ingin bisa mengunduh e-ticket dalam format PDF, agar saya bisa menunjukkannya saat registrasi di lokasi seminar. | P1 |
| US-15 | Sebagai member, saya ingin melihat riwayat seminar yang pernah saya ikuti, agar saya bisa melacak perjalanan belajar saya. | P2 |
| US-16 | Sebagai member, saya ingin bisa mengubah data profil dan preferensi notifikasi saya, agar informasi akun saya selalu up-to-date. | P2 |
| US-17 | Sebagai member, saya ingin mendapatkan rekomendasi seminar berikutnya berdasarkan riwayat pembelian saya, agar saya tidak melewatkan program yang relevan. | P3 |
| US-18 | Sebagai member, saya ingin bisa melakukan transfer tiket ke orang lain jika saya tidak bisa hadir, agar tiket yang sudah dibeli tidak terbuang sia-sia. | P3 |

### 3.3 Afiliator

| # | Cerita Pengguna | Prioritas |
|---|----------------|-----------|
| US-19 | Sebagai afiliator, saya ingin mendaftar program afiliasi dengan mudah dan mendapatkan link unik saya dalam waktu < 5 menit, agar saya bisa langsung mulai promosi. | P1 |
| US-20 | Sebagai afiliator, saya ingin melihat dashboard yang menampilkan total klik, konversi, dan komisi secara real-time, agar saya bisa mengoptimalkan strategi promosi saya. | P1 |
| US-21 | Sebagai afiliator, saya ingin mengunduh materi promosi (banner, caption, video pendek) langsung dari dashboard, agar saya tidak perlu membuat konten dari nol. | P2 |
| US-22 | Sebagai afiliator, saya ingin menerima notifikasi (email/WhatsApp) setiap kali ada konversi dari link saya, agar saya bisa memantau performa secara aktif. | P2 |
| US-23 | Sebagai afiliator, saya ingin mengajukan pencairan komisi dengan mudah dan melihat status pembayarannya, agar saya tahu kapan uang akan masuk ke rekening saya. | P1 |

### 3.4 Admin

| # | Cerita Pengguna | Prioritas |
|---|----------------|-----------|
| US-24 | Sebagai admin, saya ingin bisa membuat, mengedit, dan mempublikasikan halaman seminar baru tanpa bantuan developer, agar proses update konten lebih cepat. | P1 |
| US-25 | Sebagai admin, saya ingin melihat laporan penjualan tiket per seminar, per periode, dan per channel (organik vs afiliasi), agar saya bisa membuat keputusan bisnis berbasis data. | P1 |
| US-26 | Sebagai admin, saya ingin bisa mengelola daftar peserta seminar dan mengekspor data ke CSV/Excel, agar tim operasional bisa mempersiapkan acara dengan baik. | P1 |
| US-27 | Sebagai admin, saya ingin bisa mengelola program afiliasi (approve/reject afiliator, set komisi, proses pencairan), agar program afiliasi berjalan terkontrol. | P2 |


---


## 4. Daftar Fitur

### 4.1 Prioritas P1 — Wajib Ada (Penghambat Peluncuran)

| Kode | Fitur | Deskripsi Singkat |
|------|-------|-------------------|
| F-01 | Homepage Redesign | Hero section, featured seminars, social proof, CTA utama |
| F-02 | Halaman Listing Seminar | Grid/list seminar dengan filter kategori, kota, harga, tanggal |
| F-03 | Halaman Detail Seminar | Deskripsi lengkap, kurikulum, pembicara, jadwal, harga, CTA beli |
| F-04 | Jadwal Seminar | Tampilan kalender + list, filter multi-dimensi |
| F-05 | Sistem Autentikasi | Register, login (email + Google OAuth), forgot password |
| F-06 | Checkout & Payment | Multi-step checkout, integrasi Midtrans (Transfer, QRIS, CC, GoPay) |
| F-07 | E-Ticket Generation | Generate PDF e-ticket otomatis setelah pembayaran sukses |
| F-08 | Email Transaksional | Konfirmasi pembelian, e-ticket, reminder seminar via Resend |
| F-09 | Dashboard Member | Tiket aktif, riwayat pembelian, profil user |
| F-10 | Admin CMS | Kelola seminar, peserta, laporan penjualan |
| F-11 | Mobile Responsive | Tampilan optimal di semua ukuran layar (mobile-first) |
| F-12 | SEO Foundation | Meta tags, sitemap, structured data, Open Graph |

### 4.2 Prioritas P2 — Sebaiknya Ada (Sprint 2)

| Kode | Fitur | Deskripsi Singkat |
|------|-------|-------------------|
| F-13 | Program Afiliasi | Dashboard afiliator, link tracking, laporan komisi |
| F-14 | Halaman About TDW | Profil Tung Desem Waringin, pencapaian, media coverage |
| F-15 | Sistem Testimoni | Tampilan review peserta dengan foto, rating, video testimonial |
| F-16 | WhatsApp Integration | Tombol WA floating, notifikasi WA untuk konfirmasi & reminder |
| F-17 | Search & Filter | Global search seminar, filter advanced |
| F-18 | Countdown Timer | Timer hitung mundur untuk early bird / seat terbatas |
| F-19 | Wishlist / Simpan Seminar | User bisa simpan seminar untuk dibeli nanti |
| F-20 | Pencairan Komisi Afiliasi | Flow pengajuan & approval pencairan komisi |

### 4.3 Prioritas P3 — Bagus Jika Ada (Sprint Mendatang)

| Kode | Fitur | Deskripsi Singkat |
|------|-------|-------------------|
| F-21 | Rekomendasi Seminar | Personalisasi rekomendasi berdasarkan riwayat user |
| F-22 | Transfer Tiket | Fitur transfer tiket ke user lain |
| F-23 | Loyalty Program | Poin reward untuk repeat buyer |
| F-24 | Blog / Artikel | Konten edukasi untuk SEO dan nurturing |
| F-25 | Live Chat AI | Chatbot berbasis AI untuk FAQ dan pre-sales |
| F-26 | Multi-bahasa | Dukungan Bahasa Inggris untuk peserta internasional |
| F-27 | Opsi Cicilan | Integrasi cicilan 0% via kartu kredit / paylater |

---


## 5. Kebutuhan Fungsional

### 5.1 Homepage (F-01)

**Konsep Visual & Tema Desain:**
- **Tema gelap (dark mode)** sebagai default — background hitam/sangat gelap (#0A0A0A atau serupa)
- **Aksen warna oranye/amber** sebagai warna utama brand — digunakan untuk CTA, highlight, ikon, dan elemen interaktif
- **Efek glow oranye** — elemen penting (card, tombol, ikon) memiliki efek cahaya/glow oranye lembut di sekitarnya
- **Glassmorphism cards** — card dengan background semi-transparan, border halus, dan efek blur (backdrop-filter)
- **Gradien radial** — background section menggunakan gradien radial oranye gelap yang memancar dari tengah/bawah
- **Tipografi bold & bersih** — headline besar, kontras tinggi (putih di atas gelap), font weight tebal untuk heading
- **Layout modern & spacious** — banyak whitespace (darkspace), elemen tidak berdesakan
- **Animasi halus** — elemen muncul dengan fade-in saat scroll, hover effect pada card dengan glow yang menguat

**Hero Section:**
- Headline utama besar & bold yang menyampaikan value proposition TDW dalam ≤ 10 kata (warna putih)
- Sub-headline yang menjelaskan manfaat konkret (warna abu-abu terang/muted)
- Primary CTA: tombol solid oranye dengan efek glow — "Lihat Seminar Terdekat" → mengarah ke halaman jadwal
- Secondary CTA: tombol outline/ghost — "Pelajari Program Kami" → scroll ke section produk
- Background: gradien radial gelap dengan efek cahaya oranye di bagian tengah
- Social proof bar di bawah CTA: logo klien/media atau badge angka (alumni, seminar, tahun) dengan ikon oranye

**Bagian Kenapa Memilih Kami (Why Clients Stick With Us):**
- Grid 2x2 card dengan glassmorphism effect (background semi-transparan + border halus)
- Setiap card memiliki ikon oranye bercahaya + judul singkat + deskripsi
- Contoh poin: "Implementasi & Fokus", "High-Converting", "Maximum Return on ROI", "Desain Jelas & Terpercaya"
- Efek hover: glow oranye menguat di border card

**Bagian Proses (The Process — Fast, Clear, Done):**
- 3 langkah horizontal (mobile: vertikal) dengan card bergaya glassmorphism
- Setiap langkah: nomor/ikon + judul + deskripsi singkat
- Contoh: "Bagikan Visi Anda" → "Kami Desain" → "Siap Diluncurkan"
- Garis penghubung antar langkah dengan efek glow

**Bagian Seminar Unggulan:**
- Menampilkan 3–4 seminar unggulan (ditentukan admin)
- Card dengan background gelap, thumbnail, border halus, efek glow oranye saat hover
- Setiap card menampilkan: nama seminar, tanggal terdekat, kota, harga, sisa kursi, CTA
- Badge "Early Bird" atau "Hampir Penuh" dengan warna oranye/amber

**Bagian Harga (Pricing Section):**
- 2–3 kolom paket harga (Starter, Pro, Premium) dengan card gelap
- Card paket unggulan memiliki border oranye bercahaya + badge "Populer"
- Harga besar & bold, daftar fitur dengan checkmark oranye
- CTA tombol oranye di setiap card

**Bagian Testimoni (What Founders Are Saying):**
- Grid card testimoni dengan background gelap semi-transparan
- Foto, nama, jabatan, kutipan — teks putih/abu terang
- Rating bintang warna oranye
- Opsi tampilan: carousel (mobile) / grid (desktop)

**Bagian FAQ (Questions? We've got answers):**
- Accordion dengan background gelap, border halus
- Ikon expand/collapse warna oranye
- Teks pertanyaan putih bold, jawaban abu-abu terang

**Bagian CTA Akhir (Ready to launch something that actually works?):**
- Section full-width dengan gradien radial oranye gelap
- Headline besar di tengah
- Tombol CTA oranye besar dengan efek glow
- Efek cahaya ambient di background

**Footer:**
- Background paling gelap, teks abu-abu muted
- Logo + tagline singkat
- Link navigasi, sosial media
- Garis pemisah halus di atas footer
- Efek glow oranye subtle di bagian atas footer

**Bagian Statistik:**
- Angka pencapaian: alumni, seminar digelar, kota, tahun berdiri
- Angka besar warna oranye/putih, label abu-abu
- Animasi counter saat section masuk viewport

---

### 5.2 Halaman Listing & Detail Seminar (F-02, F-03)

**Halaman Listing:**
- Grid card seminar dengan thumbnail, judul, kategori, tanggal, kota, harga
- Filter sidebar/top: Kategori (Property, Sales, Business, Life Revolution), Kota, Bulan, Harga
- Sort: Terbaru, Terdekat, Terpopuler, Harga Terendah
- Pagination atau infinite scroll
- State kosong yang informatif jika tidak ada hasil filter

**Halaman Detail — Struktur Konten:**

| Bagian | Konten |
|--------|--------|
| Header | Nama seminar, kategori badge, tanggal & lokasi, harga, CTA beli |
| Ringkasan | Deskripsi singkat (2–3 paragraf), target peserta, outcome yang dijanjikan |
| Kurikulum | Accordion per sesi/modul dengan deskripsi singkat |
| Pembicara | Foto, nama, bio singkat Tung Desem Waringin (dan co-speaker jika ada) |
| Jadwal | Semua jadwal tersedia untuk seminar ini, dengan tombol pilih |
| Harga & Paket | Tabel perbandingan paket (Regular, VIP, VVIP) jika ada |
| Testimoni | Review spesifik untuk seminar ini |
| FAQ | Accordion pertanyaan umum |
| Sticky CTA | Floating bar di bottom (mobile) / sticky sidebar (desktop) dengan harga & tombol beli |

**Kriteria Penerimaan:**
- Halaman detail harus load dalam < 2 detik (LCP)
- Sticky CTA selalu terlihat tanpa menghalangi konten utama
- Sisa kursi diupdate real-time (atau near real-time, max delay 60 detik)
- Structured data (JSON-LD) untuk Event schema terpasang

---

### 5.3 Jadwal Seminar (F-04)

- Toggle antara tampilan **List** dan **Kalender**
- Filter: Kategori, Kota, Bulan/Tahun
- Setiap item jadwal menampilkan: nama seminar, tanggal, waktu, lokasi, harga, status (Tersedia / Hampir Penuh / Sold Out)
- Klik item → redirect ke halaman detail seminar
- Kalender view: highlight tanggal yang ada seminar, tooltip saat hover

---

### 5.4 Sistem Autentikasi (F-05)

- **Register:** Email + password, atau Google OAuth 2.1 (via Supabase Auth)
- **Login:** Email/password, Google OAuth, "Remember me" 30 hari
- **Forgot Password:** Reset via email link (expire 1 jam)
- **Email Verification:** Wajib verifikasi email sebelum bisa checkout
- **Session Management:** JWT via Supabase, refresh token otomatis
- **Keamanan:** Rate limiting login (max 5 attempt/15 menit), CAPTCHA pada register

---

### 5.5 Checkout & Payment (F-06)

**Alur Checkout (3 langkah):**

```
Step 1: Pilih Jadwal & Paket
  → Pilih tanggal seminar
  → Pilih paket (Regular/VIP/VVIP)
  → Pilih jumlah tiket

Step 2: Data Peserta
  → Nama lengkap, email, nomor HP
  → Kode afiliasi (opsional, auto-fill jika dari link afiliasi)
  → Ringkasan order

Step 3: Pembayaran
  → Pilih metode: Transfer Bank, QRIS, Kartu Kredit, GoPay
  → Konfirmasi & bayar via Midtrans
  → Redirect ke halaman sukses
```

**Pasca-Pembayaran:**
- Kirim email konfirmasi + e-ticket (Resend)
- Kirim WhatsApp konfirmasi (jika nomor HP diisi)
- Update stok kursi secara real-time
- Catat transaksi di database dengan status: `pending` → `paid` → `confirmed`

**Kriteria Penerimaan:**
- Checkout harus bisa diselesaikan dalam < 3 menit
- Midtrans webhook harus diproses dalam < 5 detik
- Jika pembayaran gagal, kursi yang di-hold dilepas setelah 15 menit
- Halaman sukses menampilkan ringkasan order dan tombol unduh e-ticket

---

### 5.6 Dashboard Member (F-09)

**Bagian-bagian:**
- **Tiket Aktif:** Seminar yang akan datang, dengan tombol unduh e-ticket dan tambah ke kalender
- **Riwayat:** Seminar yang sudah lewat
- **Profil:** Edit nama, email, nomor HP, foto profil
- **Notifikasi:** Preferensi reminder (email, WhatsApp)
- **Afiliasi:** Link ke dashboard afiliasi (jika terdaftar sebagai afiliator)

---

### 5.7 Program Afiliasi (F-13)

**Pendaftaran:**
- Form pendaftaran afiliasi (nama, email, nomor rekening, platform promosi)
- Approval manual oleh admin atau auto-approve
- Generate link unik per afiliator: `tdwresources.id/ref/[kode]`

**Dashboard Afiliator:**
- Total klik, konversi, komisi pending, komisi dibayar
- Grafik performa 30 hari terakhir
- Tabel transaksi detail (tanggal, seminar, komisi)
- Tombol salin link afiliasi
- Download materi promosi (banner 1:1, 16:9, caption template)

**Sistem Komisi:**
- Komisi dihitung otomatis saat transaksi berstatus `confirmed`
- Persentase komisi dikonfigurasi per seminar oleh admin
- Cookie tracking 30 hari (last-click attribution)
- Minimum pencairan: Rp 100.000

---

### 5.8 Admin CMS (F-10)

**Manajemen Seminar:**
- CRUD seminar: judul, deskripsi, kategori, thumbnail, kurikulum, pembicara
- Manajemen jadwal: tambah/edit/hapus jadwal per seminar
- Manajemen paket harga: nama paket, harga normal, harga early bird, kuota
- Toggle publish/draft/archived

**Manajemen Peserta:**
- Daftar peserta per seminar dengan status pembayaran
- Export CSV/Excel
- Manual add peserta (untuk pembayaran offline)
- Cetak daftar hadir

**Laporan:**
- Revenue per seminar, per periode, per kategori
- Sumber traffic (organik, afiliasi, direct)
- Conversion funnel report

---


## 6. Kebutuhan Non-Fungsional

### 6.1 Target Performa (Core Web Vitals)

| Metrik | Target | Alat Pengukuran |
|--------|--------|-----------------|
| Largest Contentful Paint (LCP) | < 2.5 detik | Vercel Analytics, PageSpeed Insights |
| Cumulative Layout Shift (CLS) | < 0.1 | Chrome DevTools |
| Interaction to Next Paint (INP) | < 200ms | Web Vitals JS |
| First Contentful Paint (FCP) | < 1.8 detik | Lighthouse |
| Time to First Byte (TTFB) | < 600ms | Vercel Edge Network |
| Total Page Weight (Homepage) | < 1.5 MB | WebPageTest |
| Uptime SLA | 99.9% | Vercel + Sentry monitoring |

### 6.2 Keamanan (Kebutuhan Keamanan)

- **Authentication:** OAuth 2.1 + OpenID Connect via Supabase Auth; JWT dengan expiry 1 jam, refresh token 30 hari
- **Authorization:** Row Level Security (RLS) di Supabase untuk semua tabel sensitif
- **Data Transmission:** HTTPS wajib (TLS 1.3), HSTS header aktif
- **Input Validation:** Semua input user divalidasi di server-side; proteksi XSS, SQL Injection, CSRF
- **Payment Security:** Tidak menyimpan data kartu kredit; semua transaksi melalui Midtrans (PCI-DSS compliant)
- **Rate Limiting:** API endpoint publik dibatasi 100 req/menit per IP; endpoint auth 5 req/15 menit
- **Secrets Management:** Semua API key dan credential disimpan di environment variables Vercel, tidak di-commit ke repository
- **Dependency Security:** Audit npm dependencies secara berkala; tidak menggunakan package dengan known CVE
- **Error Handling:** Error message tidak mengekspos stack trace atau informasi sistem ke user

### 6.3 Kebutuhan SEO

- **Meta Tags:** Title (≤ 60 karakter), description (≤ 160 karakter) unik per halaman
- **Structured Data (JSON-LD):** Schema `Event` untuk setiap halaman seminar, `Person` untuk profil TDW, `Organization` untuk homepage
- **Sitemap:** XML sitemap otomatis di-generate dan di-submit ke Google Search Console
- **Robots.txt:** Konfigurasi yang benar; blokir halaman admin, checkout, dashboard
- **Canonical URL:** Tag canonical pada semua halaman untuk mencegah duplicate content
- **Open Graph & Twitter Card:** Setiap halaman memiliki OG image, title, description
- **URL Structure:** Slug deskriptif dan SEO-friendly (contoh: `/seminar/property-revolution-jakarta-juni-2026`)
- **Core Web Vitals:** Semua halaman publik harus lulus threshold "Good" di Google Search Console
- **Internal Linking:** Setiap halaman seminar terhubung ke halaman kategori dan jadwal

### 6.4 Aksesibilitas (WCAG 2.2 Level AA)

- **Kontras Warna:** Rasio kontras minimum 4.5:1 untuk teks normal, 3:1 untuk teks besar
- **Keyboard Navigation:** Semua fitur interaktif dapat diakses via keyboard (Tab, Enter, Escape, Arrow keys)
- **Screen Reader:** Semua gambar memiliki alt text deskriptif; form memiliki label yang benar; ARIA roles digunakan dengan tepat
- **Focus Indicator:** Visible focus ring pada semua elemen interaktif
- **Form Accessibility:** Error message terhubung ke field via `aria-describedby`; required fields ditandai jelas
- **Skip Navigation:** Link "Skip to main content" tersedia di awal halaman
- **Responsive Text:** Teks dapat di-zoom hingga 200% tanpa kehilangan konten atau fungsi
- **Motion:** Animasi dapat dinonaktifkan via `prefers-reduced-motion` media query

### 6.5 Dukungan Browser & Perangkat

| Platform | Target |
|----------|--------|
| Chrome (Android & Desktop) | Versi terbaru - 2 |
| Safari (iOS & macOS) | Versi terbaru - 2 |
| Firefox | Versi terbaru - 2 |
| Samsung Internet | Versi terbaru |
| Mobile Breakpoint | 320px – 767px |
| Tablet Breakpoint | 768px – 1023px |
| Desktop Breakpoint | 1024px+ |
| Large Desktop | 1440px+ (max-width container) |


---


## 7. Di Luar Cakupan

Fitur-fitur berikut **tidak akan dibangun** pada versi pertama (v1.0) dan akan dipertimbangkan untuk roadmap berikutnya:

| # | Fitur | Alasan Ditunda |
|---|-------|----------------|
| 1 | Platform e-learning / LMS (video course, kuis, sertifikat digital) | Kompleksitas tinggi, butuh riset kebutuhan user lebih dalam |
| 2 | Aplikasi mobile native (iOS/Android) | Website mobile-first sudah mencukupi untuk v1; native app di v2 |
| 3 | Live streaming seminar online | Butuh infrastruktur video terpisah dan model bisnis baru |
| 4 | Multi-bahasa (Inggris, Mandarin) | Prioritas pasar domestik dulu |
| 5 | Marketplace pembicara tamu | Di luar core business TDW Resources saat ini |
| 6 | Forum komunitas / social features | Butuh moderasi dan infrastruktur tambahan |
| 7 | Opsi cicilan / paylater (Kredivo, Akulaku) | Integrasi kompleks; dipertimbangkan di v1.1 |
| 8 | Loyalty points & reward program | Butuh desain sistem yang matang |
| 9 | Transfer tiket antar user | Edge case yang jarang; butuh flow verifikasi khusus |
| 10 | Integrasi CRM eksternal (Salesforce, HubSpot) | Supabase + custom admin sudah cukup untuk v1 |

---


## 8. Jadwal & Milestone

### Asumsi Tim
- 1 Product Manager
- 2 Frontend Developer (Next.js/React)
- 1 Backend Developer (Supabase/Prisma)
- 1 UI/UX Designer
- 1 QA Engineer (part-time)

### Fase & Estimasi

| Fase | Durasi | Deliverables |
|------|--------|--------------|
| **Fase 0: Fondasi** | Minggu 1–2 | Setup repo, Supabase project, design system, DB schema, CI/CD pipeline |
| **Fase 1: Halaman Inti** | Minggu 3–6 | Homepage, Listing Seminar, Detail Seminar, Jadwal, Halaman About |
| **Fase 2: Auth & Checkout** | Minggu 7–10 | Register/Login, Checkout flow, Midtrans integration, E-ticket, Email transaksional |
| **Fase 3: Member & Admin** | Minggu 11–14 | Dashboard member, Admin CMS, Laporan penjualan, Manajemen peserta |
| **Fase 4: Afiliasi & Penyempurnaan** | Minggu 15–17 | Program afiliasi, WhatsApp notifikasi, SEO audit, Performance optimization |
| **Fase 5: QA & Peluncuran** | Minggu 18–20 | End-to-end testing, UAT, bug fixing, soft launch, monitoring setup |

### Milestone Kunci

| Milestone | Target Tanggal | Kriteria Selesai |
|-----------|---------------|-----------------|
| M1: Design System Disetujui | Akhir Minggu 2 | Figma design system di-approve stakeholder |
| M2: Homepage Live (Staging) | Akhir Minggu 4 | Homepage dapat diakses di staging URL |
| M3: Alur Pembelian End-to-End | Akhir Minggu 10 | User bisa beli tiket dari awal sampai terima e-ticket |
| M4: Admin CMS Live | Akhir Minggu 14 | Admin bisa kelola seminar tanpa bantuan developer |
| M5: Soft Launch | Minggu 18 | Website live di production dengan monitoring aktif |
| M6: Peluncuran Penuh | Minggu 20 | Semua fitur P1 & P2 live, laporan performa pertama tersedia |

### Dependensi

- Akses ke Midtrans merchant account (butuh verifikasi bisnis, estimasi 3–5 hari kerja)
- Konten seminar (deskripsi, foto, kurikulum) harus disediakan tim TDW sebelum Fase 1 selesai
- Approval desain dari stakeholder sebelum masuk development
- Nomor WhatsApp Business API untuk notifikasi (butuh approval Meta, estimasi 1–2 minggu)

---


## 9. Risiko & Mitigasi

### 9.1 Risiko Teknis

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|----------|
| Midtrans webhook gagal / delay | Sedang | Tinggi | Implementasi retry mechanism + manual reconciliation dashboard; alert via Sentry |
| Supabase downtime | Rendah | Tinggi | Aktifkan Supabase read replicas; cache data statis di Vercel Edge; status page monitoring |
| Performa buruk di mobile low-end | Sedang | Tinggi | Mobile-first development dari awal; test di device low-end (Redmi, Samsung A-series); budget JS ketat |
| Data breach / kebocoran data user | Rendah | Sangat Tinggi | RLS Supabase wajib; penetration testing sebelum launch; enkripsi data sensitif; audit log |
| Skalabilitas saat flash sale / promo besar | Sedang | Tinggi | Load testing sebelum launch; Vercel auto-scaling; database connection pooling via Prisma |
| Breaking changes di Next.js / React versi baru | Rendah | Sedang | Pin versi di package.json; update dependency terjadwal, bukan ad-hoc |

### 9.2 Risiko Bisnis

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|----------|
| Konten seminar tidak siap tepat waktu | Tinggi | Sedang | Buat content template dan deadline konten di minggu ke-3; assign content owner dari tim TDW |
| Stakeholder sering mengubah requirement | Sedang | Tinggi | Freeze requirement setelah Fase 0; change request melalui formal process dengan estimasi dampak |
| Adopsi admin CMS lambat | Sedang | Sedang | Sediakan dokumentasi + video tutorial; onboarding session untuk tim admin |
| Konversi tidak meningkat sesuai target | Sedang | Tinggi | A/B testing dari hari pertama; heatmap & session recording (PostHog); iterasi cepat berdasarkan data |
| Kompetitor meluncurkan fitur serupa | Rendah | Rendah | Fokus pada keunggulan brand TDW dan kualitas konten, bukan fitur semata |
| Afiliator tidak aktif menggunakan platform baru | Sedang | Sedang | Komunikasi proaktif ke afiliator existing; webinar onboarding; bonus early adopter |

### 9.3 Risiko Operasional

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|----------|
| Developer key person resign di tengah project | Rendah | Tinggi | Dokumentasi kode yang baik; knowledge sharing rutin; tidak ada single point of failure |
| Scope creep | Tinggi | Sedang | Backlog management ketat; fitur baru masuk ke sprint berikutnya, bukan sprint aktif |
| Bug kritis di production | Sedang | Tinggi | Staging environment wajib; feature flags untuk rollout bertahap; rollback plan tersedia |

---

## 10. Referensi Tech Stack

> Bagian ini sebagai referensi teknis untuk tim developer. Semua versi mengacu pada kondisi stabil per Mei 2026.

| Layer | Teknologi | Versi | Catatan |
|-------|-----------|-------|---------|
| Frontend Framework | Next.js | 16.2 | App Router, Turbopack stable |
| UI Library | React | 19.2 | View Transitions, Activity API |
| Language | TypeScript | 5.x | Strict mode, TSX |
| Styling | Tailwind CSS | v4 | CSS-first config, OKLCH colors |
| Component Library | shadcn/ui | Latest (new-york) | Tailwind v4 compatible |
| Toast | Sonner | Latest | Via shadcn/ui |
| Database | Supabase (PostgreSQL) | 17 | Auth, Storage, Realtime |
| ORM | Prisma | 7 | Full TypeScript, driver adapters |
| Runtime | Node.js | 22+ | — |
| Hosting | Vercel | — | Edge Network, Agent DevTools |
| Payment | Midtrans | — | Transfer, QRIS, CC, GoPay |
| Email | Resend + React Email | — | Transaksional email |
| Analytics | Vercel Analytics + PostHog | — | — |
| Monitoring | Sentry | — | Error tracking & alerting |

---

*Dokumen ini adalah living document. Setiap perubahan requirement harus melalui review Product Manager dan dicatat di changelog.*

**Changelog:**

| Versi | Tanggal | Perubahan | Author |
|-------|---------|-----------|--------|
| 1.0 | 14 Mei 2026 | Draft awal | Product Team |
