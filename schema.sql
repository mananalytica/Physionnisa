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
    photo_alt     VARCHAR,        -- descriptive alt text, e.g. "Dr. Ayesha Raza, physiotherapist, in clinic"
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
    user_id       VARCHAR,       -- links this profile to a users row (role = specialist) for portal login
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
    user_id        VARCHAR,                      -- set when the patient was logged in at booking time
    specialist_id  VARCHAR,                      -- optional: which specialist this appointment is with
    full_name      VARCHAR NOT NULL,
    email          VARCHAR NOT NULL,
    phone          VARCHAR,
    address        VARCHAR,
    service_type   VARCHAR NOT NULL,
    service_price_pkr DECIMAL(10, 2),
    preferred_date DATE,
    reason         VARCHAR,
    referral_source VARCHAR,                     -- how they heard about the clinic
    status         VARCHAR DEFAULT 'requested',  -- requested | confirmed | cancelled | completed
    source         VARCHAR DEFAULT 'website',
    created_at     TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS orders (
    id                VARCHAR PRIMARY KEY,          -- generated app-side (uuid)
    booking_id        VARCHAR,                      -- optional link to a booking checked out together
    user_id           VARCHAR,                      -- set when the customer was logged in at checkout
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

-- Note: an optional `analytics_events` table (for warehousing dataLayer
-- events) was intentionally left out of this schema — /api/events degrades
-- gracefully if that table doesn't exist. Add it back yourself if you want
-- to warehouse events in MotherDuck; see lib/dataLayer.ts's trackAndPersist().

CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR PRIMARY KEY,          -- generated app-side (uuid)
    email           VARCHAR UNIQUE NOT NULL,
    password_hash   VARCHAR NOT NULL,              -- scrypt(salt:hash), see lib/password.ts
    full_name       VARCHAR NOT NULL,
    phone           VARCHAR,
    role            VARCHAR NOT NULL DEFAULT 'patient',  -- patient | specialist
    specialist_id   VARCHAR,                       -- set once linked to a specialists row (role = specialist)
    created_at      TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS treatment_notes (
    id                  VARCHAR PRIMARY KEY,       -- generated app-side (uuid)
    booking_id          VARCHAR,                   -- the appointment this note relates to
    patient_user_id     VARCHAR,
    specialist_user_id  VARCHAR,
    note                VARCHAR,                   -- clinical note (visible to both patient & specialist)
    plan                VARCHAR,                   -- plan for next steps / future sessions
    created_at          TIMESTAMP DEFAULT current_timestamp
);

-- If you already ran an earlier version of this schema, add the new columns with:
--   ALTER TABLE specialists ADD COLUMN IF NOT EXISTS user_id VARCHAR;
--   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id VARCHAR;
--   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS specialist_id VARCHAR;
--   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone VARCHAR;
--   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS address VARCHAR;
--   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS referral_source VARCHAR;
--   ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id VARCHAR;
-- (users and treatment_notes are brand new tables — CREATE TABLE IF NOT EXISTS
--  above already handles them, just re-run this whole file.)

-- Seed data -------------------------------------------------------------

INSERT INTO specialists (
  id, slug, name, title, photo_url, photo_alt, bio, years_experience, languages,
  credentials, license_authority, education, specializations, memberships, clinic
)
VALUES ('sp_ayesha', 'ayesha-raza', 'Dr. Ayesha Raza', 'Senior Physiotherapist & Pelvic Health Specialist',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800',
  'Dr. Ayesha Raza, board-certified physiotherapist, in a Physionnisa clinic room in Lahore',
  'With over 12 years of clinical practice between Lahore and abroad, Dr. Ayesha Raza has built a holistic approach to pelvic health that integrates orthopedic physical therapy with specialized internal health strategies. Her mission at Physionnisa is to make pelvic floor and post-natal care openly discussed and accessible for women across Pakistan.',
  12, 'Urdu, English, Punjabi',
  'DPT, MSPT', 'Pakistan Physical Therapy Association (PPTA)',
  'Doctor of Physical Therapy (DPT), University of Lahore, 2010–2014; MS in Pelvic Floor Rehabilitation, Riphah International University, Islamabad, 2015–2017',
  'Pelvic Health, Post-Natal Recovery, Sports Injury Rehab',
  'Pakistan Physical Therapy Association (PPTA), International Continence Society (ICS), Section on Women''s Health (APTA)',
  'Physionnisa Central Clinic, Gulberg III, Lahore')
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
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200', 'Dr. Ayesha Raza', DATE '2024-05-20'),
 ('bp_pregnancy_exercise', 'safe-exercise-during-pregnancy', 'Safe Exercise During Pregnancy', 'Pregnancy',
  'Motion is medicine, especially during pregnancy. Learn how to adapt your routine safely through each trimester to support your body''s changes and prepare for a healthy delivery.',
  'Full article body goes here.',
  'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=1200', 'Physionnisa Clinical Team', DATE '2024-05-15')
ON CONFLICT (id) DO NOTHING;
