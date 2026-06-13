-- Silakan jalankan script SQL ini lagi di Supabase SQL Editor Anda
-- Buka dashboard Supabase -> SQL Editor -> New Query -> Paste dan Run.

ALTER TABLE public.ebooks
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS category TEXT;

-- Setelah sukses, coba refresh halaman Admin dan simpan lagi.
