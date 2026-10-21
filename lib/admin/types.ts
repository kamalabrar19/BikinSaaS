import type { Locale } from "@/lib/locale";

/**
 * The admin panel writes a single JSON document (data/site.json). It is
 * deliberately plain data: the editor, the API route that validates it and the
 * merge that feeds the public pages all speak this one shape, so there is no
 * translation layer that can drift out of step.
 *
 * Prices and ids are language-neutral — a price exists exactly once. Anything a
 * visitor reads lives under `copy[locale]`. When the English block is empty the
 * Indonesian one is used instead, so an admin who only writes Indonesian still
 * gets a complete English page rather than a half-translated one.
 *
 * Nothing in this file may import a node built-in: the editor runs in the
 * browser and imports these helpers.
 */

export type MediaKind = "image" | "video";

export interface MediaItem {
  /** A path under /media/... or an absolute http(s) URL. */
  src: string;
  kind: MediaKind;
  alt?: string;
  caption?: string;
}

export type RowCopy = Partial<Record<Locale, Record<string, unknown>>>;

export interface Row {
  id: string;
  copy: RowCopy;
}

export interface WorkRow extends Row {
  category: string;
  kind: "takeover" | "concept";
  /** Cover image or video for the card. Empty falls back to the drawn motif. */
  cover?: string;
  gallery?: MediaItem[];
}

export interface PlanRow extends Row {
  price: number;
  priceMax?: number;
  popular?: boolean;
}

export interface AddOnRow extends Row {
  price: number;
  from?: boolean;
}

export interface MaintenanceRow extends Row {
  pricePerMonth: number;
}

export interface StatRow extends Row {
  value: number;
  prefix?: string;
}

export interface TeamRow extends Row {
  /** Portrait. Empty falls back to a drawn initial. */
  photo?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
}

export interface IconRow extends Row {
  icon: string;
}

export interface ContactSettings {
  /** International format, digits only, e.g. 628123456789. */
  whatsapp: string;
  email: string;
  address: string;
}

export type CollectionKey =
  | "work"
  | "team"
  | "websitePlans"
  | "webappPlans"
  | "addOns"
  | "maintenance"
  | "stats"
  | "faqs"
  | "services"
  | "process"
  | "policies";

export interface AdminDoc {
  version: number;
  updatedAt: string;
  settings: ContactSettings;
  work: WorkRow[];
  team: TeamRow[];
  websitePlans: PlanRow[];
  webappPlans: PlanRow[];
  addOns: AddOnRow[];
  maintenance: MaintenanceRow[];
  stats: StatRow[];
  faqs: Row[];
  services: IconRow[];
  process: Row[];
  policies: IconRow[];
}

export const DOC_VERSION = 1;

export function emptySettings(): ContactSettings {
  return { whatsapp: "", email: "", address: "" };
}

export function emptyDoc(): AdminDoc {
  return {
    version: DOC_VERSION,
    updatedAt: new Date().toISOString(),
    settings: emptySettings(),
    work: [],
    team: [],
    websitePlans: [],
    webappPlans: [],
    addOns: [],
    maintenance: [],
    stats: [],
    faqs: [],
    services: [],
    process: [],
    policies: [],
  };
}

/* ------------------------------------------------------------- reading --- */

const EMPTY: Record<string, unknown> = {};

/** The copy block for a locale, without the fallback. */
export function copyFor(row: Row, locale: Locale): Record<string, unknown> {
  const block = row.copy?.[locale];
  return block && typeof block === "object" ? block : EMPTY;
}

function readString(row: Row, locale: Locale, key: string): string {
  const value = copyFor(row, locale)[key];
  return typeof value === "string" ? value : "";
}

function readList(row: Row, locale: Locale, key: string): string[] {
  const value = copyFor(row, locale)[key];
  return Array.isArray(value) ? value.filter((one): one is string => typeof one === "string") : [];
}

/**
 * A string for the requested locale, falling back to Indonesian when the
 * English block is empty. Both the merge and the editor use this, so what the
 * editor previews is what the page renders.
 */
export function rowText(row: Row, locale: Locale, key: string): string {
  const own = readString(row, locale, key);
  if (own.trim()) return own;
  return locale === "id" ? "" : readString(row, "id", key);
}

export function rowList(row: Row, locale: Locale, key: string): string[] {
  const own = readList(row, locale, key);
  if (own.length) return own;
  return locale === "id" ? [] : readList(row, "id", key);
}

/** Pulls a neutral (non-translated) string field off a row. */
export function rowField(row: Record<string, unknown>, key: string): string {
  const value = row[key];
  return typeof value === "string" ? value : "";
}

/* A Cloudinary video URL carries /video/upload/ whatever its extension. */
const VIDEO = /(\.(mp4|webm|mov|m4v|ogv|ogg)(\?.*)?$)|\/video\/upload\//i;

export function mediaKindOf(src: string): MediaKind {
  return VIDEO.test(src.trim()) ? "video" : "image";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
