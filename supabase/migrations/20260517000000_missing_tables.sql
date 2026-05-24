-- Migration: missing tables, columns, and RPC functions
-- BUG-001: Missing tables
-- BUG-002: Missing columns on orders
-- BUG-003: Missing RPC get_paid_orders_stats

-- ── bank_accounts ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name    text NOT NULL,
  account_no   text NOT NULL,
  account_name text NOT NULL,
  is_active    boolean NOT NULL DEFAULT true,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── company_stats ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.company_stats (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label      text NOT NULL,
  value      text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- ── team_members ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.team_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  role        text NOT NULL,
  bio         text,
  avatar_url  text,
  sort_order  integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false
);

-- ── faqs ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.faqs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question   text NOT NULL,
  answer     text NOT NULL,
  is_active  boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

-- ── pricing_packages ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pricing_packages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  price      integer NOT NULL,
  features   text[] NOT NULL DEFAULT '{}',
  is_popular boolean NOT NULL DEFAULT false,
  is_active  boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

-- ── media_coverage ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media_coverage (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  logo_url   text,
  sort_order integer NOT NULL DEFAULT 0
);

-- ── BUG-002: Missing columns on orders ───────────────────────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS unique_amount   integer,
  ADD COLUMN IF NOT EXISTS bank_account_id uuid REFERENCES public.bank_accounts(id);

-- ── FEAT-002: proof_url on payments ──────────────────────────────────────────
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS proof_url text;

-- ── BUG-003: Missing RPC get_paid_orders_stats ────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_paid_orders_stats()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_build_object(
    'total_amount', COALESCE(SUM(total_amount), 0),
    'order_count',  COUNT(*)
  )
  FROM public.orders
  WHERE status IN ('PAID', 'CONFIRMED');
$$;

-- ── BUG-004: get_my_role RPC ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql SECURITY DEFINER AS $$
  SELECT role::text FROM public.users WHERE supabase_id = auth.uid();
$$;

-- ── Seed: bank_accounts ───────────────────────────────────────────────────────
INSERT INTO public.bank_accounts (bank_name, account_no, account_name, sort_order) VALUES
  ('BCA',     '1234567890', 'PT TDW Resources Indonesia', 0),
  ('Mandiri',  '9876543210', 'PT TDW Resources Indonesia', 1),
  ('BNI',      '1122334455', 'PT TDW Resources Indonesia', 2)
ON CONFLICT DO NOTHING;
