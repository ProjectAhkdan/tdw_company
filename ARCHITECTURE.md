# ARCHITECTURE.md — TDW Resources

**Stack:** Next.js 16.2 · React 19.2 · TypeScript 5.x · Tailwind CSS v4 · Supabase · Vercel  
**Diperbarui:** 16 Mei 2026

> ⚠️ **Prisma telah dihapus dari stack.** Database diakses langsung via `@supabase/supabase-js`. Skema ada di `supabase/migrations/`.

---

## Daftar Isi

1. [Gambaran Sistem](#1-gambaran-sistem)
2. [Struktur Folder](#2-struktur-folder)
3. [Skema Database](#3-skema-database)
4. [Arsitektur Autentikasi](#4-arsitektur-autentikasi)
5. [Desain API](#5-desain-api)
6. [Strategi Cache](#6-strategi-cache)
7. [Manajemen State](#7-manajemen-state)
8. [Arsitektur Penyimpanan](#8-arsitektur-penyimpanan)
9. [Keamanan](#9-keamanan)
10. [Integrasi Pihak Ketiga](#10-integrasi-pihak-ketiga)
11. [Strategi Performa](#11-strategi-performa)

---

## 1. Gambaran Sistem

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│  Browser (React 19.2 + View Transitions + Activity API)             │
│  Zustand (client state) · React Hook Form v8 · next-intl v4         │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS / WebSocket
┌────────────────────────────▼────────────────────────────────────────┐
│                      VERCEL EDGE NETWORK                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Next.js 16.2 App Router (Turbopack)             │   │
│  │                                                              │   │
│  │  proxy.ts ──► Route Matching ──► RSC / Server Actions        │   │
│  │  (replaces middleware)    │         │                        │   │
│  │                           │         ▼                        │   │
│  │                    Cache Components  Server Actions           │   │
│  │                    (use cache)       (mutations)             │   │
│  │                           │         │                        │   │
│  │                    Route Handlers (webhooks, public API)     │   │
│  └──────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼──────┐  ┌────────▼───────┐  ┌──────▼──────────┐
│   Supabase     │  │   Supabase     │  │  Supabase       │
│   PostgreSQL17 │  │   Auth         │  │  Storage        │
│   (Supabase JS)│  │   OAuth 2.1    │  │  (S3-compatible)│
│   RLS Policies │  │   OIDC + JWT   │  │  500GB/file max │
└────────────────┘  └────────────────┘  └─────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                │
│  Midtrans (payment) · Resend (email) · PostHog (analytics)         │
│  Sentry (monitoring) · WhatsApp Business API                       │
└────────────────────────────────────────────────────────────────────┘
```

### Alur Data — Pembelian Tiket

```
User → Homepage → Seminar Detail → Checkout Form
  → Server Action: createOrder()
  → Supabase: INSERT order (status: pending)
  → Midtrans: createTransaction() → snap_token
  → Client: Midtrans Snap popup
  → User pays
  → Midtrans → POST /api/webhooks/midtrans
  → Route Handler: verifySignature() → updateOrder(paid)
  → Supabase Realtime → push to client
  → Resend: sendTicketEmail()
  → Response: redirect /dashboard/tickets
```

---

## 2. Struktur Folder

```
tdw-resources/
├── app/                              # Next.js 16 App Router
│   ├── (marketing)/                  # Route group — halaman publik
│   │   ├── page.tsx                  # Homepage
│   │   ├── seminars/
│   │   │   ├── page.tsx              # Listing seminar
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Detail seminar
│   │   ├── schedule/
│   │   │   └── page.tsx              # Jadwal seminar
│   │   ├── about/
│   │   │   └── page.tsx              # Profil TDW
│   │   └── blog/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   ├── (auth)/                       # Route group — halaman auth
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/route.ts         # OAuth callback handler
│   ├── (dashboard)/                  # Route group — terautentikasi
│   │   ├── layout.tsx                # Auth guard layout
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Dashboard member
│   │   │   ├── tickets/page.tsx
│   │   │   └── profile/page.tsx
│   │   └── affiliate/
│   │       ├── page.tsx              # Dashboard afiliasi
│   │       └── withdraw/page.tsx
│   ├── (admin)/                      # Route group — khusus admin
│   │   ├── layout.tsx                # Admin auth guard
│   │   ├── admin/
│   │   │   ├── page.tsx              # Ringkasan admin
│   │   │   ├── seminars/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── affiliates/page.tsx
│   ├── checkout/
│   │   ├── page.tsx                  # Halaman checkout
│   │   └── success/page.tsx
│   ├── api/
│   │   └── webhooks/
│   │       ├── midtrans/route.ts     # Webhook pembayaran
│   │       └── whatsapp/route.ts     # Webhook WA
│   ├── proxy.ts                      # Next.js 16 proxy (menggantikan middleware)
│   ├── layout.tsx                    # Root layout
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/                           # Primitif shadcn/ui (new-york)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── features/                     # Komponen spesifik domain
│   │   ├── seminar/
│   │   │   ├── seminar-card.tsx
│   │   │   ├── seminar-grid.tsx
│   │   │   ├── seminar-filter.tsx
│   │   │   └── seminar-detail-hero.tsx
│   │   ├── checkout/
│   │   │   ├── checkout-form.tsx
│   │   │   ├── order-summary.tsx
│   │   │   └── payment-method-selector.tsx
│   │   ├── affiliate/
│   │   │   ├── affiliate-stats.tsx
│   │   │   └── commission-table.tsx
│   │   └── dashboard/
│   │       ├── ticket-card.tsx
│   │       └── upcoming-seminars.tsx
│   └── shared/                       # Komponen lintas fitur
│       ├── navbar.tsx
│       ├── footer.tsx
│       ├── countdown-timer.tsx
│       ├── testimonial-carousel.tsx
│       └── whatsapp-button.tsx
│
├── lib/
│   ├── db/
│   │   └── client.ts                 # Supabase service role client (server-only)
│   ├── auth/
│   │   ├── server.ts                 # Supabase server client
│   │   ├── client.ts                 # Supabase browser client
│   │   └── session.ts                # Helper sesi
│   ├── utils/
│   │   ├── cn.ts                     # clsx + tailwind-merge
│   │   ├── format.ts                 # formatter mata uang, tanggal
│   │   └── slug.ts
│   ├── validators/
│   │   ├── seminar.ts                # Skema Zod v4
│   │   ├── checkout.ts
│   │   ├── auth.ts
│   │   └── affiliate.ts
│   └── email/
│       └── send.ts                   # Wrapper Resend
│
├── server/
│   ├── actions/                      # Server Actions (mutasi)
│   │   ├── auth.ts
│   │   ├── checkout.ts
│   │   ├── seminar.ts
│   │   ├── affiliate.ts
│   │   └── profile.ts
│   └── queries/                      # Pengambilan data sisi server
│       ├── seminars.ts
│       ├── orders.ts
│       ├── affiliates.ts
│       └── dashboard.ts
│
├── supabase/
│   ├── migrations/                   # SQL migrations (menggantikan Prisma)
│   ├── seed.sql                      # Seed data
│   └── config.toml
│
├── emails/                           # Template React Email
│   ├── ticket-confirmation.tsx
│   ├── seminar-reminder.tsx
│   ├── affiliate-commission.tsx
│   └── welcome.tsx
│
├── hooks/                            # Custom hooks sisi klien
│   ├── use-countdown.ts
│   ├── use-seminar-filter.ts
│   └── use-realtime-seats.ts
│
├── stores/                           # Zustand stores
│   ├── checkout-store.ts
│   └── ui-store.ts
│
├── types/
│   ├── database.ts                   # Re-export tipe Prisma yang di-generate
│   ├── supabase.ts                   # Tipe Supabase yang di-generate
│   └── index.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── styles/
│   └── globals.css                   # Tailwind v4: @import "tailwindcss" + @theme
│
└── [file konfigurasi]
    ├── next.config.ts
    ├── tsconfig.json
    ├── package.json
    └── .env.local
```

---

## 3. Skema Database

> Skema database ada di `supabase/migrations/`. Tidak menggunakan Prisma.

### lib/supabase/queries.ts

```typescript
import { supabase } from './client'

// Contoh query
export async function getFeaturedSeminars() {
  const { data, error } = await supabase
    .from('schedules')
    .select(`id, start_date, city, venue,
      seminar:seminars!inner(title, category:categories(name)),
      tickets(price, quota, sold)`)
    .gte('start_date', new Date().toISOString())
    .order('start_date')
    .limit(3)
  return { data, error }
}
      const sql = neon(env.DATABASE_URL)
      return new PrismaNeon({ connectionString: env.DATABASE_URL })
    },
  },
})
```

### prisma/schema.prisma

```prisma
generator client {
  provider        = "prisma-client"
  output          = "../node_modules/.prisma/client"
  previewFeatures = ["queryCompiler", "driverAdapters"]
}

// ─── ENUMS ────────────────────────────────────────────────────────────────────

enum Role {
  USER
  AFFILIATE
  ADMIN
}

enum SeminarStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum OrderStatus {
  PENDING
  PAID
  CONFIRMED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  EXPIRED
}

enum PaymentMethod {
  BANK_TRANSFER
  QRIS
  CREDIT_CARD
  GOPAY
}

enum CommissionStatus {
  PENDING
  APPROVED
  PAID
  REJECTED
}

enum WithdrawalStatus {
  PENDING
  PROCESSING
  COMPLETED
  REJECTED
}

// ─── MODELS ───────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(uuid())
  supabaseId    String    @unique @map("supabase_id")
  email         String    @unique
  role          Role      @default(USER)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  profile       Profile?
  orders        Order[]
  affiliate     Affiliate?
  notifications Notification[]

  @@map("users")
}

model Profile {
  id          String   @id @default(uuid())
  userId      String   @unique @map("user_id")
  fullName    String   @map("full_name")
  phone       String?
  avatarUrl   String?  @map("avatar_url")
  city        String?
  occupation  String?
  notifyEmail Boolean  @default(true) @map("notify_email")
  notifyWa    Boolean  @default(true) @map("notify_wa")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Category {
  id        String    @id @default(uuid())
  name      String    @unique
  slug      String    @unique
  color     String?
  seminars  Seminar[]

  @@map("categories")
}

model Seminar {
  id              String        @id @default(uuid())
  slug            String        @unique
  title           String
  shortDesc       String        @map("short_desc")
  description     String        // rich text / MDX
  thumbnailUrl    String?       @map("thumbnail_url")
  categoryId      String        @map("category_id")
  status          SeminarStatus @default(DRAFT)
  isFeatured      Boolean       @default(false) @map("is_featured")
  metaTitle       String?       @map("meta_title")
  metaDescription String?       @map("meta_description")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  category        Category      @relation(fields: [categoryId], references: [id])
  schedules       Schedule[]
  testimonials    Testimonial[]
  commissions     CommissionRate[]

  @@index([slug])
  @@index([categoryId])
  @@index([status, isFeatured])
  @@map("seminars")
}

model Schedule {
  id           String   @id @default(uuid())
  seminarId    String   @map("seminar_id")
  startDate    DateTime @map("start_date")
  endDate      DateTime @map("end_date")
  city         String
  venue        String
  address      String?
  createdAt    DateTime @default(now()) @map("created_at")

  seminar      Seminar  @relation(fields: [seminarId], references: [id], onDelete: Cascade)
  tickets      Ticket[]

  @@index([seminarId])
  @@index([startDate])
  @@map("schedules")
}

model Ticket {
  id           String   @id @default(uuid())
  scheduleId   String   @map("schedule_id")
  name         String   // e.g. "Regular", "VIP", "VVIP"
  price        Int      // in IDR (cents not used)
  earlyBirdPrice Int?   @map("early_bird_price")
  earlyBirdUntil DateTime? @map("early_bird_until")
  quota        Int
  sold         Int      @default(0)

  schedule     Schedule    @relation(fields: [scheduleId], references: [id], onDelete: Cascade)
  orderItems   OrderItem[]

  @@index([scheduleId])
  @@map("tickets")
}

model Order {
  id              String      @id @default(uuid())
  userId          String      @map("user_id")
  status          OrderStatus @default(PENDING)
  totalAmount     Int         @map("total_amount")
  affiliateCode   String?     @map("affiliate_code")
  snapToken       String?     @map("snap_token")     // Midtrans
  midtransOrderId String?     @unique @map("midtrans_order_id")
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")
  expiresAt       DateTime?   @map("expires_at")     // 15 min hold

  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]
  payment         Payment?
  commission      Commission?

  @@index([userId])
  @@index([status])
  @@index([midtransOrderId])
  @@map("orders")
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String  @map("order_id")
  ticketId  String  @map("ticket_id")
  quantity  Int
  unitPrice Int     @map("unit_price")
  subtotal  Int

  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  ticket    Ticket  @relation(fields: [ticketId], references: [id])

  @@index([orderId])
  @@map("order_items")
}

model Payment {
  id              String        @id @default(uuid())
  orderId         String        @unique @map("order_id")
  status          PaymentStatus @default(PENDING)
  method          PaymentMethod?
  amount          Int
  midtransPayload Json?         @map("midtrans_payload")
  paidAt          DateTime?     @map("paid_at")
  createdAt       DateTime      @default(now()) @map("created_at")

  order           Order         @relation(fields: [orderId], references: [id])

  @@index([orderId])
  @@map("payments")
}

model Affiliate {
  id            String   @id @default(uuid())
  userId        String   @unique @map("user_id")
  code          String   @unique
  bankName      String?  @map("bank_name")
  bankAccount   String?  @map("bank_account")
  bankHolder    String?  @map("bank_holder")
  isApproved    Boolean  @default(false) @map("is_approved")
  totalEarned   Int      @default(0) @map("total_earned")
  totalWithdrawn Int     @default(0) @map("total_withdrawn")
  createdAt     DateTime @default(now()) @map("created_at")

  user          User         @relation(fields: [userId], references: [id])
  commissions   Commission[]
  withdrawals   Withdrawal[]

  @@index([code])
  @@map("affiliates")
}

model CommissionRate {
  id         String  @id @default(uuid())
  seminarId  String  @map("seminar_id")
  percentage Float   // e.g. 10.0 = 10%

  seminar    Seminar @relation(fields: [seminarId], references: [id], onDelete: Cascade)

  @@unique([seminarId])
  @@map("commission_rates")
}

model Commission {
  id          String           @id @default(uuid())
  affiliateId String           @map("affiliate_id")
  orderId     String           @unique @map("order_id")
  amount      Int
  status      CommissionStatus @default(PENDING)
  createdAt   DateTime         @default(now()) @map("created_at")
  paidAt      DateTime?        @map("paid_at")

  affiliate   Affiliate        @relation(fields: [affiliateId], references: [id])
  order       Order            @relation(fields: [orderId], references: [id])

  @@index([affiliateId])
  @@map("commissions")
}

model Withdrawal {
  id          String           @id @default(uuid())
  affiliateId String           @map("affiliate_id")
  amount      Int
  status      WithdrawalStatus @default(PENDING)
  notes       String?
  processedAt DateTime?        @map("processed_at")
  createdAt   DateTime         @default(now()) @map("created_at")

  affiliate   Affiliate        @relation(fields: [affiliateId], references: [id])

  @@index([affiliateId])
  @@map("withdrawals")
}

model Testimonial {
  id         String   @id @default(uuid())
  seminarId  String?  @map("seminar_id")
  authorName String   @map("author_name")
  authorRole String?  @map("author_role")
  avatarUrl  String?  @map("avatar_url")
  content    String
  videoUrl   String?  @map("video_url")
  rating     Int      @default(5)
  isFeatured Boolean  @default(false) @map("is_featured")
  createdAt  DateTime @default(now()) @map("created_at")

  seminar    Seminar? @relation(fields: [seminarId], references: [id], onDelete: SetNull)

  @@index([seminarId, isFeatured])
  @@map("testimonials")
}

model BlogPost {
  id              String   @id @default(uuid())
  slug            String   @unique
  title           String
  excerpt         String
  content         String
  thumbnailUrl    String?  @map("thumbnail_url")
  authorName      String   @map("author_name")
  isPublished     Boolean  @default(false) @map("is_published")
  publishedAt     DateTime? @map("published_at")
  metaTitle       String?  @map("meta_title")
  metaDescription String?  @map("meta_description")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@index([slug])
  @@index([isPublished, publishedAt])
  @@map("blog_posts")
}

model Notification {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  type      String   // "reminder_7d" | "reminder_1d" | "payment_success" | etc.
  title     String
  body      String
  isRead    Boolean  @default(false) @map("is_read")
  metadata  Json?
  createdAt DateTime @default(now()) @map("created_at")

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@map("notifications")
}
```

---

## 4. Arsitektur Autentikasi

### Gambaran Umum

```
Browser
  │
  ├─ Google OAuth → Supabase Auth (OAuth 2.1 + OIDC)
  │                      │
  │                      ▼
  │               Supabase issues asymmetric JWT
  │               (RS256, public key verifiable without DB round-trip)
  │                      │
  ├─ Email/Password ──────┘
  │
  ▼
proxy.ts (Next.js 16) — reads JWT from cookie
  │
  ├─ /admin/* → require role = ADMIN
  ├─ /dashboard/* → require authenticated
  ├─ /affiliate/* → require role = AFFILIATE | ADMIN
  └─ public routes → pass through
```

### proxy.ts (Next.js 16 — menggantikan middleware.ts)

```typescript
// app/proxy.ts
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* get/set helpers */ } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  if (path.startsWith('/dashboard') || path.startsWith('/checkout')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  if (path.startsWith('/admin')) {
    const role = user?.user_metadata?.role
    if (role !== 'ADMIN') return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/checkout/:path*', '/affiliate/:path*'],
}
```

### Strategi RBAC

| Peran | Akses |
|-------|-------|
| `USER` | Dashboard, checkout, tiket, profil |
| `AFFILIATE` | Akses USER + dashboard afiliasi, komisi, penarikan |
| `ADMIN` | Akses penuh: CMS, pesanan, pengguna, laporan, manajemen afiliasi |

- Role disimpan di `users.role` (PostgreSQL) dan di-sync ke `user_metadata` Supabase JWT
- Setiap Server Action memvalidasi role via `getServerSession()` sebelum eksekusi
- RLS Supabase sebagai defense-in-depth (lihat Bagian 9)

### lib/auth/server.ts

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/client'

export async function getServerSession() {
  const cookieStore = await cookies()
  const supabase = createServerClient(/* ... */)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  return prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { profile: true },
  })
}

export async function requireRole(role: 'ADMIN' | 'AFFILIATE') {
  const session = await getServerSession()
  if (!session || session.role !== role) throw new Error('Unauthorized')
  return session
}
```



---

## 5. Desain API

### Prinsip: Server Actions vs Route Handlers

| Kriteria | Server Actions | Route Handlers |
|----------|---------------|----------------|
| **Gunakan untuk** | Mutasi dari UI (form submit, klik tombol) | Webhook eksternal, public REST API, unduh file |
| **Auth** | `getServerSession()` di awal action | Verifikasi signature / API key di header |
| **Response** | Return value / redirect / throw | `NextResponse.json()` |
| **Contoh** | `createOrder`, `updateProfile`, `publishSeminar` | `POST /api/webhooks/midtrans`, `GET /api/seminars` |

### Server Actions — Contoh Pola

```typescript
// server/actions/checkout.ts
'use server'

import { getServerSession } from '@/lib/auth/server'
import { prisma } from '@/lib/db/client'
import { checkoutSchema } from '@/lib/validators/checkout'
import { createMidtransTransaction } from '@/lib/midtrans'
import { redirect } from 'next/navigation'

export async function createOrder(formData: FormData) {
  const session = await getServerSession()
  if (!session) redirect('/login')

  const input = checkoutSchema.parse(Object.fromEntries(formData))

  // 1. Validate ticket availability
  const ticket = await prisma.ticket.findUniqueOrThrow({
    where: { id: input.ticketId },
  })
  if (ticket.quota - ticket.sold < input.quantity) {
    throw new Error('Insufficient seats')
  }

  // 2. Create order with 15-min expiry hold
  const order = await prisma.order.create({
    data: {
      userId: session.id,
      totalAmount: ticket.price * input.quantity,
      affiliateCode: input.affiliateCode ?? null,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      items: {
        create: {
          ticketId: ticket.id,
          quantity: input.quantity,
          unitPrice: ticket.price,
          subtotal: ticket.price * input.quantity,
        },
      },
    },
  })

  // 3. Get Midtrans snap token
  const { token } = await createMidtransTransaction(order)

  return { orderId: order.id, snapToken: token }
}
```

### Route Handler — Webhook Midtrans

```typescript
// app/api/webhooks/midtrans/route.ts
import { verifyMidtransSignature } from '@/lib/midtrans'
import { prisma } from '@/lib/db/client'
import { sendTicketEmail } from '@/lib/email/send'

export async function POST(request: Request) {
  const payload = await request.json()

  if (!verifyMidtransSignature(payload)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const order = await prisma.order.update({
    where: { midtransOrderId: payload.order_id },
    data: {
      status: payload.transaction_status === 'settlement' ? 'PAID' : 'CANCELLED',
      payment: {
        update: {
          status: payload.transaction_status === 'settlement' ? 'SUCCESS' : 'FAILED',
          method: mapPaymentMethod(payload.payment_type),
          midtransPayload: payload,
          paidAt: new Date(),
        },
      },
    },
    include: { user: { include: { profile: true } }, items: true },
  })

  if (order.status === 'PAID') {
    await sendTicketEmail(order)
    await calculateAffiliateCommission(order)
  }

  return Response.json({ received: true })
}
```

### Query Server — Pola Pengambilan Data

```typescript
// server/queries/seminars.ts
import { prisma } from '@/lib/db/client'
import { unstable_cache } from 'next/cache'

export const getFeaturedSeminars = unstable_cache(
  async () => {
    return prisma.seminar.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      include: {
        category: true,
        schedules: {
          where: { startDate: { gte: new Date() } },
          orderBy: { startDate: 'asc' },
          take: 1,
          include: { tickets: true },
        },
      },
      take: 4,
    })
  },
  ['featured-seminars'],
  { revalidate: 300, tags: ['seminars'] }
)
```

---

## 6. Strategi Cache

### Hierarki Cache Next.js 16

```
Request
  │
  ├─ 1. Full Route Cache (static HTML — build time)
  │       └─ Halaman statis: /about, /blog/[slug]
  │
  ├─ 2. Cache Components (use cache directive — PPR)
  │       └─ Komponen mahal: seminar listing, testimonials, stats
  │
  ├─ 3. unstable_cache / fetch cache (data layer)
  │       └─ Query DB yang sering dipanggil
  │
  └─ 4. No cache (dynamic)
          └─ Dashboard, checkout, admin pages
```

### Direktif `use cache` (Next.js 16 Cache Components)

```typescript
// components/features/seminar/seminar-grid.tsx
import { use cache } from 'react'  // Next.js 16 Cache Components

async function SeminarGrid({ categorySlug }: { categorySlug?: string }) {
  'use cache'
  // Komponen ini di-cache di server, revalidate via tag
  const seminars = await getSeminarsByCategory(categorySlug)
  return <div>{/* render */}</div>
}
```

### Tag Cache & Strategi Revalidasi

| Data | Durasi Cache | Tag | Pemicu Revalidasi |
|------|-------------|-----|-------------------|
| Seminar unggulan | 5 menit | `seminars` | Admin publish/update seminar |
| Detail seminar | 10 menit | `seminar-[slug]` | Admin edit seminar spesifik |
| Daftar jadwal | 2 menit | `schedules` | Admin tambah/edit jadwal |
| Testimoni | 1 jam | `testimonials` | Admin tambah testimoni |
| Artikel blog | 1 jam | `blog` | Admin publish artikel |
| Jumlah kursi | 30 detik | `seats-[ticketId]` | Setiap transaksi selesai |

### Revalidasi On-Demand

```typescript
// server/actions/seminar.ts
import { revalidateTag, revalidatePath } from 'next/cache'

export async function publishSeminar(seminarId: string) {
  await requireRole('ADMIN')
  await prisma.seminar.update({ where: { id: seminarId }, data: { status: 'PUBLISHED' } })

  revalidateTag('seminars')
  revalidatePath('/seminars')
  revalidatePath(`/seminars/${seminar.slug}`)
}
```

### Partial Pre-Rendering (PPR) — Homepage

```
Homepage (PPR enabled)
├── [STATIS — di-cache]  Navbar, Hero section, Stats bar
├── [STATIS — di-cache]  Grid seminar unggulan (cache 5 menit)
├── [STATIS — di-cache]  Carousel testimoni (cache 1 jam)
└── [DINAMIS]            Penghitung ketersediaan kursi (real-time)
                         CTA spesifik pengguna (sudah login / tamu)
```


---

## 7. Manajemen State

### Prinsip

```
Server State  →  Server Components + Server Actions + unstable_cache
Client State  →  Zustand (UI state, checkout flow, filters)
Form State    →  React Hook Form v8 + Zod v4
Async State   →  React 19 use() + Suspense (no useEffect for data fetching)
```

### Zustand Stores

```typescript
// stores/checkout-store.ts
import { create } from 'zustand'

interface CheckoutState {
  step: 1 | 2 | 3
  selectedTicketId: string | null
  quantity: number
  affiliateCode: string | null
  snapToken: string | null
  setStep: (step: 1 | 2 | 3) => void
  setTicket: (ticketId: string, quantity: number) => void
  setSnapToken: (token: string) => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 1,
  selectedTicketId: null,
  quantity: 1,
  affiliateCode: null,
  snapToken: null,
  setStep: (step) => set({ step }),
  setTicket: (selectedTicketId, quantity) => set({ selectedTicketId, quantity }),
  setSnapToken: (snapToken) => set({ snapToken }),
  reset: () => set({ step: 1, selectedTicketId: null, quantity: 1, snapToken: null }),
}))
```

```typescript
// stores/ui-store.ts — state UI global minimal
import { create } from 'zustand'

interface UIState {
  mobileMenuOpen: boolean
  toggleMobileMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
}))
```

### React Hook Form v8 + Zod v4

```typescript
// lib/validators/checkout.ts
import { z } from 'zod/v4'

export const checkoutSchema = z.object({
  ticketId: z.string().uuid(),
  quantity: z.int().min(1).max(10),
  fullName: z.string().min(2).max(100),
  email: z.email(),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/),
  affiliateCode: z.string().optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
```

### Supabase Realtime — Jumlah Kursi

```typescript
// hooks/use-realtime-seats.ts
'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export function useRealtimeSeats(ticketId: string, initialSold: number) {
  const [sold, setSold] = useState(initialSold)
  const supabase = createBrowserClient(/* ... */)

  useEffect(() => {
    const channel = supabase
      .channel(`ticket-${ticketId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tickets',
        filter: `id=eq.${ticketId}`,
      }, (payload) => setSold(payload.new.sold))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [ticketId])

  return sold
}
```

---

## 8. Arsitektur Penyimpanan

### Bucket Supabase Storage

| Bucket | Akses | Ukuran Maks | Konten |
|--------|-------|-------------|--------|
| `product-images` | Publik | 10 MB | Thumbnail seminar, banner |
| `avatars` | Publik | 2 MB | Foto profil pengguna |
| `documents` | Privat (auth) | 50 MB | E-ticket PDF, materi afiliasi |
| `certificates` | Privat (auth) | 5 MB | Sertifikat peserta (masa depan) |
| `promo-assets` | Publik | 20 MB | Banner afiliasi, template promosi |

### Alur Upload — Gambar Produk (Admin)

```
Admin upload via CMS form
  → Client: supabase.storage.from('product-images').upload(path, file)
  → Supabase Storage validates: size, MIME type (image/*)
  → Returns public URL
  → Server Action: prisma.seminar.update({ thumbnailUrl: publicUrl })
```

### Alur Upload — E-Ticket PDF (Pasca-Pembayaran)

```
Payment webhook confirmed
  → Server: generate PDF via @react-pdf/renderer
  → Server: supabase.storage.from('documents').upload(`tickets/${orderId}.pdf`, pdfBuffer)
  → Signed URL (expires 7 days): supabase.storage.createSignedUrl(path, 604800)
  → Store signed URL in order record
  → Send via email (Resend) + available in dashboard
```

### Kebijakan RLS Storage

```sql
-- avatars: user hanya bisa upload/update avatar miliknya sendiri
CREATE POLICY "Users manage own avatar"
ON storage.objects FOR ALL
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- documents: user hanya bisa baca dokumen miliknya
CREATE POLICY "Users read own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- product-images: hanya admin yang bisa upload
CREATE POLICY "Admin manage product images"
ON storage.objects FOR ALL
USING (bucket_id = 'product-images' AND auth.jwt() ->> 'role' = 'ADMIN');
```


---

## 9. Keamanan

### 9.1 Kebijakan RLS Supabase

```sql
-- users: hanya bisa baca/update data sendiri
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own record"
ON users FOR SELECT USING (supabase_id = auth.uid()::text);

CREATE POLICY "Admin read all users"
ON users FOR SELECT USING (auth.jwt() ->> 'role' = 'ADMIN');

-- orders: user hanya bisa lihat order miliknya
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own orders"
ON orders FOR SELECT
USING (user_id = (SELECT id FROM users WHERE supabase_id = auth.uid()::text));

CREATE POLICY "Admin read all orders"
ON orders FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- affiliates: affiliate hanya bisa lihat data sendiri
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliate read own commissions"
ON commissions FOR SELECT
USING (
  affiliate_id = (
    SELECT a.id FROM affiliates a
    JOIN users u ON u.id = a.user_id
    WHERE u.supabase_id = auth.uid()::text
  )
);
```

### 9.2 JWT Asimetris (Supabase)

Supabase menggunakan RS256 (asimetris) JWT. Server dapat memverifikasi token menggunakan **public key** tanpa round-trip ke Supabase Auth — mengurangi latensi dan dependensi.

```typescript
// lib/auth/verify-jwt.ts
import * as jose from 'jose'

const SUPABASE_JWT_PUBLIC_KEY = process.env.SUPABASE_JWT_PUBLIC_KEY!

export async function verifySupabaseJWT(token: string) {
  const publicKey = await jose.importSPKI(SUPABASE_JWT_PUBLIC_KEY, 'RS256')
  const { payload } = await jose.jwtVerify(token, publicKey, {
    issuer: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })
  return payload
}
```

### 9.3 Rate Limiting (Vercel Edge)

```typescript
// app/proxy.ts — rate limiting via Vercel KV
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '1 m'),  // 100 req/min per IP
})

// Batas lebih ketat untuk endpoint auth
const authRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '15 m'),   // 5 req/15 min
})
```

### 9.4 Variabel Lingkungan

```bash
# .env.local — TIDAK di-commit ke git

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Hanya server, tidak diekspos ke klien
SUPABASE_JWT_PUBLIC_KEY=          # Public key RS256 untuk verifikasi JWT

# Database
DATABASE_URL=                     # String koneksi Supabase (pooled)
DIRECT_URL=                       # Koneksi langsung untuk migrasi

# Midtrans
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=  # Aman untuk diekspos (public key)

# Resend
RESEND_API_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Sentry
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# WhatsApp Business API
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

### 9.5 Header Keamanan (next.config.ts)

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://app.midtrans.com https://cdn.jsdelivr.net",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.midtrans.com",
      "img-src 'self' data: blob: https://*.supabase.co",
    ].join('; '),
  },
]
```


---

## 10. Integrasi Pihak Ketiga

### 10.1 Midtrans — Alur Pembayaran Lengkap

```
Client                    Server                    Midtrans
  │                          │                          │
  │── createOrder() ────────►│                          │
  │                          │── createTransaction() ──►│
  │                          │◄── { snap_token } ───────│
  │◄── { snapToken } ────────│                          │
  │                          │                          │
  │── Midtrans.snap.pay() ──────────────────────────────►│
  │                          │                          │ (user pays)
  │                          │◄── POST /webhooks/midtrans│
  │                          │    (notification)        │
  │                          │── verifySignature()      │
  │                          │── updateOrder(PAID)      │
  │                          │── sendTicketEmail()      │
  │◄── Realtime update ──────│                          │
```

**Verifikasi Signature:**
```typescript
// lib/midtrans.ts
import crypto from 'crypto'

export function verifyMidtransSignature(payload: MidtransNotification): boolean {
  const hash = crypto
    .createHash('sha512')
    .update(`${payload.order_id}${payload.status_code}${payload.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
    .digest('hex')
  return hash === payload.signature_key
}
```

**Pembersihan Order Kedaluwarsa** — Cron job via Vercel Cron:
```
Schedule: */15 * * * *  (setiap 15 menit)
Action: UPDATE orders SET status='CANCELLED' WHERE status='PENDING' AND expires_at < NOW()
        → release held seats: UPDATE tickets SET sold = sold - quantity
```

### 10.2 Resend + React Email

**Struktur Template:**
```
emails/
├── ticket-confirmation.tsx   # Konfirmasi pembelian + lampiran e-ticket
├── seminar-reminder.tsx      # Pengingat H-7, H-3, H-1
├── affiliate-commission.tsx  # Notifikasi komisi masuk
└── welcome.tsx               # Email selamat datang setelah registrasi
```

**Helper Pengiriman:**
```typescript
// lib/email/send.ts
import { Resend } from 'resend'
import { TicketConfirmation } from '@/emails/ticket-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTicketEmail(order: OrderWithDetails) {
  await resend.emails.send({
    from: 'TDW Resources <noreply@tdwresources.id>',
    to: order.user.email,
    subject: `Tiket Anda: ${order.items[0].ticket.schedule.seminar.title}`,
    react: TicketConfirmation({ order }),
    attachments: [{
      filename: `tiket-${order.id}.pdf`,
      content: await generateTicketPDF(order),
    }],
  })
}
```

**Cron Pengingat (Vercel Cron):**
```
H-7: 0 8 * * *  → query schedules WHERE startDate = NOW() + 7 days
H-1: 0 8 * * *  → query schedules WHERE startDate = NOW() + 1 day
```

### 10.3 PostHog — Pelacakan Event

```typescript
// lib/analytics.ts
import posthog from 'posthog-js'

export const analytics = {
  seminarViewed: (seminarId: string, slug: string) =>
    posthog.capture('seminar_viewed', { seminar_id: seminarId, slug }),

  checkoutStarted: (orderId: string, amount: number) =>
    posthog.capture('checkout_started', { order_id: orderId, amount }),

  purchaseCompleted: (orderId: string, amount: number, seminarTitle: string) =>
    posthog.capture('purchase_completed', {
      order_id: orderId,
      amount,
      seminar_title: seminarTitle,
      currency: 'IDR',
    }),

  affiliateLinkClicked: (affiliateCode: string, seminarSlug: string) =>
    posthog.capture('affiliate_link_clicked', { code: affiliateCode, seminar: seminarSlug }),
}
```

**Event Utama yang Dilacak:**

| Event | Pemicu | Properti |
|-------|--------|----------|
| `page_viewed` | Setiap navigasi | path, referrer |
| `seminar_viewed` | Buka halaman detail | seminar_id, category |
| `checkout_started` | Klik "Daftar Sekarang" | ticket_id, price |
| `checkout_step_completed` | Selesai tiap step | step (1/2/3) |
| `purchase_completed` | Pembayaran sukses | order_id, amount, seminar |
| `affiliate_link_clicked` | Kunjungan via link referral | affiliate_code |
| `login_completed` | Login berhasil | method (email/google) |


---

## 11. Strategi Performa

### 11.1 Target Core Web Vitals

| Metrik | Target | Strategi |
|--------|--------|----------|
| LCP | < 2.5s | Preload gambar hero, prop `priority` Next/Image, CDN Vercel Edge |
| CLS | < 0.1 | Width/height eksplisit semua gambar, skeleton loaders, font `display: swap` |
| INP | < 200ms | React Compiler (auto-memo), Server Actions (tanpa JS klien untuk mutasi) |
| FCP | < 1.8s | PPR — shell statis disajikan instan, konten dinamis streaming |
| TTFB | < 600ms | Vercel Edge Network, Cache Components, database connection pooling |

### 11.2 React 19.2 View Transitions

```typescript
// app/(marketing)/seminars/[slug]/page.tsx
import { unstable_ViewTransition as ViewTransition } from 'react'

// Seminar card → detail page transition
export default function SeminarDetailPage() {
  return (
    <ViewTransition name={`seminar-${params.slug}`}>
      <SeminarDetailHero />
    </ViewTransition>
  )
}

// Seminar card di listing page
function SeminarCard({ seminar }: { seminar: Seminar }) {
  return (
    <ViewTransition name={`seminar-${seminar.slug}`}>
      <Link href={`/seminars/${seminar.slug}`}>
        <img src={seminar.thumbnailUrl} />
        <h3>{seminar.title}</h3>
      </Link>
    </ViewTransition>
  )
}
```

### 11.3 Optimasi Gambar

```typescript
// Semua gambar menggunakan next/image
import Image from 'next/image'

// Hero image — preload, priority
<Image
  src={seminar.thumbnailUrl}
  alt={seminar.title}
  width={1200}
  height={630}
  priority          // preload untuk LCP
  placeholder="blur"
  blurDataURL={seminar.blurHash}
/>

// Gambar di bawah fold — lazy load (default)
<Image
  src={speaker.avatarUrl}
  alt={speaker.name}
  width={80}
  height={80}
  // lazy load by default
/>
```

**next.config.ts — Domain gambar:**
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

### 11.4 Strategi Font & Sistem Warna

```css
/* styles/globals.css */
@import "tailwindcss";

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
}

@theme {
  /* Font */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-heading: 'Inter', system-ui, sans-serif;

  /* Tema Gelap + Aksen Oranye */
  --color-background: oklch(0.08 0 0);           /* #0A0A0A — hitam sangat gelap */
  --color-foreground: oklch(0.95 0 0);           /* putih/abu sangat terang */
  --color-muted: oklch(0.4 0 0);                 /* abu-abu muted untuk teks sekunder */
  --color-muted-foreground: oklch(0.65 0 0);     /* abu-abu terang */

  --color-primary: oklch(0.75 0.18 55);          /* oranye/amber utama */
  --color-primary-foreground: oklch(0.1 0 0);    /* teks gelap di atas oranye */
  --color-primary-glow: oklch(0.75 0.18 55 / 0.3); /* efek glow oranye */

  --color-card: oklch(0.12 0.005 55 / 0.6);     /* card semi-transparan gelap */
  --color-card-border: oklch(0.3 0.05 55 / 0.3); /* border halus oranye */
  --color-card-foreground: oklch(0.9 0 0);

  --color-secondary: oklch(0.15 0.01 55);        /* background sekunder */
  --color-accent: oklch(0.8 0.15 55);            /* aksen oranye terang */
  --color-destructive: oklch(0.6 0.2 25);        /* merah untuk error */

  --color-border: oklch(0.2 0.01 55 / 0.5);     /* border default */
  --color-ring: oklch(0.75 0.18 55 / 0.5);      /* focus ring oranye */

  /* Radius & Efek */
  --radius-lg: 1rem;
  --radius-md: 0.75rem;
  --radius-sm: 0.5rem;

  /* Glassmorphism */
  --glass-bg: oklch(0.12 0.005 55 / 0.4);
  --glass-border: oklch(0.3 0.05 55 / 0.2);
  --glass-blur: 12px;
}
```

**Catatan Desain:**
- Tema default adalah **dark mode** — tidak ada light mode pada v1
- Semua card menggunakan efek **glassmorphism** (backdrop-blur + background semi-transparan + border halus)
- Elemen interaktif (tombol, link, ikon aktif) menggunakan warna **oranye/amber** dengan efek **glow**
- Gradien radial oranye gelap digunakan sebagai background section untuk kedalaman visual
- Animasi menggunakan `prefers-reduced-motion` untuk aksesibilitas

### 11.5 Optimasi Bundle

- **React Compiler** (stabil di React 19.2): auto-memoization, tidak perlu `useMemo`/`useCallback` manual
- **Turbopack** (stabil di Next.js 16): dev server < 1 detik cold start
- **Tree shaking**: Import spesifik dari shadcn/ui, bukan barrel imports
- **Dynamic imports** untuk komponen berat:

```typescript
// Midtrans Snap hanya di-load saat checkout
const MidtransSnap = dynamic(() => import('@/components/features/checkout/midtrans-snap'), {
  ssr: false,
  loading: () => <PaymentSkeleton />,
})

// Kalender jadwal — heavy component
const ScheduleCalendar = dynamic(() => import('@/components/features/seminar/schedule-calendar'), {
  ssr: false,
})
```

### 11.6 Performa Database

- **Connection Pooling**: Prisma driver adapter + Supabase Pooler (PgBouncer) — maks 10 koneksi per fungsi serverless
- **Indexes**: Semua foreign keys, field slug, dan kolom filter sudah di-index di skema (lihat Bagian 3)
- **Pencegahan N+1**: Selalu gunakan `include` / `select` Prisma untuk relasi yang dibutuhkan
- **Pagination**: Cursor-based pagination untuk listing seminar (bukan offset untuk performa konsisten)

```typescript
// server/queries/seminars.ts — cursor pagination
export async function getSeminars(cursor?: string, limit = 12) {
  return prisma.seminar.findMany({
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  })
}
```

---

## 12. Pengelolaan via CLI

> Semua layanan dikelola melalui CLI untuk konsistensi, reproducibility, dan kemudahan onboarding developer baru.

### 12.1 Supabase CLI

**Instalasi:**
```bash
npm install -g supabase
supabase --version
```

**Perintah Utama:**
```bash
# Login & inisialisasi
supabase login
supabase init                          # Buat folder supabase/ di root project

# Jalankan Supabase lokal (Docker required)
supabase start                         # Jalankan semua service lokal (DB, Auth, Storage, Realtime)
supabase stop                          # Hentikan service lokal
supabase status                        # Lihat URL & key lokal

# Database migrations
supabase migration new <nama_migrasi>  # Buat file migrasi baru (SQL)
supabase migration list                # Lihat daftar migrasi
supabase db reset                      # Reset DB lokal & jalankan ulang semua migrasi + seed
supabase db push                       # Push migrasi ke remote (staging/production)
supabase db pull                       # Pull skema dari remote ke lokal

# RLS & Policies (tulis di file migrasi SQL)
supabase migration new add_rls_policies

# Storage buckets (kelola via migrasi SQL atau dashboard lokal)
# Akses dashboard lokal: http://localhost:54323

# Generate types untuk TypeScript
supabase gen types typescript --local > types/supabase.ts
supabase gen types typescript --project-id <id> > types/supabase.ts  # dari remote

# Link ke project remote
supabase link --project-ref <project-id>

# Deploy edge functions (jika digunakan)
supabase functions deploy <nama_fungsi>
supabase functions serve                # Jalankan lokal untuk testing

# Secrets management
supabase secrets set KEY=value          # Set secret di remote
supabase secrets list                   # Lihat daftar secret
```

**Struktur Folder Supabase:**
```
supabase/
├── config.toml                # Konfigurasi project lokal
├── migrations/                # File migrasi SQL (berurutan)
│   ├── 20260514000000_init.sql
│   ├── 20260514000001_add_rls.sql
│   └── 20260514000002_create_buckets.sql
├── seed.sql                   # Data seed untuk development
└── functions/                 # Edge Functions (opsional)
```

**Contoh Migrasi RLS:**
```sql
-- supabase/migrations/20260514000001_add_rls.sql

-- Aktifkan RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- Policy: user baca data sendiri
CREATE POLICY "Users read own record" ON users
  FOR SELECT USING (supabase_id = auth.uid()::text);

-- Policy: admin baca semua
CREATE POLICY "Admin read all users" ON users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'ADMIN');
```

**Contoh Migrasi Storage Buckets:**
```sql
-- supabase/migrations/20260514000002_create_buckets.sql

INSERT INTO storage.buckets (id, name, public) VALUES
  ('product-images', 'product-images', true),
  ('avatars', 'avatars', true),
  ('documents', 'documents', false),
  ('promo-assets', 'promo-assets', true),
  ('certificates', 'certificates', false);

-- Policy storage
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin manage product images" ON storage.objects
  FOR ALL USING (bucket_id = 'product-images' AND auth.jwt() ->> 'role' = 'ADMIN');
```

---

### 12.2 Prisma CLI

**Database (Supabase CLI):**
```bash
# Push migrations ke Supabase
npx supabase db push

# Seed data
node scripts/seed-users.mjs

# Link ke project Supabase
npx supabase link --project-ref <ref>
```
npx supabase db push                   # Push migrations ke Supabase production
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

### 12.3 Next.js & Vercel CLI

**Vercel CLI:**
```bash
npm install -g vercel

# Login & link project
vercel login
vercel link                            # Link folder ke project Vercel

# Development
vercel dev                             # Jalankan dev server dengan env Vercel

# Environment variables
vercel env pull .env.local             # Pull env vars dari Vercel ke lokal
vercel env add <NAMA_VAR>             # Tambah env var ke Vercel
vercel env ls                          # Lihat daftar env vars

# Deploy
vercel                                 # Deploy ke preview
vercel --prod                          # Deploy ke production

# Domain
vercel domains add tdwresources.id     # Tambah custom domain
vercel domains ls                      # Lihat daftar domain
```

**Next.js CLI:**
```bash
# Development
npm run dev                            # Jalankan dev server (Turbopack)
npx next dev --turbopack               # Eksplisit Turbopack

# Build & production
npm run build                          # Build production
npm run start                          # Jalankan production server lokal

# Linting & type check
npx next lint                          # Jalankan ESLint
npx tsc --noEmit                       # Type check tanpa output
```

---

### 12.4 shadcn/ui CLI

```bash
# Inisialisasi (sudah dilakukan)
npx shadcn@latest init

# Tambah komponen
npx shadcn@latest add button           # Tambah satu komponen
npx shadcn@latest add card dialog form # Tambah beberapa sekaligus
npx shadcn@latest add --all            # Tambah semua komponen

# Update komponen
npx shadcn@latest diff                 # Lihat perubahan dari upstream
```

---

### 12.5 Workflow Harian Developer

```bash
# 1. Mulai development
supabase start                         # Jalankan Supabase lokal
npm run dev                            # Jalankan Next.js dev server

# 2. Perubahan database
# Edit prisma/schema.prisma
npx prisma migrate dev --name <deskripsi>
supabase gen types typescript --local > types/supabase.ts

# 3. Tambah RLS / Storage policy
supabase migration new <nama_policy>
# Edit file SQL yang dibuat
supabase db reset                      # Reset & jalankan ulang semua migrasi

# 4. Sebelum commit
npx prisma validate
npx tsc --noEmit
npx next lint
npm run build                          # Pastikan build sukses

# 5. Deploy
git push origin main                   # Auto-deploy via Vercel
# atau manual:
vercel --prod

# 6. Push migrasi ke remote Supabase
supabase db push
npx prisma migrate deploy
```

---

### 12.6 Script `package.json`

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "db:reset": "prisma migrate reset",
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "supabase:types": "supabase gen types typescript --local > types/supabase.ts",
    "supabase:push": "supabase db push"
  }
}
```

---

*Dokumen ini adalah referensi hidup. Perbarui setiap kali ada perubahan arsitektur signifikan.*

**Catatan Perubahan:**

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 1.0 | 14 Mei 2026 | Dokumen arsitektur awal |
| 1.1 | 15 Mei 2026 | Tambah sistem warna dark + oranye, section pengelolaan CLI |