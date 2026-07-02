-- SQL Script untuk inisialisasi Samawa Space
-- Jalankan skrip ini di Supabase SQL Editor Anda.

-- 1. Tambah tabel samawa_profiles
CREATE TABLE IF NOT EXISTS public.samawa_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  gender TEXT CHECK (gender IN ('Ikhwan', 'Akhwat')),
  ktp_url TEXT,
  recommendation_url TEXT,
  vision_mission TEXT,
  criteria TEXT,
  amalan_rutin TEXT,
  skill_bekal TEXT,
  status TEXT DEFAULT 'unverified', -- 'unverified', 'verified', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tambah tabel taaruf_requests
CREATE TABLE IF NOT EXISTS public.taaruf_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'chat_active', 'closed'
  reason_text TEXT,
  vision_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tambah tabel taaruf_messages
CREATE TABLE IF NOT EXISTS public.taaruf_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.taaruf_requests(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.samawa_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taaruf_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taaruf_messages ENABLE ROW LEVEL SECURITY;

-- Run ../../secure_supabase.sql after this file to install the final access policies.
