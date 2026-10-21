import type { Locale } from "@/lib/locale";
import {
  rowText,
  slugify,
  type AdminDoc,
  type CollectionKey,
  type Row,
} from "./types";

/**
 * The shape of the panel, as data. Adding a collection or a field is a change
 * here — the editor, the validator and the merge all read this, so none of them
 * needs a new component.
 *
 * `neutral` fields are written once and shared by both languages (ids, prices,
 * media). `copy` fields are per language: the editor shows the ones belonging
 * to the language you picked at the top of the page.
 */

export type FieldDef =
  | { kind: "text"; key: string; label: string; hint?: string; placeholder?: string; mono?: boolean }
  | { kind: "textarea"; key: string; label: string; rows?: number; hint?: string; placeholder?: string }
  | { kind: "money"; key: string; label: string; hint?: string }
  | { kind: "number"; key: string; label: string; hint?: string }
  | { kind: "list"; key: string; label: string; hint?: string; placeholder?: string }
  | { kind: "select"; key: string; label: string; hint?: string; options: { value: string; label: string }[] }
  | { kind: "toggle"; key: string; label: string; hint?: string }
  | { kind: "cover"; key: string; label: string; hint?: string }
  | { kind: "gallery"; key: string; label: string; hint?: string };

export interface CollectionDef {
  key: CollectionKey;
  label: string;
  singular: string;
  hint: string;
  neutral: FieldDef[];
  copy: FieldDef[];
  /** The line shown on a collapsed card. */
  titleOf: (row: Row, locale: Locale) => string;
  newRow: () => Row;
}

const WORK_CATEGORY_OPTIONS = [
  { value: "takeover", label: "Takeover — website yang sudah jalan" },
  { value: "company", label: "Company profile" },
  { value: "saas", label: "SaaS / aplikasi web" },
  { value: "ssb", label: "Sekolah sepak bola" },
];

const SERVICE_ICON_OPTIONS = [
  { value: "palette", label: "Palet — desain & branding" },
  { value: "rocket", label: "Roket — landing page" },
  { value: "layers", label: "Lapisan — sistem custom" },
  { value: "saas", label: "SaaS — produk langganan" },
  { value: "bot", label: "Bot — otomatisasi WhatsApp" },
];

const POLICY_ICON_OPTIONS = [
  { value: "wallet", label: "Dompet — pembayaran" },
  { value: "shield", label: "Perisai — garansi" },
  { value: "refresh", label: "Panah — revisi" },
  { value: "server", label: "Server — di luar lingkup" },
];

