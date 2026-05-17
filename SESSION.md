# SESSION.md — TDW Resources

> Dokumen serah terima yang diperbarui setiap sesi. Baca ini sebelum melanjutkan pekerjaan.

---

## 1. Informasi Sesi

| Kolom | Nilai |
|-------|-------|
| **Tanggal** | 2026-05-16 |
| **Waktu** | 18:00 – 20:30 WIB |
| **Developer** | Ahkdan |
| **Sesi #** | 4 |

---

## 2. Fase & Progres Saat Ini

**Fase Aktif:** Fase 2 — Fitur Inti (sebagian) + Fase 4 — Admin Dashboard (sebagian)

```
Phase 0: Project Setup        ████████████████████  100% ✅
Phase 1: Foundation           ████████████████████  100% ✅
Phase 2: Core Features        ████████░░░░░░░░░░░░   40% 🔄
Phase 3: User Features        ████████░░░░░░░░░░░░   35% 🔄
Phase 4: Admin Dashboard      ████████░░░░░░░░░░░░   40% 🔄
Phase 5: Content & SEO        ░░░░░░░░░░░░░░░░░░░░    0%
Phase 6: Polish & Launch      ░░░░░░░░░░░░░░░░░░░░    0%
```

**Keseluruhan proyek:** ~45% selesai

---

## 3. Perubahan Arsitektur dari Sesi Sebelumnya

> ⚠️ **BREAKING CHANGE:** Prisma dihapus dari project. Database diakses langsung via Supabase client.

| Sebelum | Sekarang |
|---------|----------|
| Prisma 7 + `@prisma/adapter-neon` | **Dihapus** |
| `lib/db/client.ts` (Prisma client) | `lib/supabase/client.ts` (browser) + `lib/db/client.ts` (service role) |
| `prisma/schema.prisma` | Skema ada di `supabase/migrations/` |
| `prisma/seed.ts` | `supabase/migrations/20260516000002_seed_data.sql` |
| `middleware.ts` | **Tidak ada** — project ini pakai `proxy.ts` |

---

## 4. Diselesaikan Sesi Ini

### Infrastruktur
- [x] Supabase project sudah di-link (`rgwquajbnjghbyzyxwxc`)
- [x] Migration SQL dijalankan ke Supabase production
- [x] Trigger `on_auth_user_created` — auto-insert `public.users` + `public.profiles` saat signup
- [x] RLS policies untuk `users` dan `profiles`
- [x] Akun admin dibuat: `admin@tdwresources.id` / `Admin@TDW2026`
- [x] Akun user dibuat: `ahkdancoc@gmail.com` (role: USER)
- [x] `proxy.ts` diperbarui — enforce role dari `public.users` (bukan `user_metadata`)

### UI/UX Redesign (Pro Max)
- [x] `styles/globals.css` — dark luxury theme, gold accent `oklch(0.78 0.16 55)`, Inter + Playfair Display
- [x] `components/shared/navbar.tsx` — glassmorphism on scroll, animated mobile overlay
- [x] `app/(marketing)/page.tsx` — Hero fullscreen, Why Us, Process, Seminars, Testimonials, Pricing, FAQ, CTA
- [x] `app/(marketing)/about/page.tsx` — Storytelling layout, stats, visi/misi, team, media
- [x] `app/(marketing)/schedule/page.tsx` + `schedule-client.tsx` — server fetch + client filter
- [x] `app/(admin)/layout.tsx` — premium dark sidebar
- [x] `app/(admin)/admin/page.tsx` — KPI cards + recent orders dari Supabase
- [x] `app/(admin)/admin/orders/` — server + client component, filter search/status
- [x] `app/(admin)/admin/users/` — server + client component, filter search/role
- [x] `app/(dashboard)/layout.tsx` — premium sidebar user
- [x] `app/(dashboard)/dashboard/page.tsx` — stats, tiket aktif, rekomendasi
- [x] `app/(dashboard)/dashboard/tickets/page.tsx` — tab aktif/riwayat, QR placeholder
- [x] `app/(dashboard)/dashboard/profile/page.tsx` — edit form + custom toggle notifikasi

### Data Layer
- [x] `lib/supabase/client.ts` — browser client (anon key)
- [x] `lib/supabase/queries.ts` — semua query helpers dengan TypeScript types
- [x] `app/(auth)/callback/route.ts` — sync user ke `public.users` + redirect by role
- [x] `framer-motion@11.18.2` diinstall

---

## 5. File Dibuat / Dimodifikasi

