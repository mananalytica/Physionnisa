# Physionnisa

Full website for Physionnisa — a physiotherapy clinic for women — built to
match the provided mockups (Home, Booking, Shop, Product, Specialist, Blog,
Contact, Thank You).

- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database:** [MotherDuck](https://motherduck.com) via its Postgres
  wire-protocol endpoint (no DuckDB client needed — works from Vercel
  serverless functions using the standard `pg` package)
- **Analytics:** a custom `window.dataLayer` — no GTM container, no GA4
  script, anywhere in the codebase

---

## 1. Run it locally

```bash
npm install
cp .env.example .env.local     # fill in MotherDuck values (or leave blank — see below)
npm run dev
```

Open http://localhost:3000.

**You don't need MotherDuck to see the site working.** Every data-fetching
function in `lib/queries.ts` falls back to realistic seed content in
`lib/data.ts` whenever `MOTHERDUCK_TOKEN` isn't set, so `npm run dev` renders
a fully populated site out of the box. Forms (`/api/bookings`, `/api/orders`,
`/api/contact`, `/api/newsletter`) still work — they just log to the console
instead of writing to a database until you connect one.

## 2. Set up MotherDuck

1. Create a free account at https://app.motherduck.com and a database (e.g. `physionnisa`).
2. Generate a token: **Settings → Tokens**.
3. Run `schema.sql` against that database to create the tables and seed a
   few rows (specialists, products, blog posts). Easiest way, using the
   [DuckDB CLI](https://duckdb.org/docs/api/cli/overview):

   ```bash
   duckdb "md:physionnisa?motherduck_token=YOUR_TOKEN" -c ".read schema.sql"
   ```

   Or paste the contents of `schema.sql` into a MotherDuck SQL notebook in
   the web UI.
4. Set these in `.env.local` (or your Vercel project's environment variables):

   ```
   MOTHERDUCK_TOKEN=md_...
   MOTHERDUCK_DATABASE=physionnisa
   MOTHERDUCK_PG_HOST=pg.us-east-1-aws.motherduck.com   # or eu-central-1 for EU orgs
   MOTHERDUCK_PG_PORT=5432
   ```

From here on, every page and API route automatically reads/writes real data
— no code changes needed.

### Tables created by `schema.sql`

| Table | Purpose |
|---|---|
| `specialists` | Physiotherapist profiles (`/specialists/[slug]`) |
| `products` | Shop catalog (`/shop`, `/shop/[slug]`) |
| `blog_posts` | Blog articles (`/blog`, `/blog/[slug]`) |
| `bookings` | Appointment requests from the Booking page |
| `orders` / `order_items` | Checked-out cart orders (Thank You page) |
| `contact_messages` | Contact form submissions |
| `newsletter_subscribers` | Blog newsletter sign-ups |
| `analytics_events` | Optional warehouse copy of dataLayer events |

## 3. Deploy — GitHub + Vercel

```bash
git init
git add .
git commit -m "Physionnisa website"
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

Then in Vercel:

1. **Import the GitHub repo** as a new project (framework auto-detected: Next.js).
2. **Add the MotherDuck integration** from the Vercel Marketplace
   (Project → Integrations → MotherDuck) — this auto-populates
   `MOTHERDUCK_TOKEN` for you. Otherwise, add the four `MOTHERDUCK_*`
   environment variables manually under Project → Settings → Environment
   Variables.
3. Deploy. That's it — no build configuration changes needed.

## 4. The dataLayer (analytics without GTM/GA4)

`lib/dataLayer.ts` exports a `track(event, payload)` function that pushes
structured events onto `window.dataLayer`, the same array shape Google Tag
Manager expects — but **no GTM/GA4 script is ever loaded**. Open your
browser console on any page and inspect `window.dataLayer` to see events
fire live.

Events already wired up throughout the site:

| Event | Fired when |
|---|---|
| `page_view` | Every route change |
| `view_item_list` | Shop grid renders / category filter changes |
| `view_item` | A product detail page loads |
| `select_item` | A product card is clicked from a grid |
| `add_to_cart` / `remove_from_cart` | Cart quantity changes |
| `view_cart` | Cart drawer opens |
| `begin_checkout` | "Checkout with Booking" clicked from the cart |
| `book_appointment_request` | Booking form submitted |
| `purchase` | Thank-you page finalizes an order |
| `contact_form_submit` | Contact form submitted |
| `newsletter_signup` | Newsletter form submitted |

To send these events to your own analytics stack later, you only have to
edit one place: `lib/dataLayer.ts`. A few options:

- **Add a real GTM container:** drop the GTM snippet in `app/layout.tsx`
  and it will pick up everything already pushed to `window.dataLayer`
  going forward — no page code changes needed.
- **Warehouse events in MotherDuck:** swap `track(...)` calls for
  `trackAndPersist(...)` (already implemented, writes to the
  `analytics_events` table via `/api/events`).
- **Send to Segment/PostHog/etc.:** add the SDK call inside `track()`.

## 5. Troubleshooting: "my bookings/contact form aren't saving to MotherDuck"

Visit **`/api/health`** on your deployed site. It will tell you exactly what's wrong:

- `"configured": false` → `MOTHERDUCK_TOKEN` and/or `MOTHERDUCK_DATABASE` aren't set in
  this environment. **This is the most common cause.** The Vercel MotherDuck
  marketplace integration only auto-populates `MOTHERDUCK_TOKEN` — you still need to add
  `MOTHERDUCK_DATABASE` yourself (Project → Settings → Environment Variables), set to the
  *exact* database name you ran `schema.sql` against. Redeploy after adding it — env var
  changes don't apply to already-running deployments.
- `"connection": "error"` → token/database are set but the connection itself failed.
  Check `MOTHERDUCK_PG_HOST` matches your org's region.
- `"connection": "ok"` with `rowCounts` → you're fully connected; the counts show how
  many rows are in each table right now, so you can confirm a test submission landed.

As of this version, `/api/bookings`, `/api/orders`, `/api/contact`, and `/api/newsletter`
all return a `stored: true/false` field and log a console warning (visible in Vercel's
function logs) whenever a submission was accepted by the UI but not actually written to
MotherDuck — so this failure mode is loud instead of silent going forward.

## 6. Checkout vs. Booking — two independent flows

These are intentionally decoupled:

- **Shop → Cart → `/checkout`** — a pure product purchase. Fills in shipping/contact
  details, creates a row in `orders` (+ `order_items`), and redirects to
  `/checkout/thank-you?order=<id>`.
- **`/booking`** — an appointment request only. Creates a row in `bookings` and redirects
  to `/checkout/thank-you?booking=<id>`.
- The thank-you page reads whichever of `?order=` / `?booking=` (or both) are present in
  the URL and fetches the corresponding record fresh from the API — so it renders
  correctly even on a page refresh, unlike relying on client-side cart state.

## 7. Specialists

`/specialists` lists every specialist profile (linked from the header nav and homepage);
`/specialists/[slug]` is the individual profile page from the mockups. Both are backed by
`getSpecialists()` / `getSpecialistBySlug()` in `lib/queries.ts`. Add profiles via the
admin panel (see below) rather than editing seed data directly once MotherDuck is connected.

## 8. Google Shopping / Merchant Center

Products carry the standard Merchant Center feed attributes (`brand`, `gtin`, `mpn`,
`condition_gs`, `availability_gs`, `google_product_category`, `product_type`, `currency`).

- **On the website:** every product page renders `schema.org/Product` JSON-LD (price,
  availability, brand, GTIN/MPN, aggregate rating) so Google can pick products up via
  structured data as well.
- **On the backend:** `GET /api/feed/google-shopping` generates a live RSS/XML product
  feed straight from MotherDuck. Register that URL as a **Scheduled fetch** feed in
  Merchant Center → Products → Feeds.
- Specialist pages similarly carry `schema.org/Person` JSON-LD with credentials,
  education, and memberships — see §9.

## 9. Admin panel (`/admin`)

A password-protected panel for managing products and specialist profiles without writing
SQL by hand.

**Setup:** set `ADMIN_PASSWORD` (and optionally a separate `ADMIN_SESSION_SECRET`) in your
environment, then visit `/admin/login`. Auth is a signed, stateless session cookie (HMAC,
7-day expiry, httpOnly) — no separate user table needed for a single-admin setup.

- **`/admin`** — dashboard showing live MotherDuck connection status and row counts
  (same data as `/api/health`, presented for humans).
- **`/admin/products`** — add/edit/delete products one at a time, or bulk-upload via CSV.
  A sample file matching the expected columns is included at `products-sample.csv` in the
  repo root. Only `slug`, `name`, `category`, and `price_pkr` are required per row; the
  Google Shopping columns are optional and default sensibly (`brand: Physionnisa`,
  `condition_gs: new`, `availability_gs: in stock`). Uploading a slug that already exists
  updates that product instead of duplicating it.
- **`/admin/specialists`** — add/edit/delete specialist profiles, including the
  credential/education/membership fields that feed the structured data on the public
  profile page. The form includes an inline reminder to keep this content accurate and
  verifiable, in line with Google's guidance on health-related (YMYL) content and E-E-A-T
  (Experience, Expertise, Authoritativeness, Trustworthiness) — real license numbers,
  real institutions, no unverifiable claims.
- The admin panel requires MotherDuck to be connected (there's no seed-data fallback for
  writes) — `/api/health` will tell you if it isn't yet.
- `middleware.ts` protects everything under `/admin/*` and `/api/admin/*` except the
  login page/endpoint.

## 10. Project structure

```
app/
  page.tsx                       Home
  booking/page.tsx                Booking (appointments only)
  checkout/page.tsx               Checkout (cart purchase only)
  checkout/thank-you/page.tsx     Order/booking confirmation (fetches by id)
  shop/page.tsx                    Shop (product grid)
  shop/[slug]/page.tsx             Product detail (+ Product JSON-LD)
  specialists/page.tsx             Specialists index
  specialists/[slug]/page.tsx      Specialist profile (+ Person JSON-LD)
  blog/page.tsx                     Blog listing
  blog/[slug]/page.tsx              Blog post
  contact/page.tsx                  Contact
  admin/                             Password-protected admin panel
    login/page.tsx
    page.tsx                         Dashboard (DB health)
    products/page.tsx                Product CRUD + CSV bulk upload
    specialists/page.tsx             Specialist CRUD
  api/                               MotherDuck-backed API routes
    health/route.ts                  Connection diagnostics
    feed/google-shopping/route.ts    Merchant Center XML feed
    admin/                           Protected by middleware.ts
components/                     Shared UI + client-side forms
context/CartContext.tsx         Global cart state
lib/
  db.ts                          MotherDuck connection (pg)
  queries.ts                     Public data access layer (DB + fallback)
  data.ts                        Seed/fallback content
  dataLayer.ts                   Custom analytics tracking
  adminAuth.ts                   Signed admin session tokens
  csv.ts                         CSV parser for bulk upload
  types.ts                       Shared TS types
middleware.ts                   Protects /admin and /api/admin
schema.sql                      MotherDuck table definitions + seed data
products-sample.csv             Sample file for the bulk-upload feature
```

## 11. Notes

- Colors, type, and layout follow the supplied Google Stitch mockups
  (teal `#12695a` primary, cream background, rounded cards) rather than a
  generic template.
- Prices are shown in PKR (`Rs`) to match the Shop/Product mockups; adjust
  formatting in `ProductCard.tsx` / `ProductBuyBox.tsx` if you need another
  currency.
- The cart persists to `localStorage` client-side and is submitted as an
  `order` to MotherDuck at checkout.
