-- Seed: Jadwal Seminar TDW Resources 2026
-- Jalankan di: npx supabase db execute --project-ref rgwquajbnjghbyzyxwxc --file supabase/migrations/20260524000000_seed_jadwal_2026.sql

-- ── 1. Categories ─────────────────────────────────────────────────────────────
insert into public.categories (name, slug, color) values
  ('Financial',  'financial',  '#F59E0B'),
  ('Business',   'business',   '#3B82F6'),
  ('Property',   'property',   '#10B981'),
  ('Life',       'life',       '#8B5CF6'),
  ('Sales',      'sales',      '#EF4444'),
  ('Teens',      'teens',      '#EC4899'),
  ('Special',    'special',    '#D9F25D')
on conflict (slug) do nothing;

-- ── 2. Seminars ───────────────────────────────────────────────────────────────
insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'financial-revolution', 'Financial Revolution',
  'Kuasai strategi keuangan untuk mencapai kebebasan finansial.',
  'Program intensif yang mengajarkan strategi investasi, manajemen keuangan, dan cara membangun aset untuk mencapai kebebasan finansial bersama Tung Desem Waringin.',
  id, 'PUBLISHED', true from public.categories where slug = 'financial'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'sales-marketing-revolution', 'Sales Marketing Revolution',
  'Tingkatkan penjualan dan kuasai strategi marketing terkini.',
  'Program revolusioner untuk meningkatkan kemampuan sales dan marketing Anda secara drastis dengan teknik-teknik terbukti dari Tung Desem Waringin.',
  id, 'PUBLISHED', true from public.categories where slug = 'sales'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'property-rich-revolution', 'Property Rich Revolution',
  'Bangun kekayaan melalui investasi properti yang cerdas.',
  'Pelajari cara memilih, membeli, dan mengelola properti untuk menghasilkan passive income dan capital gain maksimal.',
  id, 'PUBLISHED', true from public.categories where slug = 'property'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'business-revolution', 'Business Revolution',
  'Transformasi bisnis Anda ke level berikutnya.',
  'Program komprehensif untuk para pengusaha yang ingin mengembangkan bisnis secara eksponensial dengan sistem dan strategi yang terbukti.',
  id, 'PUBLISHED', true from public.categories where slug = 'business'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'life-revolution', 'Life Revolution',
  'Ubah hidup Anda secara total — mindset, kesehatan, dan hubungan.',
  'Program transformasi hidup menyeluruh yang mencakup pengembangan mindset, kesehatan optimal, hubungan harmonis, dan pencapaian tujuan hidup.',
  id, 'PUBLISHED', true from public.categories where slug = 'life'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'im-superteens-bootcamp', 'iM Superteens Bootcamp',
  'Program intensif pengembangan diri untuk remaja.',
  'Bootcamp eksklusif untuk remaja usia 13-19 tahun yang dirancang untuk membangun kepercayaan diri, kepemimpinan, dan potensi terbaik mereka.',
  id, 'PUBLISHED', false from public.categories where slug = 'teens'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'ramadhan-breakthrough', 'Ramadhan Breakthrough',
  'Program spesial Ramadhan untuk transformasi spiritual dan finansial.',
  'Program online eksklusif selama Ramadhan yang menggabungkan nilai-nilai spiritual dengan strategi sukses dunia dan akhirat.',
  id, 'PUBLISHED', false from public.categories where slug = 'special'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'lunch-and-tour', 'Lunch & Tour',
  'Networking eksklusif bersama Tung Desem Waringin.',
  'Kesempatan langka untuk makan siang dan tur bersama Tung Desem Waringin sambil mendapatkan insight bisnis secara personal.',
  id, 'PUBLISHED', false from public.categories where slug = 'special'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'turbocharge-your-q4', 'Turbocharge Your Q4',
  'Maksimalkan performa bisnis di kuartal terakhir tahun ini.',
  'Program intensif untuk memaksimalkan pencapaian target bisnis dan keuangan di kuartal keempat.',
  id, 'PUBLISHED', false from public.categories where slug = 'business'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, category_id, status, is_featured)
select 'training-for-firewalk-trainers', 'Training for Firewalk Trainers',
  'Jadilah trainer bersertifikat untuk program Firewalk.',
  'Pelatihan eksklusif untuk menjadi trainer bersertifikat dalam program Firewalk — pengalaman transformasi paling powerful.',
  id, 'PUBLISHED', false from public.categories where slug = 'special'
on conflict (slug) do nothing;

-- ── 3. Schedules + Tickets (helper function) ──────────────────────────────────
-- Januari: Financial Revolution Online 30 Jan – 1 Feb
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-01-30 08:00+07', '2026-02-01 17:00+07', 'Online', 'Zoom Webinar'
  from public.seminars where slug = 'financial-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 1500000, 1200000, '2026-01-15 23:59+07', 500 from s;

-- Februari: Sales Marketing Revolution Offline Jakarta 10–14 Feb
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-02-10 08:00+07', '2026-02-14 17:00+07', 'Jakarta', 'Hotel Mulia Senayan'
  from public.seminars where slug = 'sales-marketing-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 5000000, 4000000, '2026-01-31 23:59+07', 300 from s;

