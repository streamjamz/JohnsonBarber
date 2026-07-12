import { createClient } from '@/lib/supabase/server';

/** Returns the signed-in admin user, or null. Use in Server Components. */
export async function getUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/** Throws if not signed in — call at the top of every admin server action. */
export async function requireUser() {
  const user = await getUser();
  if (!user) throw new Error('Not authorized');
  return user;
}
