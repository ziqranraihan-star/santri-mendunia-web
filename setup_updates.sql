-- SQL Script untuk update Auth, RBAC Admin/PIC, dan Santri News
-- Jalankan skrip ini di Supabase SQL Editor Anda.

-- 1. Tambah kolom baru di tabel users
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS pesantren TEXT,
ADD COLUMN IF NOT EXISTS managed_menus TEXT[] DEFAULT '{}';

-- 2. Tambah kolom baru di tabel news
ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS authors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS editors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS related_links JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT false;
