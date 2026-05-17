-- Migration: company content tables
-- Tabel untuk data konten company profile yang sebelumnya hardcoded

-- company_stats: statistik perusahaan (alumni, seminar, kota, tahun)
create table if not exists public.company_stats (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  value      text not null,
  sort_order integer not null default 0
);

-- team_members: anggota tim / profil TDW
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null,
  bio         text,
  avatar_url  text,
  sort_order  integer not null default 0,
  is_featured boolean not null default false
);

-- faqs: pertanyaan yang sering ditanyakan
create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  sort_order integer not null default 0,
  is_active  boolean not null default true
);

-- pricing_packages: paket harga
create table if not exists public.pricing_packages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  price      integer not null,
  features   text[] not null default '{}',
  is_popular boolean not null default false,
  sort_order integer not null default 0,
  is_active  boolean not null default true
);

-- company_settings: konfigurasi umum perusahaan
create table if not exists public.company_settings (
  key   text primary key,
  value text not null
);

-- media_coverage: media yang meliput
create table if not exists public.media_coverage (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo_url   text,
  sort_order integer not null default 0
);

-- Enable RLS
alter table public.company_stats enable row level security;
alter table public.team_members enable row level security;
alter table public.faqs enable row level security;
alter table public.pricing_packages enable row level security;
alter table public.company_settings enable row level security;
alter table public.media_coverage enable row level security;

-- Public read policies (data ini publik)
create policy "public read company_stats" on public.company_stats for select using (true);
create policy "public read team_members" on public.team_members for select using (true);
create policy "public read faqs" on public.faqs for select using (is_active = true);
create policy "public read pricing_packages" on public.pricing_packages for select using (is_active = true);
create policy "public read company_settings" on public.company_settings for select using (true);
create policy "public read media_coverage" on public.media_coverage for select using (true);
