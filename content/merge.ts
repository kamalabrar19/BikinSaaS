import { formatMoney, formatMoneyRange } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import {
  rowList,
  rowText,
  type AddOnRow,
  type AdminDoc,
  type MaintenanceRow,
  type PlanRow,
  type Row,
  type TeamRow,
  type WorkRow,
} from "@/lib/admin/types";
import type { ServiceIcon, PolicyIcon } from "./schema";
import type {
  AddOn,
  Content,
  Faq,
  MaintenancePlan,
  Plan,
  Policy,
  ProcessStep,
  Service,
  TeamMember,
  WorkItem,
} from "./index";

/**
 * Lays the admin document over the content in content/*.ts.
 *
 * The TypeScript files stay the seed: with no data/site.json the site renders
 * exactly what it always did. A collection only replaces the seed once the
 * admin has saved at least one row of it, so a half-written document can never
 * blank a section.
 *
 * Only `import type` is taken from ./index — the merge is a runtime dependency
 * of that module, and a value import back would be a cycle.
 */

function hasRows<T>(rows: T[] | undefined): rows is T[] {
  return Array.isArray(rows) && rows.length > 0;
}

function planFrom(row: PlanRow, locale: Locale): Plan {
  const max = typeof row.priceMax === "number" && row.priceMax > row.price ? row.priceMax : undefined;
  return {
    id: row.id,
    name: rowText(row, locale, "name"),
    tagline: rowText(row, locale, "tagline"),
    features: rowList(row, locale, "features"),
    price: row.price,
    priceMax: max,
    popular: row.popular === true,
    priceLabel: max ? formatMoneyRange(row.price, max, locale) : formatMoney(row.price, locale),
  };
}

function workFrom(row: WorkRow, locale: Locale): WorkItem {
  return {
    id: row.id,
    category: row.category || "company",
    kind: row.kind === "takeover" ? "takeover" : "concept",
    title: rowText(row, locale, "title"),
    client: rowText(row, locale, "client"),
    before: rowText(row, locale, "before"),
    solution: rowText(row, locale, "solution"),
    result: rowText(row, locale, "result"),
    detail: rowText(row, locale, "detail"),
    stack: rowList(row, locale, "stack"),
    cover: row.cover || undefined,
    gallery: hasRows(row.gallery) ? row.gallery : undefined,
    website: link(row.website),
  };
}

function serviceFrom(row: Row & { icon?: unknown }, locale: Locale): Service {
  return {
    id: row.id,
    icon: (row.icon ?? "layers") as ServiceIcon,
    title: rowText(row, locale, "title"),
    summary: rowText(row, locale, "summary"),
    points: rowList(row, locale, "points"),
    detail: rowText(row, locale, "detail"),
    deliverables: rowList(row, locale, "deliverables"),
  };
}

function processFrom(row: Row, locale: Locale): ProcessStep {
  return {
    id: row.id,
    title: rowText(row, locale, "title"),
    subtitle: rowText(row, locale, "subtitle"),
    body: rowText(row, locale, "body"),
    points: rowList(row, locale, "points"),
  };
}

function policyFrom(row: Row & { icon?: unknown }, locale: Locale): Policy {
  return {
    id: row.id,
    icon: (row.icon ?? "shield") as PolicyIcon,
    title: rowText(row, locale, "title"),
    body: rowText(row, locale, "body"),
  };
}

function addOnFrom(row: AddOnRow, locale: Locale): AddOn {
  return {
    id: row.id,
    name: rowText(row, locale, "name"),
    body: rowText(row, locale, "body"),
    price: row.price,
    priceLabel: formatMoney(row.price, locale),
    unit: rowText(row, locale, "unit") || undefined,
    from: row.from === true,
  };
}

function maintenanceFrom(row: MaintenanceRow, locale: Locale): MaintenancePlan {
  return {
    id: row.id,
    name: rowText(row, locale, "name"),
    features: rowList(row, locale, "features"),
    pricePerMonth: row.pricePerMonth,
    priceLabel: formatMoney(row.pricePerMonth, locale),
  };
}

/** A social link is shown only if it is a real http(s) address. */
function link(value: unknown): string | undefined {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim()) ? value.trim() : undefined;
}

function teamFrom(row: TeamRow, locale: Locale): TeamMember {
  return {
    id: row.id,
    name: rowText(row, locale, "name"),
    role: rowText(row, locale, "role"),
    bio: rowText(row, locale, "bio"),
    skills: rowList(row, locale, "skills"),
    photo: row.photo || undefined,
    linkedin: link(row.linkedin),
    instagram: link(row.instagram),
    github: link(row.github),
  };
}

function faqFrom(row: Row, locale: Locale): Faq {
  return {
    id: row.id,
    question: rowText(row, locale, "question"),
    answer: rowText(row, locale, "answer"),
  };
}

export function applyOverrides(base: Content, doc: AdminDoc | null): Content {
  if (!doc) return base;
  const locale = base.locale;
  const next: Content = { ...base };

  if (hasRows(doc.services)) next.services = doc.services.map((row) => serviceFrom(row, locale));
  if (hasRows(doc.process)) next.process = doc.process.map((row) => processFrom(row, locale));
  if (hasRows(doc.policies)) next.policies = doc.policies.map((row) => policyFrom(row, locale));
  if (hasRows(doc.faqs)) next.faqs = doc.faqs.map((row) => faqFrom(row, locale));
  if (hasRows(doc.team)) next.team = doc.team.map((row) => teamFrom(row, locale));
  if (hasRows(doc.categories)) {
    next.workCategories = doc.categories.map((row) => ({
      id: row.id,
      label: rowText(row, locale, "name") || row.id,
    }));
  }
  if (hasRows(doc.work)) next.work = doc.work.map((row) => workFrom(row, locale));

  if (hasRows(doc.websitePlans)) next.websitePlans = doc.websitePlans.map((row) => planFrom(row, locale));
  if (hasRows(doc.webappPlans)) next.webappPlans = doc.webappPlans.map((row) => planFrom(row, locale));
  if (hasRows(doc.addOns)) next.addOns = doc.addOns.map((row) => addOnFrom(row, locale));
  if (hasRows(doc.maintenance)) {
    next.maintenance = doc.maintenance.map((row) => maintenanceFrom(row, locale));
  }

  /* The address line lives on the shared UI copy, which is a module singleton:
     a new object rather than a mutation, or the other locale would see it. */
  if (doc.settings.address) {
    next.ui = { ...base.ui, footer: { ...base.ui.footer, place: doc.settings.address } };
  }

  const prices = next.websitePlans.map((plan) => plan.price).filter((price) => Number.isFinite(price));
  next.entryPrice = prices.length ? formatMoney(Math.min(...prices), locale) : base.entryPrice;

  return next;
}
