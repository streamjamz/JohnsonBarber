'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HIDDEN_PAGES } from '@/lib/site-config';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kit', label: 'Owner Kit' },
].filter((n) => !HIDDEN_PAGES.includes(n.href.replace('/', '')));

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    try {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    } catch (e) {}
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('jb-theme', next); } catch (e) {}
  }

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="no-print site-header">
      <Link href="/" className="brand" style={{ textDecoration: 'none' }}>
        <div className="brand-mark"><div className="stripe" /><span>J</span></div>
        <div style={{ lineHeight: 1 }}>
          <div className="brand-name">Johnson&apos;s</div>
          <div className="brand-sub">Barbers</div>
        </div>
      </Link>
      <nav className="site-nav">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={'nav-link' + (isActive(n.href) ? ' active' : '')}>
            {n.label}
          </Link>
        ))}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle light / dark" suppressHydrationWarning>
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <Link href="/book" className="btn btn-red nav-book">Book Now</Link>
      </nav>
    </header>
  );
}
