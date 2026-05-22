-- Seed: Jadwal Seminar TDW Resources 2026
-- Jalankan di Supabase SQL Editor

-- ── Tambah kategori yang belum ada ───────────────────────────────────────────
insert into public.categories (name, slug, color) values
  ('Financial', 'financial', '#F59E0B'),
  ('Marketing',  'marketing',  '#10B981'),
  ('Property',   'property',   '#3B82F6'),
  ('Teens',      'teens',      '#EC4899'),
  ('Leadership', 'leadership', '#8B5CF6')
on conflict (slug) do nothing;

-- ── Seminars ─────────────────────────────────────────────────────────────────
insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'financial-revolution', 'Financial Revolution',
  'Revolusi keuangan pribadi dan bisnis Anda bersama Tung Desem Waringin.',
  'Program intensif yang mengajarkan strategi keuangan, investasi, dan kebebasan finansial. Pelajari cara mengelola uang, membangun aset, dan mencapai financial freedom.',
  'PUBLISHED', true, c.id from public.categories c where c.slug = 'financial'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'sales-marketing-revolution', 'Sales Marketing Revolution',
  'Kuasai strategi sales dan marketing terkini untuk meledakkan omzet bisnis Anda.',
  'Seminar intensif 5 hari yang membahas strategi penjualan, digital marketing, copywriting, dan teknik closing yang terbukti meningkatkan revenue bisnis.',
  'PUBLISHED', true, c.id from public.categories c where c.slug = 'marketing'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'lunch-and-tour', 'Lunch & Tour',
  'Networking eksklusif bersama para pengusaha sukses Indonesia.',
  'Event networking premium berformat makan siang dan tur bersama komunitas pengusaha TDW. Bangun relasi bisnis berkualitas tinggi.',
  'PUBLISHED', false, c.id from public.categories c where c.slug = 'bisnis'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'ramadhan-breakthrough', 'Ramadhan Breakthrough',
  'Raih breakthrough spiritual dan finansial di bulan Ramadhan.',
  'Program online intensif selama Ramadhan yang menggabungkan nilai spiritual dengan strategi bisnis dan keuangan untuk meraih keberkahan dan kesuksesan.',
  'PUBLISHED', false, c.id from public.categories c where c.slug = 'life'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'property-rich-revolution', 'Property Rich Revolution',
  'Jadilah kaya melalui investasi properti bersama para expert.',
  'Program 5 hari intensif tentang strategi investasi properti, dari pemula hingga mahir. Pelajari cara membeli properti tanpa modal besar dan membangun passive income dari properti.',
  'PUBLISHED', true, c.id from public.categories c where c.slug = 'property'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'i-am-superteens', 'I Am SuperTeens Bootcamp',
  'Bootcamp transformasi karakter dan kepemimpinan untuk remaja usia 13-19 tahun.',
  'Program bootcamp intensif khusus remaja yang membangun karakter, kepercayaan diri, kepemimpinan, dan mindset sukses sejak dini.',
  'PUBLISHED', true, c.id from public.categories c where c.slug = 'teens'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'business-revolution', 'Business Revolution',
  'Revolusi cara Anda berbisnis dengan strategi terbukti dari Tung Desem Waringin.',
  'Program 5 hari intensif yang mengajarkan sistem bisnis, kepemimpinan, manajemen tim, dan strategi scale up bisnis ke level berikutnya.',
  'PUBLISHED', true, c.id from public.categories c where c.slug = 'bisnis'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'turbocharge-your-q4', 'Turbocharge Your Q4',
  'Maksimalkan performa bisnis di kuartal terakhir tahun ini.',
  'Seminar satu hari penuh yang fokus pada strategi akselerasi bisnis di Q4. Pelajari cara menutup tahun dengan rekor penjualan tertinggi.',
  'PUBLISHED', false, c.id from public.categories c where c.slug = 'bisnis'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'life-revolution', 'Life Revolution',
  'Transformasi total kehidupan Anda dalam 3 hari bersama Tung Desem Waringin.',
  'Program transformasi hidup yang komprehensif mencakup kesehatan, hubungan, karir, keuangan, dan spiritualitas. Ubah hidup Anda secara menyeluruh.',
  'PUBLISHED', true, c.id from public.categories c where c.slug = 'life'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select 'training-for-firewalk-trainers', 'Training for Firewalk Trainers',
  'Jadilah trainer bersertifikat yang mampu memimpin sesi firewalk transformasional.',
  'Program sertifikasi eksklusif untuk menjadi Firewalk Trainer profesional. Pelajari teknik, keamanan, dan metodologi firewalk untuk transformasi peserta.',
  'PUBLISHED', false, c.id from public.categories c where c.slug = 'leadership'
on conflict (slug) do nothing;

-- ── Schedules ────────────────────────────────────────────────────────────────

-- JANUARI: Financial Revolution - Online, 30 Jan - 1 Feb
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-01-30 09:00:00+07', '2026-02-01 17:00:00+07', 'Online', 'Zoom Webinar', 'Online'
from public.seminars s where s.slug = 'financial-revolution'
on conflict do nothing;

-- FEBRUARI: Sales Marketing Revolution - Offline Jakarta, 10-14 Feb
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-02-10 09:00:00+07', '2026-02-14 17:00:00+07', 'Jakarta', 'Hotel Mulia Senayan', 'Jl. Asia Afrika, Senayan, Jakarta'
from public.seminars s where s.slug = 'sales-marketing-revolution'
on conflict do nothing;

-- FEBRUARI: Lunch & Tour - 15 Feb
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-02-15 12:00:00+07', '2026-02-15 17:00:00+07', 'Jakarta', 'TBA', 'Jakarta'
from public.seminars s where s.slug = 'lunch-and-tour'
on conflict do nothing;

