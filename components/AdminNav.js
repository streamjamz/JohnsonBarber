'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Bookings' },
  { href: '/admin/barbers', label: 'Barbers' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/content', label: 'Content' },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="admin-nav">
      {LINKS.map((l) => {
        const active = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={active ? 'active' : ''}>{l.label}</Link>
        );
      })}
    </div>
  );
}
