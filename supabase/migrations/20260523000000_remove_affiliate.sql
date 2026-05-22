-- Drop RLS policies safely
DO $$ 
BEGIN
  drop policy if exists "user read own affiliate" on public.affiliates;
  drop policy if exists "user insert own affiliate" on public.affiliates;
  drop policy if exists "affiliate read own commissions" on public.commissions;
  drop policy if exists "affiliate read own withdrawals" on public.withdrawals;
  drop policy if exists "affiliate insert own withdrawals" on public.withdrawals;
EXCEPTION WHEN OTHERS THEN 
END $$;

-- Drop tables
drop table if exists public.withdrawals cascade;
drop table if exists public.commissions cascade;
drop table if exists public.commission_rates cascade;
drop table if exists public.affiliates cascade;

-- Drop column
alter table public.orders drop column if exists affiliate_code;
