-- Seed: company content data
-- Run after 20260516000001_company_content.sql

-- ── company_stats ────────────────────────────────────────────────────────────
insert into public.company_stats (label, value, sort_order) values
  ('Peserta',           '10 Juta+', 0),
  ('Negara',            '30+',      1),
  ('Tahun Pengalaman',  '20+',      2),
  ('Program Training',  '7+',       3)
on conflict do nothing;

-- ── media_coverage ───────────────────────────────────────────────────────────
insert into public.media_coverage (name, sort_order) values
  ('Majalah Pilar Bisnis',       0),
  ('Majalah Marketing',          1),
  ('Majalah SWA',                2),
  ('Jawa Pos Group',             3),
  ('Metro TV',                   4),
  ('SCTV',                       5),
  ('Majalah Gatra',              6),
  ('National Achievers Congress', 7)
on conflict do nothing;

-- ── team_members ─────────────────────────────────────────────────────────────
insert into public.team_members (name, role, bio, is_featured, sort_order) values
  ('Tung Desem Waringin', 'Co-Founder & Lead Trainer',
   'Pelatih Sukses No.1 di Indonesia versi Majalah Marketing. Pemegang rekor MURI untuk penjualan buku Financial Revolution (10.511 eksemplar) dan Marketing Revolution (38.878 eksemplar) di hari pertama edar. Man of The Year 2020 versi Majalah Gatra.',
   true, 0),
  ('Richard Tan', 'Co-Founder',
   'Co-Founder TDW Resources dan CEO Success Resources Singapore. Telah membawa program pengembangan diri dan bisnis ke lebih dari 30 negara dengan peserta lebih dari 10 juta orang.',
   true, 1),
  ('Tim Operasional', 'Operations Team',
   'Tim profesional yang memastikan setiap seminar berjalan dengan sempurna.',
   false, 2),
  ('Tim Marketing', 'Marketing Team',
   'Tim kreatif yang menjangkau ribuan calon peserta di seluruh Indonesia.',
   false, 3)
on conflict do nothing;

-- ── faqs ─────────────────────────────────────────────────────────────────────
insert into public.faqs (question, answer, sort_order, is_active) values
  ('Bagaimana cara mendaftar seminar?',
   'Anda bisa mendaftar melalui website kami dengan memilih seminar, mengisi formulir, dan melakukan pembayaran. Konfirmasi akan dikirim via email dan WhatsApp.',
   0, true),
  ('Metode pembayaran apa saja yang tersedia?',
   'Kami menerima transfer bank (BCA, Mandiri, BNI), kartu kredit, dan e-wallet (GoPay, OVO, Dana).',
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
  ('Tony Robbins',
   'Pelatih Sukses #1 di Dunia',
   'Your Accomplishments will impact the lives of many generations to come.',
   5, true),
  ('Hendy Setiono',
   'Founder & CEO Kebab Turki Baba Rafi',
   'Dari 1 outlet, kini sudah mengoperasikan lebih dari 1.000 outlet di Indonesia, Malaysia & Filipina setelah menerapkan ilmu dari Pak Tung.',
   5, true),
  ('Alex P. Chandra',
   'Direktur BPR LESTARI Bali',
   'BPR LESTARI dari tak dikenal menjadi TERBESAR di BALI. Tahun 1999 Aset Rp 300 juta, akhir tahun 2018 aset 5,13 Trilyun.',
   5, true),
  ('Bong Chandra',
   'Direktur Triniti Property',
   'Dengan modal yang sedikit, jurus Pak Tung saya praktekkan. Berhasil membangun perumahan 300-an rumah & 65 ruko, SOLD OUT dengan omzet 180 miliar. Lalu berhasil menjual 900 unit apartment dalam 45 hari dengan omzet 1,2 Trilyun.',
   5, true),
  ('Rudy Margono',
   'Presdir Gapura Prima Group',
   'The Belleza, Bellagio, Serpong Town Square — 31 proyek properti dari Gapura Prima Group, penjualannya naik 420% hanya dalam waktu 1 bulan.',
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
