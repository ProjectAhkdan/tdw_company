-- Videos table for YouTube embeds
CREATE TABLE IF NOT EXISTS public.videos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  youtube_id  text NOT NULL,
  description text,
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Seed: video dari channel Tung Desem Waringin
INSERT INTO public.videos (title, youtube_id, description, sort_order) VALUES
  ('Rahasia Kaya yang Jarang Diketahui', 'dQw4w9WgXcQ', 'Strategi membangun kekayaan dari nol', 0),
  ('Cara Sukses dalam Bisnis', 'dQw4w9WgXcQ', 'Tips bisnis dari Tung Desem Waringin', 1),
  ('Financial Revolution Highlights', 'dQw4w9WgXcQ', 'Highlight seminar Financial Revolution', 2)
ON CONFLICT DO NOTHING;
