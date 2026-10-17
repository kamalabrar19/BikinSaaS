/**
 * Language-neutral catalog: ids, numeric prices, icon keys, categories and
 * order. Nothing here is translated, so a price exists exactly once and can
 * never drift between the two locales.
 *
 * Every translatable string that belongs to these records lives in
 * content/copy.<locale>.ts, keyed by the same id. The id unions in
 * content/schema.ts are derived from this file, so a missing translation is a
 * compile error rather than a silently Indonesian page.
 */

/** Anchor ids. Deliberately English so /id and /en share the same anchors. */
export const SECTION_IDS = [
  "services",
  "pricing",
  "process",
  "work",
  "ssb",
  "faq",
  "contact",
] as const;

/** The nav shows a subset: the house style allows three to five plain links. */
export const NAV_SECTIONS = ["services", "pricing", "work", "contact"] as const;

export const SERVICES = [
  { id: "branding-web-design", icon: "palette" },
  { id: "landing-page", icon: "rocket" },
  { id: "custom-system", icon: "layers" },
  { id: "saas-mvp", icon: "saas" },
  { id: "ai-wa-automation", icon: "bot" },
] as const;

/**
 * Process steps carry no printed number. The sequence is already clear from
 * the reading order, and the study found index numbering to be costume.
 */
export const PROCESS_STEPS = ["discovery", "strategy", "build", "launch"] as const;

export const WEBSITE_PLANS = [
  { id: "lp-starter", price: 399_000 },
  { id: "lp-business", price: 699_000 },
  { id: "cp-basic", price: 999_000 },
  { id: "cp-plus", price: 1_499_000, popular: true },
  { id: "catalog", price: 1_499_000 },
  { id: "store", price: 2_499_000 },
] as const;

export const WEBAPP_PLANS = [
  { id: "dash-basic", price: 1_499_000 },
  { id: "biz-app", price: 2_499_000, popular: true },
  { id: "saas-mvp-plan", price: 3_499_000, priceMax: 4_900_000 },
] as const;

export const ADD_ONS = [
  { id: "extra-page", price: 100_000, metered: true },
  { id: "design-custom", price: 400_000 },
  { id: "seo", price: 250_000 },
  { id: "multi-lang", price: 300_000 },
  { id: "cms", price: 600_000 },
  { id: "api", price: 500_000, from: true },
  { id: "payment", price: 750_000, from: true },
  { id: "wa-auto", price: 600_000, from: true },
] as const;

export const MAINTENANCE_PLANS = [
  { id: "mt-basic", pricePerMonth: 150_000 },
  { id: "mt-standard", pricePerMonth: 350_000 },
  { id: "mt-pro", pricePerMonth: 750_000 },
] as const;

export const POLICIES = [
  { id: "dp", icon: "wallet" },
  { id: "warranty", icon: "shield" },
  { id: "revision", icon: "refresh" },
  { id: "exclusion", icon: "server" },
] as const;

export const WORK_CATEGORIES = ["takeover", "company", "saas", "ssb"] as const;

/**
 * `kind` separates a real client engagement from a demo concept. Every record
 * below is currently "concept" except the two takeovers, and the section says
 * so in a plain sentence rather than a badge.
 */
export const WORK = [
  { id: "takeover-inventori", category: "takeover", kind: "takeover" },
  { id: "takeover-toko", category: "takeover", kind: "takeover" },
  { id: "cp-kontraktor", category: "company", kind: "concept" },
  { id: "cp-klinik", category: "company", kind: "concept" },
  { id: "saas-broadcast", category: "saas", kind: "concept" },
  { id: "saas-absensi", category: "saas", kind: "concept" },
  { id: "ssb-pendaftaran", category: "ssb", kind: "concept" },
] as const;

export const SSB_FEATURES = ["profil", "ku", "jadwal", "daftar"] as const;

export const FAQS = [
  "domain-hosting",
  "duration",
  "revision",
  "warranty",
  "maintenance",
  "takeover",
  "payment",
] as const;

export const CONTACT_SERVICES = [
  "landing-page",
  "company-profile",
  "catalog-store",
  "web-app",
  "saas-mvp",
  "custom-system",
  "wa-automation",
  "ssb-site",
  "takeover",
] as const;

export const BUDGET_BRACKETS = ["under-1m", "1-2_5m", "2_5-5m", "over-5m", "unsure"] as const;

/**
 * The footer year is a constant, not `new Date().getFullYear()`. Under static
 * generation that call freezes to the build year, and a client re-render on
 * 1 January would mismatch what the server sent.
 */
export const LAUNCH_YEAR = 2026;
