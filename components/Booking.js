'use client';

import { useEffect, useMemo, useState } from 'react';

const STEP_META = [
  { label: 'Barber',  title: "Who's cutting today?", sub: 'Pick your barber — or the first one free.' },
  { label: 'Service', title: 'What are we doing?',   sub: 'Choose your cut. You can add extras next.' },
  { label: 'Add-ons', title: 'Anything extra?',      sub: 'Optional — skip it if you just want the cut.' },
  { label: 'Date',    title: 'When suits you?',       sub: 'Pick a day and a time that’s open.' },
  { label: 'Pay',     title: 'Lock it in',           sub: 'Your details and how you’d like to pay.' },
];
const TIMES = ['9:00', '9:45', '10:30', '11:15', '1:00', '1:45', '3:00', '4:30'];

function computeDays() {
  const out = [];
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let d = new Date();
  while (out.length < 6) {
    d = new Date(d.getTime() + 86400000);
    if (d.getDay() === 1) continue; // Mon closed
    out.push({ id: d.toISOString().slice(0, 10), dow: dow[d.getDay()], date: String(d.getDate()), mon: mon[d.getMonth()] });
  }
  return out;
}

export default function Booking({ barbers, services, addons, initialBarber, initialService, initialStep }) {
  const [step, setStep] = useState(initialStep || 0);
  const [barber, setBarber] = useState(initialBarber || null);
  const [service, setService] = useState(initialService || null);
  const [addonIds, setAddonIds] = useState([]);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [pay, setPay] = useState(null);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [days, setDays] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setDays(computeDays()); }, []);

  const serviceObj = useMemo(() => services.find((s) => s.id === service) || null, [services, service]);
  const barberObj = useMemo(() => barbers.find((b) => b.id === barber) || null, [barbers, barber]);
  const addonObjs = useMemo(() => addons.filter((a) => addonIds.includes(a.id)), [addons, addonIds]);
  const total = useMemo(() => (serviceObj ? serviceObj.price : 0) + addonObjs.reduce((t, a) => t + a.price, 0), [serviceObj, addonObjs]);
  const deposit = Math.max(10, Math.round(total * 0.3));
  const dayObj = days.find((d) => d.id === day);

  const contactOk = customer.name.trim() && /.+@.+\..+/.test(customer.email);

  function canNext() {
    if (step === 0 && !barber) return false;
    if (step === 1 && !service) return false;
    if (step === 3 && (!day || !time)) return false;
    if (step === 4 && (!pay || !contactOk)) return false;
    return true;
  }

  async function next() {
    if (!canNext()) return;
    if (step === 4) return confirm();
    setStep((s) => Math.min(5, s + 1));
    window.scrollTo(0, 0);
  }
  function back() { setStep((s) => Math.max(0, s - 1)); window.scrollTo(0, 0); }
  function reset() {
    setStep(0); setBarber(null); setService(null); setAddonIds([]);
    setDay(null); setTime(null); setPay(null); setCustomer({ name: '', phone: '', email: '' });
    setError(null); window.scrollTo(0, 0);
  }

  const amountPaid = pay === 'deposit' ? deposit : pay === 'full' ? total : 0;

  async function confirm() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barberId: barber,
          serviceId: service,
          addonIds,
          day,
          time,
          payType: pay,
          amount: total,
          amountPaid,
          customer,
          when: dayObj ? `${dayObj.dow} ${dayObj.mon} ${dayObj.date}, ${time}` : `${day}, ${time}`,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
      setStep(5);
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const summaryLines = [];
  if (barberObj) summaryLines.push(['Barber', barberObj.name]);
  if (serviceObj) summaryLines.push(['Service', serviceObj.name]);
  if (addonObjs.length) summaryLines.push(['Add-ons', addonObjs.map((a) => a.name).join(', ')]);
  if (dayObj && time) summaryLines.push(['When', `${dayObj.dow} ${dayObj.mon} ${dayObj.date}, ${time}`]);

  return (
    <>
      {step < 5 && (
        <>
          <div className="progress">
            {STEP_META.map((m, i) => {
              const active = i === step, done = i < step;
              return (
                <div className="progress-step" key={m.label}>
                  <div className="inner">
                    <div className={'dot' + (active ? ' active' : done ? ' done' : '')}>{done ? '✓' : i + 1}</div>
                    <span className={'step-label' + (active ? ' active' : '')}>{m.label}</span>
                  </div>
                  <div className={'progress-line' + (done ? ' done' : '') + (i === STEP_META.length - 1 ? ' last' : '')} />
                </div>
              );
            })}
          </div>
          <h1>{STEP_META[step].title}</h1>
          <p className="book-sub">{STEP_META[step].sub}</p>
        </>
      )}

      {/* STEP 0 — BARBER */}
      {step === 0 && (
        <div className="barber-grid">
          {barbers.map((b) => {
            const sel = barber === b.id;
            return (
              <div className={'select-card' + (sel ? ' selected' : '')} key={b.id} onClick={() => setBarber(b.id)}>
                <div className="barber-avatar">
                  {b.photo_url
                    ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={b.photo_url} alt={b.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : (b.initial || b.name[0])}
                </div>
                <div className="barber-name">{b.name}</div>
                <div className="barber-spec">{b.specialty}</div>
                {sel && <div className="barber-check">✓ Selected</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 1 — SERVICE */}
      {step === 1 && (
        <div className="service-list">
          {services.map((s) => {
            const sel = service === s.id;
            return (
              <div className={'service-row' + (sel ? ' selected' : '')} key={s.id} onClick={() => setService(s.id)}>
                <div className="svc-main">
                  <div className="svc-title-line">
                    <span className="svc-name">{s.name}</span>
                    <span className="svc-dur" style={{ color: 'var(--muted)' }}>{s.duration}</span>
                  </div>
                  <div className="svc-desc">{s.description}</div>
                </div>
                <div className="price">${s.price}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 2 — ADD-ONS */}
      {step === 2 && (
        <>
          <div className="extras-intro">
            <div className="label">Treat yourself</div>
            <div className="sub">Tap to add. These make the chair feel like a proper barbershop.</div>
          </div>
          <div className="extras-grid">
            {addons.map((a) => {
              const on = addonIds.includes(a.id);
              return (
                <div className={'extra-card' + (on ? ' selected' : '')} key={a.id}
                  onClick={() => setAddonIds((prev) => on ? prev.filter((x) => x !== a.id) : [...prev, a.id])}>
                  <div className="extra-main">
                    <div className="addon-name">{a.name}</div>
                    <div className="addon-desc">{a.description}</div>
                  </div>
                  <div className="extra-right">
                    <div className="extra-price">+${a.price}</div>
                    <div className={'pill' + (on ? ' on' : '')}>{on ? 'Added ✓' : '+ Add'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* STEP 3 — WHEN */}
      {step === 3 && (
        <>
          <div className="when-label">Pick a day</div>
          <div className="day-grid">
            {days.map((d) => (
              <div className={'day-cell' + (day === d.id ? ' selected' : '')} key={d.id} onClick={() => setDay(d.id)}>
                <div className="day-dow">{d.dow}</div>
                <div className="day-date">{d.date}</div>
                <div className="day-mon">{d.mon}</div>
              </div>
            ))}
          </div>
          <div className="when-label second">Pick a time</div>
          <div className="time-grid">
            {TIMES.map((t) => (
              <div className={'time-cell' + (time === t ? ' selected' : '')} key={t} onClick={() => setTime(t)}>{t}</div>
            ))}
          </div>
        </>
      )}

      {/* STEP 4 — PAY + DETAILS */}
      {step === 4 && (
        <div className="pay-grid">
          <div>
            <div className="when-label">Your details</div>
            <div className="field">
              <label>Name</label>
              <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="row2">
              <div className="field">
                <label>Email</label>
                <input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} placeholder="you@email.com" />
              </div>
              <div className="field">
                <label>Phone</label>
                <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="(555) 000-0000" />
              </div>
            </div>

            <div className="when-label" style={{ marginTop: 18 }}>How do you want to pay?</div>
            <div className="pay-list">
              {[
                { id: 'deposit', title: 'Pay a deposit now', desc: 'Hold your chair. Rest paid in shop.', amount: `$${deposit}` },
                { id: 'full', title: 'Pay in full now', desc: 'Skip the card at the counter.', amount: `$${total}` },
                { id: 'shop', title: 'Pay in shop', desc: 'Cash or card when you’re done.', amount: '$0' },
              ].map((p) => {
                const on = pay === p.id;
                return (
                  <div className={'pay-option' + (on ? ' selected' : '')} key={p.id} onClick={() => setPay(p.id)}>
                    <div className="radio"><div className="fill" /></div>
                    <div className="pay-main">
                      <div className="pay-title">{p.title}</div>
                      <div className="pay-desc">{p.desc}</div>
                    </div>
                    <div className="pay-amount">{p.amount}</div>
                  </div>
                );
              })}
            </div>
            <div className="reminder">
              <div className="bell">🔔</div>
              <div className="txt">We&apos;ll email you a confirmation now and a reminder <b>24 hours before</b> your slot — so you never miss a cut.</div>
            </div>
            {error && <div className="msg err" style={{ marginTop: 16 }}>{error}</div>}
          </div>

          <div className="summary">
            <div className="summary-head">Your Booking</div>
            <div className="summary-body">
              {summaryLines.map(([label, value]) => (
                <div className="summary-line" key={label}>
                  <span className="label">{label}</span>
                  <span className="value">{value}</span>
                </div>
              ))}
              <div className="summary-total">
                <span className="label">Total</span>
                <span className="amount">${total}</span>
              </div>
              <div className="due-note">
                {pay === 'deposit' ? `$${deposit} now, $${total - deposit} in shop.`
                  : pay === 'full' ? 'Paid in full — just show up.'
                  : 'Nothing due now — pay when you’re done.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5 — CONFIRMATION */}
      {step === 5 && (
        <>
          <div className="confirm">
            <div className="confirm-check">✓</div>
            <h1>You&apos;re booked in</h1>
            <p>A confirmation email is on its way{customer.name ? `, ${customer.name.split(' ')[0]}` : ''}. See you in the chair.</p>
          </div>
          <div className="confirm-card">
            <div className="lines">
              {summaryLines.map(([label, value]) => (
                <div className="summary-line" key={label}>
                  <span className="label">{label}</span>
                  <span className="value">{value}</span>
                </div>
              ))}
            </div>
            <div className="confirm-paid">
              <span className="label">
                {pay === 'deposit' ? 'Deposit paid' : pay === 'full' ? 'Paid in full' : 'Pay in shop'}
              </span>
              <span className="amount">${amountPaid}</span>
            </div>
          </div>
          <div className="confirm-again">
            <button className="btn" onClick={reset}>Book Another</button>
          </div>
        </>
      )}

      {/* NAV */}
      {step < 5 && (
        <div className="book-nav">
          <button className={'back-btn' + (step === 0 ? ' hidden-slot' : '')} onClick={back}>← Back</button>
          <button className="next-btn" disabled={!canNext() || submitting} onClick={next}>
            {step === 4 ? (submitting ? 'Booking…' : 'Confirm Booking') : 'Continue →'}
          </button>
        </div>
      )}
    </>
  );
}
