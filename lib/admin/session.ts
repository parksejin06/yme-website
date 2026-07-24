const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is not set. Add it to .env.local before using /admin."
    );
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer): string {
  const buf = new Uint8Array(bytes);
  let binary = "";
  for (const b of buf) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(sig);
}

// Constant-time-ish comparison: avoids short-circuiting on the first mismatched
// character so response timing doesn't leak how many leading chars matched.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const sig = await hmac(payload, getSecret());
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(payload, getSecret());
  if (!safeEqual(sig, expected)) return false;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  return true;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}
