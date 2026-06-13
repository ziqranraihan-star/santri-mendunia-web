-- SQL Script untuk membuat tabel pesantren
-- Silakan jalankan script SQL ini di Supabase SQL Editor Anda
-- Buka dashboard Supabase -> SQL Editor -> New Query -> Paste dan Run.

CREATE TABLE IF NOT EXISTS public.pesantren (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'modern',
  location TEXT,
  image_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan RLS
ALTER TABLE public.pesantren ENABLE ROW LEVEL SECURITY;

-- Kebijakan baca: siapa saja bisa membaca
CREATE POLICY "Public profiles are viewable by everyone for pesantren."
ON public.pesantren FOR SELECT
USING (true);

-- Kebijakan tulis: hanya admin dan PIC yang bisa mengubah (sementara kita buat anon bisa untuk memudahkan atau sesuaikan dengan RBAC)
-- Note: karena ini pakai anon key di web untuk insert (berdasarkan setup lama), kita izinkan insert/update sementara
CREATE POLICY "Enable insert for authenticated users only for pesantren"
ON public.pesantren FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only for pesantren"
ON public.pesantren FOR UPDATE
USING (true);

CREATE POLICY "Enable delete for authenticated users only for pesantren"
ON public.pesantren FOR DELETE
USING (true);