```
CREATED
├── lib/supabase/client.ts
├── lib/supabase/queries.ts
├── middleware.ts                         ← DIHAPUS (konflik dengan proxy.ts)
├── scripts/seed-users.mjs
├── supabase/migrations/20260516000001_company_content.sql
├── supabase/migrations/20260516000002_seed_data.sql
├── supabase/migrations/20260516000003_auth_trigger_rls.sql
├── app/(marketing)/schedule/schedule-client.tsx
├── app/(admin)/admin/orders/orders-client.tsx
├── app/(admin)/admin/users/users-client.tsx

MODIFIED
├── proxy.ts                              — role enforcement dari public.users
├── styles/globals.css                    — dark luxury theme
├── app/layout.tsx                        — Inter + Playfair Display fonts
├── app/(marketing)/page.tsx              — full redesign + Supabase data
├── app/(marketing)/about/page.tsx        — full redesign + Supabase data
├── app/(marketing)/schedule/page.tsx     — server component, fetch Supabase
├── app/(admin)/layout.tsx                — premium sidebar
├── app/(admin)/admin/page.tsx            — Supabase data
├── app/(admin)/admin/orders/page.tsx     — server component
├── app/(admin)/admin/users/page.tsx      — server component
├── app/(dashboard)/layout.tsx            — premium sidebar
├── app/(dashboard)/dashboard/page.tsx    — redesign
├── app/(dashboard)/dashboard/tickets/page.tsx
├── app/(dashboard)/dashboard/profile/page.tsx
├── app/(auth)/callback/route.ts          — sync user + redirect by role
└── lib/auth/server.ts                    — fix type error
```

---

## 6. Kondisi Codebase Saat Ini

**Auth:** Berfungsi end-to-end. Login → redirect ke `/admin` (ADMIN) atau `/dashboard` (USER). Trigger auto-create user aktif untuk signup baru.

**Database:** Supabase production sudah punya data. Tabel `public.users` berisi 2 akun. Seed data seminar/jadwal/tiket sudah ada.

**UI:** Semua halaman marketing, admin, dan dashboard sudah didesain ulang dengan dark luxury theme. Data diambil dari Supabase dengan fallback.

**Build:** `npx next build` ✅ — 24 routes, 0 errors.

---

## 7. Akun yang Tersedia

| Email | Password | Role | Redirect |
|-------|----------|------|----------|
| `admin@tdwresources.id` | `Admin@TDW2026` | ADMIN | `/admin` |
| `ahkdancoc@gmail.com` | *(password saat daftar)* | USER | `/dashboard` |

---

## 8. Yang Belum Dikerjakan (Prioritas Berikutnya)

1. **Checkout flow** — halaman checkout, integrasi Midtrans Snap, webhook handler
2. **E-ticket PDF** — `@react-pdf/renderer`, QR code, upload ke Supabase Storage
3. **Halaman seminar detail** — `/seminars/[slug]` dengan pemilih jadwal + tiket
4. **Halaman seminar listing** — `/seminars` dengan filter kategori/kota
5. **Admin: manajemen seminar** — CRUD seminar, jadwal, tiket
6. **Sistem afiliasi** — dashboard afiliasi, tracking link, komisi
7. **Email transaksional** — Resend setup, template konfirmasi pesanan
8. **Blog** — listing + detail post
9. **SEO** — metadata dinamis, JSON-LD, sitemap

---

## 9. Instruksi untuk Developer Berikutnya

### Stack yang Digunakan
- **Next.js 16.2** App Router, `proxy.ts` (bukan `middleware.ts`)
- **Tailwind v4** CSS-first via `@theme` di `globals.css` — tidak ada `tailwind.config.js`
- **Supabase** langsung (tanpa Prisma) — `lib/supabase/client.ts` untuk browser, `lib/db/client.ts` untuk server
- **shadcn/ui new-york** — Sonner untuk toast, bukan `useToast`
- **React 19.2** — tanpa `forwardRef`, tanpa `useMemo`/`useCallback` manual

### Pola yang Harus Diikuti
- Data fetching: Server Components + `lib/supabase/queries.ts`
- Mutations: Server Actions di `server/actions/*.ts`
- Auth check di actions: `const session = await getServerSession()` → null check
- Semua nilai moneter: IDR sebagai integer (tanpa desimal)
- Fallback data: setiap halaman punya fallback jika Supabase kosong

### JANGAN
- Buat `middleware.ts` — project pakai `proxy.ts`
- Install atau referensikan Prisma — sudah dihapus
- Buat `tailwind.config.js` — Tailwind v4 CSS-first
- Gunakan `useEffect` untuk data fetching

---

*Terakhir diperbarui: 2026-05-16 20:30 WIB*
