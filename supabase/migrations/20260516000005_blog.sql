-- Migration: blog posts table (extends existing blog_posts table)
-- The blog_posts table already exists from initial schema.
-- Add missing columns if needed.

alter table public.blog_posts
  add column if not exists category  text,
  add column if not exists tags       text[] default '{}',
  add column if not exists read_time  integer; -- minutes

-- Public read policy
drop policy if exists "public read blog_posts" on public.blog_posts;
create policy "public read blog_posts" on public.blog_posts
  for select using (is_published = true);

-- Admin full access
drop policy if exists "admin manage blog_posts" on public.blog_posts;
create policy "admin manage blog_posts" on public.blog_posts
  for all using (
    exists (select 1 from public.users u where u.supabase_id = auth.uid() and u.role = 'ADMIN')
  );

-- Seed sample posts
insert into public.blog_posts (slug, title, excerpt, content, author_name, category, tags, is_published, published_at, read_time)
values
  ('strategi-investasi-properti-2026',
   'Strategi Investasi Properti di 2026',
   'Pasar properti Indonesia terus berkembang. Pelajari strategi terbaik untuk memaksimalkan return investasi Anda tahun ini.',
   '## Mengapa Properti Masih Menjadi Pilihan Utama

Pasar properti Indonesia terus menunjukkan pertumbuhan yang signifikan di tahun 2026. Dengan meningkatnya urbanisasi dan pertumbuhan kelas menengah, permintaan akan hunian dan properti komersial terus meningkat.

## Strategi Terbaik 2026

Salah satu strategi terbaik adalah fokus pada properti di kawasan yang sedang berkembang, terutama di sekitar infrastruktur baru seperti MRT, LRT, dan jalan tol.

### 1. Properti Mixed-Use

Properti dengan konsep mixed-use yang menggabungkan hunian, komersial, dan fasilitas publik menjadi tren yang semakin diminati.

### 2. Timing yang Tepat

Kunci sukses investasi properti adalah riset mendalam, timing yang tepat, dan pemilihan lokasi yang strategis.

## Kesimpulan

Jangan lupa untuk selalu menghitung ROI secara realistis sebelum mengambil keputusan investasi.',
   'Tung Desem Waringin', 'Properti', array['properti', 'investasi', 'bisnis'], true, now() - interval '6 days', 5),

  ('teknik-closing-sales-terbukti',
   '7 Teknik Closing Sales yang Terbukti Efektif',
   'Tingkatkan closing rate Anda dengan teknik-teknik yang telah digunakan oleh ribuan sales professional sukses di Indonesia.',
   '## Mengapa Closing Itu Penting

Closing adalah momen paling krusial dalam proses penjualan. Banyak sales professional yang gagal bukan karena produknya buruk, melainkan karena tidak tahu cara menutup deal dengan efektif.

## 7 Teknik Closing Terbukti

### 1. Assumptive Close

Berbicara seolah-olah prospek sudah memutuskan untuk membeli. Misalnya: *"Kapan Anda ingin mulai?"* bukan *"Apakah Anda ingin membeli?"*

### 2. Urgency Close

Menciptakan rasa urgensi yang nyata — batas waktu penawaran, ketersediaan stok terbatas, atau kenaikan harga yang akan datang.

### 3. Summary Close

Merangkum semua manfaat yang akan didapat prospek sebelum meminta keputusan.

## Penutup

Ingat, teknik closing yang baik bukan tentang manipulasi, melainkan tentang membantu prospek membuat keputusan yang tepat untuk mereka.',
   'Tung Desem Waringin', 'Sales', array['sales', 'closing', 'teknik'], true, now() - interval '11 days', 7)

on conflict (slug) do nothing;
