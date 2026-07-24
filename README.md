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

## 5. Project structure

```
app/
  page.tsx                    Home
  booking/page.tsx            Booking
  shop/page.tsx                Shop (product grid)
  shop/[slug]/page.tsx         Product detail
  specialists/[slug]/page.tsx  Specialist profile
  blog/page.tsx                 Blog listing
  blog/[slug]/page.tsx          Blog post
  contact/page.tsx              Contact
  checkout/thank-you/page.tsx   Order/booking confirmation
  api/                          MotherDuck-backed API routes
components/                     Shared UI + client-side forms
context/CartContext.tsx         Global cart state
lib/
  db.ts                         MotherDuck connection (pg)
  queries.ts                    Data access layer (DB + fallback)
  data.ts                       Seed/fallback content
  dataLayer.ts                  Custom analytics tracking
  types.ts                      Shared TS types
schema.sql                      MotherDuck table definitions + seed data
```

## 6. Notes

- Colors, type, and layout follow the supplied Google Stitch mockups
  (teal `#12695a` primary, cream background, rounded cards) rather than a
  generic template.
- Prices are shown in PKR (`Rs`) to match the Shop/Product mockups; adjust
  formatting in `ProductCard.tsx` / `ProductBuyBox.tsx` if you need another
  currency.
- The cart persists to `localStorage` client-side and is submitted as an
  `order` to MotherDuck at checkout.
