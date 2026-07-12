# Johnson's Barbers

Booking website for Johnson's Barbers with an owner admin dashboard.

**Stack:** Next.js (App Router) · Supabase (Postgres + Auth + Storage) ·
Resend (email) · deploys to Vercel.

## Features

- Public marketing site + a multi-step **booking flow**.
- On booking: saves the appointment, **emails the barber** and **the customer**.
- **Admin dashboard** at `/admin` — add/remove/edit **barbers**, edit
  **services, add-ons, hours, and homepage content**, and view/cancel bookings.
- **24h reminder emails** via a daily Vercel Cron.
- All site content is database-driven and editable in the admin. Before
  Supabase is connected, the site renders from built-in seed content.

## Getting started

See **[SETUP.md](SETUP.md)** for the full account setup, database, env vars,
and deploy walkthrough. Quick version:

```bash
cp .env.example .env.local   # fill in Supabase + Resend keys
npm install
npm run dev                  # http://localhost:3000  (admin at /admin)
```

## Project layout

```
app/               Next.js routes (public pages, /admin dashboard, /api)
components/         React components (Header, Booking, Faq, admin UI, …)
lib/               data layer, Supabase clients, email, seed content
supabase/          schema.sql — run once in the Supabase SQL editor
site/              the original static prototype (reference only)
design_handoff…/   the original design spec
```
