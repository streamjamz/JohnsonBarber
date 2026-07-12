import Link from 'next/link';
import { getServices, getAddons } from '@/lib/content';

export const revalidate = 0;

export default async function ServicesPage() {
  const [services, addons] = await Promise.all([getServices(), getAddons()]);

  return (
    <main className="page" data-page="services">
      <div className="page-head">
        <div className="eyebrow">Services &amp; Pricing</div>
        <h1>The Menu</h1>
        <p>Prices are per service. Times are how long we&apos;ll hold your chair.</p>
      </div>

      <div className="svc-section">
        <div className="section-label">Cuts &amp; Shaves</div>
        {services.map((s) => (
          <div className="svc-row" key={s.id}>
            <div className="svc-main">
              <div className="svc-title-line">
                <span className="svc-name">{s.name}</span>
                <span className="svc-dur">{s.duration}</span>
              </div>
              <div className="svc-desc">{s.description}</div>
            </div>
            <div className="svc-price">${s.price}</div>
            <Link href={`/book?service=${s.id}`} className="btn btn-red svc-book">Book</Link>
          </div>
        ))}
      </div>

      <div className="addons-section">
        <div className="section-label">Add-ons</div>
        <p className="addons-intro">Stack any of these onto your cut — you&apos;ll get the option during booking.</p>
        <div className="addons-grid">
          {addons.map((a) => (
            <div className="addon-card" key={a.id}>
              <div>
                <div className="addon-name">{a.name}</div>
                <div className="addon-desc">{a.description}</div>
              </div>
              <div className="addon-price">+${a.price}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="center-cta">
        <Link href="/book" className="btn btn-red">Start Booking</Link>
      </div>
    </main>
  );
}
