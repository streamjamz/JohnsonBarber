'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    try { await createClient().auth.signOut(); } catch (e) {}
    router.push('/admin/login');
    router.refresh();
  }
  return <button className="abtn ghost sm" onClick={logout}>Sign out</button>;
}
