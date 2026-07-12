# Johnson's Barbers — Setup & Deploy Guide

A Next.js booking site with an owner admin dashboard, backed by Supabase
(database + login + photo storage) and Resend (email alerts). Deploys to
GitHub → Vercel.

Until you connect Supabase, the public site still renders from built-in
seed content, and the admin shows a "Setup needed" notice. Nothing breaks.

---

## What you get

- **Public site** — Home, Services, Booking, Gallery, FAQ, Owner Kit. All
  content comes from the database (editable in the admin).
- **Booking flow** — barber → service → add-ons → date/time → details + pay.
  On confirm it saves the appointment, **emails the chosen barber**, and
  **emails the customer** a confirmation.
- **Admin dashboard** (`/admin`) — add/edit/remove **barbers**, edit
  **services & add-ons**, edit homepage **content** and **hours**, and view
  **bookings** (with cancel).
- **24h reminders** — a daily Vercel Cron emails tomorrow's customers.

---

## 1. Create the accounts (all free to start)

1. **Supabase** — https://supabase.com → New project. Pick a name
   (`johnson-barbers`), a region near you, and set a database password.
2. **Resend** — https://resend.com → sign up. (For real email from your own
   domain, add + verify your domain later; for testing you can send from
   `onboarding@resend.dev`.)
3. **Vercel** — https://vercel.com → sign in with GitHub.

---

## 2. Set up the database

In Supabase: **SQL Editor → New query**, paste the entire contents of
[`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates every
table, the security rules, and seeds your current content.

---

## 3. Create the owner login

Supabase → **Authentication → Users → Add user** → enter your email and a
password (check "Auto Confirm"). That's the account you'll use at `/admin`.

---

## 4. (Optional) Photo uploads

Barber and gallery photos use image **URLs**. Easiest source: Supabase
**Storage → New bucket** named `photos`, set it **Public**, upload images,
copy each file's public URL, and paste it into the barber/gallery field in the
admin. (Any public image URL works.)

---

## 5. Get your keys

**Supabase → Project Settings → API:**
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

**Resend → API Keys:** create one → `RESEND_API_KEY`

---

## 6. Run locally (optional)

```bash
cp .env.example .env.local     # then fill in the values
npm install
npm run dev                    # http://localhost:3000
```

Visit `/` for the site and `/admin` to log in.

---

## 7. Deploy to Vercel

1. https://vercel.com/new → import **streamjamz/JohnsonBarber**.
2. Framework preset: **Next.js** (auto-detected). Root directory: **`.`**
   (repo root — leave default). No build command changes needed.
3. **Environment Variables** — add every key from `.env.example` with your
   real values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_FROM` (e.g. `Johnson's Barbers <bookings@yourdomain.com>` once your
     domain is verified in Resend, or `onboarding@resend.dev` to test)
   - `SHOP_EMAIL` (fallback inbox if a barber has no email set)
   - `CRON_SECRET` (any long random string)
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL, then your domain)
4. **Deploy.** The cron job in `vercel.json` runs automatically once a day.

> Tip: there's a **Vercel ↔ Supabase integration** that fills in the Supabase
> env vars for you — optional, but handy.

---

## Day-to-day

- **Add/remove a barber:** `/admin/barbers`. Set their **alert email** so
  their bookings land in their inbox. Toggle **Active** to hide someone
  without deleting.
- **Change prices / services:** `/admin/services`.
- **Edit the homepage words, hours, Instagram, address:** `/admin/content`.
- **See upcoming bookings / cancel:** `/admin`.

---

## Notes & next steps

- **Email first.** Barber alerts + customer confirmations are email. To also
  send **SMS**, add Twilio and call it alongside the email in
  [`app/api/book/route.js`](app/api/book/route.js).
- **Payments.** "Pay deposit / in full" is recorded but no card is charged
  yet. To take real money, add **Stripe Checkout** and only save the booking
  after payment succeeds (integration point is in the same route).
- **Availability.** The date/time step currently offers fixed daily slots. A
  true per-barber availability engine (buffers, real open days, no
  double-booking) is the natural next upgrade.
- The old static prototype lives in [`site/`](site/) for reference; the live
  app is the Next.js project at the repo root.
