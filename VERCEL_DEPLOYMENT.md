# Vercel Production Checklist

Use Vercel as the production target for `www.santrimendunia.org`.

## Environment Variables

Set these values in Vercel for Production, Preview, and Development:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SEED_ADMIN_SECRET=
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are compiled into the browser bundle. After changing either value, redeploy production with the build cache cleared.

## Admin Recovery

1. Open Supabase Dashboard > Authentication > Users.
2. Reset the password for `admin@santrimendunia.com`.
3. Run `supabase_admin_recovery.sql` in Supabase SQL Editor.
4. Confirm the resulting `public.users` row has `role = 'admin'`.

## Database Checks

Run the latest baseline and hardening SQL before smoke testing:

1. `../supabase_schema.sql` from the workspace root.
2. `../secure_supabase.sql` from the workspace root.

Then verify active news rows exist:

```sql
SELECT id, title, slug, is_active, published_at
FROM public.news
WHERE is_active = true
ORDER BY published_at DESC
LIMIT 10;
```

## Smoke Test

After redeploying Vercel:

1. Visit `/login` and confirm a wrong password shows a friendly error.
2. Login with `admin@santrimendunia.com` and confirm redirect to `/admin/dashboard`.
3. Visit `/berita`; it should show articles, an empty state, or a retryable error state, never endless skeleton cards.
4. Create a test article in `/admin/berita` and confirm it appears on `/berita`.
5. Check `curl -I https://www.santrimendunia.org/berita`; `Age` should be low right after redeploy.
