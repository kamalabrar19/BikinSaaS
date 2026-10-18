import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

/**
 * One username and one password, from the environment. There is no user table
 * because there is one user.
 *
 *   ADMIN_USERNAME         the login name
 *   ADMIN_PASSWORD_HASH    scrypt$<salt>$<hash>, made by `npm run admin:password`
 *   ADMIN_SESSION_SECRET   signs the session cookie
 *
 * The session is a signed cookie, not a token in a database: it holds the
 * username and an expiry, plus an HMAC over both. Nothing about the password is
 * ever stored in the cookie, and the cookie is httpOnly, so page scripts cannot
 * read it.
 *
 * Server-only. The password is never sent to the browser, and the hash never
 * leaves the server.
 */

const COOKIE_NAME = "bikin_admin";
const SESSION_DAYS = 7;

/** After this many wrong answers from one address, logins pause. */
const MAX_ATTEMPTS = 8;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

function normalize(password: string): string {
  return password.normalize("NFKC");
}

/**
 * The stored value is `scrypt:<salt>:<hash>`, both base64url.
 *
 * A colon rather than the more common `$` separator because dotenv-expand
 * treats `$SECRET` in .env.local as a variable reference: `scrypt$abc$def`
 * arrives as `scrypt`. The `$` form is still read (and unescaped), so a value
 * written for a host that needs escaping keeps working.
 */
function parseHash(stored: string): { salt: Buffer; hash: Buffer } | null {
  const parts = stored.replace(/\\\$/g, "$").split(/[:$]/);
  if (parts.length !== 3 || parts[0].trim() !== "scrypt") return null;
  const salt = Buffer.from(parts[1].trim(), "base64url");
  const hash = Buffer.from(parts[2].trim(), "base64url");
  if (salt.length < 8 || hash.length < 16) return null;
  return { salt, hash };
}

/** Used by the CLI script; also handy in a test. */
export function hashPassword(password: string, salt = randomBytes(16)): string {
  const hash = scryptSync(normalize(password), salt, 64);
  return `scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`;
}

export function adminConfigured(): boolean {
  return Boolean(
    (process.env.ADMIN_USERNAME ?? "").trim() &&
      (process.env.ADMIN_PASSWORD_HASH ?? "").trim() &&
      (process.env.ADMIN_SESSION_SECRET ?? "").trim(),
  );
}

/** What the login page shows when the environment is not set up yet. */
export function missingConfig(): string[] {
  const missing: string[] = [];
  if (!(process.env.ADMIN_USERNAME ?? "").trim()) missing.push("ADMIN_USERNAME");
  if (!(process.env.ADMIN_PASSWORD_HASH ?? "").trim()) missing.push("ADMIN_PASSWORD_HASH");
  if (!(process.env.ADMIN_SESSION_SECRET ?? "").trim()) missing.push("ADMIN_SESSION_SECRET");
  return missing;
}

function equalText(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) {
    /* Still compare, so the timing does not reveal the length. */
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function verifyCredentials(username: string, password: string): boolean {
  const storedUser = (process.env.ADMIN_USERNAME ?? "").trim();
  const storedHash = (process.env.ADMIN_PASSWORD_HASH ?? "").trim();
  if (!storedUser || !storedHash) return false;

  const parsed = parseHash(storedHash);
  if (!parsed) return false;

  const actual = scryptSync(normalize(password), parsed.salt, parsed.hash.length);
  const passwordOk = timingSafeEqual(actual, parsed.hash);
  const userOk = equalText(username.trim(), storedUser);

  /* Both are evaluated before returning, so a wrong username and a wrong
     password take the same time. */
  return passwordOk && userOk;
}

/* ---------------------------------------------------------------- token --- */

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ u: (process.env.ADMIN_USERNAME ?? "").trim(), exp: Date.now() + SESSION_DAYS * 86400_000 }),
    "utf8",
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token || !secret()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  if (expected.length !== signature.length) return false;
  if (!timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(signature, "utf8"))) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { u?: string; exp?: number };
    if (typeof data.exp !== "number" || data.exp < Date.now()) return false;
    return data.u === (process.env.ADMIN_USERNAME ?? "").trim();
  } catch {
    return false;
  }
}

/* --------------------------------------------------------------- request --- */

export function readToken(request: Request): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const index = trimmed.indexOf("=");
    if (index < 0) continue;
    if (trimmed.slice(0, index) === COOKIE_NAME) return decodeURIComponent(trimmed.slice(index + 1));
  }
  return undefined;
}

/** For route handlers. */
export function isAuthed(request: Request): boolean {
  return verifyToken(readToken(request));
}

/** For server components and pages. */
export async function isAuthedPage(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE_NAME)?.value);
}

function httpsOnly(request: Request): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * A `secure` cookie is only stored over https, so marking it secure on a plain
 * http deployment would make the login silently fail. The flag follows the
 * request instead of NODE_ENV.
 */
export function startSession(response: NextResponse, request: Request): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: createToken(),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
    secure: httpsOnly(request),
  });
}

export function endSession(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/* ----------------------------------------------------------- rate limit --- */

interface Attempt {
  count: number;
  windowEnds: number;
}

const attempts = new Map<string, Attempt>();

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "lokal";
}

/** Seconds left in the lockout, or 0 when the address may try again. */
export function lockoutSeconds(ip: string): number {
  const found = attempts.get(ip);
  if (!found) return 0;
  const now = Date.now();
  if (found.windowEnds < now) {
    attempts.delete(ip);
    return 0;
  }
  if (found.count < MAX_ATTEMPTS) return 0;
  return Math.ceil((found.windowEnds - now) / 1000);
}

export function recordFailure(ip: string): void {
  const now = Date.now();
  const found = attempts.get(ip);
  if (!found || found.windowEnds < now) {
    attempts.set(ip, { count: 1, windowEnds: now + ATTEMPT_WINDOW_MS });
    return;
  }
  found.count += 1;
}

export function clearFailures(ip: string): void {
  attempts.delete(ip);
}
