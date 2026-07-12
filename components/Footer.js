import Link from 'next/link';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kit', label: 'Owner Kit' },
];

export default function Footer({ content }) {
  const c = content || {};
  const line = [c.shop_address, c.shop_phone, c.shop_instagram].filter(Boolean).join(' · ');
  return (
    <footer className="no-print site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-name">Johnson&apos;s Barbers</div>
          <div className="footer-addr">{line}</div>
        </div>
        <div className="footer-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="footer-link">{n.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
