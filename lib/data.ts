import type { BlogPost, Product, Specialist } from "./types";

export const FALLBACK_SPECIALISTS: Specialist[] = [
  {
    id: "sp_elena",
    slug: "elena-rodriguez",
    name: "Dr. Elena Rodriguez",
    title: "Senior Physiotherapist & Pelvic Health Specialist",
    photo_url:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80",
    photo_alt: "Dr. Elena Rodriguez, board-certified physiotherapist, standing in a Physionnisa clinic room",
    bio: "With over 15 years of clinical expertise, Dr. Elena Rodriguez has pioneered a holistic approach to pelvic health that integrates orthopedic physical therapy with specialized internal health strategies. Her mission at Physionnisa is to dismantle the stigma surrounding pelvic floor dysfunction and provide women with the tools they need for lifelong physical confidence.",
    years_experience: 15,
    languages: "English, Spanish, Catalan",
    credentials: "DPT, MSc",
    license_number: null,
    license_authority: "American Board of Physical Therapy Specialties",
    education:
      "Doctor of Physical Therapy (DPT), Stanford University School of Medicine, 2005–2008; MSc in Pelvic Floor Rehabilitation, University of Brighton, UK, 2010–2012",
    specializations: "Pelvic Health, Post-Natal Recovery, Sports Injury Rehab",
    memberships:
      "International Continence Society (ICS), Section on Women's Health (APTA), Global Physiotherapy Alliance",
    external_profile_url: null,
    clinic: "Physionnisa Central Clinic",
  },
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "pr_pelvic_trainer",
    slug: "pelvic-floor-trainer",
    name: "Physionnisa Premium Pelvic Floor Trainer",
    category: "Clinical Equipment",
    short_desc: "App-connected biofeedback trainer for pelvic floor strength.",
    long_desc:
      "An intelligent, medical-grade solution designed for the modern woman. Strengthen, tone, and track your progress with biofeedback technology integrated with our professional guidance.",
    price_pkr: 24500,
    compare_at_pkr: 28000,
    image_url:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
    rating: 4.5,
    review_count: 128,
    badge: "Physiotherapist Recommended",
    in_stock: true,
    brand: "Physionnisa",
    gtin: null,
    mpn: "PFT-PREMIUM-01",
    condition_gs: "new",
    availability_gs: "in stock",
    google_product_category:
      "Health & Beauty > Health Care > Fitness & Nutrition > Physical Therapy Equipment",
    product_type: "Clinical Equipment > Pelvic Health",
    identifier_exists: true,
    currency: "PKR",
  },
  {
    id: "pr_resistance_band",
    slug: "pro-resistance-band-set",
    name: "Pro Resistance Band Set",
    category: "Recovery Essentials",
    short_desc: "Set of 5 premium resistance bands with varied levels.",
    long_desc:
      "Five graduated resistance levels in a durable, non-slip fabric construction. Built for structured rehab programs and progressive home strengthening.",
    price_pkr: 8500,
    compare_at_pkr: null,
    image_url:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
    rating: 4.6,
    review_count: 64,
    badge: null,
    in_stock: true,
    brand: "Physionnisa",
    gtin: null,
    mpn: "RB-SET-05",
    condition_gs: "new",
    availability_gs: "in stock",
    google_product_category: "Sporting Goods > Exercise & Fitness > Exercise Bands",
    product_type: "Recovery Essentials > Bands",
    identifier_exists: true,
    currency: "PKR",
  },
  {
    id: "pr_foam_roller",
    slug: "high-density-foam-roller",
    name: "High-Density Foam Roller",
    category: "Recovery Essentials",
    short_desc: "Eco-friendly textured roller for deep tissue massage.",
    long_desc:
      "A dense, textured foam roller designed to release fascia and speed recovery between sessions. Clinic-grade density, home-friendly size.",
    price_pkr: 9800,
    compare_at_pkr: null,
    image_url:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
    rating: 4.4,
    review_count: 52,
    badge: null,
    in_stock: true,
    brand: "Physionnisa",
    gtin: null,
    mpn: "FR-HD-01",
    condition_gs: "new",
    availability_gs: "in stock",
    google_product_category: "Sporting Goods > Exercise & Fitness > Massage Tools",
    product_type: "Recovery Essentials > Massage",
    identifier_exists: true,
    currency: "PKR",
  },
  {
    id: "pr_heat_pack",
    slug: "microwavable-heat-pack",
    name: "Microwavable Heat Pack",
    category: "Recovery Essentials",
    short_desc: "Lavender-scented wand bag for natural pain relief.",
    long_desc:
      "Reusable, lavender-scented heat therapy for cramping, tension, and post-session soreness. Microwave-safe, freezer-safe for dual therapy.",
    price_pkr: 6900,
    compare_at_pkr: null,
    image_url:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=80",
    rating: 4.7,
    review_count: 41,
    badge: null,
    in_stock: true,
    brand: "Physionnisa",
    gtin: null,
    mpn: "HP-LAV-01",
    condition_gs: "new",
    availability_gs: "in stock",
    google_product_category: "Health & Beauty > Health Care > Hot & Cold Therapy",
    product_type: "Recovery Essentials > Heat Therapy",
    identifier_exists: true,
    currency: "PKR",
  },
  {
    id: "pr_tens_unit",
    slug: "dual-channel-tens-unit",
    name: "Dual Channel TENS Unit",
    category: "Clinical Equipment",
    short_desc: "Professional muscle stimulator for pain management.",
    long_desc:
      "Clinic-grade dual channel TENS/EMS unit with programmable intensity curves, designed under physiotherapist guidance for at-home pain management.",
    price_pkr: 41000,
    compare_at_pkr: null,
    image_url:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80",
    rating: 4.3,
    review_count: 37,
    badge: "Professional",
    in_stock: true,
    brand: "Physionnisa",
    gtin: null,
    mpn: "TENS-DC-01",
    condition_gs: "new",
    availability_gs: "in stock",
    google_product_category: "Health & Beauty > Health Care > Medical Supplies > TENS Units",
    product_type: "Clinical Equipment > Pain Management",
    identifier_exists: true,
    currency: "PKR",
  },
  {
    id: "pr_posture_corrector",
    slug: "posture-corrector-pro",
    name: "Posture Corrector Pro",
    category: "Clinical Equipment",
    short_desc: "Breathable medical-grade brace for thoracic alignment.",
    long_desc:
      "A breathable, adjustable brace engineered to gently retrain thoracic posture during desk work, recovery, and daily movement.",
    price_pkr: 12800,
    compare_at_pkr: null,
    image_url:
      "https://images.unsplash.com/photo-1599447462773-4b04d3c40b9c?w=900&q=80",
    rating: 4.2,
    review_count: 29,
    badge: null,
    in_stock: true,
    brand: "Physionnisa",
    gtin: null,
    mpn: "PC-PRO-01",
    condition_gs: "new",
    availability_gs: "in stock",
    google_product_category: "Health & Beauty > Health Care > Medical Supplies > Braces & Supports",
    product_type: "Clinical Equipment > Posture",
    identifier_exists: true,
    currency: "PKR",
  },
];

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: "bp_industry_news",
    slug: "developments-in-the-physio-world",
    title: "Developments in the Physio World",
    category: "Clinical",
    excerpt:
      "Stay ahead with the latest clinical breakthroughs. From AI-assisted rehabilitation to new protocols in connective tissue recovery, we explore how modern science is redefining physical recovery and wellness for women across all life stages.",
    body: "Full article body goes here.",
    cover_image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&q=80",
    author: "Physionnisa Clinical Team",
    published_at: "2024-05-24",
  },
  {
    id: "bp_pelvic_awareness",
    slug: "pelvic-health-awareness",
    title: "Pelvic Health Awareness",
    category: "Women's Health",
    excerpt:
      "Breaking the silence on pelvic floor dysfunction. Understand the symptoms, the science of recovery, and how specialized physiotherapy can restore quality of life and confidence.",
    body: "Full article body goes here.",
    cover_image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
    author: "Dr. Elena Rodriguez",
    published_at: "2024-05-20",
  },
  {
    id: "bp_pregnancy_exercise",
    slug: "safe-exercise-during-pregnancy",
    title: "Safe Exercise During Pregnancy",
    category: "Pregnancy",
    excerpt:
      "Motion is medicine, especially during pregnancy. Learn how to adapt your routine safely through each trimester to support your body's changes and prepare for a healthy delivery.",
    body: "Full article body goes here.",
    cover_image:
      "https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=1200&q=80",
    author: "Physionnisa Clinical Team",
    published_at: "2024-05-15",
  },
];

export const SERVICE_RATES = [
  {
    id: "initial",
    name: "Initial Consultation",
    duration: "60 Minutes",
    detail: "Assessment + First Treatment",
    price_pkr: 34000,
  },
  {
    id: "follow_up",
    name: "Follow-up Session",
    duration: "45 Minutes",
    detail: "Focused Therapy",
    price_pkr: 24000,
  },
  {
    id: "extended",
    name: "Extended Treatment",
    duration: "90 Minutes",
    detail: "Complex Cases",
    price_pkr: 45000,
  },
];

/** Checkout tax/service-fee rate — shown on both the checkout page and the thank-you summary. */
export const CHECKOUT_TAX_RATE = 0.086;
