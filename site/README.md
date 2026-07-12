# Johnson's Barbers — Website

A fast, self-contained static website for Johnson's Barbers. Built with plain
HTML, CSS, and JavaScript — **no build step, no dependencies, no server code**.
Just upload the files and it works.

## What's in here

```
site/
├── index.html        ← the whole site (all pages live here as one SPA)
├── css/styles.css    ← all styling + the light/dark design tokens
├── js/app.js         ← data, page routing, theme toggle, booking flow
└── assets/favicon.svg
```

Pages: **Home · Services · Booking · Gallery · FAQ & Policies · Owner Kit**.
Includes a persisted light/dark theme toggle and full mobile responsiveness.

## Run it locally

Just open `index.html` in a browser — that's it. (The Google Fonts load over the
internet, so you'll want to be online for the exact typography.)

If a browser blocks anything when opened via `file://`, serve the folder:

```bash
# Python (any OS)
cd site
python -m http.server 8000
# then visit http://localhost:8000
```

## Upload to a web host

This is a static site, so **any** host works. Upload the **contents of the
`site/` folder** to your host's web root (often `public_html`, `www`, or `htdocs`).

- **Shared hosting / cPanel:** drag the files into `public_html` via the File
  Manager or FTP (FileZilla). Make sure `index.html` sits at the top level.
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop the `site` folder onto
  their dashboard, or connect a repo. No build command needed; publish
  directory is `site`.
- **GitHub Pages:** push the files and enable Pages on the branch/folder.

Then point your domain at the host and you're live.

## ⚠️ Important: the booking flow is a front-end demo

The booking screens (barber → service → add-ons → date → pay → confirmation)
currently run **entirely in the browser**. Selections are held in memory and the
"You're booked in" screen is local only — **no appointment is actually saved, no
payment is taken, and no reminder text is sent.**

To take real bookings, connect a booking provider (recommended) or your own
backend. The single integration point is marked in `js/app.js`:

```js
// >>> INTEGRATION POINT <<<  (function confirmBooking)
```

Replace that with a real call — e.g. send the booking to **Square
Appointments**, **Fresha**, or **Booksy** (they handle staff calendars,
availability, SMS/email reminders, deposits, and card payments / PCI compliance
out of the box). The **Owner Kit** page in the site has a step-by-step go-live
checklist for exactly this.

## Customizing content

Almost all copy and data (services, prices, barbers, add-ons, hours, reviews,
FAQ, policies) live in arrays at the top of `js/app.js` — edit those to change
what shows on the site. Colors and fonts are the CSS variables at the top of
`css/styles.css`.

## Adding real photos

The Gallery tiles and barber cards use placeholders. To add real images, drop
files into `assets/` and swap the placeholder markup for `<img>` tags (barber
cards render in `renderStatic()` under `#crewGrid`; gallery tiles under
`#galleryGrid`).
