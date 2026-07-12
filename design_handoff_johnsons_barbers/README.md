# Handoff: Johnson's Barbers — Booking Website

## Overview
A three-plus-page marketing + booking website for a neighborhood barbershop ("Johnson's Barbers"). It lets clients browse services, pick a barber, book an appointment through a multi-step flow (with upsell add-ons and an optional deposit/payment step), view a gallery + reviews, read policies/FAQ, and gives the owner a launch checklist. Aesthetic: bold, high-contrast "street" barbershop — near-black + red accent, condensed display type. Includes a persisted light/dark theme toggle and full mobile responsiveness.

## About the Design Files
The file in this bundle (`Johnsons Barbers.dc.html`) is a **design reference created in HTML** — a prototype showing the intended look, copy, and interaction flow. It is **not production code to ship directly**. The task is to **recreate this design in a real codebase** using an appropriate stack, wiring it to a **real backend** for scheduling, reminders, and payments.

Recommended approach: a Next.js/React front end that re-implements these screens, backed by a booking provider rather than a hand-rolled backend:
- **Square Appointments**, **Fresha**, or **Booksy** handle the hard parts out of the box: staff calendars, availability, SMS/email reminders, deposits, and card payments (PCI compliance included).
- Use the provider's API/embed for the actual booking + payment; keep this design as the branded storefront around it.
- If a fully custom backend is required instead: appointments/services/barbers tables, a scheduling/availability engine, Stripe for deposits, and Twilio (or provider) for SMS reminders.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are all specified below. Recreate the UI pixel-accurately using the target codebase's component library and patterns, then connect the booking flow to a real backend/provider.

## Screens / Views

### 1. Global chrome — Header + Footer
- **Header**: sticky, `backdrop-filter: blur(10px)`, background `var(--header-bg)`, 1px bottom border `var(--border)`, padding 14px 28px. Left: logo (38×38 red-bordered box with a 45° red diagonal-stripe fill at 0.35 opacity and an "J" in Anton) + wordmark ("JOHNSON'S" / "BARBERS" in red). Right nav: Home, Services, Gallery, FAQ, Owner Kit + a 38×38 theme-toggle button (☀ / ☾) + a red "BOOK NOW" button. On ≤860px nav wraps + shrinks; on ≤560px header wraps.
- **Footer**: background `var(--bg2)`, top border, shop name + address/phone/Instagram + repeat of nav links.

### 2. Home
- **Hero**: centered, ~96px vertical padding. Diagonal-stripe background pattern; a top accent bar of repeating red/cream/black stripes. Eyebrow pill ("EST. 2011 · WALK-INS & APPOINTMENTS"), giant headline `clamp(52px,9vw,128px)` Anton "Sharp cuts. / Straight talk." (second line red), subhead paragraph, two CTAs (red "Book an Appointment", outline "See the Menu").
- **Stats strip**: fluid grid `repeat(auto-fit,minmax(150px,1fr))`, 4 cells with red Anton numbers (3 Master Barbers / 15 Years Open / 4.9★ Google / 60s To Book), right dividers.
- **Story + Hours**: 2-col `1.3fr 1fr` (collapses ≤860px). Left: "The Shop" eyebrow, 44px Anton heading, two body paragraphs, "See our work →" link. Right: Hours card (red header bar, rows Mon Closed / Tue–Fri 9am–7pm / Sat 8am–5pm / Sun 10am–3pm, address/phone footer).
- **Crew preview**: dark band. 3 barber cards (`repeat(auto-fit,minmax(230px,1fr))`) each with a square photo slot, name (Anton), red role, specialty, and "Book with {first}" button (jumps into booking with that barber preselected).
- **Group Bookings**: 2-col `1fr 1fr` (collapses). Left: "Group Bookings" eyebrow, 44px heading "Bring the whole crew", 4 checked perks, "Enquire About a Group" button. Right: 4 package cards (`repeat(auto-fit,minmax(250px,1fr))`) — The Wedding / Birthday / Corporate / Father & Sons, each icon + name + desc + red tag.
- **CTA banner**: full red background, white Anton heading "Ready for a fresh cut?", subtext, white "Book Now" button.

### 3. Services & Pricing ("The Menu")
- Centered header. **Cuts & Shaves** section: red section label with 2px underline, then rows (border-bottom, hover tint) each with name (Barlow 800), duration (red), description (muted), price (Anton 32px), and a red "Book" button (jumps into booking with service preselected). Six services (see Data). **Add-ons** section: grid of 4 cards (name / desc / red price). Bottom "Start Booking" CTA.

