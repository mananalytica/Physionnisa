export const ADMIN_COOKIE = "physionnisa_admin_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD (and ideally ADMIN_SESSION_SECRET) must be set to use the admin panel."
    );
  }
  return secret;
}

async function hmac(message: string): Promise<string> {
  const secret = getSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Creates a signed, stateless session token (no server-side session store needed). */
export async function createAdminSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString();
  const signature = await hmac(`physionnisa-admin:${issuedAt}`);
  return `${issuedAt}.${signature}`;
}

/** Verifies a session token's signature and expiry. */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs)) return false;
  if (Date.now() - issuedAtMs > SESSION_MAX_AGE_MS) return false;

  try {
    const expected = await hmac(`physionnisa-admin:${issuedAt}`);
    return timingSafeEqual(expected, signature);
  } catch {
    return false;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
