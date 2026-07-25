/**
 * Central place for clinic/business details so the address, phone, and
 * hours are consistent everywhere instead of hardcoded in a dozen
 * components. Update this file when the clinic's real details are ready
 * (this is placeholder content for a Lahore-based clinic).
 */
export const SITE = {
  name: "Physionnisa",
  legalName: "Physionnisa Physiotherapy",
  tagline: "Expert physiotherapy tailored for women's health and empowerment.",
  city: "Lahore",
  country: "Pakistan",
  clinic: {
    addressLine1: "12-C, Aibak Block, Gulberg III",
    addressLine2: "Lahore, Punjab 54660, Pakistan",
    area: "Gulberg III",
    phoneDisplay: "+92 42 3571 2345",
    phoneHref: "tel:+924235712345",
    whatsappDisplay: "+92 300 1234567",
    whatsappHref: "https://wa.me/923001234567",
    email: "care@physionnisa.com",
    hoursWeekday: "Mon–Sat: 10:00 AM – 8:00 PM",
    hoursWeekend: "Sunday: Closed",
    mapsQuery: "Gulberg III, Lahore, Pakistan",
  },
  currency: "PKR",
  currencySymbol: "Rs",
  locale: "en-PK",
  timezone: "Asia/Karachi",
};
