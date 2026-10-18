import fs from "node:fs";
import path from "node:path";

import { sanitizeDoc } from "./sanitize";
import { mediaKindOf, type AdminDoc, type MediaKind } from "./types";

/**
 * Where the admin panel keeps things, on disk:
 *
 *   data/site.json              the single content document
 *   data/backups/…              the previous version, before every save
 *   public/media/uploads/…      pictures, GIFs and videos
 *
 * Server-only. Every function is synchronous and tiny: the document is a few
 * tens of kilobytes and the pages that read it already run on the server.
 *
 * Swapping this for a database or object storage means reimplementing these
 * functions and nothing else — the editor and the API routes only speak the
 * AdminDoc shape.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "site.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const KEEP_BACKUPS = 20;

export const UPLOAD_DIR = path.join(process.cwd(), "public", "media", "uploads");
export const UPLOAD_URL_BASE = "/media/uploads";

/** 64 MB. Big enough for a phone video, small enough to not fill a disk. */
export const MAX_UPLOAD_BYTES = 64 * 1024 * 1024;

/** Read the document at most once every 400 ms; a save clears the cache. */
const CACHE_MS = 400;

let cache: { at: number; doc: AdminDoc | null } | null = null;

export function storeFile(): string {
  return STORE_FILE;
}

export function readStore(): AdminDoc | null {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.doc;

  let doc: AdminDoc | null = null;
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    doc = sanitizeDoc(JSON.parse(raw));
  } catch {
    /* No file yet, or it is unreadable: the pages fall back to content/*.ts. */
    doc = null;
  }

  cache = { at: now, doc };
  return doc;
}

function backupExisting(): void {
  if (!fs.existsSync(STORE_FILE)) return;
  try {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(STORE_FILE, path.join(BACKUP_DIR, `site-${stamp}.json`));
    const files = fs
      .readdirSync(BACKUP_DIR)
      .filter((name) => name.endsWith(".json"))
      .sort();
    for (const name of files.slice(0, Math.max(0, files.length - KEEP_BACKUPS))) {
      fs.rmSync(path.join(BACKUP_DIR, name), { force: true });
    }
  } catch {
    /* A failed backup must never block a save. */
  }
}

export function writeStore(input: AdminDoc): AdminDoc {
  const doc = sanitizeDoc(input);
  if (!doc) throw new Error("Dokumen tidak valid.");

  fs.mkdirSync(DATA_DIR, { recursive: true });
  backupExisting();

  const tmp = `${STORE_FILE}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(doc, null, 2)}\n`, "utf8");
  fs.renameSync(tmp, STORE_FILE);

  cache = null;
  return doc;
}

/* ------------------------------------------------------------- uploads --- */

export interface UploadInfo {
  name: string;
  src: string;
  kind: MediaKind;
  size: number;
  modified: string;
}

const SAFE_NAME = /^[a-z0-9][a-z0-9._-]*$/i;

export function uploadNameIsSafe(name: string): boolean {
  return SAFE_NAME.test(name) && !name.includes("..");
}

export function listUploads(): UploadInfo[] {
  try {
    return fs
      .readdirSync(UPLOAD_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile() && uploadNameIsSafe(entry.name))
      .map((entry) => {
        const stat = fs.statSync(path.join(UPLOAD_DIR, entry.name));
        return {
          name: entry.name,
          src: `${UPLOAD_URL_BASE}/${entry.name}`,
          kind: mediaKindOf(entry.name),
          size: stat.size,
          modified: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => b.modified.localeCompare(a.modified));
  } catch {
    return [];
  }
}

export function deleteUpload(name: string): boolean {
  if (!uploadNameIsSafe(name)) return false;
  const file = path.join(UPLOAD_DIR, name);
  if (!fs.existsSync(file)) return false;
  fs.rmSync(file, { force: true });
  return true;
}

export function newUploadPath(originalName: string): { file: string; url: string } {
  const ext = path.extname(originalName).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const base = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "berkas";
  const stamp = Date.now().toString(36);
  const unique = `${base}-${stamp}${ext}`;

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  return { file: path.join(UPLOAD_DIR, unique), url: `${UPLOAD_URL_BASE}/${unique}` };
}

/** Extensions the upload route accepts, mapped to what the browser will render. */
export const ALLOWED_IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
export const ALLOWED_VIDEO_EXT = [".mp4", ".webm", ".mov", ".m4v", ".ogv"];
