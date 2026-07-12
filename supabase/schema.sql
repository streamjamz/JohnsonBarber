-- ============================================================
-- Johnson's Barbers — database schema + seed
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: it drops and recreates the content tables.
-- ============================================================

-- ---------- CONTENT TABLES ----------
drop table if exists services cascade;
drop table if exists addons cascade;
drop table if exists barbers cascade;
drop table if exists hours cascade;
drop table if exists reviews cascade;
drop table if exists faqs cascade;
drop table if exists policies cascade;
drop table if exists gallery cascade;
drop table if exists stats cascade;
drop table if exists group_perks cascade;
drop table if exists group_packages cascade;
drop table if exists features cascade;
drop table if exists checklist cascade;
drop table if exists content cascade;
drop table if exists appointments cascade;

create table services (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  price int not null default 0,
  duration text,
  description text,
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table addons (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  price int not null default 0,
  description text,
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table barbers (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  first_name text,
  role text,
  specialty text,
  initial text,
  photo_url text,
  email text,
  phone text,
  active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table hours (
  id bigint generated always as identity primary key,
  day text not null,
  time text,
  closed boolean default false,
  sort_order int default 0
);

create table reviews (
  id bigint generated always as identity primary key,
  text text not null,
  name text,
  initial text,
  when_text text,
  sort_order int default 0
);

create table faqs (
  id bigint generated always as identity primary key,
  question text not null,
  answer text,
  sort_order int default 0
);

create table policies (
  id bigint generated always as identity primary key,
  icon text,
  title text not null,
  body text,
  sort_order int default 0
);

create table gallery (
  id bigint generated always as identity primary key,
  image_url text,
  span text,
  hint text,
  sort_order int default 0
);

create table stats (
  id bigint generated always as identity primary key,
  num text,
  label text,
  sort_order int default 0
);

create table group_perks (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  sort_order int default 0
);

create table group_packages (
  id bigint generated always as identity primary key,
  icon text,
  name text not null,
  description text,
  tag text,
  sort_order int default 0
);

create table features (
  id bigint generated always as identity primary key,
  icon text,
  title text not null,
  body text,
  tip text,
  sort_order int default 0
);

create table checklist (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  sort_order int default 0
);

create table content (
  key text primary key,
  value text
);

-- ---------- APPOINTMENTS ----------
create table appointments (
  id uuid primary key default gen_random_uuid(),
  barber_id text references barbers(id) on delete set null,
  barber_name text,
  service_id text,
  service_name text,
  addon_names text,
  day date,
  time text,
  customer_name text,
  customer_phone text,
  customer_email text,
  pay_type text,             -- 'deposit' | 'full' | 'shop'
  amount int default 0,      -- full service+addons total
  amount_paid int default 0, -- what they paid online
  status text default 'confirmed',
  reminder_sent boolean default false,
  created_at timestamptz default now()
);
create index appointments_day_idx on appointments (day);

-- ============================================================
-- ROW-LEVEL SECURITY
-- Public site reads content anonymously. All writes + appointment
-- access go through the server (service_role key), which bypasses RLS.
-- ============================================================
alter table services       enable row level security;
alter table addons         enable row level security;
alter table barbers        enable row level security;
alter table hours          enable row level security;
alter table reviews        enable row level security;
alter table faqs           enable row level security;
alter table policies       enable row level security;
alter table gallery        enable row level security;
alter table stats          enable row level security;
alter table group_perks    enable row level security;
alter table group_packages enable row level security;
alter table features       enable row level security;
alter table checklist      enable row level security;
alter table content        enable row level security;
alter table appointments   enable row level security;

-- Public read on content tables
create policy "public read services"       on services       for select using (true);
create policy "public read addons"         on addons         for select using (true);
create policy "public read barbers"        on barbers        for select using (true);
create policy "public read hours"          on hours          for select using (true);
create policy "public read reviews"        on reviews        for select using (true);
create policy "public read faqs"           on faqs           for select using (true);
create policy "public read policies"       on policies       for select using (true);
create policy "public read gallery"        on gallery        for select using (true);
create policy "public read stats"          on stats          for select using (true);
create policy "public read group_perks"    on group_perks    for select using (true);
create policy "public read group_packages" on group_packages for select using (true);
create policy "public read features"       on features       for select using (true);
create policy "public read checklist"      on checklist      for select using (true);
create policy "public read content"        on content        for select using (true);
-- appointments: no public policies → only reachable via service_role.

-- ============================================================
-- SEED DATA
-- ============================================================
insert into services (id, name, price, duration, description, sort_order, active) values
  ('sig',   $$Signature Cut$$,        35, $$45 min$$, $$Scissor + clipper, washed, styled, and lined up clean.$$, 1, true),
  ('fade',  $$Skin Fade$$,            40, $$50 min$$, $$Bald to blend, razor-sharp on the sides, however you like it up top.$$, 2, true),
  ('beard', $$Beard Trim & Line-up$$, 20, $$20 min$$, $$Shaped, edged, and oiled. Straight-razor detail on the lines.$$, 3, true),
  ('shave', $$Hot Towel Shave$$,      35, $$30 min$$, $$The full ritual — hot towels, straight razor, cool finish.$$, 4, true),
  ('combo', $$Cut + Beard Combo$$,    50, $$60 min$$, $$The works. Fresh cut and a shaped beard in one sitting.$$, 5, true),
  ('kids',  $$Kids Cut (under 12)$$,  25, $$30 min$$, $$Patient hands and a chair that goes up. First cuts welcome.$$, 6, true);

insert into addons (id, name, price, description, sort_order, active) values
  ('oil',   $$Beard Oil Treatment$$,     8,  $$Conditioning oil worked in and massaged.$$, 1, true),
  ('towel', $$Hot Towel Finish$$,        10, $$Steamed towel to open up and relax before the finish.$$, 2, true),
  ('prod',  $$Premium Styling Product$$, 12, $$Take-home clay or pomade, matched to your hair.$$, 3, true),
  ('grey',  $$Grey Blending$$,           15, $$Subtle color to knock back the grey. Nobody will know.$$, 4, true);

insert into barbers (id, name, first_name, role, specialty, initial, active, sort_order) values
  ('johnson', $$Mr. Johnson$$, $$Mr. J$$,  $$Owner · Master Barber$$, $$Classic cuts & straight-razor shaves$$, $$J$$, true, 1),
  ('miguel',  $$Miguel$$,      $$Miguel$$, $$Senior Barber$$,         $$Fades, tapers & modern styles$$,        $$M$$, true, 2),
  ('subby',   $$Subby$$,       $$Subby$$,  $$Barber$$,                $$Beard sculpting, designs & line work$$, $$S$$, true, 3);

insert into hours (day, time, closed, sort_order) values
  ($$Mon$$,       $$Closed$$,     true,  1),
  ($$Tue – Fri$$, $$9am – 7pm$$,  false, 2),
  ($$Saturday$$,  $$8am – 5pm$$,  false, 3),
  ($$Sunday$$,    $$10am – 3pm$$, false, 4);

insert into reviews (text, name, initial, when_text, sort_order) values
  ($$Best fade in the city, hands down. Miguel remembers exactly how I like it every single time.$$, $$Darnell W.$$, $$D$$, $$2 weeks ago$$, 1),
  ($$Took my son for his first cut. Subby was so patient with him. We're both regulars now.$$, $$Priya K.$$, $$P$$, $$1 month ago$$, 2),
  ($$The hot towel shave is worth every penny. Mr. Johnson is a proper old-school craftsman.$$, $$Tom R.$$, $$T$$, $$3 weeks ago$$, 3);

insert into faqs (question, answer, sort_order) values
  ($$Do I need an appointment, or can I walk in?$$, $$Both work. Walk-ins are welcome whenever a chair is free, but booking online guarantees your barber and time — especially on weekends.$$, 1),
  ($$Can I ask for a specific barber?$$, $$Absolutely. Pick Mr. Johnson, Miguel, or Subby right in the booking flow. Choosing "any barber" just gets you the first one free.$$, 2),
  ($$How long does a cut take?$$, $$Every service lists its time on the Menu — from a 20-minute beard line-up to the full 60-minute cut-and-beard combo. We hold your chair for that whole window.$$, 3),
  ($$What if I'm not happy with my cut?$$, $$Tell us before you leave the chair and we'll fix it on the spot. Notice something within 3 days? Come back and we'll tidy it up free.$$, 4),
  ($$Do you cut kids' hair?$$, $$Yes — kids under 12 have their own rate, and first cuts are a specialty. Patient hands and a chair that goes up.$$, 5),
  ($$Will I get a reminder before my appointment?$$, $$Yes. You'll get a confirmation text as soon as you book and a reminder 24 hours before, so a slot never slips your mind.$$, 6),
  ($$What payment do you accept?$$, $$Cash and all major cards in shop. You can also pay a deposit or the full amount online when you book.$$, 7);

insert into policies (icon, title, body, sort_order) values
  ($$⏰$$,  $$Late Arrivals$$,      $$A chair's held for you, not the whole afternoon. Arrive more than 10 minutes late and we may need to shorten the service or rebook you so the next client isn't held up.$$, 1),
  ($$🗓️$$, $$Cancellations$$,      $$Life happens — just give us 24 hours' notice to cancel or reschedule free of charge. Inside 24 hours, any deposit is kept to cover the empty chair.$$, 2),
  ($$👤$$,  $$No-Shows$$,           $$Miss an appointment without telling us and the deposit is forfeited. Two no-shows and future bookings will require full pre-payment.$$, 3),
  ($$💳$$,  $$Deposits & Payment$$, $$Optional deposits go straight toward your final bill. We take cash and all major cards in shop. Refunds on deposits follow the cancellation window above.$$, 4);

insert into gallery (image_url, span, hint, sort_order) values
  (null, $$span-2col span-2row$$, $$Feature cut$$, 1),
  (null, $$$$,                    $$Cut photo$$,   2),
  (null, $$$$,                    $$Cut photo$$,   3),
  (null, $$span-2col$$,           $$Cut photo$$,   4),
  (null, $$$$,                    $$Cut photo$$,   5),
  (null, $$span-2row$$,           $$Cut photo$$,   6),
  (null, $$$$,                    $$Cut photo$$,   7),
  (null, $$$$,                    $$Cut photo$$,   8);

insert into stats (num, label, sort_order) values
  ($$3$$, $$Master Barbers$$, 1),
  ($$15$$, $$Years Open$$, 2),
  ($$4.9★$$, $$Google Rating$$, 3),
  ($$60s$$, $$To Book$$, 4);

insert into group_perks (title, description, sort_order) values
  ($$Private time slots$$, $$we open early or run late so it's just your group$$, 1),
  ($$Multiple barbers$$,   $$up to 3 chairs going at once to move fast$$, 2),
  ($$Drinks on us$$,       $$coffee, beers, or something stronger for the occasion$$, 3),
  ($$Group rate$$,         $$10% off when you book 4 or more cuts together$$, 4);

insert into group_packages (icon, name, description, tag, sort_order) values
  ($$🤵$$, $$The Wedding$$,   $$Groom + groomsmen fresh and photo-ready on the day.$$, $$Up to 8 heads$$, 1),
  ($$🎉$$, $$Birthday$$,      $$Line up the crew for the celebration with a chair each.$$, $$From 4 heads$$, 2),
  ($$👔$$, $$Corporate$$,     $$Treat the team or clients to a proper barbershop visit.$$, $$Invoiced$$, 3),
  ($$👦$$, $$Father & Sons$$, $$Bring the family through together, one after another.$$, $$Any age$$, 4);

insert into features (icon, title, body, tip, sort_order) values
  ($$🔔$$,  $$Automated Reminders$$,        $$Cut no-shows by sending an SMS + email the moment someone books, then a reminder 24h before. Connect a booking tool (Square, Fresha, or Booksy) and switch reminders on — they text automatically.$$, $$Aim for 1 confirmation + 1 reminder. More than that annoys people.$$, 1),
  ($$✂️$$, $$Staff Profiles & Preference$$, $$Each barber gets a photo, specialty, and their own calendar. Clients choose who they want (built into the booking flow here) so regulars always land in the right chair.$$, $$Let clients pick "any barber" too — it fills gaps in slow hours.$$, 2),
  ($$💰$$,  $$Up-selling Add-ons$$,         $$The booking flow already prompts for beard oil, hot-towel finishes, and take-home product before checkout. A single tap adds $8–$15 to the ticket without any hard sell.$$, $$Keep it to 3–4 add-ons. Too many choices kill the impulse.$$, 3),
  ($$💳$$,  $$Deposit / Payment Capture$$,  $$Take a small deposit (or full payment) at booking to protect against late cancels. Enable card payments in your booking tool and set a deposit of $10 or ~30% — applied to the final bill.$$, $$Pair it with a clear 24h cancellation policy on the confirmation.$$, 4),
  ($$⭐$$,  $$Google Reviews Integration$$, $$Text a review link to every client after their cut, then embed the live Google widget on the gallery page so fresh 5-stars appear on their own. Social proof sells the next booking.$$, $$A widget slot is already marked on the Gallery page — drop the embed in.$$, 5);

insert into checklist (title, description, sort_order) values
  ($$Claim your booking tool$$,        $$Sign up for a free barbershop booking platform (Square Appointments, Fresha, or Booksy). Add your three barbers and their hours. This runs the calendar behind the site.$$, 1),
  ($$Load your menu & prices$$,        $$Enter every service and add-on from the Menu page with its price and duration. Set a deposit amount if you want to capture payment up front.$$, 2),
  ($$Add photos & connect Instagram$$, $$Drop real cut photos into the Gallery tiles and link @johnsonsbarbers so the feed fills itself. First impressions live here.$$, 3),
  ($$Turn on reminders & reviews$$,    $$Switch on SMS/email confirmations + 24h reminders, and paste your Google Reviews embed into the widget slot on the Gallery page.$$, 4),
  ($$Publish & share the link$$,       $$Point your domain at the site, then put the booking link everywhere — Instagram bio, Google Business profile, and a QR code taped by the register.$$, 5);

insert into content (key, value) values
  ($$hero_pill$$, $$Est. 2011 · Walk-ins & Appointments$$),
  ($$hero_title_1$$, $$Sharp cuts.$$),
  ($$hero_title_2$$, $$Straight talk.$$),
  ($$hero_sub$$, $$Precision fades, classic scissor work, and hot-towel shaves in the heart of the neighborhood. No fuss. Just a clean cut and a good chair to sit in.$$),
  ($$story_title$$, $$A chair, a mirror, and 15 years of steady hands.$$),
  ($$story_p1$$, $$Johnson's started as a single chair Mr. Johnson set up after 20 years cutting hair across the city. Today it's three barbers who take the craft seriously — and take their time. We learn your head, remember your cut, and get you back out the door looking sharp.$$),
  ($$story_p2$$, $$Every seat books online, every barber's got their own style, and there's always a fresh pot of coffee going.$$),
  ($$shop_address$$, $$218 Halstead Ave$$),
  ($$shop_phone$$, $$(555) 019-4477$$),
  ($$shop_instagram$$, $$@johnsonsbarbers$$),
  ($$reviews_rating$$, $$4.9$$),
  ($$reviews_count$$, $$312$$);
