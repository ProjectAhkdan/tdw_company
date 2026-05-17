-- Migration: bank transfer payment system

-- Rekening bank perusahaan
create table if not exists public.bank_accounts (
  id          uuid primary key default gen_random_uuid(),
  bank_name   text not null,
  account_no  text not null,
  account_name text not null,
  logo_url    text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0
);

alter table public.bank_accounts enable row level security;
create policy "public read bank_accounts" on public.bank_accounts
  for select using (is_active = true);

-- Tambah kolom ke orders
alter table public.orders
  add column if not exists unique_amount    integer,
  add column if not exists bank_account_id  uuid references public.bank_accounts(id),
  add column if not exists proof_url        text,
  add column if not exists verified_at      timestamptz,
  add column if not exists verified_by      uuid references public.users(id);

-- Seed rekening bank
insert into public.bank_accounts (bank_name, account_no, account_name, sort_order) values
  ('BCA',     '1234567890', 'PT TDW Resources Indonesia', 0),
  ('Mandiri', '9876543210', 'PT TDW Resources Indonesia', 1),
  ('BNI',     '1122334455', 'PT TDW Resources Indonesia', 2)
on conflict do nothing;
