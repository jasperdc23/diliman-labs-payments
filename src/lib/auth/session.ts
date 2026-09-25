import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Prototype-grade session module.
 *
 * No auth library is installed on purpose — this signs a session cookie by
 * hand with Node's built-in `crypto` (HMAC-SHA256), following the shape of
 * Next.js's own "Stateless Sessions" guide
 * (node_modules/next/dist/docs/01-app/02-guides/authentication.md). It is
 * enough to demonstrate real route protection in this prototype; it is not
 * a production session implementation (no rotation, no revocation list,
 * no database-backed sessions).
 */

const COOKIE_NAME = "session";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * DEV-ONLY FALLBACK SECRET. Set `SESSION_SECRET` in the environment for any
 * shared or deployed environment — this fallback exists only so `next dev`
 * works out of the box, and it is logged loudly on every server start when
 * unset so it can never be mistaken for a real secret.
 */
const DEV_ONLY_FALLBACK_SECRET =
  "dev-only-insecure-session-secret-do-not-use-in-production-eplayment";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.warn(
      "[auth/session] SESSION_SECRET is not set. Falling back to a dev-only " +
        "insecure secret. Set SESSION_SECRET before deploying anywhere real.",
    );
    return DEV_ONLY_FALLBACK_SECRET;
  }
  return secret;
}

type SessionPayload = {
  /** The session subject — the demo user's email. */
  sub: string;
  /** Unix ms expiry. */
  exp: number;
};

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + padding, "base64").toString("utf8");
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

/** Encodes and signs a session payload as `<payload>.<signature>`. */
function encode(payload: SessionPayload): string {
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(body);
  return `${body}.${signature}`;
}

/**
 * Verifies the HMAC signature and decodes the payload. Returns `null` for
 * anything malformed, unsigned by this server, or expired — callers never
 * have to distinguish "tampered" from "expired" from "absent".
 */
function decode(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, signature] = parts;

  const expected = sign(body);
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length) return null;
  if (!timingSafeEqual(expectedBuf, actualBuf)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    if (Date.now() >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Creates a signed session for `subject` (the demo user's email) and sets it as an HttpOnly cookie. 7-day expiry. */
export async function createSession(subject: string): Promise<void> {
  const exp = Date.now() + SEVEN_DAYS_MS;
  const token = encode({ sub: subject, exp });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(exp),
  });
}

/**
 * Reads, verifies and decodes the session cookie. Returns `null` when
 * absent, malformed, tampered with, or expired — never throws, so callers
 * can treat every failure mode the same way (redirect to /login).
 */
export async function verifySession(): Promise<{ subject: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = decode(token);
  if (!payload) return null;

  return { subject: payload.sub };
}

/** Deletes the session cookie, logging the user out. */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
