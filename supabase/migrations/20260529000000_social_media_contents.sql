-- Migration: social_media_contents table
-- Tabel untuk menyimpan konten social media TDW Resources (YouTube, Instagram, TikTok)

CREATE TABLE IF NOT EXISTS public.social_media_contents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform      text NOT NULL CHECK (platform IN ('youtube', 'instagram', 'tiktok')),
  title         text NOT NULL,
  caption       text,
  content_url   text NOT NULL,
  embed_id      text NOT NULL,
  thumbnail_url text,
  view_count    bigint NOT NULL DEFAULT 0,
  like_count    bigint NOT NULL DEFAULT 0,
  is_featured   boolean NOT NULL DEFAULT false,
  is_active     boolean NOT NULL DEFAULT true,
  published_at  timestamptz NOT NULL,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_social_media_platform ON public.social_media_contents (platform);
CREATE INDEX IF NOT EXISTS idx_social_media_featured ON public.social_media_contents (is_featured);
CREATE INDEX IF NOT EXISTS idx_social_media_active ON public.social_media_contents (is_active);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_social_media_updated_at ON public.social_media_contents;
CREATE TRIGGER trg_social_media_updated_at
  BEFORE UPDATE ON public.social_media_contents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.social_media_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "social_media_select_public" ON public.social_media_contents
  FOR SELECT USING (true);

CREATE POLICY "social_media_insert_admin" ON public.social_media_contents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE supabase_id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "social_media_update_admin" ON public.social_media_contents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE supabase_id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "social_media_delete_admin" ON public.social_media_contents
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE supabase_id = auth.uid() AND role = 'ADMIN')
  );

-- Seed data
INSERT INTO public.social_media_contents (platform, title, caption, content_url, embed_id, view_count, like_count, is_featured, published_at, sort_order) VALUES
-- YouTube
('youtube', 'Rahasia Sukses Finansial - Tung Desem Waringin', 'Pelajari strategi keuangan yang telah terbukti dari Tung Desem Waringin untuk mencapai kebebasan finansial.', 'https://www.youtube.com/watch?v=FK63rFTjsDE', 'FK63rFTjsDE', 1250000, 45000, true, '2024-08-15T10:00:00Z', 1),
('youtube', 'Marketing Revolution - Strategi Bisnis TDW', 'Strategi marketing revolusioner yang telah membantu ribuan pengusaha Indonesia meningkatkan omzet bisnis mereka.', 'https://www.youtube.com/watch?v=g7A34zlAX9U', 'g7A34zlAX9U', 890000, 32000, true, '2024-09-20T10:00:00Z', 2),
('youtube', 'Highlight Seminar Financial Revolution 2024', 'Cuplikan momen terbaik dari seminar Financial Revolution yang dihadiri lebih dari 10.000 peserta.', 'https://www.youtube.com/watch?v=BQ5yPlTpUd8', 'BQ5yPlTpUd8', 560000, 21000, true, '2024-11-05T10:00:00Z', 3),
-- Instagram
('instagram', 'Tips Investasi untuk Pemula', 'Mulai investasi dari sekarang! Berikut 5 tips investasi yang bisa kamu terapkan hari ini. #TDWResources #Investasi', 'https://www.instagram.com/p/C8xKLmNvQ1a/', 'C8xKLmNvQ1a', 320000, 28000, true, '2024-10-12T08:00:00Z', 1),
('instagram', 'Motivasi Pagi - Mindset Sukses', 'Bangun pagi dengan mindset pemenang! Setiap hari adalah kesempatan baru. #MotivasiTDW #MindsetSukses', 'https://www.instagram.com/p/C9aB2kNPxYz/', 'C9aB2kNPxYz', 185000, 15000, false, '2024-10-25T07:00:00Z', 2),
('instagram', 'Behind The Scene - Life Revolution Seminar', 'Persiapan tim TDW Resources untuk seminar Life Revolution. Teamwork makes the dream work! 💪', 'https://www.instagram.com/p/C7mNoPqRs3t/', 'C7mNoPqRs3t', 95000, 8500, false, '2024-09-08T12:00:00Z', 3),
-- TikTok
('tiktok', '3 Kebiasaan Orang Kaya yang Jarang Diketahui', 'Ternyata orang kaya punya kebiasaan unik ini! Nomor 3 paling mengejutkan 🤯 #TDW #FinancialFreedom', 'https://www.tiktok.com/@tdwresources/video/7312345678901234567', '7312345678901234567', 2100000, 180000, true, '2024-11-18T15:00:00Z', 1),
('tiktok', 'Cara Nego Gaji Naik 50%', 'Teknik negosiasi yang terbukti berhasil! Simpan video ini 📌 #KarirSukses #TipsKerja #TDW', 'https://www.tiktok.com/@tdwresources/video/7298765432109876543', '7298765432109876543', 1500000, 120000, false, '2024-10-30T14:00:00Z', 2),
('tiktok', 'Reply to @user - Mulai Bisnis Modal 0 Rupiah', 'Banyak yang tanya gimana mulai bisnis tanpa modal. Ini jawabannya! #BisnisOnline #TDWResources', 'https://www.tiktok.com/@tdwresources/video/7287654321098765432', '7287654321098765432', 980000, 75000, false, '2024-09-15T16:00:00Z', 3);

-- Migrate existing videos table data to social_media_contents (if videos table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'videos' AND table_schema = 'public') THEN
    INSERT INTO public.social_media_contents (platform, title, caption, content_url, embed_id, view_count, is_featured, published_at, sort_order)
    SELECT 'youtube', title, description, 'https://www.youtube.com/watch?v=' || youtube_id, youtube_id, 0, false, created_at, sort_order
    FROM public.videos
    WHERE youtube_id NOT IN (SELECT embed_id FROM public.social_media_contents WHERE platform = 'youtube')
    ON CONFLICT DO NOTHING;

    DROP TABLE public.videos;
  END IF;
END $$;
