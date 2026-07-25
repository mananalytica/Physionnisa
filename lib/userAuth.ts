export const SESSION_COOKIE = "physionnisa_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type SessionRole = "patient" | "specialist";

function getSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SESSION_SECRET must be set to use accounts/login (see .env.example)."
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

/** Creates a signed, stateless session token encoding userId + role + issuedAt. */
export async function createSessionToken(userId: string, role: SessionRole): Promise<string> {
  const issuedAt = Date.now().toString();
  const payload = `${userId}:${role}:${issuedAt}`;
  const signature = await hmac(payload);
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<{ userId: string; role: SessionRole } | null> {
  if (!token) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  let payload: string;
  try {
    payload = Buffer.from(encodedPayload, "base64url").toString("utf-8");
  } catch {
    return null;
  }

  const [userId, role, issuedAt] = payload.split(":");
  if (!userId || !role || !issuedAt) return null;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs)) return null;
  if (Date.now() - issuedAtMs > SESSION_MAX_AGE_MS) return null;

  try {
    const expected = await hmac(payload);
    if (!timingSafeEqual(expected, signature)) return null;
  } catch {
    return null;
  }

  return { userId, role: role as SessionRole };
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
