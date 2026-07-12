import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the service_role key. Bypasses RLS.
 * Use ONLY in trusted server code (admin mutations, booking inserts,
 * cron). Never import into client components. Returns null if unconfigured.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