-- MARET: Ramadhan Breakthrough - Online, 18 Feb - 19 Mar
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-02-18 09:00:00+07', '2026-03-19 17:00:00+07', 'Online', 'Zoom Webinar', 'Online'
from public.seminars s where s.slug = 'ramadhan-breakthrough'
on conflict do nothing;

-- APRIL: Financial Revolution - Online, 3-5 Apr
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-04-03 09:00:00+07', '2026-04-05 17:00:00+07', 'Online', 'Zoom Webinar', 'Online'
from public.seminars s where s.slug = 'financial-revolution'
on conflict do nothing;

-- APRIL: Property Rich Revolution - Offline Surabaya, 21-25 Apr
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-04-21 09:00:00+07', '2026-04-25 17:00:00+07', 'Surabaya', 'Grand City Hall', 'Jl. Walikota Mustajab, Surabaya'
from public.seminars s where s.slug = 'property-rich-revolution'
on conflict do nothing;

-- JUNI: Financial Revolution - Online, 11-13 Jun
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-06-11 09:00:00+07', '2026-06-13 17:00:00+07', 'Online', 'Zoom Webinar', 'Online'
from public.seminars s where s.slug = 'financial-revolution'
on conflict do nothing;

-- JUNI: I Am SuperTeens - Offline Surabaya, 23-28 Jun
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-06-23 09:00:00+07', '2026-06-28 17:00:00+07', 'Surabaya', 'Hotel Bumi Surabaya', 'Jl. Jenderal Basuki Rachmat, Surabaya'
from public.seminars s where s.slug = 'i-am-superteens'
on conflict do nothing;

-- JULI: I Am SuperTeens - Offline Bandung, 3-8 Jul
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-07-03 09:00:00+07', '2026-07-08 17:00:00+07', 'Bandung', 'Trans Convention Centre', 'Jl. Gatot Subroto No.289, Bandung'
from public.seminars s where s.slug = 'i-am-superteens'
on conflict do nothing;

-- JULI: Financial Revolution - Online, 24-26 Jul
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-07-24 09:00:00+07', '2026-07-26 17:00:00+07', 'Online', 'Zoom Webinar', 'Online'
from public.seminars s where s.slug = 'financial-revolution'
on conflict do nothing;

-- AGUSTUS: Business Revolution - Offline Jakarta, 25-29 Ags
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-08-25 09:00:00+07', '2026-08-29 17:00:00+07', 'Jakarta', 'Hotel Mulia Senayan', 'Jl. Asia Afrika, Senayan, Jakarta'
from public.seminars s where s.slug = 'business-revolution'
on conflict do nothing;

-- SEPTEMBER: Turbocharge Your Q4 - Offline Jakarta, 26 Sep
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-09-26 09:00:00+07', '2026-09-26 17:00:00+07', 'Jakarta', 'JCC Senayan', 'Jl. Gatot Subroto, Senayan, Jakarta'
from public.seminars s where s.slug = 'turbocharge-your-q4'
on conflict do nothing;

-- OKTOBER: Financial Revolution - Online, 2-4 Okt
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-10-02 09:00:00+07', '2026-10-04 17:00:00+07', 'Online', 'Zoom Webinar', 'Online'
from public.seminars s where s.slug = 'financial-revolution'
on conflict do nothing;

-- OKTOBER: Life Revolution - Offline Surabaya, 22-24 Okt
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-10-22 09:00:00+07', '2026-10-24 17:00:00+07', 'Surabaya', 'Grand City Hall', 'Jl. Walikota Mustajab, Surabaya'
from public.seminars s where s.slug = 'life-revolution'
on conflict do nothing;

-- NOVEMBER: Training for Firewalk Trainers - Offline Lombok, 25-28 Nov
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-11-25 09:00:00+07', '2026-11-28 17:00:00+07', 'Lombok', 'Novotel Lombok', 'Jl. Pantai Mandalika, Lombok Tengah'
from public.seminars s where s.slug = 'training-for-firewalk-trainers'
on conflict do nothing;

-- DESEMBER: Financial Revolution - Online, 4-6 Des
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-12-04 09:00:00+07', '2026-12-06 17:00:00+07', 'Online', 'Zoom Webinar', 'Online'
from public.seminars s where s.slug = 'financial-revolution'
on conflict do nothing;

-- DESEMBER: I Am SuperTeens - Offline Bandung, 18-23 Des
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select s.id, '2026-12-18 09:00:00+07', '2026-12-23 17:00:00+07', 'Bandung', 'Trans Convention Centre', 'Jl. Gatot Subroto No.289, Bandung'
from public.seminars s where s.slug = 'i-am-superteens'
on conflict do nothing;

-- ── Tickets (Regular untuk semua jadwal) ─────────────────────────────────────
insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 2000000, 200, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug in ('financial-revolution') and sc.city = 'Online'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);

insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 5000000, 300, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'sales-marketing-revolution'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);

insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 500000, 100, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'lunch-and-tour'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);

insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 1500000, 500, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'ramadhan-breakthrough'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);

insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 5000000, 300, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'property-rich-revolution'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);

insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 3500000, 150, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'i-am-superteens'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);

insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 5000000, 300, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'business-revolution'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);

insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 1000000, 500, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'turbocharge-your-q4'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);

insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 4000000, 200, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'life-revolution'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);

insert into public.tickets (schedule_id, name, price, quota, sold)
select sc.id, 'Regular', 7500000, 50, 0
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'training-for-firewalk-trainers'
  and not exists (select 1 from public.tickets t where t.schedule_id = sc.id);