### 4. Booking flow (interactive, 6 steps)
Progress bar of 5 numbered steps (Barber, Service, Add-ons, Date, Pay) with a red active dot, red check for completed, connecting lines fill red as you advance. Step title (Anton) + subtitle. Step labels hidden ≤560px.
- **Step 0 — Barber**: 3 selectable cards (avatar with diagonal-stripe fill + initial, name, specialty, "✓ Selected" badge when chosen). Selected = red border + tinted bg.
- **Step 1 — Service**: selectable rows (name/duration/desc/price). Selected highlight.
- **Step 2 — Add-ons**: intro card, then 4 toggleable cards; pill reads "+ Add" → "Added ✓" (red) when on.
- **Step 3 — Date & time**: "Pick a day" fluid grid of the next 6 open days (Mondays skipped — shop closed), each showing DOW / date / month; "Pick a time" grid of 8 slots. Both single-select.
- **Step 4 — Payment**: 2-col `1.4fr 1fr` (collapses). Left: 3 radio options — "Pay a deposit now" (30% of total, min $10), "Pay in full now", "Pay in shop" ($0); plus a reminder note ("confirmation now + reminder 24h before"). Right: sticky order-summary card (Barber / Service / Add-ons / When lines, Total in red Anton, contextual "due" note).
- **Step 5 — Confirmation**: red check circle, "You're booked in" heading, summary card, paid label/amount, "Book Another" (resets flow).
- Footer nav buttons: "← Back" (hidden on step 0) and a right button "Continue →" / "Confirm Booking" (disabled + dimmed until the current step's required selection is made).

### 5. Gallery / Social Proof
- Header. **Masonry photo grid** (`.gallery-grid`, `repeat(4,1fr)` desktop, 200px rows, varied col/row spans; → 2 cols ≤860px, 150px rows ≤560px) of 8 drag-and-drop image slots. **Instagram CTA** card (2-col, collapses) pointing at @johnsonsbarbers with guidance to embed the live feed. **Reviews**: 4.9★ / 312 Google reviews line, 3 review cards (5 gold stars, quote, avatar initial + name + when). A dashed "widget slot" note for embedding live Google Reviews.

### 6. FAQ & Policies
- Header. **Shop Policies**: 4 cards (`repeat(auto-fit,minmax(250px,1fr))`) — Late Arrivals, Cancellations, No-Shows, Deposits & Payment. **FAQ accordion**: 7 questions, single-open (default first open), "+" / "−" red sign; answer expands. Bottom "Still got a question?" card with phone + Book CTA.

### 7. Owner Kit (Launch Kit)
- Header with a "🖨 Print One-Pager" button (`window.print()`; `.no-print` hides chrome). Intro copy. **Go-Live Checklist · 5 Steps**: 5 tickable rows (checkbox + number + title + desc), toggling marks done (tinted). **High-Value Features**: 5 cards (icon/title/body/red tip) — Automated Reminders, Staff Profiles & Preference, Up-selling Add-ons, Deposit/Payment Capture, Google Reviews Integration.

## Interactions & Behavior
- **Routing**: single-page, `page` state switches sections (home / services / book / gallery / faq / kit); nav + logo + CTAs set it. "Book" entries can preselect a barber or service and jump to the relevant step.
- **Booking**: step index 0–5; Next is gated by required selection per step; deposit = `max(10, round(total * 0.3))`; total = service price + sum of add-ons. Reset clears all booking state back to step 0.
- **Theme toggle**: flips `data-theme` on the root between `dark`/`light`; persisted to `localStorage['jb-theme']` and restored on load; body has `transition: background .2s`.
- **FAQ accordion**: clicking a question toggles it; only one open at a time.
- **Checklist**: click toggles per-item done state.
- **Hover states**: nav items → ink color; buttons → lighter red (`#e8564e`) or inverted; selectable cards/rows → red border; service rows → panel tint.
- **Responsive**: see per-screen notes; breakpoints at 860px and 560px. Card grids use `auto-fit`/`minmax` so they reflow without media queries; ratio 2-col layouts collapse to 1 col via `.resp-2col`.
- **Image slots**: drag-and-drop placeholders (prototype uses a web component). In production, replace with the app's image upload / Instagram embed.

## State Management
- `page` — current view.
- `step` — booking step 0–5.
- `barber`, `service` — selected ids (nullable).
- `addons` — array of selected add-on ids.
- `day`, `time` — selected slot (nullable).
- `pay` — 'deposit' | 'full' | 'shop' | null.
- `done` — boolean[5] for checklist.
- `openFaq` — index of open FAQ (nullable).
- `theme` — 'dark' | 'light', seeded from localStorage.
- **Backend data needs (production)**: barbers, services (name/price/duration/desc), add-ons, real availability per barber, appointment creation, deposit/payment intent, SMS/email reminder scheduling. Prefer a booking provider's API over building these from scratch.

## Design Tokens

### Colors — Dark (default) / Light
- `--bg`: #0f0f11 / #f4f1ea
- `--bg2`: #0c0c0e / #e9e4d8
- `--panel`: #141416 / #ffffff
- `--border`: #242428 / #e2dccf
- `--border2`: #2f2f34 / #d6cfbe
- `--border3`: #3a3a3f / #c7bda8
- `--text`: #e8e6e2 / #26221d
- `--text2`: #b9b9bd / #4c463c
- `--muted`: #9a9a9f / #726c60
- `--dim`: #6a6a6f / #a49d8e
- `--ink` (headings/strong): #ffffff / #17130d
- `--sel` (selected bg): #1c1512 / #fbeae8
- `--chip` / `--chip2` (avatar gradient): #26262a·#1c1c1f / #e9e2d4·#dbd2c0
- `--header-bg`: rgba(15,15,17,0.92) / rgba(249,247,242,0.92)
- **Accent (constant both themes)**: red `#d6342c`, red-hover `#e8564e`, star gold `#f5b301`. White-on-red text stays `#fff` in both themes.

### Typography (Google Fonts)
- **Display**: `Anton` — headings, numbers, prices. Uppercase, tight line-height (0.92–1.02), letter-spacing ~0.5–1px.
- **Body**: `Barlow` (weights 400–800) — paragraphs, service names (800), labels.
- **Condensed labels/eyebrows/buttons**: `Barlow Condensed` (600/700) — uppercase, letter-spacing 1.5–4px.
- Scale examples: hero `clamp(52px,9vw,128px)`; page titles `clamp(44px,7vw,80px)`; section headings 44–48px; prices 24–32px; body 15–19px; eyebrows/labels 11–16px.

### Spacing / shape
- Section vertical padding ~70–96px; horizontal 28px (16px on mobile). Card padding 18–36px. Grid gaps 10–24px.
- **Border radius: essentially 0** — sharp rectangular cards/buttons are core to the aesthetic (only avatars/dots/theme radio use 50%). Keep corners square.
- Borders: 1px `var(--border)` for cards; 2px `var(--border)`→red for selectable states. No drop shadows.

### Breakpoints
- ≤860px: 2-col ratio layouts → 1 col; gallery → 2 cols; nav wraps/shrinks.
- ≤560px: header wraps; gallery rows 150px; booking step labels hidden.

## Data (exact content)

### Barbers
- **Mr. Johnson** — Owner · Master Barber — "Classic cuts & straight-razor shaves"
- **Miguel** — Senior Barber — "Fades, tapers & modern styles"
- **Subby** — Barber — "Beard sculpting, designs & line work"

### Services (name — price / duration / description)
- Signature Cut — $35 / 45 min / "Scissor + clipper, washed, styled, and lined up clean."
- Skin Fade — $40 / 50 min / "Bald to blend, razor-sharp on the sides, however you like it up top."
- Beard Trim & Line-up — $20 / 20 min / "Shaped, edged, and oiled. Straight-razor detail on the lines."
- Hot Towel Shave — $35 / 30 min / "The full ritual — hot towels, straight razor, cool finish."
- Cut + Beard Combo — $50 / 60 min / "The works. Fresh cut and a shaped beard in one sitting."
- Kids Cut (under 12) — $25 / 30 min / "Patient hands and a chair that goes up. First cuts welcome."

### Add-ons
- Beard Oil Treatment +$8 · Hot Towel Finish +$10 · Premium Styling Product +$12 · Grey Blending +$15

### Hours
- Mon Closed · Tue–Fri 9am–7pm · Sat 8am–5pm · Sun 10am–3pm
- Address/phone placeholder: 218 Halstead Ave · (555) 019-4477 · @johnsonsbarbers

(FAQ questions, policies, reviews, checklist steps, and feature blurbs are all present verbatim in the HTML file — copy from there.)

## Assets
- **Fonts**: Anton, Barlow, Barlow Condensed via Google Fonts.
- **Images**: none shipped — the gallery and barber photos are empty drag-and-drop slots the owner fills. Replace with real uploads / Instagram embed in production.
- **No SVG/icon library**: a few emoji are used as feature/policy icons; swap for the codebase's icon set if preferred. The logo is CSS-only (bordered box + diagonal-stripe + letter).

## Files
- `Johnsons Barbers.dc.html` — the complete prototype (all screens, copy, interactions, theming, responsiveness). It is a single self-contained design component; all logic/data live inside it. Use it as the source of truth for copy and exact styling.
