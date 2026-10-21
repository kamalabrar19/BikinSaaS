import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Privacy-first visit counting, with no third-party script and no cookie.
 *
 * A visitor is a short hash of IP + browser + the date + a secret. The salt
 * changes every day, so the same person cannot be followed from one day to the
 * next, and the IP itself is never written down. "Visitors" in a range is the
 * sum of each day's distinct visitors.
 *
 * Everything lands in data/analytics.json, one bucket per day. Like the admin
 * document, that file is runtime data (it is git-ignored) and needs a host with
 * a writable disk.
 */

export type Channel = "whatsapp" | "email" | "phone" | "form";

export const CHANNELS: Channel[] = ["whatsapp", "email", "phone", "form"];

interface Day {
  views: number;
  visitors: string[];
  contactVisitors: string[];
  pages: Record<string, number>;
  refs: Record<string, number>;
  devices: Record<string, number>;
  langs: Record<string, number>;
  contacts: Record<string, number>;
}

interface Data {
  days: Record<string, Day>;
}

const FILE = path.join(process.cwd(), "data", "analytics.json");
const KEEP_DAYS = 400;
/** A bucket never grows past this many distinct keys, so junk cannot bloat it. */
const MAX_KEYS = 150;

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|monitor|curl|wget|python|axios|node-fetch/i;

/* -------------------------------------------------------------- storage -- */

function emptyDay(): Day {
  return {
    views: 0,
    visitors: [],
    contactVisitors: [],
    pages: {},
    refs: {},
    devices: {},
    langs: {},
    contacts: {},
  };
}

function load(): Data {
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8")) as Data;
    if (parsed && typeof parsed.days === "object") return parsed;
  } catch {
    /* no file yet, or unreadable: start fresh */
  }
  return { days: {} };
}

function save(data: Data): void {
  const keep = Object.keys(data.days).sort().slice(-KEEP_DAYS);
  const days: Record<string, Day> = {};
  for (const key of keep) days[key] = data.days[key];

  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify({ days }));
  fs.renameSync(tmp, FILE);
}

/* ----------------------------------------------------------- date helpers - */

/** Days roll over at midnight Jakarta time, whatever the server's own zone. */
const ZONE = "Asia/Jakarta";

export function dayKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONE }).format(date);
}

function shiftDay(key: string, by: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + by)).toISOString().slice(0, 10);
}

/* ------------------------------------------------------------ recording -- */

const bump = (bucket: Record<string, number>, key: string, by = 1) => {
  if (key in bucket || Object.keys(bucket).length < MAX_KEYS) bucket[key] = (bucket[key] ?? 0) + by;
};

function visitorId(ip: string, ua: string, day: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "bikinsaas";
  return createHash("sha256").update(`${secret}|${day}|${ip}|${ua}`).digest("hex").slice(0, 12);
}

function deviceOf(ua: string): "mobile" | "tablet" | "desktop" {
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

/** Keeps only the host of a referrer, and drops the site's own. */
function refHost(referrer: string, ownHost: string): string {
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host && host !== ownHost.replace(/^www\./, "").split(":")[0] ? host : "";
  } catch {
    return "";
  }
}

export interface Hit {
  ip: string;
  ua: string;
  host: string;
}

/** "/id/pricing" -> { lang: "id", path: "/pricing" }. Null when not a public page. */
export function parsePath(raw: unknown): { lang: "id" | "en"; path: string } | null {
  if (typeof raw !== "string" || raw.length > 120 || !raw.startsWith("/")) return null;
  const clean = raw.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const match = /^\/(id|en)(\/.*)?$/.exec(clean);
  if (!match) return null;
  return { lang: match[1] as "id" | "en", path: match[2] || "/" };
}

