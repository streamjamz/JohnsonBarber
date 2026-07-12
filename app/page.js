import Link from 'next/link';
import BarberPhoto from '@/components/BarberPhoto';
import { isHidden } from '@/lib/site-config';
import {
  getStats, getContent, getHours, getBarbers, getGroupPerks, getGroupPackages,
} from '@/lib/content';

export const revalidate = 0;

export default async function HomePage() {
  const [stats, content, hours, barbers, perks, packages] = await Promise.all([
    getStats(), getContent(), getHours(), getBarbers(), getGroupPerks(), getGroupPackages(),
  ]);
  const c = content;

  return (
    <main data-page="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-topbar" />
        <div className="hero-inner">
          <div className="hero-pill">{c.hero_pill}</div>
          <h1>{c.hero_title_1}<br /><span className="red">{c.hero_title_2}</span></h1>
          <p>{c.hero_sub}</p>
          <div className="hero-cta">
            <Link href="/book" className="btn btn-red">Book an Appointment</Link>
            <Link href="/services" className="btn btn-outline">See the Menu</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.id}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* STORY + HOURS */}
      <section className="story">
        <div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>The Shop</div>
          <h2>{c.story_title}</h2>
          <p>{c.story_p1}</p>
          <p>{c.story_p2}</p>
          {!isHidden('gallery') && (
            <Link href="/gallery" className="link-btn" style={{ display: 'inline-block' }}>See our work →</Link>
          )}
        </div>
        <div className="hours-card">
          <div className="hours-head">Hours</div>
          <div className="hours-body">
            {hours.map((h) => {
              const color = h.closed ? 'var(--dim)' : 'var(--text)';
              return (
                <div className="hours-row" key={h.id}>
                  <span className="day" style={{ color }}>{h.day}</span>
                  <span className="time" style={{ color }}>{h.time}</span>
                </div>
              );
            })}
            <div className="hours-foot">📍 {c.shop_address} · {c.shop_phone}</div>
          </div>
        </div>
      </section>

      {/* CREW */}
      <section className="crew">
        <div className="crew-inner">
          <div className="section-center">
            <div className="eyebrow">The Crew</div>
            <h2>Pick your barber</h2>
          </div>
          <div className="crew-grid">
            {barbers.map((b) => (
              <div className="crew-card" key={b.id}>
                <div className="crew-photo"><BarberPhoto barber={b} /></div>
                <div className="crew-body">
                  <div className="crew-name">{b.name}</div>
                  <div className="crew-role">{b.role}</div>
                  <div className="crew-spec">{b.specialty}</div>
                  <Link href={`/book?barber=${b.id}`} className="crew-book" style={{ display: 'block', textAlign: 'center' }}>
                    Book with {b.first_name || b.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GROUP BOOKINGS */}
      <section className="group">
        <div className="group-inner">
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Group Bookings</div>
            <h2>Bring the whole crew</h2>
            <p>Wedding party, birthday, a corporate crew, or just the boys getting fresh before a big night — we&apos;ll block out chairs, line up the barbers, and keep the drinks flowing. Four or more heads and we&apos;ll build the whole session around you.</p>
            <div className="perks">
              {perks.map((g) => (
                <div className="perk" key={g.id}>
                  <div className="perk-check">✓</div>
                  <div><span className="perk-title">{g.title}</span><span className="perk-desc"> — {g.description}</span></div>
                </div>
              ))}
            </div>
            <Link href="/book" className="btn btn-red group-cta" style={{ display: 'inline-block', marginTop: 28 }}>Enquire About a Group</Link>
          </div>
          <div className="packages">
            {packages.map((p) => (
              <div className="package" key={p.id}>
                <div className="package-icon">{p.icon}</div>
                <div className="package-name">{p.name}</div>
                <div className="package-desc">{p.description}</div>
                <div className="package-tag">{p.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <h2>Ready for a fresh cut?</h2>
        <p>Book in 60 seconds. Get a text reminder before your slot.</p>
        <Link href="/book" className="btn">Book Now</Link>
      </section>
    </main>
  );
}
