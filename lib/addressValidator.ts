/**
 * Format-based validation for address and contact fields.
 *
 * This is NOT a geocoding/address-verification service — it checks shape
 * (required fields present, plausible phone/postal code patterns), not
 * whether the address actually exists or is deliverable. Real address
 * verification would need a service like Google's Address Validation API
 * or Pakistan Post's postal code lookup, which requires its own API key
 * and billing setup. The types below are intentionally structured so that
 * swapping in a real verification call later only touches `validateAddress`.
 */

export type AddressFields = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
};

export type ValidationErrors = Record<string, string>;

// Pakistani mobile: 03XXXXXXXXX or +923XXXXXXXXX. Also loosely allow other
// countries' numbers (7-15 digits) so the clinic can serve non-Pakistani
// patients without hard-blocking them.
const PK_MOBILE = /^(\+92|0)3\d{9}$/;
const GENERIC_PHONE = /^\+?[0-9\s-]{7,17}$/;

// Pakistani postal codes are 5 digits (e.g. 54000 for Lahore).
const PK_POSTAL_CODE = /^\d{5}$/;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address.";
  return null;
}

export function validatePhone(phone: string, country = "Pakistan"): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return "Phone number is required.";
  if (country === "Pakistan" && !PK_MOBILE.test(trimmed.replace(/\s/g, ""))) {
    return "Enter a valid Pakistani mobile number (e.g. 0300 1234567 or +923001234567).";
  }
  if (country !== "Pakistan" && !GENERIC_PHONE.test(trimmed)) {
    return "Enter a valid phone number.";
  }
  return null;
}

export function validatePostalCode(postalCode: string, country = "Pakistan"): string | null {
  const trimmed = postalCode.trim();
  if (!trimmed) return "Postal code is required.";
  if (country === "Pakistan" && !PK_POSTAL_CODE.test(trimmed)) {
    return "Pakistani postal codes are 5 digits (e.g. 54000).";
  }
  return null;
}

export function validateAddress(fields: AddressFields): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!fields.addressLine1.trim()) {
    errors.addressLine1 = "House/building and street are required.";
  }
  if (!fields.city.trim()) {
    errors.city = "City is required.";
  }
  const postalError = validatePostalCode(fields.postalCode, fields.country);
  if (postalError) errors.postalCode = postalError;

  if (!fields.country.trim()) {
    errors.country = "Country is required.";
  }

  return errors;
}

/** Joins structured fields into the single display/db string kept for quick summaries. */
export function formatAddress(fields: AddressFields): string {
  const parts = [
    fields.addressLine1.trim(),
    fields.addressLine2?.trim(),
    fields.city.trim(),
    fields.postalCode.trim(),
    fields.country.trim(),
  ].filter(Boolean);
  return parts.join(", ");
}
