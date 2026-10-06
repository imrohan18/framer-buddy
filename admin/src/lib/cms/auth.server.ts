import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import {
  deleteCookie,
  getCookies,
  getRequestHeader,
  getRequestIP,
  setCookie,
} from "@tanstack/react-start/server";

import { getDb, newId, nowIso } from "./db.server";

type AdminSession = {
  sessionId: string;
  email: string;
  expiresAt: string;
};

const SESSION_COOKIE_NAME = "cyrux_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const MAX_LOGIN_ATTEMPTS = 8;
const LOGIN_WINDOW_MS = 1000 * 60 * 15;

const failedLogins = new Map<string, Array<number>>();

let credentialsCache: { email: string; passwordHash: string } | null = null;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function getAdminCredentials() {
  if (credentialsCache) return credentialsCache;

  const envEmail = process.env.CYRUX_ADMIN_EMAIL?.trim().toLowerCase();
  const envHash = process.env.CYRUX_ADMIN_PASSWORD_HASH?.trim();

  if (envEmail && envHash) {
    credentialsCache = { email: envEmail, passwordHash: envHash };
    return credentialsCache;
  }

  if (process.env.NODE_ENV !== "production") {
    const devEmail = envEmail || "admin@cyrux.local";
    const devPassword = process.env.CYRUX_ADMIN_PASSWORD || "ChangeMe123!";
    credentialsCache = { email: devEmail, passwordHash: hashPassword(devPassword) };
    return credentialsCache;
  }

  throw new Error(
    "Admin credentials are not configured. Set CYRUX_ADMIN_EMAIL and CYRUX_ADMIN_PASSWORD_HASH.",
  );
}

function verifyPassword(password: string, storedHash: string) {
  const [algo, salt, expectedHex] = storedHash.split(":");
  if (algo !== "scrypt" || !salt || !expectedHex) return false;

  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  if (actual.byteLength !== expected.byteLength) return false;
  return timingSafeEqual(actual, expected);
}

function sessionTokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getLoginKey() {
  const ip = getRequestIP({ xForwardedFor: true }) || "unknown";
  return ip;
}

function assertNotRateLimited() {
  const key = getLoginKey();
  const now = Date.now();
  const events = failedLogins.get(key) ?? [];
  const recent = events.filter((stamp) => now - stamp < LOGIN_WINDOW_MS);
  failedLogins.set(key, recent);
  if (recent.length >= MAX_LOGIN_ATTEMPTS) {
    throw new Error("Too many login attempts. Please try again in a few minutes.");
  }
}

function recordFailedLogin() {
  const key = getLoginKey();
  const now = Date.now();
  const events = failedLogins.get(key) ?? [];
  events.push(now);
  failedLogins.set(key, events);
}

function clearFailedLogins() {
  failedLogins.delete(getLoginKey());
}

export function purgeExpiredSessions() {
  const db = getDb();
  db.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").run(nowIso());
}

export async function loginAdmin(email: string, password: string) {
  assertNotRateLimited();

  const credentials = getAdminCredentials();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordMatches = verifyPassword(password, credentials.passwordHash);

  if (normalizedEmail !== credentials.email || !passwordMatches) {
    recordFailedLogin();
    throw new Error("Invalid email or password.");
  }

  clearFailedLogins();
  return createSession(credentials.email);
}

function createSession(email: string) {
  const db = getDb();
  purgeExpiredSessions();

  const sessionToken = randomBytes(40).toString("base64url");
  const tokenHash = sessionTokenHash(sessionToken);
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  const userAgent = getRequestHeader("user-agent");
  const ip = getRequestIP({ xForwardedFor: true }) || null;

  db.prepare(
    `INSERT INTO admin_sessions (id, token_hash, email, ip, user_agent, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(newId(), tokenHash, email, ip, userAgent ?? null, createdAt, expiresAt);

  setCookie(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return { ok: true };
}

export function getCurrentAdminSession(): AdminSession | null {
  purgeExpiredSessions();

  const token = getCookies()[SESSION_COOKIE_NAME];
  if (!token) return null;

  const db = getDb();
  const tokenHash = sessionTokenHash(token);
  const row = db
    .prepare(
      `SELECT id, email, expires_at
       FROM admin_sessions
       WHERE token_hash = ?`,
    )
    .get(tokenHash) as { id: string; email: string; expires_at: string } | undefined;

  if (!row) {
    deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
    return null;
  }

  if (new Date(row.expires_at).getTime() <= Date.now()) {
    db.prepare("DELETE FROM admin_sessions WHERE id = ?").run(row.id);
    deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
    return null;
  }

  return {
    sessionId: row.id,
    email: row.email,
    expiresAt: row.expires_at,
  };
}

export function requireAdminSession() {
  const session = getCurrentAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function logoutAdmin() {
  const token = getCookies()[SESSION_COOKIE_NAME];
  if (token) {
    const db = getDb();
    db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(sessionTokenHash(token));
  }

  deleteCookie(SESSION_COOKIE_NAME, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { ok: true };
}
