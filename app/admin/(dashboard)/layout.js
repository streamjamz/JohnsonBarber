import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/admin-auth';
import { isConfigured } from '@/lib/supabase/server';
import AdminNav from '@/components/AdminNav';
import LogoutButton from '@/components/LogoutButton';

export const metadata = { title: "Admin · Johnson's Barbers" };
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  if (!isConfigured()) {
    return (
      <div className="admin-shell">
        <div className="admin-wrap">
          <div className="admin-h1">Setup needed</div>
          <div className="card">
            <p style={{ color: 'var(--text2)' }}>
              Supabase isn&apos;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and <code>SUPABASE_SERVICE_ROLE_KEY</code>{' '}
              to your environment, run <code>supabase/schema.sql</code>, then create an owner
              user in Supabase → Authentication. See <code>SETUP.md</code>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const user = await getUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="brand-name">Johnson&apos;s</span>{' '}
          <span className="tag">Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/" className="abtn ghost sm" target="_blank">View site ↗</Link>
          <LogoutButton />
        </div>
      </div>
      <div className="admin-wrap">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
