'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Could not sign in.');
      setBusy(false);
    }
  }

  return (
    <div className="admin-shell">
      <div className="login-box">
        <div className="brand-name">Johnson&apos;s Barbers</div>
        <div className="tag">Owner Admin</div>
        <div className="card">
          <form onSubmit={onSubmit}>
            {error && <div className="msg err">{error}</div>}
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <button className="abtn" type="submit" disabled={busy} style={{ width: '100%' }}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center' }}>
          Create the owner account in Supabase → Authentication → Users.
        </p>
      </div>
    </div>
  );
}
