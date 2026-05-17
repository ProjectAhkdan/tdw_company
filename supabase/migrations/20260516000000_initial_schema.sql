-- Migration: initial schema
-- Generated from prisma/schema.prisma

-- Enums
create type "Role" as enum ('USER', 'AFFILIATE', 'ADMIN');
create type "SeminarStatus" as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
create type "OrderStatus" as enum ('PENDING', 'PAID', 'CONFIRMED', 'CANCELLED', 'REFUNDED');
create type "PaymentStatus" as enum ('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED');
create type "PaymentMethod" as enum ('BANK_TRANSFER', 'QRIS', 'CREDIT_CARD', 'GOPAY');
create type "CommissionStatus" as enum ('PENDING', 'APPROVED', 'PAID', 'REJECTED');
create type "WithdrawalStatus" as enum ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED');

-- users
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  supabase_id   uuid unique not null,
  email         text unique not null,
  role          "Role" not null default 'USER',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- profiles
create table if not exists public.profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid unique not null references public.users(id) on delete cascade,
  full_name     text not null,
  phone         text,
  avatar_url    text,
  city          text,
  occupation    text,
  notify_email  boolean not null default true,
  notify_wa     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- categories
create table if not exists public.categories (
  id    uuid primary key default gen_random_uuid(),
  name  text unique not null,
  slug  text unique not null,
  color text
);

-- seminars
create table if not exists public.seminars (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  short_desc       text not null,
  description      text not null,
  thumbnail_url    text,
  category_id      uuid not null references public.categories(id),
  status           "SeminarStatus" not null default 'DRAFT',
  is_featured      boolean not null default false,
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists seminars_slug_idx on public.seminars(slug);
create index if not exists seminars_category_id_idx on public.seminars(category_id);
create index if not exists seminars_status_featured_idx on public.seminars(status, is_featured);

-- schedules
create table if not exists public.schedules (
  id          uuid primary key default gen_random_uuid(),
  seminar_id  uuid not null references public.seminars(id) on delete cascade,
  start_date  timestamptz not null,
  end_date    timestamptz not null,
  city        text not null,
  venue       text not null,
  address     text,
  created_at  timestamptz not null default now()
);
create index if not exists schedules_seminar_id_idx on public.schedules(seminar_id);
create index if not exists schedules_start_date_idx on public.schedules(start_date);

-- tickets
create table if not exists public.tickets (
  id               uuid primary key default gen_random_uuid(),
  schedule_id      uuid not null references public.schedules(id) on delete cascade,
  name             text not null,
  price            integer not null,
  early_bird_price integer,
  early_bird_until timestamptz,
  quota            integer not null,
  sold             integer not null default 0
);
create index if not exists tickets_schedule_id_idx on public.tickets(schedule_id);

-- orders
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id),
  status            "OrderStatus" not null default 'PENDING',
  total_amount      integer not null,
  affiliate_code    text,
  snap_token        text,
  midtrans_order_id text unique,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  expires_at        timestamptz
);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_midtrans_order_id_idx on public.orders(midtrans_order_id);

-- order_items
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  ticket_id   uuid not null references public.tickets(id),
  quantity    integer not null,
  unit_price  integer not null,
  subtotal    integer not null
);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- payments
create table if not exists public.payments (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid unique not null references public.orders(id),
  status           "PaymentStatus" not null default 'PENDING',
  method           "PaymentMethod",
  amount           integer not null,
  midtrans_payload jsonb,
  paid_at          timestamptz,
  created_at       timestamptz not null default now()
);
create index if not exists payments_order_id_idx on public.payments(order_id);

-- affiliates
create table if not exists public.affiliates (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid unique not null references public.users(id),
  code             text unique not null,
  bank_name        text,
  bank_account     text,
  bank_holder      text,
  is_approved      boolean not null default false,
  total_earned     integer not null default 0,
  total_withdrawn  integer not null default 0,
  created_at       timestamptz not null default now()
);
create index if not exists affiliates_code_idx on public.affiliates(code);

-- commission_rates
create table if not exists public.commission_rates (
  id          uuid primary key default gen_random_uuid(),
  seminar_id  uuid unique not null references public.seminars(id) on delete cascade,
  percentage  float not null
);

-- commissions
create table if not exists public.commissions (
  id            uuid primary key default gen_random_uuid(),
  affiliate_id  uuid not null references public.affiliates(id),
  order_id      uuid unique not null references public.orders(id),
  amount        integer not null,
  status        "CommissionStatus" not null default 'PENDING',
  created_at    timestamptz not null default now(),
  paid_at       timestamptz
);
create index if not exists commissions_affiliate_id_idx on public.commissions(affiliate_id);

-- withdrawals
create table if not exists public.withdrawals (
  id            uuid primary key default gen_random_uuid(),
  affiliate_id  uuid not null references public.affiliates(id),
  amount        integer not null,
  status        "WithdrawalStatus" not null default 'PENDING',
  notes         text,
  processed_at  timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists withdrawals_affiliate_id_idx on public.withdrawals(affiliate_id);

-- testimonials
create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  seminar_id   uuid references public.seminars(id) on delete set null,
  author_name  text not null,
  author_role  text,
  avatar_url   text,
  content      text not null,
  video_url    text,
  rating       integer not null default 5,
  is_featured  boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists testimonials_seminar_featured_idx on public.testimonials(seminar_id, is_featured);

-- blog_posts
create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  excerpt          text not null,
  content          text not null,
  thumbnail_url    text,
  author_name      text not null,
  is_published     boolean not null default false,
  published_at     timestamptz,
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists blog_posts_slug_idx on public.blog_posts(slug);
create index if not exists blog_posts_published_idx on public.blog_posts(is_published, published_at);

-- notifications
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text not null,
  is_read    boolean not null default false,
  metadata   jsonb,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_read_idx on public.notifications(user_id, is_read);
