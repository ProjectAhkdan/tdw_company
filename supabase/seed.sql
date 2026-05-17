-- Seed data untuk TDW Resources

-- Categories
insert into public.categories (id, name, slug, color) values
  ('11111111-0000-0000-0000-000000000001', 'Properti',        'properti',        '#f97316'),
  ('11111111-0000-0000-0000-000000000002', 'Sales',           'sales',           '#3b82f6'),
  ('11111111-0000-0000-0000-000000000003', 'Bisnis',          'bisnis',          '#8b5cf6'),
  ('11111111-0000-0000-0000-000000000004', 'Life Revolution', 'life-revolution', '#10b981')
on conflict (slug) do nothing;

-- Seminars
insert into public.seminars (id, slug, title, short_desc, description, category_id, status, is_featured) values
  (
    '22222222-0000-0000-0000-000000000001',
    'property-revolution',
    'Property Revolution',
    'Strategi investasi properti terbukti untuk menghasilkan keuntungan berlipat ganda.',
    'Property Revolution adalah seminar intensif yang dirancang untuk membantu Anda memahami strategi investasi properti yang terbukti menghasilkan keuntungan berlipat ganda. Dipandu langsung oleh Tung Desem Waringin.',
    '11111111-0000-0000-0000-000000000001',
    'PUBLISHED',
    true
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'sales-mastery',
    'Sales Mastery',
    'Kuasai teknik closing yang digunakan top 1% sales professional Indonesia.',
    'Sales Mastery adalah program pelatihan penjualan paling komprehensif yang akan mengubah cara Anda menjual selamanya.',
    '11111111-0000-0000-0000-000000000002',
    'PUBLISHED',
    true
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    'business-breakthrough',
    'Business Breakthrough',
    'Strategi scaling bisnis dari 7 digit ke 9 digit bersama TDW.',
    'Business Breakthrough adalah seminar transformasi bisnis yang akan membantu Anda menembus plateau dan membawa bisnis ke level berikutnya.',
    '11111111-0000-0000-0000-000000000003',
    'PUBLISHED',
    true
  ),
  (
    '22222222-0000-0000-0000-000000000004',
    'life-revolution',
    'Life Revolution',
    'Transformasi total kehidupan Anda — mindset, kesehatan, hubungan, dan keuangan.',
    'Life Revolution adalah program pengembangan diri paling komprehensif yang mencakup semua aspek kehidupan.',
    '11111111-0000-0000-0000-000000000004',
    'PUBLISHED',
    false
  )
on conflict (slug) do nothing;

-- Schedules
insert into public.schedules (id, seminar_id, start_date, end_date, city, venue) values
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '2026-06-15 09:00:00+07', '2026-06-15 17:00:00+07', 'Jakarta',   'JCC Senayan'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', '2026-07-20 09:00:00+07', '2026-07-20 17:00:00+07', 'Surabaya',  'Grand City Convention'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000002', '2026-06-22 09:00:00+07', '2026-06-22 17:00:00+07', 'Surabaya',  'Pakuwon Mall Convention'),
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000002', '2026-07-13 09:00:00+07', '2026-07-13 17:00:00+07', 'Jakarta',   'Balai Kartini'),
  ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003', '2026-07-05 09:00:00+07', '2026-07-05 17:00:00+07', 'Bandung',   'Padma Hotel Bandung'),
  ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000004', '2026-07-12 09:00:00+07', '2026-07-12 17:00:00+07', 'Jakarta',   'ICE BSD')
on conflict do nothing;

-- Tickets
insert into public.tickets (schedule_id, name, price, early_bird_price, early_bird_until, quota, sold) values
  ('33333333-0000-0000-0000-000000000001', 'Regular', 2500000, 2000000, '2026-06-01 23:59:59+07', 200, 45),
  ('33333333-0000-0000-0000-000000000001', 'VIP',     5000000, 4000000, '2026-06-01 23:59:59+07', 50,  12),
  ('33333333-0000-0000-0000-000000000001', 'VVIP',    10000000, null,   null,                      10,  3),
  ('33333333-0000-0000-0000-000000000002', 'Regular', 2500000, 2000000, '2026-07-06 23:59:59+07', 200, 20),
  ('33333333-0000-0000-0000-000000000002', 'VIP',     5000000, null,    null,                      50,  5),
  ('33333333-0000-0000-0000-000000000003', 'Regular', 1800000, 1500000, '2026-06-08 23:59:59+07', 150, 60),
  ('33333333-0000-0000-0000-000000000003', 'VIP',     3500000, null,    null,                      30,  8),
  ('33333333-0000-0000-0000-000000000004', 'Regular', 1800000, null,    null,                      150, 10),
  ('33333333-0000-0000-0000-000000000005', 'Regular', 3000000, 2500000, '2026-06-21 23:59:59+07', 100, 25),
  ('33333333-0000-0000-0000-000000000005', 'VIP',     6000000, null,    null,                      20,  4),
  ('33333333-0000-0000-0000-000000000006', 'Regular', 2000000, null,    null,                      200, 80);

-- Commission rates
insert into public.commission_rates (seminar_id, percentage) values
  ('22222222-0000-0000-0000-000000000001', 15),
  ('22222222-0000-0000-0000-000000000002', 15),
  ('22222222-0000-0000-0000-000000000003', 15),
  ('22222222-0000-0000-0000-000000000004', 10)
on conflict (seminar_id) do nothing;

-- Testimonials
insert into public.testimonials (seminar_id, author_name, author_role, content, rating, is_featured) values
  ('22222222-0000-0000-0000-000000000001', 'Budi Santoso',   'CEO PT Maju Jaya',      'Setelah ikut Property Revolution, saya berhasil mendapatkan 3 properti dalam 6 bulan dengan total keuntungan Rp 800 juta.',                    5, true),
  ('22222222-0000-0000-0000-000000000001', 'Sari Dewi',      'Karyawan Swasta',       'Awalnya skeptis, tapi teknik yang diajarkan benar-benar applicable. Sekarang saya punya 2 rumah kontrakan yang menghasilkan passive income.',    5, true),
  ('22222222-0000-0000-0000-000000000002', 'Rini Handayani', 'Sales Manager',         'Tim saya meningkatkan revenue 250% dalam 3 bulan setelah menerapkan teknik dari Sales Mastery.',                                                5, true),
  ('22222222-0000-0000-0000-000000000002', 'Denny Pratama',  'Insurance Agent',       'Dari closing 2-3 polis per bulan, sekarang konsisten 10+ polis. Game changer!',                                                                 5, false),
  ('22222222-0000-0000-0000-000000000003', 'Hendra Kusuma',  'CEO Startup',           'Revenue bisnis saya naik dari 500 juta ke 5 miliar per tahun dalam 18 bulan setelah menerapkan framework dari Business Breakthrough.',          5, true),
  (null,                                  'Maya Sari',      'Pemilik Franchise',     'Dari 1 outlet, sekarang sudah 12 outlet dalam 2 tahun. Sistem yang diajarkan benar-benar works!',                                               5, true);
