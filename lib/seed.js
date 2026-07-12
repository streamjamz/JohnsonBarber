/* ============================================================
   Default content for Johnson's Barbers.
   Used to (a) seed the database (see supabase/schema.sql) and
   (b) render the site as a fallback before Supabase is connected.
   Once the DB has rows, that data takes over — edit via /admin.
   ============================================================ */

export const SEED = {
  services: [
    { id: 'sig',   name: 'Signature Cut',        price: 35, duration: '45 min', description: 'Scissor + clipper, washed, styled, and lined up clean.', sort_order: 1, active: true },
    { id: 'fade',  name: 'Skin Fade',            price: 40, duration: '50 min', description: 'Bald to blend, razor-sharp on the sides, however you like it up top.', sort_order: 2, active: true },
    { id: 'beard', name: 'Beard Trim & Line-up', price: 20, duration: '20 min', description: 'Shaped, edged, and oiled. Straight-razor detail on the lines.', sort_order: 3, active: true },
    { id: 'shave', name: 'Hot Towel Shave',      price: 35, duration: '30 min', description: 'The full ritual — hot towels, straight razor, cool finish.', sort_order: 4, active: true },
    { id: 'combo', name: 'Cut + Beard Combo',    price: 50, duration: '60 min', description: 'The works. Fresh cut and a shaped beard in one sitting.', sort_order: 5, active: true },
    { id: 'kids',  name: 'Kids Cut (under 12)',  price: 25, duration: '30 min', description: 'Patient hands and a chair that goes up. First cuts welcome.', sort_order: 6, active: true },
  ],
  addons: [
    { id: 'oil',   name: 'Beard Oil Treatment',     price: 8,  description: 'Conditioning oil worked in and massaged.', sort_order: 1, active: true },
    { id: 'towel', name: 'Hot Towel Finish',        price: 10, description: 'Steamed towel to open up and relax before the finish.', sort_order: 2, active: true },
    { id: 'prod',  name: 'Premium Styling Product', price: 12, description: 'Take-home clay or pomade, matched to your hair.', sort_order: 3, active: true },
    { id: 'grey',  name: 'Grey Blending',           price: 15, description: 'Subtle color to knock back the grey. Nobody will know.', sort_order: 4, active: true },
  ],
  barbers: [
    { id: 'johnson', name: 'Mr. Johnson', first_name: 'Mr. J',  role: 'Owner · Master Barber', specialty: 'Classic cuts & straight-razor shaves', initial: 'J', photo_url: null, email: null, phone: null, active: true, sort_order: 1 },
    { id: 'miguel',  name: 'Miguel',      first_name: 'Miguel', role: 'Senior Barber',         specialty: 'Fades, tapers & modern styles',       initial: 'M', photo_url: null, email: null, phone: null, active: true, sort_order: 2 },
    { id: 'subby',   name: 'Subby',       first_name: 'Subby',  role: 'Barber',                specialty: 'Beard sculpting, designs & line work', initial: 'S', photo_url: null, email: null, phone: null, active: true, sort_order: 3 },
  ],
  hours: [
    { id: 1, day: 'Mon – Fri', time: '9am – 7pm', closed: false, sort_order: 1 },
    { id: 2, day: 'Saturday',  time: '8am – 5pm', closed: false, sort_order: 2 },
    { id: 3, day: 'Sunday',    time: 'Closed',    closed: true,  sort_order: 3 },
  ],
  reviews: [
    { id: 1, text: 'Best fade in the city, hands down. Miguel remembers exactly how I like it every single time.', name: 'Darnell W.', initial: 'D', when_text: '2 weeks ago', sort_order: 1 },
    { id: 2, text: "Took my son for his first cut. Subby was so patient with him. We're both regulars now.",        name: 'Priya K.',   initial: 'P', when_text: '1 month ago', sort_order: 2 },
    { id: 3, text: 'The hot towel shave is worth every penny. Mr. Johnson is a proper old-school craftsman.',       name: 'Tom R.',     initial: 'T', when_text: '3 weeks ago', sort_order: 3 },
  ],
  faqs: [
    { id: 1, question: 'Do I need an appointment, or can I walk in?', answer: 'Both work. Walk-ins are welcome whenever a chair is free, but booking online guarantees your barber and time — especially on weekends.', sort_order: 1 },
    { id: 2, question: 'Can I ask for a specific barber?',            answer: 'Absolutely. Pick Mr. Johnson, Miguel, or Subby right in the booking flow. Choosing "any barber" just gets you the first one free.', sort_order: 2 },
    { id: 3, question: 'How long does a cut take?',                   answer: 'Every service lists its time on the Menu — from a 20-minute beard line-up to the full 60-minute cut-and-beard combo. We hold your chair for that whole window.', sort_order: 3 },
    { id: 4, question: "What if I'm not happy with my cut?",          answer: "Tell us before you leave the chair and we'll fix it on the spot. Notice something within 3 days? Come back and we'll tidy it up free.", sort_order: 4 },
    { id: 5, question: "Do you cut kids' hair?",                      answer: 'Yes — kids under 12 have their own rate, and first cuts are a specialty. Patient hands and a chair that goes up.', sort_order: 5 },
    { id: 6, question: 'Will I get a reminder before my appointment?',answer: "Yes. You'll get a confirmation text as soon as you book and a reminder 24 hours before, so a slot never slips your mind.", sort_order: 6 },
    { id: 7, question: 'What payment do you accept?',                 answer: 'Cash and all major cards in shop. You can also pay a deposit or the full amount online when you book.', sort_order: 7 },
  ],
  policies: [
    { id: 1, icon: '⏰',  title: 'Late Arrivals',      body: "A chair's held for you, not the whole afternoon. Arrive more than 10 minutes late and we may need to shorten the service or rebook you so the next client isn't held up.", sort_order: 1 },
    { id: 2, icon: '🗓️', title: 'Cancellations',      body: "Life happens — just give us 24 hours' notice to cancel or reschedule free of charge. Inside 24 hours, any deposit is kept to cover the empty chair.", sort_order: 2 },
    { id: 3, icon: '👤',  title: 'No-Shows',           body: 'Miss an appointment without telling us and the deposit is forfeited. Two no-shows and future bookings will require full pre-payment.', sort_order: 3 },
    { id: 4, icon: '💳',  title: 'Deposits & Payment', body: 'Optional deposits go straight toward your final bill. We take cash and all major cards in shop. Refunds on deposits follow the cancellation window above.', sort_order: 4 },
  ],
  gallery: [
    { id: 1, image_url: null, span: 'span-2col span-2row', hint: 'Feature cut', sort_order: 1 },
    { id: 2, image_url: null, span: '',                    hint: 'Cut photo',   sort_order: 2 },
    { id: 3, image_url: null, span: '',                    hint: 'Cut photo',   sort_order: 3 },
    { id: 4, image_url: null, span: 'span-2col',           hint: 'Cut photo',   sort_order: 4 },
    { id: 5, image_url: null, span: '',                    hint: 'Cut photo',   sort_order: 5 },
    { id: 6, image_url: null, span: 'span-2row',           hint: 'Cut photo',   sort_order: 6 },
    { id: 7, image_url: null, span: '',                    hint: 'Cut photo',   sort_order: 7 },
    { id: 8, image_url: null, span: '',                    hint: 'Cut photo',   sort_order: 8 },
  ],
  // Editable free-text content, keyed. (hero, story, stats, group section, etc.)
  content: {
    hero_pill: 'Est. 2011 · Walk-ins & Appointments',
    hero_title_1: 'Sharp cuts.',
    hero_title_2: 'Straight talk.',
    hero_sub: 'Precision fades, classic scissor work, and hot-towel shaves in the heart of the neighborhood. No fuss. Just a clean cut and a good chair to sit in.',
    story_title: 'A chair, a mirror, and 15 years of steady hands.',
    story_p1: "Johnson's started as a single chair Mr. Johnson set up after 20 years cutting hair across the city. Today it's three barbers who take the craft seriously — and take their time. We learn your head, remember your cut, and get you back out the door looking sharp.",
    story_p2: "Every seat books online, every barber's got their own style, and there's always a fresh pot of coffee going.",
    shop_address: '218 Halstead Ave',
    shop_phone: '(555) 019-4477',
    shop_instagram: '@johnsonsbarbers',
    reviews_rating: '4.9',
    reviews_count: '312',
    // Weekdays the shop is CLOSED (0=Sun … 6=Sat). Comma-separated.
    // Shop is open Mon–Sat, closed Sunday → "0".
    closed_days: '0',
  },
  stats: [
    { id: 1, num: '3',    label: 'Master Barbers', sort_order: 1 },
    { id: 2, num: '15',   label: 'Years Open',     sort_order: 2 },
    { id: 3, num: '4.9★', label: 'Google Rating',  sort_order: 3 },
    { id: 4, num: '60s',  label: 'To Book',        sort_order: 4 },
  ],
  group_perks: [
    { id: 1, title: 'Private time slots', description: "we open early or run late so it's just your group", sort_order: 1 },
    { id: 2, title: 'Multiple barbers',   description: 'up to 3 chairs going at once to move fast', sort_order: 2 },
    { id: 3, title: 'Drinks on us',       description: 'coffee, beers, or something stronger for the occasion', sort_order: 3 },
    { id: 4, title: 'Group rate',         description: '10% off when you book 4 or more cuts together', sort_order: 4 },
  ],
  group_packages: [
    { id: 1, icon: '🤵', name: 'The Wedding',   description: 'Groom + groomsmen fresh and photo-ready on the day.', tag: 'Up to 8 heads', sort_order: 1 },
    { id: 2, icon: '🎉', name: 'Birthday',      description: 'Line up the crew for the celebration with a chair each.', tag: 'From 4 heads', sort_order: 2 },
    { id: 3, icon: '👔', name: 'Corporate',     description: 'Treat the team or clients to a proper barbershop visit.', tag: 'Invoiced', sort_order: 3 },
    { id: 4, icon: '👦', name: 'Father & Sons', description: 'Bring the family through together, one after another.', tag: 'Any age', sort_order: 4 },
  ],
  features: [
    { id: 1, icon: '🔔',  title: 'Automated Reminders',        body: 'Cut no-shows by sending an SMS + email the moment someone books, then a reminder 24h before. Connect a booking tool (Square, Fresha, or Booksy) and switch reminders on — they text automatically.', tip: 'Aim for 1 confirmation + 1 reminder. More than that annoys people.', sort_order: 1 },
    { id: 2, icon: '✂️', title: 'Staff Profiles & Preference', body: 'Each barber gets a photo, specialty, and their own calendar. Clients choose who they want (built into the booking flow here) so regulars always land in the right chair.', tip: 'Let clients pick "any barber" too — it fills gaps in slow hours.', sort_order: 2 },
    { id: 3, icon: '💰',  title: 'Up-selling Add-ons',         body: 'The booking flow already prompts for beard oil, hot-towel finishes, and take-home product before checkout. A single tap adds $8–$15 to the ticket without any hard sell.', tip: 'Keep it to 3–4 add-ons. Too many choices kill the impulse.', sort_order: 3 },
    { id: 4, icon: '💳',  title: 'Deposit / Payment Capture',  body: 'Take a small deposit (or full payment) at booking to protect against late cancels. Enable card payments in your booking tool and set a deposit of $10 or ~30% — applied to the final bill.', tip: 'Pair it with a clear 24h cancellation policy on the confirmation.', sort_order: 4 },
    { id: 5, icon: '⭐',  title: 'Google Reviews Integration', body: 'Text a review link to every client after their cut, then embed the live Google widget on the gallery page so fresh 5-stars appear on their own. Social proof sells the next booking.', tip: 'A widget slot is already marked on the Gallery page — drop the embed in.', sort_order: 5 },
  ],
  checklist: [
    { id: 1, title: 'Claim your booking tool',        description: 'Sign up for a free barbershop booking platform (Square Appointments, Fresha, or Booksy). Add your three barbers and their hours. This runs the calendar behind the site.', sort_order: 1 },
    { id: 2, title: 'Load your menu & prices',        description: 'Enter every service and add-on from the Menu page with its price and duration. Set a deposit amount if you want to capture payment up front.', sort_order: 2 },
    { id: 3, title: 'Add photos & connect Instagram', description: 'Drop real cut photos into the Gallery tiles and link @johnsonsbarbers so the feed fills itself. First impressions live here.', sort_order: 3 },
    { id: 4, title: 'Turn on reminders & reviews',    description: 'Switch on SMS/email confirmations + 24h reminders, and paste your Google Reviews embed into the widget slot on the Gallery page.', sort_order: 4 },
    { id: 5, title: 'Publish & share the link',       description: 'Point your domain at the site, then put the booking link everywhere — Instagram bio, Google Business profile, and a QR code taped by the register.', sort_order: 5 },
  ],
  times: ['9:00', '9:45', '10:30', '11:15', '1:00', '1:45', '3:00', '4:30'],
};