-- Februari: Lunch & Tour 15 Feb
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-02-15 11:00+07', '2026-02-15 15:00+07', 'Jakarta', 'TBA'
  from public.seminars where slug = 'lunch-and-tour' returning id)
insert into public.tickets (schedule_id, name, price, quota)
select id, 'VIP Seat', 3500000, 50 from s;

-- Feb–Mar: Ramadhan Breakthrough Online 18 Feb – 19 Mar
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-02-18 19:00+07', '2026-03-19 21:00+07', 'Online', 'Zoom Webinar'
  from public.seminars where slug = 'ramadhan-breakthrough' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 750000, 600000, '2026-02-10 23:59+07', 1000 from s;

-- April: Financial Revolution Online 3–5 Apr
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-04-03 08:00+07', '2026-04-05 17:00+07', 'Online', 'Zoom Webinar'
  from public.seminars where slug = 'financial-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 1500000, 1200000, '2026-03-20 23:59+07', 500 from s;

-- April: Property Rich Revolution Offline Surabaya 21–25 Apr
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-04-21 08:00+07', '2026-04-25 17:00+07', 'Surabaya', 'Hotel Shangri-La Surabaya'
  from public.seminars where slug = 'property-rich-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 4500000, 3500000, '2026-04-07 23:59+07', 250 from s;

-- Juni: Financial Revolution Online 11–13 Jun
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-06-11 08:00+07', '2026-06-13 17:00+07', 'Online', 'Zoom Webinar'
  from public.seminars where slug = 'financial-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 1500000, 1200000, '2026-05-28 23:59+07', 500 from s;

-- Juni: iM Superteens Bootcamp Offline Surabaya 23–28 Jun
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-06-23 08:00+07', '2026-06-28 17:00+07', 'Surabaya', 'Hotel Bumi Surabaya'
  from public.seminars where slug = 'im-superteens-bootcamp' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 3500000, 2800000, '2026-06-09 23:59+07', 200 from s;

-- Juli: iM Superteens Bootcamp Offline Bandung 3–8 Jul
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-07-03 08:00+07', '2026-07-08 17:00+07', 'Bandung', 'Hotel Savoy Homann Bandung'
  from public.seminars where slug = 'im-superteens-bootcamp' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 3500000, 2800000, '2026-06-19 23:59+07', 200 from s;

-- Juli: Financial Revolution Online 24–26 Jul
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-07-24 08:00+07', '2026-07-26 17:00+07', 'Online', 'Zoom Webinar'
  from public.seminars where slug = 'financial-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 1500000, 1200000, '2026-07-10 23:59+07', 500 from s;

-- Agustus: Business Revolution Offline Jakarta 25–29 Ags
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-08-25 08:00+07', '2026-08-29 17:00+07', 'Jakarta', 'Hotel Grand Hyatt Jakarta'
  from public.seminars where slug = 'business-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 5500000, 4500000, '2026-08-11 23:59+07', 300 from s;

-- September: Turbocharge Your Q4 Offline Jakarta 26 Sep
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-09-26 08:00+07', '2026-09-26 17:00+07', 'Jakarta', 'Hotel Mulia Senayan'
  from public.seminars where slug = 'turbocharge-your-q4' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 2000000, 1600000, '2026-09-12 23:59+07', 400 from s;

-- Oktober: Financial Revolution Online 2–4 Okt
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-10-02 08:00+07', '2026-10-04 17:00+07', 'Online', 'Zoom Webinar'
  from public.seminars where slug = 'financial-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 1500000, 1200000, '2026-09-18 23:59+07', 500 from s;

-- Oktober: Life Revolution Offline Surabaya 22–24 Okt
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-10-22 08:00+07', '2026-10-24 17:00+07', 'Surabaya', 'Hotel JW Marriott Surabaya'
  from public.seminars where slug = 'life-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 4000000, 3200000, '2026-10-08 23:59+07', 250 from s;

-- November: Training for Firewalk Trainers Offline Lombok 25–28 Nov
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-11-25 08:00+07', '2026-11-28 17:00+07', 'Lombok', 'The Lombok Lodge'
  from public.seminars where slug = 'training-for-firewalk-trainers' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 7500000, 6000000, '2026-11-11 23:59+07', 100 from s;

-- Desember: Financial Revolution Online 4–6 Des
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-12-04 08:00+07', '2026-12-06 17:00+07', 'Online', 'Zoom Webinar'
  from public.seminars where slug = 'financial-revolution' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 1500000, 1200000, '2026-11-20 23:59+07', 500 from s;

-- Desember: iM Superteens Bootcamp Offline Bandung 18–23 Des
with s as (insert into public.schedules (seminar_id, start_date, end_date, city, venue)
  select id, '2026-12-18 08:00+07', '2026-12-23 17:00+07', 'Bandung', 'Hotel Savoy Homann Bandung'
  from public.seminars where slug = 'im-superteens-bootcamp' returning id)
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota)
select id, 'Regular', 3500000, 2800000, '2026-12-04 23:59+07', 200 from s;