export function recordView(hit: Hit, rawPath: unknown, referrer: unknown): void {
  if (!hit.ua || BOT.test(hit.ua)) return;
  const page = parsePath(rawPath);
  if (!page) return;

  const data = load();
  const key = dayKey();
  const day = (data.days[key] ??= emptyDay());
  const id = visitorId(hit.ip, hit.ua, key);

  day.views += 1;
  if (!day.visitors.includes(id)) {
    day.visitors.push(id);
    bump(day.devices, deviceOf(hit.ua));
    bump(day.langs, page.lang);
    bump(day.refs, (typeof referrer === "string" && refHost(referrer, hit.host)) || "");
  }
  bump(day.pages, page.path);
  save(data);
}

export function recordContact(hit: Hit, channel: unknown): void {
  if (!hit.ua || BOT.test(hit.ua)) return;
  if (!CHANNELS.includes(channel as Channel)) return;

  const data = load();
  const key = dayKey();
  const day = (data.days[key] ??= emptyDay());
  const id = visitorId(hit.ip, hit.ua, key);

  bump(day.contacts, channel as string);
  if (!day.contactVisitors.includes(id)) day.contactVisitors.push(id);
  save(data);
}

/* -------------------------------------------------------------- reading -- */

export type RangeDays = 7 | 30 | 90;
export const RANGES: RangeDays[] = [7, 30, 90];

export interface Point {
  date: string;
  visitors: number;
  views: number;
  contacts: number;
}

interface Totals {
  visitors: number;
  views: number;
  contacts: number;
  /** Distinct people who reached out, as a share of visitors. */
  contactRate: number;
}

export interface Ranked {
  key: string;
  count: number;
}

export interface Stats {
  days: RangeDays;
  series: Point[];
  totals: Totals;
  previous: Totals;
  today: { visitors: number; views: number; contacts: number };
  channels: Ranked[];
  pages: Ranked[];
  refs: Ranked[];
  devices: Ranked[];
  langs: Ranked[];
  empty: boolean;
}

const sum = (record: Record<string, number>) => Object.values(record).reduce((a, b) => a + b, 0);

function totalsOf(days: Day[]): Totals {
  const visitors = days.reduce((n, day) => n + day.visitors.length, 0);
  const views = days.reduce((n, day) => n + day.views, 0);
  const contacts = days.reduce((n, day) => n + sum(day.contacts), 0);
  const contactPeople = days.reduce((n, day) => n + day.contactVisitors.length, 0);
  return {
    visitors,
    views,
    contacts,
    contactRate: visitors ? (contactPeople / visitors) * 100 : 0,
  };
}

function merge(days: Day[], pick: (day: Day) => Record<string, number>): Ranked[] {
  const total: Record<string, number> = {};
  for (const day of days) for (const [key, count] of Object.entries(pick(day))) total[key] = (total[key] ?? 0) + count;
  return Object.entries(total)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export function getStats(days: RangeDays): Stats {
  const data = load();
  const today = dayKey();
  const keys = Array.from({ length: days }, (_, i) => shiftDay(today, i - (days - 1)));
  const before = Array.from({ length: days }, (_, i) => shiftDay(today, i - (days * 2 - 1)));
  const at = (key: string): Day => data.days[key] ?? emptyDay();

  const inRange = keys.map(at);
  const totals = totalsOf(inRange);
  const now = at(today);

  return {
    days,
    series: keys.map((date, i) => ({
      date,
      visitors: inRange[i].visitors.length,
      views: inRange[i].views,
      contacts: sum(inRange[i].contacts),
    })),
    totals,
    previous: totalsOf(before.map(at)),
    today: { visitors: now.visitors.length, views: now.views, contacts: sum(now.contacts) },
    channels: CHANNELS.map((key) => ({
      key,
      count: inRange.reduce((n, day) => n + (day.contacts[key] ?? 0), 0),
    })),
    pages: merge(inRange, (day) => day.pages),
    refs: merge(inRange, (day) => day.refs),
    devices: merge(inRange, (day) => day.devices),
    langs: merge(inRange, (day) => day.langs),
    empty: totals.views === 0 && totals.contacts === 0,
  };
}
