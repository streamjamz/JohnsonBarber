/* ============================================================
   Johnson's Barbers — front-end logic (vanilla JS, no build step)

   This drives the single-page marketing site + a simulated booking
   flow. The booking flow is a front-end demo: selections are held in
   memory and the "confirmation" screen is local only.

   >>> TO GO LIVE with real scheduling/payments/reminders, replace the
   demo confirm step (see `confirmBooking()` below) with a call to your
   booking provider (Square Appointments / Fresha / Booksy) or your own
   backend. See the Owner Kit page and README.md for the checklist.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- DATA ---------------- */
  const SERVICES = [
    { id: 'sig',   name: 'Signature Cut',        price: '$35', p: 35, dur: '45 min', desc: 'Scissor + clipper, washed, styled, and lined up clean.' },
    { id: 'fade',  name: 'Skin Fade',            price: '$40', p: 40, dur: '50 min', desc: 'Bald to blend, razor-sharp on the sides, however you like it up top.' },
    { id: 'beard', name: 'Beard Trim & Line-up', price: '$20', p: 20, dur: '20 min', desc: 'Shaped, edged, and oiled. Straight-razor detail on the lines.' },
    { id: 'shave', name: 'Hot Towel Shave',      price: '$35', p: 35, dur: '30 min', desc: 'The full ritual — hot towels, straight razor, cool finish.' },
    { id: 'combo', name: 'Cut + Beard Combo',    price: '$50', p: 50, dur: '60 min', desc: 'The works. Fresh cut and a shaped beard in one sitting.' },
    { id: 'kids',  name: 'Kids Cut (under 12)',  price: '$25', p: 25, dur: '30 min', desc: 'Patient hands and a chair that goes up. First cuts welcome.' },
  ];
  const ADDONS = [
    { id: 'oil',  name: 'Beard Oil Treatment',     price: '+$8',  p: 8,  desc: 'Conditioning oil worked in and massaged.' },
    { id: 'towel',name: 'Hot Towel Finish',        price: '+$10', p: 10, desc: 'Steamed towel to open up and relax before the finish.' },
    { id: 'prod', name: 'Premium Styling Product', price: '+$12', p: 12, desc: 'Take-home clay or pomade, matched to your hair.' },
    { id: 'grey', name: 'Grey Blending',           price: '+$15', p: 15, desc: 'Subtle color to knock back the grey. Nobody will know.' },
  ];
  const BARBERS = [
    { id: 'johnson', name: 'Mr. Johnson', first: 'Mr. J',  role: 'Owner · Master Barber', specialty: 'Classic cuts & straight-razor shaves', initial: 'J' },
    { id: 'miguel',  name: 'Miguel',      first: 'Miguel', role: 'Senior Barber',         specialty: 'Fades, tapers & modern styles',       initial: 'M' },
    { id: 'subby',   name: 'Subby',       first: 'Subby',  role: 'Barber',                specialty: 'Beard sculpting, designs & line work', initial: 'S' },
  ];
  const STEP_META = [
    { label: 'Barber',  title: "Who's cutting today?", sub: 'Pick your barber — or the first one free.' },
    { label: 'Service', title: 'What are we doing?',   sub: 'Choose your cut. You can add extras next.' },
    { label: 'Add-ons', title: 'Anything extra?',      sub: 'Optional — skip it if you just want the cut.' },
    { label: 'Date',    title: 'When suits you?',       sub: "Pick a day and a time that's open." },
    { label: 'Pay',     title: 'Lock it in',           sub: "Choose how to pay and we'll hold your chair." },
  ];
  const TIMES = ['9:00', '9:45', '10:30', '11:15', '1:00', '1:45', '3:00', '4:30'];
  const STATS = [
    { num: '3',    label: 'Master Barbers' },
    { num: '15',   label: 'Years Open' },
    { num: '4.9★', label: 'Google Rating' },
    { num: '60s',  label: 'To Book' },
  ];
  const HOURS = [
    { day: 'Mon',       time: 'Closed',     closed: true },
    { day: 'Tue – Fri', time: '9am – 7pm' },
    { day: 'Saturday',  time: '8am – 5pm' },
    { day: 'Sunday',    time: '10am – 3pm' },
  ];
  const GROUP_PERKS = [
    { title: 'Private time slots', desc: "we open early or run late so it's just your group" },
    { title: 'Multiple barbers',   desc: 'up to 3 chairs going at once to move fast' },
    { title: 'Drinks on us',       desc: 'coffee, beers, or something stronger for the occasion' },
    { title: 'Group rate',         desc: '10% off when you book 4 or more cuts together' },
  ];
  const GROUP_PACKAGES = [
    { icon: '🤵', name: 'The Wedding',    desc: 'Groom + groomsmen fresh and photo-ready on the day.', tag: 'Up to 8 heads' },
    { icon: '🎉', name: 'Birthday',       desc: 'Line up the crew for the celebration with a chair each.', tag: 'From 4 heads' },
    { icon: '👔', name: 'Corporate',      desc: 'Treat the team or clients to a proper barbershop visit.', tag: 'Invoiced' },
    { icon: '👦', name: 'Father & Sons',  desc: 'Bring the family through together, one after another.', tag: 'Any age' },
  ];
  const REVIEWS = [
    { text: 'Best fade in the city, hands down. Miguel remembers exactly how I like it every single time.', name: 'Darnell W.', initial: 'D', when: '2 weeks ago' },
    { text: "Took my son for his first cut. Subby was so patient with him. We're both regulars now.",        name: 'Priya K.',   initial: 'P', when: '1 month ago' },
    { text: 'The hot towel shave is worth every penny. Mr. Johnson is a proper old-school craftsman.',       name: 'Tom R.',     initial: 'T', when: '3 weeks ago' },
  ];
  const POLICIES = [
    { icon: '⏰',  title: 'Late Arrivals',       body: "A chair's held for you, not the whole afternoon. Arrive more than 10 minutes late and we may need to shorten the service or rebook you so the next client isn't held up." },
    { icon: '🗓️', title: 'Cancellations',       body: "Life happens — just give us 24 hours' notice to cancel or reschedule free of charge. Inside 24 hours, any deposit is kept to cover the empty chair." },
    { icon: '👤',  title: 'No-Shows',            body: 'Miss an appointment without telling us and the deposit is forfeited. Two no-shows and future bookings will require full pre-payment.' },
    { icon: '💳',  title: 'Deposits & Payment',  body: 'Optional deposits go straight toward your final bill. We take cash and all major cards in shop. Refunds on deposits follow the cancellation window above.' },
  ];
  const FAQS = [
    { q: 'Do I need an appointment, or can I walk in?', a: 'Both work. Walk-ins are welcome whenever a chair is free, but booking online guarantees your barber and time — especially on weekends.' },
    { q: 'Can I ask for a specific barber?',            a: 'Absolutely. Pick Mr. Johnson, Miguel, or Subby right in the booking flow. Choosing "any barber" just gets you the first one free.' },
    { q: 'How long does a cut take?',                   a: 'Every service lists its time on the Menu — from a 20-minute beard line-up to the full 60-minute cut-and-beard combo. We hold your chair for that whole window.' },
    { q: "What if I'm not happy with my cut?",          a: "Tell us before you leave the chair and we'll fix it on the spot. Notice something within 3 days? Come back and we'll tidy it up free." },
    { q: "Do you cut kids' hair?",                      a: 'Yes — kids under 12 have their own rate, and first cuts are a specialty. Patient hands and a chair that goes up.' },
    { q: 'Will I get a reminder before my appointment?',a: "Yes. You'll get a confirmation text as soon as you book and a reminder 24 hours before, so a slot never slips your mind." },
    { q: 'What payment do you accept?',                 a: 'Cash and all major cards in shop. You can also pay a deposit or the full amount online when you book.' },
  ];
  const FEATURES = [
    { icon: '🔔',  title: 'Automated Reminders',        body: 'Cut no-shows by sending an SMS + email the moment someone books, then a reminder 24h before. Connect a booking tool (Square, Fresha, or Booksy) and switch reminders on — they text automatically.', tip: 'Aim for 1 confirmation + 1 reminder. More than that annoys people.' },
    { icon: '✂️', title: 'Staff Profiles & Preference', body: 'Each barber gets a photo, specialty, and their own calendar. Clients choose who they want (built into the booking flow here) so regulars always land in the right chair.', tip: 'Let clients pick "any barber" too — it fills gaps in slow hours.' },
    { icon: '💰',  title: 'Up-selling Add-ons',         body: 'The booking flow already prompts for beard oil, hot-towel finishes, and take-home product before checkout. A single tap adds $8–$15 to the ticket without any hard sell.', tip: 'Keep it to 3–4 add-ons. Too many choices kill the impulse.' },
    { icon: '💳',  title: 'Deposit / Payment Capture',  body: 'Take a small deposit (or full payment) at booking to protect against late cancels. Enable card payments in your booking tool and set a deposit of $10 or ~30% — applied to the final bill.', tip: 'Pair it with a clear 24h cancellation policy on the confirmation.' },
    { icon: '⭐',  title: 'Google Reviews Integration', body: 'Text a review link to every client after their cut, then embed the live Google widget on the gallery page so fresh 5-stars appear on their own. Social proof sells the next booking.', tip: 'A widget slot is already marked on the Gallery page — drop the embed in.' },
  ];
  const CHECK_ITEMS = [
    { title: 'Claim your booking tool',          desc: 'Sign up for a free barbershop booking platform (Square Appointments, Fresha, or Booksy). Add your three barbers and their hours. This runs the calendar behind the site.' },
    { title: 'Load your menu & prices',          desc: 'Enter every service and add-on from the Menu page with its price and duration. Set a deposit amount if you want to capture payment up front.' },
    { title: 'Add photos & connect Instagram',   desc: 'Drop real cut photos into the Gallery tiles and link @johnsonsbarbers so the feed fills itself. First impressions live here.' },
    { title: 'Turn on reminders & reviews',      desc: 'Switch on SMS/email confirmations + 24h reminders, and paste your Google Reviews embed into the widget slot on the Gallery page.' },
    { title: 'Publish & share the link',         desc: 'Point your domain at the site, then put the booking link everywhere — Instagram bio, Google Business profile, and a QR code taped by the register.' },
  ];
  const GALLERY_SPANS = ['span-2col span-2row', '', '', 'span-2col', '', 'span-2row', '', ''];

  /* ---------------- STATE ---------------- */
  const state = {
    page: 'home',
    step: 0,
    barber: null,
    service: null,
    addons: [],
    day: null,
    time: null,
    pay: null,
    done: [false, false, false, false, false],
    openFaq: 0,
    theme: (function () {
      try { return localStorage.getItem('jb-theme') || 'dark'; } catch (e) { return 'dark'; }
    })(),
  };

  /* ---------------- HELPERS ---------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (n) => '$' + n;

  const serviceObj = () => SERVICES.find((s) => s.id === state.service) || null;
  const barberObj = () => BARBERS.find((b) => b.id === state.barber) || null;
  const addonObjs = () => ADDONS.filter((a) => state.addons.includes(a.id));
  const total = () => {
    const svc = serviceObj();
    let t = svc ? svc.p : 0;
    addonObjs().forEach((a) => { t += a.p; });
    return t;
  };
  const depositAmt = () => Math.max(10, Math.round(total() * 0.3));

  function days() {
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
  let DAYS = days();

  /* ---------------- THEME ---------------- */
  function applyTheme() {
    $('.app-root').setAttribute('data-theme', state.theme);
    $('#themeToggle').textContent = state.theme === 'dark' ? '☀' : '☾';
  }
  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('jb-theme', state.theme); } catch (e) {}
    applyTheme();
  }

  /* ---------------- ROUTING ---------------- */
  function go(page, opts) {
    opts = opts || {};
    state.page = page;
    if (opts.step != null) state.step = opts.step;
    if (opts.barber !== undefined) state.barber = opts.barber;
    if (opts.service !== undefined) state.service = opts.service;
    render();
    window.scrollTo(0, 0);
  }

  function showPage() {
    document.querySelectorAll('.page-view').forEach((v) => {
      v.classList.toggle('hidden', v.getAttribute('data-page') !== state.page);
    });
    document.querySelectorAll('.nav-link').forEach((n) => {
      n.classList.toggle('active', n.getAttribute('data-nav') === state.page);
    });
  }

  /* ---------------- STATIC RENDERS (once) ---------------- */
  function renderStatic() {
    // stats
    const stats = $('#stats');
    STATS.forEach((s) => {
      const cell = el('div', 'stat');
      cell.appendChild(el('div', 'stat-num', esc(s.num)));
      cell.appendChild(el('div', 'stat-label', esc(s.label)));
      stats.appendChild(cell);
    });

    // hours (insert before the foot line)
    const hours = $('#hours');
    const foot = hours.querySelector('.hours-foot');
    HOURS.forEach((h) => {
      const row = el('div', 'hours-row');
      const color = h.closed ? 'var(--dim)' : 'var(--text)';
      row.innerHTML = '<span class="day" style="color:' + color + '">' + esc(h.day) + '</span>' +
                      '<span class="time" style="color:' + color + '">' + esc(h.time) + '</span>';
      hours.insertBefore(row, foot);
    });

    // crew
    const crew = $('#crewGrid');
    BARBERS.forEach((b) => {
      const card = el('div', 'crew-card');
      card.innerHTML =
        '<div class="crew-photo"><span class="initial">' + esc(b.initial) + '</span></div>' +
        '<div class="crew-body">' +
          '<div class="crew-name">' + esc(b.name) + '</div>' +
          '<div class="crew-role">' + esc(b.role) + '</div>' +
          '<div class="crew-spec">' + esc(b.specialty) + '</div>' +
          '<button class="crew-book">Book with ' + esc(b.first) + '</button>' +
        '</div>';
      card.querySelector('.crew-book').addEventListener('click', () => go('book', { step: 1, barber: b.id }));
      crew.appendChild(card);
    });

    // group perks
    const perks = $('#perks');
    GROUP_PERKS.forEach((g) => {
      const p = el('div', 'perk');
      p.innerHTML = '<div class="perk-check">✓</div><div><span class="perk-title">' + esc(g.title) +
                    '</span><span class="perk-desc"> — ' + esc(g.desc) + '</span></div>';
      perks.appendChild(p);
    });

    // group packages
    const packages = $('#packages');
    GROUP_PACKAGES.forEach((p) => {
      const c = el('div', 'package');
      c.innerHTML =
        '<div class="package-icon">' + p.icon + '</div>' +
        '<div class="package-name">' + esc(p.name) + '</div>' +
        '<div class="package-desc">' + esc(p.desc) + '</div>' +
        '<div class="package-tag">' + esc(p.tag) + '</div>';
      packages.appendChild(c);
    });

    // services page rows
    const rows = $('#serviceRows');
    SERVICES.forEach((s) => {
      const row = el('div', 'svc-row');
      row.innerHTML =
        '<div class="svc-main"><div class="svc-title-line">' +
          '<span class="svc-name">' + esc(s.name) + '</span>' +
          '<span class="svc-dur">' + esc(s.dur) + '</span></div>' +
          '<div class="svc-desc">' + esc(s.desc) + '</div></div>' +
        '<div class="svc-price">' + esc(s.price) + '</div>' +
        '<button class="btn btn-red svc-book">Book</button>';
      row.querySelector('.svc-book').addEventListener('click', () => go('book', { step: 0, service: s.id }));
      rows.appendChild(row);
    });

    // services page add-ons
    const addonCards = $('#addonCards');
    ADDONS.forEach((a) => {
      const c = el('div', 'addon-card');
      c.innerHTML =
        '<div><div class="addon-name">' + esc(a.name) + '</div>' +
        '<div class="addon-desc">' + esc(a.desc) + '</div></div>' +
        '<div class="addon-price">' + esc(a.price) + '</div>';
      addonCards.appendChild(c);
    });

    // gallery
    const gallery = $('#galleryGrid');
    GALLERY_SPANS.forEach((sp, i) => {
      const tile = el('div', ('gallery-tile ' + sp).trim());
      const hint = i === 0 ? 'Feature cut' : 'Cut photo';
      tile.innerHTML = '<div class="slot"><span class="cam">📷</span><span>' + hint + '</span></div>';
      gallery.appendChild(tile);
    });

    // reviews
    const reviews = $('#reviewsGrid');
    REVIEWS.forEach((r) => {
      const c = el('div', 'review-card');
      c.innerHTML =
        '<div class="review-stars">★★★★★</div>' +
        '<p class="review-text">"' + esc(r.text) + '"</p>' +
        '<div class="review-author"><div class="review-avatar">' + esc(r.initial) + '</div>' +
        '<div><div class="review-name">' + esc(r.name) + '</div>' +
        '<div class="review-when">' + esc(r.when) + '</div></div></div>';
      reviews.appendChild(c);
    });

    // policies
    const policies = $('#policiesGrid');
    POLICIES.forEach((p) => {
      const c = el('div', 'policy-card');
      c.innerHTML =
        '<div class="policy-icon">' + p.icon + '</div>' +
        '<div class="policy-title">' + esc(p.title) + '</div>' +
        '<div class="policy-body">' + esc(p.body) + '</div>';
      policies.appendChild(c);
    });

    // features
    const features = $('#featuresGrid');
    FEATURES.forEach((f) => {
      const c = el('div', 'feature-card');
      c.innerHTML =
        '<div class="feature-icon">' + f.icon + '</div>' +
        '<div class="feature-title">' + esc(f.title) + '</div>' +
        '<div class="feature-body">' + esc(f.body) + '</div>' +
        '<div class="feature-tip">' + esc(f.tip) + '</div>';
      features.appendChild(c);
    });
  }

  /* ---------------- FAQ (re-render on toggle) ---------------- */
  function renderFaq() {
    const list = $('#faqList');
    list.innerHTML = '';
    FAQS.forEach((f, i) => {
      const open = state.openFaq === i;
      const item = el('div', 'faq-item' + (open ? ' open' : ''));
      item.innerHTML =
        '<button class="faq-q"><span>' + esc(f.q) + '</span>' +
        '<span class="faq-sign">' + (open ? '−' : '+') + '</span></button>' +
        '<div class="faq-a">' + esc(f.a) + '</div>';
      item.querySelector('.faq-q').addEventListener('click', () => {
        state.openFaq = state.openFaq === i ? null : i;
        renderFaq();
      });
      list.appendChild(item);
    });
  }

  /* ---------------- CHECKLIST (re-render on toggle) ---------------- */
  function renderChecklist() {
    const list = $('#checklist');
    list.innerHTML = '';
    CHECK_ITEMS.forEach((c, i) => {
      const done = state.done[i];
      const row = el('div', 'check-row' + (done ? ' done' : ''));
      row.innerHTML =
        '<div class="check-box">' + (done ? '✓' : '') + '</div>' +
        '<div class="check-num">' + (i + 1) + '</div>' +
        '<div class="check-body"><div class="check-title">' + esc(c.title) + '</div>' +
        '<div class="check-desc">' + esc(c.desc) + '</div></div>';
      row.addEventListener('click', () => { state.done[i] = !state.done[i]; renderChecklist(); });
      list.appendChild(row);
    });
  }

  /* ---------------- BOOKING FLOW ---------------- */
  function canNext() {
    const s = state;
    if (s.step === 0 && !s.barber) return false;
    if (s.step === 1 && !s.service) return false;
    if (s.step === 3 && (!s.day || !s.time)) return false;
    if (s.step === 4 && !s.pay) return false;
    return true;
  }
  function nextStep() {
    if (!canNext()) return;
    if (state.step === 4) { confirmBooking(); return; }
    state.step = Math.min(5, state.step + 1);
    renderBooking();
    window.scrollTo(0, 0);
  }
  function prevStep() {
    state.step = Math.max(0, state.step - 1);
    renderBooking();
    window.scrollTo(0, 0);
  }
  function resetBooking() {
    Object.assign(state, { step: 0, barber: null, service: null, addons: [], day: null, time: null, pay: null });
    renderBooking();
    window.scrollTo(0, 0);
  }

  // >>> INTEGRATION POINT <<<
  // In the demo this just advances to the local confirmation screen.
  // For production, POST the booking to your provider/backend here, and
  // only advance to step 5 once it succeeds. e.g.
  //   await createAppointment({ barber, service, addons, day, time, pay });
  function confirmBooking() {
    state.step = 5;
    renderBooking();
    window.scrollTo(0, 0);
  }

  function summaryLines() {
    const lines = [];
    const barb = barberObj();
    const svc = serviceObj();
    const list = addonObjs();
    const dayObj = DAYS.find((d) => d.id === state.day);
    if (barb) lines.push({ label: 'Barber', value: barb.name });
    if (svc) lines.push({ label: 'Service', value: svc.name });
    if (list.length) lines.push({ label: 'Add-ons', value: list.map((a) => a.name).join(', ') });
    if (dayObj && state.time) lines.push({ label: 'When', value: dayObj.dow + ' ' + dayObj.mon + ' ' + dayObj.date + ', ' + state.time });
    return lines;
  }

  function renderBooking() {
    const root = $('#bookRoot');
    root.innerHTML = '';
    const s = state;

    // progress + title (hidden on confirmation)
    if (s.step < 5) {
      const prog = el('div', 'progress');
      STEP_META.forEach((m, i) => {
        const active = i === s.step, done = i < s.step;
        const step = el('div', 'progress-step');
        const dotCls = 'dot' + (active ? ' active' : done ? ' done' : '');
        const lblCls = 'step-label' + (active ? ' active' : '');
        const lineCls = 'progress-line' + (done ? ' done' : '') + (i === STEP_META.length - 1 ? ' last' : '');
        step.innerHTML =
          '<div class="inner"><div class="' + dotCls + '">' + (done ? '✓' : (i + 1)) + '</div>' +
          '<span class="' + lblCls + '">' + esc(m.label) + '</span></div>' +
          '<div class="' + lineCls + '"></div>';
        prog.appendChild(step);
      });
      root.appendChild(prog);
      const meta = STEP_META[s.step] || {};
      root.appendChild(el('h1', null, esc(meta.title || '')));
      root.appendChild(el('p', 'book-sub', esc(meta.sub || '')));
    }

    if (s.step === 0) root.appendChild(renderBarberStep());
    else if (s.step === 1) root.appendChild(renderServiceStep());
    else if (s.step === 2) root.appendChild(renderExtrasStep());
    else if (s.step === 3) root.appendChild(renderWhenStep());
    else if (s.step === 4) root.appendChild(renderPayStep());
    else if (s.step === 5) root.appendChild(renderConfirmStep());

    // nav buttons
    if (s.step < 5) {
      const nav = el('div', 'book-nav');
      const back = el('button', 'back-btn' + (s.step === 0 ? ' hidden-slot' : ''), '← Back');
      back.addEventListener('click', prevStep);
      const next = el('button', 'next-btn', s.step === 4 ? 'Confirm Booking' : 'Continue →');
      next.disabled = !canNext();
      next.addEventListener('click', nextStep);
      nav.appendChild(back);
      nav.appendChild(next);
      root.appendChild(nav);
    }
  }

  function renderBarberStep() {
    const grid = el('div', 'barber-grid');
    BARBERS.forEach((b) => {
      const sel = state.barber === b.id;
      const card = el('div', 'select-card' + (sel ? ' selected' : ''));
      card.innerHTML =
        '<div class="barber-avatar">' + esc(b.initial) + '</div>' +
        '<div class="barber-name">' + esc(b.name) + '</div>' +
        '<div class="barber-spec">' + esc(b.specialty) + '</div>' +
        (sel ? '<div class="barber-check">✓ Selected</div>' : '');
      card.addEventListener('click', () => { state.barber = b.id; renderBooking(); });
      grid.appendChild(card);
    });
    return grid;
  }

  function renderServiceStep() {
    const list = el('div', 'service-list');
    SERVICES.forEach((s) => {
      const sel = state.service === s.id;
      const row = el('div', 'service-row' + (sel ? ' selected' : ''));
      row.innerHTML =
        '<div class="svc-main"><div class="svc-title-line">' +
          '<span class="svc-name">' + esc(s.name) + '</span>' +
          '<span class="svc-dur" style="color:var(--muted)">' + esc(s.dur) + '</span></div>' +
          '<div class="svc-desc">' + esc(s.desc) + '</div></div>' +
        '<div class="price">' + esc(s.price) + '</div>';
      row.addEventListener('click', () => { state.service = s.id; renderBooking(); });
      list.appendChild(row);
    });
    return list;
  }

  function renderExtrasStep() {
    const wrap = el('div');
    wrap.innerHTML =
      '<div class="extras-intro"><div class="label">Treat yourself</div>' +
      '<div class="sub">Tap to add. These make the chair feel like a proper barbershop.</div></div>';
    const grid = el('div', 'extras-grid');
    ADDONS.forEach((a) => {
      const on = state.addons.includes(a.id);
      const card = el('div', 'extra-card' + (on ? ' selected' : ''));
      card.innerHTML =
        '<div class="extra-main"><div class="addon-name">' + esc(a.name) + '</div>' +
        '<div class="addon-desc">' + esc(a.desc) + '</div></div>' +
        '<div class="extra-right"><div class="extra-price">' + esc(a.price) + '</div>' +
        '<div class="pill' + (on ? ' on' : '') + '">' + (on ? 'Added ✓' : '+ Add') + '</div></div>';
      card.addEventListener('click', () => {
        state.addons = on ? state.addons.filter((x) => x !== a.id) : state.addons.concat(a.id);
        renderBooking();
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderWhenStep() {
    const wrap = el('div');
    wrap.appendChild(el('div', 'when-label', 'Pick a day'));
    const dayGrid = el('div', 'day-grid');
    DAYS.forEach((d) => {
      const sel = state.day === d.id;
      const cell = el('div', 'day-cell' + (sel ? ' selected' : ''));
      cell.innerHTML =
        '<div class="day-dow">' + esc(d.dow) + '</div>' +
        '<div class="day-date">' + esc(d.date) + '</div>' +
        '<div class="day-mon">' + esc(d.mon) + '</div>';
      cell.addEventListener('click', () => { state.day = d.id; renderBooking(); });
      dayGrid.appendChild(cell);
    });
    wrap.appendChild(dayGrid);
    wrap.appendChild(el('div', 'when-label second', 'Pick a time'));
    const timeGrid = el('div', 'time-grid');
    TIMES.forEach((t) => {
      const sel = state.time === t;
      const cell = el('div', 'time-cell' + (sel ? ' selected' : ''), esc(t));
      cell.addEventListener('click', () => { state.time = t; renderBooking(); });
      timeGrid.appendChild(cell);
    });
    wrap.appendChild(timeGrid);
    return wrap;
  }

  function renderPayStep() {
    const dep = depositAmt(), tot = total();
    const payDef = [
      { id: 'deposit', title: 'Pay a deposit now', desc: 'Hold your chair. Rest paid in shop.', amount: fmt(dep) },
      { id: 'full',    title: 'Pay in full now',   desc: 'Skip the card at the counter.',      amount: fmt(tot) },
      { id: 'shop',    title: 'Pay in shop',       desc: "Cash or card when you're done.",     amount: '$0' },
    ];
    const grid = el('div', 'pay-grid');

    const left = el('div');
    left.appendChild(el('div', 'when-label', 'How do you want to pay?'));
    const list = el('div', 'pay-list');
    payDef.forEach((p) => {
      const on = state.pay === p.id;
      const opt = el('div', 'pay-option' + (on ? ' selected' : ''));
      opt.innerHTML =
        '<div class="radio"><div class="fill"></div></div>' +
        '<div class="pay-main"><div class="pay-title">' + esc(p.title) + '</div>' +
        '<div class="pay-desc">' + esc(p.desc) + '</div></div>' +
        '<div class="pay-amount">' + esc(p.amount) + '</div>';
      opt.addEventListener('click', () => { state.pay = p.id; renderBooking(); });
      list.appendChild(opt);
    });
    left.appendChild(list);
    const reminder = el('div', 'reminder');
    reminder.innerHTML = '<div class="bell">🔔</div><div class="txt">We\'ll text you a confirmation now and a reminder <b>24 hours before</b> your slot — so you never miss a cut.</div>';
    left.appendChild(reminder);
    grid.appendChild(left);

    // summary
    let dueNote = "Nothing due now — pay when you're done.";
    if (state.pay === 'deposit') dueNote = fmt(dep) + ' now, ' + fmt(tot - dep) + ' in shop.';
    else if (state.pay === 'full') dueNote = 'Paid in full — just show up.';
    grid.appendChild(buildSummaryCard(dueNote));
    return grid;
  }

  function buildSummaryCard(dueNote) {
    const card = el('div', 'summary');
    card.appendChild(el('div', 'summary-head', 'Your Booking'));
    const body = el('div', 'summary-body');
    summaryLines().forEach((l) => {
      body.innerHTML += '<div class="summary-line"><span class="label">' + esc(l.label) +
                        '</span><span class="value">' + esc(l.value) + '</span></div>';
    });
    body.innerHTML += '<div class="summary-total"><span class="label">Total</span>' +
                      '<span class="amount">' + fmt(total()) + '</span></div>' +
                      '<div class="due-note">' + esc(dueNote) + '</div>';
    card.appendChild(body);
    return card;
  }

  function renderConfirmStep() {
    const wrap = el('div');
    const dep = depositAmt(), tot = total();
    let paidLabel = 'Pay in shop', paidAmount = '$0';
    if (state.pay === 'deposit') { paidLabel = 'Deposit paid'; paidAmount = fmt(dep); }
    else if (state.pay === 'full') { paidLabel = 'Paid in full'; paidAmount = fmt(tot); }

    const head = el('div', 'confirm');
    head.innerHTML =
      '<div class="confirm-check">✓</div>' +
      '<h1>You\'re booked in</h1>' +
      '<p>A confirmation text is on its way to your phone. See you in the chair, champ.</p>';
    wrap.appendChild(head);

    const card = el('div', 'confirm-card');
    const lines = el('div', 'lines');
    summaryLines().forEach((l) => {
      lines.innerHTML += '<div class="summary-line"><span class="label">' + esc(l.label) +
                         '</span><span class="value">' + esc(l.value) + '</span></div>';
    });
    card.appendChild(lines);
    const paid = el('div', 'confirm-paid');
    paid.innerHTML = '<span class="label">' + esc(paidLabel) + '</span><span class="amount">' + esc(paidAmount) + '</span>';
    card.appendChild(paid);
    wrap.appendChild(card);

    const again = el('div', 'confirm-again');
    const btn = el('button', 'btn', 'Book Another');
    btn.addEventListener('click', resetBooking);
    again.appendChild(btn);
    wrap.appendChild(again);
    return wrap;
  }

  /* ---------------- MASTER RENDER ---------------- */
  function render() {
    applyTheme();
    showPage();
    if (state.page === 'book') { DAYS = days(); renderBooking(); }
    if (state.page === 'faq') renderFaq();
    if (state.page === 'kit') renderChecklist();
  }

  /* ---------------- INIT ---------------- */
  function init() {
    renderStatic();
    // nav wiring
    document.querySelectorAll('[data-nav]').forEach((n) => {
      n.addEventListener('click', () => go(n.getAttribute('data-nav')));
    });
    $('#themeToggle').addEventListener('click', toggleTheme);
    $('#printKit').addEventListener('click', () => window.print());
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
