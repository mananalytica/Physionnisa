import type { BlogPost, Product, Service, Specialist } from "./types";

export const FALLBACK_SPECIALISTS: Specialist[] = [
  {
    id: "sp_ayesha",
    slug: "ayesha-raza",
    name: "Dr. Ayesha Raza",
    title: "Senior Physiotherapist & Pelvic Health Specialist",
    photo_url:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80",
    photo_alt: "Dr. Ayesha Raza, board-certified physiotherapist, in a Physionnisa clinic room in Lahore",
    bio: "With over 12 years of clinical practice between Lahore and abroad, Dr. Ayesha Raza has built a holistic approach to pelvic health that integrates orthopedic physical therapy with specialized internal health strategies. Her mission at Physionnisa is to make pelvic floor and post-natal care openly discussed and accessible for women across Pakistan.",
    years_experience: 12,
    languages: "Urdu, English, Punjabi",
    credentials: "DPT, MSPT",
    license_number: null,
    license_authority: "Pakistan Physical Therapy Association (PPTA)",
    education:
      "Doctor of Physical Therapy (DPT), University of Lahore, 2010–2014; MS in Pelvic Floor Rehabilitation, Riphah International University, Islamabad, 2015–2017",
    specializations: "Pelvic Health, Post-Natal Recovery, Sports Injury Rehab",
    memberships:
      "Pakistan Physical Therapy Association (PPTA), International Continence Society (ICS), Section on Women's Health (APTA)",
    external_profile_url: null,
    clinic: "Physionnisa Central Clinic, Gulberg III, Lahore",
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
    author: "Dr. Ayesha Raza",
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

export const FALLBACK_SERVICES: Service[] = [
  {
    id: "sv_initial",
    slug: "initial-consultation",
    name: "Initial Consultation & Assessment",
    category: "General",
    short_desc: "Your first visit — a full movement and history assessment plus first treatment.",
    long_desc:
      "A comprehensive 60-minute evaluation where your physiotherapist reviews your medical history, conducts a full movement and postural assessment, and begins your first treatment. You leave with a clear, personalized recovery plan.",
    duration_minutes: 60,
    price_pkr: 34000,
    icon: "🔍",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&q=80",
    benefits:
      "Full clinical history review; Movement and postural assessment; Personalized recovery roadmap; First hands-on treatment included",
    is_featured: true,
    display_order: 1,
  },
  {
    id: "sv_pelvic",
    slug: "pelvic-health-therapy",
    name: "Pelvic Health & Pelvic Floor Therapy",
    category: "Pelvic Health",
    short_desc: "Treatment for incontinence, pelvic pain, and pelvic floor dysfunction.",
    long_desc:
      "Specialized, discreet treatment for pelvic floor dysfunction — including stress incontinence, pelvic organ prolapse, and chronic pelvic pain — using manual therapy, biofeedback, and targeted muscle re-education.",
    duration_minutes: 60,
    price_pkr: 38000,
    icon: "♀",
    image_url: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=1000&q=80",
    benefits:
      "Biofeedback-guided pelvic floor training; Manual therapy for pelvic pain; Bladder and bowel symptom management; Discreet, women-only clinical setting",
    is_featured: true,
    display_order: 2,
  },
  {
    id: "sv_postnatal",
    slug: "post-natal-recovery",
    name: "Post-Natal Recovery Program",
    category: "Post-Natal",
    short_desc: "Structured recovery for Diastasis Recti and post-delivery core restoration.",
    long_desc:
      "A progressive rehabilitation program for the weeks and months after delivery — rebuilding core and pelvic floor strength, closing Diastasis Recti safely, and restoring function for daily life and exercise.",
    duration_minutes: 60,
    price_pkr: 34000,
    icon: "🤰",
    image_url: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1000&q=80",
    benefits:
      "Diastasis Recti assessment and closure plan; Core and pelvic floor restoration; Safe return-to-exercise guidance; C-section scar mobilization available",
    is_featured: true,
    display_order: 3,
  },
  {
    id: "sv_prenatal",
    slug: "prenatal-physiotherapy",
    name: "Prenatal Physiotherapy",
    category: "Pregnancy",
    short_desc: "Pregnancy-safe movement, pain relief, and birth-prep guidance for every trimester.",
    long_desc:
      "Trimester-adapted physiotherapy to manage pregnancy-related back and pelvic pain, maintain safe activity levels, and prepare your body for labor and delivery.",
    duration_minutes: 45,
    price_pkr: 28000,
    icon: "🧘‍♀️",
    image_url: "https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=1000&q=80",
    benefits:
      "Trimester-specific exercise plans; Pregnancy-related back/pelvic pain relief; Birth preparation techniques; Safe for all trimesters with physician clearance",
    is_featured: false,
    display_order: 4,
  },
  {
    id: "sv_sports",
    slug: "sports-injury-rehabilitation",
    name: "Sports Injury Rehabilitation",
    category: "Sports Injury",
    short_desc: "Biomechanical assessment and return-to-sport programs for active women.",
    long_desc:
      "Advanced injury assessment and rehabilitation for female athletes and active women — from ACL prevention and hip mechanics to a structured, sport-specific return-to-play program.",
    duration_minutes: 60,
    price_pkr: 36000,
    icon: "🏃‍♀️",
    image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=80",
    benefits:
      "Biomechanical movement analysis; ACL injury prevention protocols; Sport-specific return-to-play plans; Performance and strength testing",
    is_featured: false,
    display_order: 5,
  },
  {
    id: "sv_pain",
    slug: "chronic-pain-orthopedic",
    name: "Chronic Pain & Orthopedic Rehabilitation",
    category: "Orthopedic",
    short_desc: "Extended sessions for complex, long-standing musculoskeletal pain.",
    long_desc:
      "For complex or long-standing musculoskeletal cases — chronic back pain, joint conditions, or post-surgical rehabilitation — this extended 90-minute session allows time for thorough hands-on treatment and a multi-week care plan.",
    duration_minutes: 90,
    price_pkr: 45000,
    icon: "🦴",
    image_url: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=1000&q=80",
    benefits:
      "Extended 90-minute hands-on sessions; Post-surgical rehabilitation; Multi-week structured care plans; Coordination with referring physicians",
    is_featured: false,
    display_order: 6,
  },
];

/** @deprecated kept only so nothing crashes if referenced from a stale import; use FALLBACK_SERVICES / getServices() instead. */
export const SERVICE_RATES = FALLBACK_SERVICES.map((s) => ({
  id: s.slug,
  name: s.name,
  duration: `${s.duration_minutes} Minutes`,
  detail: s.short_desc || "",
  price_pkr: s.price_pkr,
}));

/** Checkout tax/service-fee rate — shown on both the checkout page and the thank-you summary. */
export const CHECKOUT_TAX_RATE = 0.086;
