-- Migration: Enable RLS on all tables missing it
-- Tables from initial schema that had no RLS

-- ── Enable RLS ────────────────────────────────────────────────────────────────
alter table public.categories       enable row level security;
alter table public.seminars         enable row level security;
alter table public.schedules        enable row level security;
alter table public.tickets          enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.payments         enable row level security;
alter table public.affiliates       enable row level security;
alter table public.commission_rates enable row level security;
alter table public.commissions      enable row level security;
alter table public.withdrawals      enable row level security;
alter table public.testimonials     enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.notifications    enable row level security;

-- ── Public read (no auth needed) ─────────────────────────────────────────────
create policy "public read categories"   on public.categories   for select using (true);
create policy "public read seminars"     on public.seminars     for select using (status = 'PUBLISHED');
create policy "public read schedules"    on public.schedules    for select using (true);
create policy "public read tickets"      on public.tickets      for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read blog_posts"   on public.blog_posts   for select using (is_published = true);
create policy "public read commission_rates" on public.commission_rates for select using (true);

-- ── Orders: user sees own orders ─────────────────────────────────────────────
create policy "user read own orders" on public.orders
  for select using (
    user_id = (select id from public.users where supabase_id = auth.uid())
  );

create policy "user insert own orders" on public.orders
  for insert with check (
    user_id = (select id from public.users where supabase_id = auth.uid())
  );

create policy "user update own orders" on public.orders
  for update using (
    user_id = (select id from public.users where supabase_id = auth.uid())
  );

-- ── Order items: user sees own ───────────────────────────────────────────────
create policy "user read own order_items" on public.order_items
  for select using (
    order_id in (
      select id from public.orders
      where user_id = (select id from public.users where supabase_id = auth.uid())
    )
  );

create policy "user insert own order_items" on public.order_items
  for insert with check (
    order_id in (
      select id from public.orders
      where user_id = (select id from public.users where supabase_id = auth.uid())
    )
  );

-- ── Payments: user sees own ──────────────────────────────────────────────────
create policy "user read own payments" on public.payments
  for select using (
    order_id in (
      select id from public.orders
      where user_id = (select id from public.users where supabase_id = auth.uid())
    )
  );

-- ── Affiliates: user sees own ────────────────────────────────────────────────
create policy "user read own affiliate" on public.affiliates
  for select using (
    user_id = (select id from public.users where supabase_id = auth.uid())
  );

create policy "user insert own affiliate" on public.affiliates
  for insert with check (
    user_id = (select id from public.users where supabase_id = auth.uid())
  );

-- ── Commissions: affiliate sees own ─────────────────────────────────────────
create policy "user read own commissions" on public.commissions
  for select using (
    affiliate_id in (
      select id from public.affiliates
      where user_id = (select id from public.users where supabase_id = auth.uid())
    )
  );

-- ── Withdrawals: affiliate sees own ─────────────────────────────────────────
create policy "user read own withdrawals" on public.withdrawals
  for select using (
    affiliate_id in (
      select id from public.affiliates
      where user_id = (select id from public.users where supabase_id = auth.uid())
    )
  );

create policy "user insert own withdrawals" on public.withdrawals
  for insert with check (
    affiliate_id in (
      select id from public.affiliates
      where user_id = (select id from public.users where supabase_id = auth.uid())
    )
  );

-- ── Notifications: user sees own ────────────────────────────────────────────
create policy "user read own notifications" on public.notifications
  for select using (
    user_id = (select id from public.users where supabase_id = auth.uid())
  );

-- ── Admin full access to all tables ─────────────────────────────────────────
do $$
declare
  tbl text;
  tbls text[] := array[
    'categories','seminars','schedules','tickets',
    'orders','order_items','payments',
    'affiliates','commission_rates','commissions','withdrawals',
    'testimonials','blog_posts','notifications'
  ];
begin
  foreach tbl in array tbls loop
    execute format(
      'create policy "admin full access %I" on public.%I for all using (
        exists (select 1 from public.users u where u.supabase_id = auth.uid() and u.role = ''ADMIN'')
      )',
      tbl, tbl
    );
  end loop;
end $$;
