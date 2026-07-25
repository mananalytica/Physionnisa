-- Physionnisa — MotherDuck schema
-- Run this once against your MotherDuck database, e.g.:
--   duckdb "md:physionnisa?motherduck_token=$MOTHERDUCK_TOKEN" -c ".read schema.sql"
-- or paste it into a MotherDuck SQL notebook / the web UI.

CREATE TABLE IF NOT EXISTS specialists (
    id            VARCHAR PRIMARY KEY,
    slug          VARCHAR UNIQUE NOT NULL,
    name          VARCHAR NOT NULL,
    title         VARCHAR NOT NULL,
    photo_url     VARCHAR,
    photo_alt     VARCHAR,        -- descriptive alt text, e.g. "Dr. Elena Rodriguez, physiotherapist, in clinic"
    bio           VARCHAR,
    years_experience INTEGER,
    languages     VARCHAR,        -- comma-separated

    -- E-E-A-T / medical-content trust signals (Google's health-content guidance:
    -- https://developers.google.com/search/docs/appearance/eeat and YMYL guidance)
    credentials       VARCHAR,     -- comma-separated post-nominals, e.g. "DPT, MSc"
    license_number    VARCHAR,     -- professional license/registration number, if public
    license_authority VARCHAR,     -- issuing body, e.g. "American Board of Physical Therapy Specialties"
    education         VARCHAR,     -- comma-separated degrees + institutions
    specializations   VARCHAR,     -- comma-separated clinical focus areas
    memberships       VARCHAR,     -- comma-separated professional bodies
    external_profile_url VARCHAR,  -- link to an independent verification (e.g. licensing board lookup)

    clinic        VARCHAR,
    created_at    TIMESTAMP DEFAULT current_timestamp
);

-- If you already ran an earlier version of this schema, add the new columns with:
--   ALTER TABLE specialists ADD COLUMN IF NOT EXISTS photo_alt VARCHAR;
--   ALTER TABLE specialists ADD COLUMN IF NOT EXISTS credentials VARCHAR;
--   ALTER TABLE specialists ADD COLUMN IF NOT EXISTS license_number VARCHAR;
--   ALTER TABLE specialists ADD COLUMN IF NOT EXISTS license_authority VARCHAR;
--   ALTER TABLE specialists ADD COLUMN IF NOT EXISTS education VARCHAR;
--   ALTER TABLE specialists ADD COLUMN IF NOT EXISTS specializations VARCHAR;
--   ALTER TABLE specialists ADD COLUMN IF NOT EXISTS memberships VARCHAR;
--   ALTER TABLE specialists ADD COLUMN IF NOT EXISTS external_profile_url VARCHAR;

CREATE TABLE IF NOT EXISTS products (
    id            VARCHAR PRIMARY KEY,
    slug          VARCHAR UNIQUE NOT NULL,
    name          VARCHAR NOT NULL,
    category      VARCHAR NOT NULL,     -- Recovery Essentials | Clinical Equipment | Wellness & Supplements
    short_desc    VARCHAR,
    long_desc     VARCHAR,
    price_pkr     DECIMAL(10, 2) NOT NULL,
    compare_at_pkr DECIMAL(10, 2),
    image_url     VARCHAR,
    rating        DECIMAL(2, 1) DEFAULT 4.5,
    review_count  INTEGER DEFAULT 0,
    badge         VARCHAR,               -- e.g. "Physiotherapist Recommended"
    in_stock      BOOLEAN DEFAULT TRUE,

    -- Google Shopping / Merchant Center feed attributes
    -- https://support.google.com/merchants/answer/7052112
    brand                  VARCHAR DEFAULT 'Physionnisa',
    gtin                   VARCHAR,       -- Global Trade Item Number (UPC/EAN), if you have one
    mpn                    VARCHAR,       -- Manufacturer Part Number — required if no GTIN
    condition_gs           VARCHAR DEFAULT 'new',        -- new | refurbished | used
    availability_gs        VARCHAR DEFAULT 'in stock',   -- in stock | out of stock | preorder | backorder
    google_product_category VARCHAR,      -- Google's taxonomy, e.g. "Health & Beauty > Health Care > Fitness & Nutrition > Massage Tools"
    product_type           VARCHAR,       -- your own category breadcrumb, e.g. "Recovery Essentials > Massage"
    identifier_exists       BOOLEAN DEFAULT TRUE,          -- set FALSE if the product genuinely has no GTIN/MPN/brand
    currency                VARCHAR DEFAULT 'PKR',

    created_at    TIMESTAMP DEFAULT current_timestamp
);

-- If you already ran an earlier version of this schema, add the new columns with:
--   ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR DEFAULT 'Physionnisa';
--   ALTER TABLE products ADD COLUMN IF NOT EXISTS gtin VARCHAR;
--   ALTER TABLE products ADD COLUMN IF NOT EXISTS mpn VARCHAR;
--   ALTER TABLE products ADD COLUMN IF NOT EXISTS condition_gs VARCHAR DEFAULT 'new';
--   ALTER TABLE products ADD COLUMN IF NOT EXISTS availability_gs VARCHAR DEFAULT 'in stock';
--   ALTER TABLE products ADD COLUMN IF NOT EXISTS google_product_category VARCHAR;
--   ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type VARCHAR;
--   ALTER TABLE products ADD COLUMN IF NOT EXISTS identifier_exists BOOLEAN DEFAULT TRUE;
--   ALTER TABLE products ADD COLUMN IF NOT EXISTS currency VARCHAR DEFAULT 'PKR';

CREATE TABLE IF NOT EXISTS blog_posts (
    id            VARCHAR PRIMARY KEY,
    slug          VARCHAR UNIQUE NOT NULL,
    title         VARCHAR NOT NULL,
    category      VARCHAR NOT NULL,      -- Clinical | Women's Health | Pregnancy
    excerpt       VARCHAR,
    body          VARCHAR,
    cover_image   VARCHAR,
    author        VARCHAR,
    published_at  DATE,
    created_at    TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS bookings (
    id             VARCHAR PRIMARY KEY,          -- generated app-side (uuid)
    full_name      VARCHAR NOT NULL,
    email          VARCHAR NOT NULL,
    service_type   VARCHAR NOT NULL,
    service_price_pkr DECIMAL(10, 2),
    preferred_date DATE,
    reason         VARCHAR,
    status         VARCHAR DEFAULT 'requested',  -- requested | confirmed | cancelled | completed
    source         VARCHAR DEFAULT 'website',
    created_at     TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS orders (
    id                VARCHAR PRIMARY KEY,          -- generated app-side (uuid)
    booking_id        VARCHAR,                      -- optional link to a booking checked out together
    full_name         VARCHAR,
    email             VARCHAR,
    phone             VARCHAR,
    shipping_address  VARCHAR,
    subtotal_pkr      DECIMAL(10, 2) NOT NULL,
    tax_pkr           DECIMAL(10, 2) NOT NULL,
    total_pkr         DECIMAL(10, 2) NOT NULL,
    status            VARCHAR DEFAULT 'paid',
    created_at        TIMESTAMP DEFAULT current_timestamp
);

-- If you already ran an earlier version of this schema, add the new columns with:
--   ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone VARCHAR;
--   ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address VARCHAR;

CREATE TABLE IF NOT EXISTS order_items (
    id             VARCHAR PRIMARY KEY,          -- generated app-side (uuid)
    order_id       VARCHAR NOT NULL,
    product_id     VARCHAR NOT NULL,
    product_name   VARCHAR NOT NULL,
    unit_price_pkr DECIMAL(10, 2) NOT NULL,
    quantity       INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id             VARCHAR PRIMARY KEY,          -- generated app-side (uuid)
    full_name      VARCHAR NOT NULL,
    email          VARCHAR NOT NULL,
    phone          VARCHAR,
    subject        VARCHAR,
    message        VARCHAR,
    created_at     TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id             VARCHAR PRIMARY KEY,          -- generated app-side (uuid)
    email          VARCHAR UNIQUE NOT NULL,
    created_at     TIMESTAMP DEFAULT current_timestamp
);

-- Optional: a raw event log if you'd rather warehouse dataLayer events in
-- MotherDuck instead of (or in addition to) a dedicated analytics tool.
-- The /api/events route below writes here.
CREATE TABLE IF NOT EXISTS analytics_events (
    id             VARCHAR PRIMARY KEY,
    event          VARCHAR NOT NULL,
    payload        JSON,
    page_path      VARCHAR,
    session_id     VARCHAR,
    created_at     TIMESTAMP DEFAULT current_timestamp
);

-- Seed data -------------------------------------------------------------

INSERT INTO specialists (
  id, slug, name, title, photo_url, photo_alt, bio, years_experience, languages,
  credentials, license_authority, education, specializations, memberships, clinic
)
VALUES ('sp_elena', 'elena-rodriguez', 'Dr. Elena Rodriguez', 'Senior Physiotherapist & Pelvic Health Specialist',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800',
  'Dr. Elena Rodriguez, board-certified physiotherapist, standing in a Physionnisa clinic room',
  'Dr. Elena Rodriguez has pioneered a holistic approach to pelvic health that integrates orthopedic physical therapy with specialized internal health strategies.',
  15, 'English, Spanish, Catalan',
  'DPT, MSc', 'American Board of Physical Therapy Specialties',
  'Doctor of Physical Therapy (DPT), Stanford University School of Medicine, 2005–2008; MSc in Pelvic Floor Rehabilitation, University of Brighton, UK, 2010–2012',
  'Pelvic Health, Post-Natal Recovery, Sports Injury Rehab',
  'International Continence Society (ICS), Section on Women''s Health (APTA), Global Physiotherapy Alliance',
  'Physionnisa Central Clinic')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
  id, slug, name, category, short_desc, long_desc, price_pkr, compare_at_pkr, image_url,
  rating, review_count, badge, brand, gtin, mpn, condition_gs, availability_gs,
  google_product_category, product_type
)
VALUES
 ('pr_pelvic_trainer', 'pelvic-floor-trainer', 'Physionnisa Premium Pelvic Floor Trainer', 'Clinical Equipment',
  'App-connected biofeedback trainer for pelvic floor strength.',
  'An intelligent, medical-grade solution designed for the modern woman. Strengthen, tone, and track your progress with biofeedback technology integrated with our professional guidance.',
  24500, 28000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 4.5, 128,
  'Physiotherapist Recommended', 'Physionnisa', NULL, 'PFT-PREMIUM-01', 'new', 'in stock',
  'Health & Beauty > Health Care > Fitness & Nutrition > Physical Therapy Equipment',
  'Clinical Equipment > Pelvic Health'),
 ('pr_resistance_band', 'pro-resistance-band-set', 'Pro Resistance Band Set', 'Recovery Essentials',
  'Set of 5 premium resistance bands with varied levels.', NULL, 8500, NULL,
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 4.6, 64, NULL,
  'Physionnisa', NULL, 'RB-SET-05', 'new', 'in stock',
  'Sporting Goods > Exercise & Fitness > Exercise Bands',
  'Recovery Essentials > Bands'),
 ('pr_foam_roller', 'high-density-foam-roller', 'High-Density Foam Roller', 'Recovery Essentials',
  'Eco-friendly textured roller for deep tissue massage.', NULL, 9800, NULL,
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', 4.4, 52, NULL,
  'Physionnisa', NULL, 'FR-HD-01', 'new', 'in stock',
  'Sporting Goods > Exercise & Fitness > Massage Tools',
  'Recovery Essentials > Massage')
ON CONFLICT (id) DO NOTHING;

INSERT INTO blog_posts (id, slug, title, category, excerpt, body, cover_image, author, published_at)
VALUES
 ('bp_pelvic_awareness', 'pelvic-health-awareness', 'Pelvic Health Awareness', 'Women''s Health',
  'Breaking the silence on pelvic floor dysfunction. Understand the symptoms, the science of recovery, and how specialized physiotherapy can restore quality of life and confidence.',
  'Full article body goes here.',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200', 'Dr. Elena Rodriguez', DATE '2024-05-20'),
 ('bp_pregnancy_exercise', 'safe-exercise-during-pregnancy', 'Safe Exercise During Pregnancy', 'Pregnancy',
  'Motion is medicine, especially during pregnancy. Learn how to adapt your routine safely through each trimester to support your body''s changes and prepare for a healthy delivery.',
  'Full article body goes here.',
  'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=1200', 'Physionnisa Clinical Team', DATE '2024-05-15')
ON CONFLICT (id) DO NOTHING;