/** Short random suffix so a new row never collides with an existing one. */
function tmpId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 6)}`;
}

const NAME_HINT = "Judul yang tampil di halaman. Kolom Inggris boleh dikosongkan.";

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "work",
    label: "Portofolio",
    singular: "karya",
    hint: "Urutan di sini menentukan urutan di halaman portofolio. Empat teratas ikut tampil di beranda.",
    neutral: [
      {
        kind: "text",
        key: "id",
        label: "Alamat halaman",
        mono: true,
        hint: "Terisi otomatis. Ubah hanya bila perlu.",
      },
      { kind: "select", key: "category", label: "Kategori", options: WORK_CATEGORY_OPTIONS },
      {
        kind: "select",
        key: "kind",
        label: "Jenis",
        options: [
          { value: "takeover", label: "Proyek klien" },
          { value: "concept", label: "Konsep / demo" },
        ],
      },
      {
        kind: "cover",
        key: "cover",
        label: "Sampul (foto / GIF / video)",
        hint: "Kosongkan bila ingin memakai motif grafis bawaan.",
      },
      { kind: "gallery", key: "gallery", label: "Galeri di halaman detail" },
    ],
    copy: [
      { kind: "text", key: "title", label: "Judul", hint: NAME_HINT },
      { kind: "text", key: "client", label: "Nama klien", hint: "Isi hanya untuk proyek klien nyata." },
      { kind: "textarea", key: "before", label: "Masalah sebelumnya", rows: 3 },
      { kind: "textarea", key: "solution", label: "Yang dikerjakan", rows: 3 },
      { kind: "textarea", key: "result", label: "Hasilnya", rows: 3 },
      { kind: "textarea", key: "detail", label: "Cerita lengkap", rows: 5 },
      { kind: "list", key: "stack", label: "Teknologi / kata kunci", placeholder: "mis. Next.js" },
    ],
    titleOf: (row, locale) => rowText(row, locale, "title") || row.id || "(tanpa judul)",
    newRow: () => ({
      id: tmpId("karya"),
      category: "company",
      kind: "concept",
      copy: { id: {}, en: {} },
    }) as Row,
  },

  {
    key: "websitePlans",
    label: "Paket website",
    singular: "paket",
    hint: "Harga ditulis sekali dan dipakai untuk dua bahasa.",
    neutral: [
      { kind: "text", key: "id", label: "Kode paket", mono: true, hint: "Huruf kecil tanpa spasi, mis. lp-starter." },
      { kind: "money", key: "price", label: "Harga" },
      { kind: "money", key: "priceMax", label: "Harga maksimum", hint: "Kosongkan kalau harganya pasti satu angka." },
      { kind: "toggle", key: "popular", label: "Tandai sebagai paling sering dipilih" },
    ],
    copy: [
      { kind: "text", key: "name", label: "Nama paket", hint: NAME_HINT },
      { kind: "textarea", key: "tagline", label: "Kalimat singkat", rows: 2 },
      { kind: "list", key: "features", label: "Isi paket", placeholder: "mis. 5 halaman" },
    ],
    titleOf: (row, locale) => rowText(row, locale, "name") || row.id || "(tanpa nama)",
    newRow: () => ({ id: tmpId("paket"), price: 0, copy: { id: {}, en: {} } }) as Row,
  },

  {
    key: "webappPlans",
    label: "Paket aplikasi",
    singular: "paket",
    hint: "Tab kedua di halaman harga — sistem, dashboard, dan MVP.",
    neutral: [
      { kind: "text", key: "id", label: "Kode paket", mono: true },
      { kind: "money", key: "price", label: "Harga" },
      { kind: "money", key: "priceMax", label: "Harga maksimum", hint: "Kosongkan kalau harganya pasti satu angka." },
      { kind: "toggle", key: "popular", label: "Tandai sebagai paling sering dipilih" },
    ],
    copy: [
      { kind: "text", key: "name", label: "Nama paket", hint: NAME_HINT },
      { kind: "textarea", key: "tagline", label: "Kalimat singkat", rows: 2 },
      { kind: "list", key: "features", label: "Isi paket" },
    ],
    titleOf: (row, locale) => rowText(row, locale, "name") || row.id || "(tanpa nama)",
    newRow: () => ({ id: tmpId("app"), price: 0, copy: { id: {}, en: {} } }) as Row,
  },

  {
    key: "addOns",
    label: "Tambahan",
    singular: "tambahan",
    hint: "Pekerjaan lepas di luar paket. Bisa dicentang pengunjung.",
    neutral: [
      { kind: "text", key: "id", label: "Kode", mono: true },
      { kind: "money", key: "price", label: "Harga" },
      { kind: "toggle", key: "from", label: "Tulis sebagai harga awal", hint: "Pakai kata “mulai dari” karena harga akhirnya menyesuaikan." },
    ],
    copy: [
      { kind: "text", key: "name", label: "Nama", hint: NAME_HINT },
      { kind: "textarea", key: "body", label: "Penjelasan", rows: 2 },
      { kind: "text", key: "unit", label: "Satuan", placeholder: "/halaman", hint: "Opsional. Muncul setelah harga." },
    ],
    titleOf: (row, locale) => rowText(row, locale, "name") || row.id || "(tanpa nama)",
    newRow: () => ({ id: tmpId("tambahan"), price: 0, copy: { id: {}, en: {} } }) as Row,
  },

  {
    key: "maintenance",
    label: "Perawatan",
    singular: "paket",
    hint: "Biaya bulanan setelah website online.",
    neutral: [
      { kind: "text", key: "id", label: "Kode", mono: true },
      { kind: "number", key: "pricePerMonth", label: "Harga per bulan" },
    ],
    copy: [
      { kind: "text", key: "name", label: "Nama paket", hint: NAME_HINT },
      { kind: "list", key: "features", label: "Isi paket" },
    ],
    titleOf: (row, locale) => rowText(row, locale, "name") || row.id || "(tanpa nama)",
    newRow: () => ({ id: tmpId("rawat"), pricePerMonth: 0, copy: { id: {}, en: {} } }) as Row,
  },

  {
    key: "stats",
    label: "Statistik",
    singular: "angka",
    hint: "Angka yang tampil di beranda. Nilai & awalan untuk dua bahasa; satuan boleh beda (rb / k).",
    neutral: [
      { kind: "number", key: "value", label: "Angka" },
      { kind: "text", key: "prefix", label: "Awalan", placeholder: "Rp" },
    ],
    copy: [
      { kind: "text", key: "suffix", label: "Satuan", placeholder: "rb", hint: "Ditempel langsung setelah angka, tanpa spasi." },
      { kind: "text", key: "label", label: "Keterangan" },
    ],
    titleOf: (row, locale) => rowText(row, locale, "label") || row.id || "(tanpa keterangan)",
    newRow: () => ({ id: tmpId("angka"), value: 0, copy: { id: {}, en: {} } }) as Row,
  },

  {
    key: "faqs",
    label: "FAQ",
    singular: "pertanyaan",
    hint: "Muncul di halaman harga. Pertanyaan pertama terbuka lebih dulu.",
    neutral: [{ kind: "text", key: "id", label: "Kode", mono: true }],
    copy: [
      { kind: "text", key: "question", label: "Pertanyaan", hint: NAME_HINT },
      { kind: "textarea", key: "answer", label: "Jawaban", rows: 4 },
    ],
    titleOf: (row, locale) => rowText(row, locale, "question") || row.id || "(tanpa pertanyaan)",
    newRow: () => ({ id: tmpId("faq"), copy: { id: {}, en: {} } }) as Row,
  },

  {
    key: "services",
    label: "Layanan",
    singular: "layanan",
    hint: "Kartu layanan di beranda.",
    neutral: [
      { kind: "text", key: "id", label: "Kode", mono: true },
      { kind: "select", key: "icon", label: "Ikon", options: SERVICE_ICON_OPTIONS },
    ],
    copy: [
      { kind: "text", key: "title", label: "Judul", hint: NAME_HINT },
      { kind: "textarea", key: "summary", label: "Ringkasan", rows: 2 },
      { kind: "list", key: "points", label: "Poin singkat" },
      { kind: "textarea", key: "detail", label: "Penjelasan panjang", rows: 4 },
      { kind: "list", key: "deliverables", label: "Yang Anda terima" },
    ],
    titleOf: (row, locale) => rowText(row, locale, "title") || row.id || "(tanpa judul)",
    newRow: () => ({ id: tmpId("layanan"), icon: "layers", copy: { id: {}, en: {} } }) as Row,
  },

  {
    key: "process",
    label: "Proses",
    singular: "langkah",
    hint: "Urutan cara kerja. Nomornya mengikuti urutan daftar ini.",
    neutral: [{ kind: "text", key: "id", label: "Kode", mono: true }],
    copy: [
      { kind: "text", key: "title", label: "Judul langkah", hint: NAME_HINT },
      { kind: "text", key: "subtitle", label: "Sub-judul" },
      { kind: "textarea", key: "body", label: "Penjelasan", rows: 3 },
      { kind: "list", key: "points", label: "Rincian" },
    ],
    titleOf: (row, locale) => rowText(row, locale, "title") || row.id || "(tanpa judul)",
    newRow: () => ({ id: tmpId("langkah"), copy: { id: {}, en: {} } }) as Row,
  },

  {
    key: "policies",
    label: "Kebijakan",
    singular: "kebijakan",
    hint: "Ketentuan pembayaran, garansi, dan revisi di halaman harga.",
    neutral: [
      { kind: "text", key: "id", label: "Kode", mono: true },
      { kind: "select", key: "icon", label: "Ikon", options: POLICY_ICON_OPTIONS },
    ],
    copy: [
      { kind: "text", key: "title", label: "Judul", hint: NAME_HINT },
      { kind: "textarea", key: "body", label: "Isi", rows: 3 },
    ],
    titleOf: (row, locale) => rowText(row, locale, "title") || row.id || "(tanpa judul)",
    newRow: () => ({ id: tmpId("kebijakan"), icon: "shield", copy: { id: {}, en: {} } }) as Row,
  },
];

export function collectionDef(key: CollectionKey): CollectionDef {
  const found = COLLECTIONS.find((one) => one.key === key);
  if (!found) throw new Error(`Unknown collection: ${key}`);
  return found;
}

/** Every collection key, in the order the tabs are shown. */
export const COLLECTION_KEYS: CollectionKey[] = COLLECTIONS.map((one) => one.key);

/** Only the keys a collection is allowed to carry, so nothing else is stored. */
export function neutralKeys(def: CollectionDef): string[] {
  return def.neutral.map((field) => field.key);
}

export function copyKeys(def: CollectionDef): string[] {
  return def.copy.map((field) => field.key);
}

/** Suggested slug for a brand new row, based on its title in either language. */
export function suggestId(def: CollectionDef, row: Row): string {
  for (const locale of ["id", "en"] as const) {
    const title = rowText(row, locale, "title") || rowText(row, locale, "name") || rowText(row, locale, "question");
    if (title.trim()) return slugify(title);
  }
  return "";
}

/** The copy field that acts as a row's name, per collection. */
const TITLE_KEY: Record<string, string> = {
  work: "title",
  websitePlans: "name",
  webappPlans: "name",
  addOns: "name",
  maintenance: "name",
  stats: "label",
  faqs: "question",
  services: "title",
  process: "title",
  policies: "title",
};

/** Used by the editor before saving: is a row complete enough to publish? */
export function rowProblems(def: CollectionDef, row: Row): string[] {
  const problems: string[] = [];
  const id = rowFieldId(row);
  if (!id) problems.push("Kode/slug belum diisi.");
  else if (!/^[a-z0-9._-]+$/.test(id)) problems.push("Kode/slug hanya boleh huruf kecil, angka, titik, dan tanda minus.");

  const titleKey = TITLE_KEY[def.key];
  if (titleKey && !rowText(row, "id", titleKey).trim()) {
    problems.push("Teks Indonesia belum diisi.");
  }
  return problems;
}

export function rowFieldId(row: Row): string {
  return typeof row.id === "string" ? row.id.trim() : "";
}

/** Guards against two rows claiming the same slug — the slug is the URL. */
export function duplicateIds(doc: AdminDoc, key: CollectionKey): string[] {
  const rows = (doc[key] ?? []) as Row[];
  const seen = new Map<string, number>();
  for (const row of rows) {
    const id = rowFieldId(row);
    if (!id) continue;
    seen.set(id, (seen.get(id) ?? 0) + 1);
  }
  return [...seen.entries()].filter(([, count]) => count > 1).map(([id]) => id);
}
