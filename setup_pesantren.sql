-- Deprecated standalone setup.
-- Use ../../supabase_schema.sql followed by ../../secure_supabase.sql instead.
-- This file remains as a safe compatibility wrapper for older deployment notes.

CREATE TABLE IF NOT EXISTS public.pesantren (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'modern',
  location TEXT,
  image_url TEXT,
  website_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.pesantren ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone for pesantren." ON public.pesantren;
DROP POLICY IF EXISTS "Enable insert for authenticated users only for pesantren" ON public.pesantren;
DROP POLICY IF EXISTS "Enable update for authenticated users only for pesantren" ON public.pesantren;
DROP POLICY IF EXISTS "Enable delete for authenticated users only for pesantren" ON public.pesantren;

DROP POLICY IF EXISTS content_public_read_pesantren ON public.pesantren;
DROP POLICY IF EXISTS content_manage_pesantren ON public.pesantren;

CREATE POLICY content_public_read_pesantren ON public.pesantren
  FOR SELECT USING (is_active = true);

CREATE POLICY content_manage_pesantren ON public.pesantren
  FOR ALL TO authenticated
  USING (public.can_manage('/admin/pesantren'))
  WITH CHECK (public.can_manage('/admin/pesantren'));
