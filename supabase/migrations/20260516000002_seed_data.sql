-- Seed: company content data
-- Run after 20260516000001_company_content.sql

-- ── company_stats ────────────────────────────────────────────────────────────
insert into public.company_stats (label, value, sort_order) values
  ('Alumni',  '50.000+', 0),
  ('Seminar', '200+',    1),
  ('Kota',    '25+',     2),
  ('Tahun',   '20+',     3)
on conflict do nothing;

-- ── media_coverage ───────────────────────────────────────────────────────────
insert into public.media_coverage (name, sort_order) values
  ('Kompas',           0),
  ('Metro TV',         1),
  ('Trans TV',         2),
  ('CNN Indonesia',    3),
  ('Forbes Indonesia', 4),
  ('Bisnis Indonesia', 5)
on conflict do nothing;

-- ── team_members ─────────────────────────────────────────────────────────────
insert into public.team_members (name, role, bio, is_featured, sort_order) values
  ('Tung Desem Waringin', 'Founder & CEO', 'Motivator dan business coach nomor satu di Indonesia dengan pengalaman lebih dari 20 tahun.', true, 0),
  ('Tim Operasional', 'Operations Team', 'Tim profesional yang memastikan setiap seminar berjalan dengan sempurna.', false, 1),
  ('Tim Marketing', 'Marketing Team', 'Tim kreatif yang menjangkau ribuan calon peserta di seluruh Indonesia.', false, 2)
on conflict do nothing;

-- ── faqs ─────────────────────────────────────────────────────────────────────
insert into public.faqs (question, answer, sort_order, is_active) values
  ('Bagaimana cara mendaftar seminar?',
   'Anda bisa mendaftar melalui website kami dengan memilih seminar, mengisi formulir, dan melakukan pembayaran. Konfirmasi akan dikirim via email dan WhatsApp.',
   0, true),
  ('Metode pembayaran apa saja yang tersedia?',
   'Kami menerima transfer bank (BCA, Mandiri, BNI), kartu kredit, dan e-wallet (GoPay, OVO, Dana) melalui payment gateway Midtrans.',
   1, true),
  ('Apakah peserta mendapat sertifikat?',
   'Ya, setiap peserta yang menghadiri seminar akan mendapatkan sertifikat digital yang bisa diunduh melalui dashboard akun Anda.',
   2, true),
  ('Bagaimana kebijakan refund?',
   'Refund dapat diajukan maksimal 7 hari sebelum acara dengan potongan admin 10%. Setelah itu, tiket bisa dipindahtangankan ke orang lain.',
   3, true),
  ('Di mana lokasi seminar diadakan?',
   'Seminar diadakan di hotel-hotel bintang 4-5 di kota-kota besar Indonesia seperti Jakarta, Surabaya, Bandung, Bali, dan Medan.',
   4, true),
  ('Apakah ada program cicilan?',
   'Ya, kami menyediakan program cicilan 0% untuk kartu kredit tertentu. Hubungi tim kami untuk informasi lebih lanjut.',
   5, true)
on conflict do nothing;

-- ── pricing_packages ─────────────────────────────────────────────────────────
insert into public.pricing_packages (name, price, features, is_popular, sort_order, is_active) values
  ('Starter',
   1500000,
   array['1 Seminar pilihan', 'Materi digital', 'Sertifikat', 'Grup komunitas'],
   false, 0, true),
  ('Pro',
   2500000,
   array['3 Seminar pilihan', 'Materi digital + fisik', 'Sertifikat', 'Grup komunitas', 'Konsultasi 1x', 'Akses rekaman'],
   true, 1, true),
  ('Premium',
   4000000,
   array['Semua seminar 1 tahun', 'Materi digital + fisik', 'Sertifikat', 'Grup VIP', 'Konsultasi 4x', 'Akses rekaman', 'Seat prioritas'],
   false, 2, true)
on conflict do nothing;

-- ── testimonials ─────────────────────────────────────────────────────────────
insert into public.testimonials (author_name, author_role, content, rating, is_featured) values
  ('Budi Santoso',  'CEO PT Maju Jaya',
   'Seminar TDW mengubah cara saya memimpin bisnis. Omzet naik 3x dalam 6 bulan setelah menerapkan ilmu yang didapat.',
   5, true),
  ('Sari Dewi',     'Manager Marketing',
   'Materi yang diajarkan sangat aplikatif. Langsung bisa diterapkan di pekerjaan sehari-hari dengan hasil nyata.',
   5, true),
  ('Rudi Hartono',  'Pengusaha',
   'Investasi terbaik yang pernah saya keluarkan. Networking dan ilmu yang didapat tidak ternilai harganya.',
   5, true),
  ('Dewi Kusuma',   'Direktur PT Sukses Bersama',
   'Setelah mengikuti seminar Property Revolution, saya berhasil membeli properti pertama saya dalam 3 bulan.',
   5, true),
  ('Andi Wijaya',   'Sales Manager',
   'Teknik closing yang diajarkan TDW benar-benar revolusioner. Konversi saya naik dari 20% menjadi 65%.',
   5, true),
  ('Rina Marlina',  'Ibu Rumah Tangga & Investor',
   'Saya tidak menyangka bisa memulai bisnis properti dari nol. TDW memberikan roadmap yang sangat jelas.',
   5, true)
