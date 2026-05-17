-- Migration: auto-create user/profile on signup + seed admin & user accounts
-- Run this in Supabase SQL Editor

-- ── 1. Trigger: auto-insert ke public.users + public.profiles saat signup ────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  _role "Role";
begin
  -- Ambil role dari metadata jika ada, default USER
  _role := coalesce(
    (new.raw_user_meta_data->>'role')::"Role",
    'USER'::"Role"
  );

  insert into public.users (supabase_id, email, role)
  values (new.id, new.email, _role)
  on conflict (supabase_id) do nothing;

  insert into public.profiles (user_id, full_name, phone)
  values (
    (select id from public.users where supabase_id = new.id),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Drop dulu kalau sudah ada, lalu buat ulang
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. Seed: buat akun admin & user via auth.users ───────────────────────────
-- CATATAN: Supabase tidak bisa insert auth.users langsung via SQL biasa.
-- Gunakan fungsi supabase_admin untuk create user dengan password.
-- Jalankan blok ini di SQL Editor (membutuhkan service_role).

select auth.uid(); -- test koneksi

-- Buat akun Admin
select * from auth.users where email = 'admin@tdwresources.id';
-- Jika belum ada, jalankan via Supabase Dashboard > Auth > Add User
-- ATAU gunakan script di bawah (membutuhkan pg_net / supabase admin API)

-- ── 3. Seed manual: insert langsung jika akun sudah dibuat via Dashboard ─────
-- Setelah buat akun di Dashboard, jalankan ini untuk set role ADMIN:

-- Set role admin (ganti email jika berbeda)
update public.users
set role = 'ADMIN'
where email = 'admin@tdwresources.id';

-- Pastikan profile admin ada
insert into public.profiles (user_id, full_name, city, occupation)
select u.id, 'Admin TDW', 'Jakarta', 'Administrator'
from public.users u
where u.email = 'admin@tdwresources.id'
on conflict (user_id) do update set full_name = 'Admin TDW';

-- Pastikan profile user biasa ada
insert into public.profiles (user_id, full_name, phone, city, occupation)
select u.id, 'Budi Santoso', '081234567890', 'Jakarta', 'Entrepreneur'
from public.users u
where u.email = 'budi@example.com'
on conflict (user_id) do update set full_name = 'Budi Santoso';

-- ── 4. RLS: users hanya bisa baca data diri sendiri ──────────────────────────
alter table public.users enable row level security;
alter table public.profiles enable row level security;

-- Drop existing policies dulu
drop policy if exists "users: read own" on public.users;
drop policy if exists "users: update own" on public.users;
drop policy if exists "profiles: read own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
drop policy if exists "admin: read all users" on public.users;
drop policy if exists "admin: read all profiles" on public.profiles;

-- User bisa baca & update data diri sendiri
create policy "users: read own" on public.users
  for select using (supabase_id = auth.uid());

create policy "users: update own" on public.users
  for update using (supabase_id = auth.uid());

create policy "profiles: read own" on public.profiles
  for select using (
    user_id = (select id from public.users where supabase_id = auth.uid())
  );

create policy "profiles: update own" on public.profiles
  for update using (
    user_id = (select id from public.users where supabase_id = auth.uid())
  );

-- Admin bisa baca semua users & profiles
create policy "admin: read all users" on public.users
  for select using (
    exists (
      select 1 from public.users u
      where u.supabase_id = auth.uid() and u.role = 'ADMIN'
    )
  );

create policy "admin: read all profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.users u
      where u.supabase_id = auth.uid() and u.role = 'ADMIN'
    )
  );

-- ── 5. Helper function: get role dari JWT / supabase_id ──────────────────────
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
as $$
  select role::text from public.users where supabase_id = auth.uid();
$$;
