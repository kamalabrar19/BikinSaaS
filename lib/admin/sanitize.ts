import { normalizeWhatsapp } from "@/lib/contact-target";
import { COLLECTIONS, type CollectionDef, type FieldDef } from "./fields";
import {
  DOC_VERSION,
  emptyDoc,
  mediaKindOf,
  type AdminDoc,
  type ContactSettings,
  type MediaItem,
  type Row,
} from "./types";

/**
 * Everything the browser sends is rebuilt from scratch here, field by field,
 * using the field definitions in ./fields.ts. Unknown keys are dropped rather
 * than stored, strings are length-capped, money is clamped to a sane range and
 * media paths must be a local path or an http(s) URL — so a stray
 * `javascript:` in a cover field can never reach a page.
 *
 * A payload that is not an object at all returns null, which callers treat as
 * "no overrides" rather than "empty site".
 */

const MAX_STRING = 3000;
const MAX_ITEM = 300;
const MAX_LIST = 40;
const MAX_ROWS = 200;
const MAX_ID = 60;
const MAX_SRC = 500;
const MAX_MONEY = 1_000_000_000_000;

function str(value: unknown, max = MAX_STRING): string {
  if (typeof value === "string") return value.slice(0, max);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function num(value: unknown): number {
  const raw = typeof value === "number" ? value : Number(str(value, 24).replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(raw)) return 0;
  return Math.min(Math.max(Math.round(raw), 0), MAX_MONEY);
}

function bool(value: unknown): boolean {
  return value === true || value === "true" || value === 1;
}

function list(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, MAX_LIST)
    .map((one) => str(one, MAX_ITEM).trim())
    .filter((one) => one.length > 0);
}

/** Only a path we serve ourselves, or a real http(s) URL. */
function safeSrc(value: unknown): string {
  const raw = str(value, MAX_SRC).trim();
  if (!raw) return "";
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  return "";
}

/** A website address a visitor can safely open: http(s) only. A bare domain gets https://. */
function webAddress(value: unknown): string {
  const raw = str(value, 300).trim();
  if (!raw) return "";
  const full = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  if (!/^https?:\/\//i.test(full)) return "";
  try {
    return new URL(full).toString();
  } catch {
    return "";
  }
}

function safeId(value: unknown, fallback: string): string {
  const raw = str(value, MAX_ID).trim().toLowerCase();
  const cleaned = raw.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

function mediaItem(value: unknown): MediaItem | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const src = safeSrc(raw.src);
  if (!src) return null;
  const alt = str(raw.alt, 200);
  const caption = str(raw.caption, 200);
  return { src, kind: mediaKindOf(src), ...(alt ? { alt } : {}), ...(caption ? { caption } : {}) };
}

function neutralValue(field: FieldDef, raw: Record<string, unknown>): unknown {
  switch (field.kind) {
    case "text":
      return field.url ? webAddress(raw[field.key]) : str(raw[field.key], MAX_ITEM);
    case "money":
    case "number":
      return num(raw[field.key]);
    case "select": {
      const value = str(raw[field.key], MAX_ITEM);
      return field.options.some((option) => option.value === value) ? value : field.options[0].value;
    }
    case "toggle":
      return bool(raw[field.key]);
    case "cover":
      return safeSrc(raw[field.key]);
    case "gallery": {
      const value = raw[field.key];
      if (!Array.isArray(value)) return [];
      return value.slice(0, MAX_LIST).map(mediaItem).filter((one): one is MediaItem => one !== null);
    }
    case "textarea":
    case "list":
      return undefined; // never a neutral field
  }
}

function copyValue(field: FieldDef, raw: Record<string, unknown>): unknown {
  switch (field.kind) {
    case "list":
      return list(raw[field.key]);
    default:
      return str(raw[field.key], MAX_STRING);
  }
}

function sanitizeRow(def: CollectionDef, input: unknown, index: number): Row | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;

  const row: Record<string, unknown> = { id: safeId(raw.id, `${def.key}-${index + 1}`) };

  for (const field of def.neutral) {
    if (field.key === "id") continue;
    row[field.key] = neutralValue(field, raw);
  }

  const copyRaw = raw.copy && typeof raw.copy === "object" ? (raw.copy as Record<string, unknown>) : {};
  const copy: Record<string, Record<string, unknown>> = {};
  for (const locale of ["id", "en"] as const) {
    const blockRaw = copyRaw[locale];
    if (!blockRaw || typeof blockRaw !== "object") continue;
    const block = blockRaw as Record<string, unknown>;
    const clean: Record<string, unknown> = {};
    for (const field of def.copy) clean[field.key] = copyValue(field, block);
    copy[locale] = clean;
  }
  row.copy = copy;

  return row as unknown as Row;
}

function sanitizeSettings(input: unknown): ContactSettings {
  const raw = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const whatsapp = normalizeWhatsapp(str(raw.whatsapp, 24)).slice(0, 20);
  return {
    whatsapp,
    email: str(raw.email, 200).trim(),
    address: str(raw.address, 200).trim(),
  };
}

function assignCollection(doc: AdminDoc, def: CollectionDef, rows: Row[]): void {
  // One cast, in one place: the column name comes from the schema, never from
  // user input, so the value always matches the interface it is written into.
  (doc as unknown as Record<string, Row[]>)[def.key] = rows;
}

export function sanitizeDoc(input: unknown): AdminDoc | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const raw = input as Record<string, unknown>;

  const doc = emptyDoc();
  for (const def of COLLECTIONS) {
    const value = raw[def.key];
    const rows = Array.isArray(value) ? value.slice(0, MAX_ROWS) : [];
    assignCollection(
      doc,
      def,
      rows.map((row, index) => sanitizeRow(def, row, index)).filter((row): row is Row => row !== null),
    );
  }

  doc.version = DOC_VERSION;
  doc.settings = sanitizeSettings(raw.settings);
  doc.updatedAt = new Date().toISOString();
  return doc;
}