on conflict do nothing;

-- ── categories (untuk seminar seed) ─────────────────────────────────────────
insert into public.categories (name, slug, color) values
  ('Properti', 'properti', '#F59E0B'),
  ('Sales',    'sales',    '#10B981'),
  ('Bisnis',   'bisnis',   '#3B82F6'),
  ('Life',     'life',     '#8B5CF6')
on conflict (slug) do nothing;

-- ── seminars seed ────────────────────────────────────────────────────────────
insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select
  'property-revolution',
  'Property Revolution',
  'Kuasai strategi investasi properti yang menghasilkan passive income berlipat ganda.',
  'Program intensif selama 1 hari penuh yang mengajarkan strategi investasi properti dari nol hingga mahir. Anda akan belajar cara menemukan properti undervalue, teknik negosiasi, dan cara membangun portofolio properti yang menghasilkan passive income.',
  'PUBLISHED',
  true,
  c.id
from public.categories c where c.slug = 'properti'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select
  'sales-mastery',
  'Sales Mastery',
  'Tingkatkan kemampuan closing dan konversi penjualan Anda hingga 10x lipat.',
  'Seminar sales terlengkap yang mengajarkan psikologi pembeli, teknik presentasi, handling objection, dan closing yang efektif. Cocok untuk sales profesional, pengusaha, dan siapa saja yang ingin meningkatkan kemampuan menjual.',
  'PUBLISHED',
  true,
  c.id
from public.categories c where c.slug = 'sales'
on conflict (slug) do nothing;

insert into public.seminars (slug, title, short_desc, description, status, is_featured, category_id)
select
  'business-breakthrough',
  'Business Breakthrough',
  'Temukan strategi bisnis yang tepat untuk scale up usaha Anda ke level berikutnya.',
  'Program transformasi bisnis yang komprehensif. Pelajari cara membangun sistem bisnis yang berjalan tanpa Anda, strategi marketing yang efektif, dan cara mengelola keuangan bisnis dengan benar.',
  'PUBLISHED',
  true,
  c.id
from public.categories c where c.slug = 'bisnis'
on conflict (slug) do nothing;

-- ── schedules seed ───────────────────────────────────────────────────────────
insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select
  s.id,
  '2026-06-15 09:00:00+07',
  '2026-06-15 17:00:00+07',
  'Jakarta',
  'JCC Senayan',
  'Jl. Gatot Subroto, Senayan, Jakarta Pusat'
from public.seminars s where s.slug = 'property-revolution'
on conflict do nothing;

insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select
  s.id,
  '2026-06-22 09:00:00+07',
  '2026-06-22 17:00:00+07',
  'Surabaya',
  'Grand City Hall',
  'Jl. Walikota Mustajab, Surabaya'
from public.seminars s where s.slug = 'sales-mastery'
on conflict do nothing;

insert into public.schedules (seminar_id, start_date, end_date, city, venue, address)
select
  s.id,
  '2026-07-05 09:00:00+07',
  '2026-07-05 17:00:00+07',
  'Bandung',
  'Trans Convention Centre',
  'Jl. Gatot Subroto No.289, Bandung'
from public.seminars s where s.slug = 'business-breakthrough'
on conflict do nothing;

-- ── tickets seed ─────────────────────────────────────────────────────────────
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota, sold)
select
  sc.id,
  'Regular',
  2500000,
  null,
  null,
  500,
  200
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'property-revolution' and sc.city = 'Jakarta'
on conflict do nothing;

insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota, sold)
select
  sc.id,
  'Regular',
  1800000,
  null,
  null,
  300,
  280
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'sales-mastery' and sc.city = 'Surabaya'
on conflict do nothing;

insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota, sold)
select
  sc.id,
  'Regular',
  3000000,
  2500000,
  '2026-06-25 23:59:59+07',
  400,
  100
from public.schedules sc
join public.seminars s on s.id = sc.seminar_id
where s.slug = 'business-breakthrough' and sc.city = 'Bandung'
on conflict do nothing;
