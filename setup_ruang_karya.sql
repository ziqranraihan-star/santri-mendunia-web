-- Jalankan script SQL ini di Supabase SQL Editor Anda
-- Buka dashboard Supabase -> SQL Editor -> New Query -> Paste dan Run.

ALTER TABLE public.ebooks
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Jika ada error RLS saat upload, pastikan policy storage juga mengizinkan public.
