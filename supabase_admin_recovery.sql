-- Admin recovery helper for Santri Mendunia.
-- Run this in the Supabase SQL Editor after resetting the password for
-- admin@santrimendunia.com in Authentication > Users.

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id
  INTO admin_user_id
  FROM auth.users
  WHERE lower(email) = lower('admin@santrimendunia.com')
  LIMIT 1;

  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Auth user admin@santrimendunia.com was not found. Create or reset it in Supabase Authentication first.';
  END IF;

  INSERT INTO public.users (
    id,
    email,
    name,
    role,
    managed_menus,
    created_at,
    updated_at
  )
  VALUES (
    admin_user_id,
    'admin@santrimendunia.com',
    'Admin Santri Mendunia',
    'admin',
    ARRAY[]::text[],
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    role = 'admin',
    managed_menus = ARRAY[]::text[],
    updated_at = now();
END $$;

SELECT id, email, name, role, managed_menus
FROM public.users
WHERE lower(email) = lower('admin@santrimendunia.com');
