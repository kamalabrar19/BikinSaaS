import type { Locale } from "@/lib/locale";
import { formatMoney, formatMoneyRange } from "@/lib/format";
import * as catalog from "./catalog";
import { copyId } from "./copy.id";
import { copyEn } from "./copy.en";
import type {
  AddOnId,
  Copy,
  FaqId,
  MaintenanceId,
  PlanId,
  PolicyIcon,
  PolicyId,
  ProcessStepId,
  SectionId,
  ServiceIcon,
  ServiceId,
  SsbFeatureId,
  WorkCategory,
  WorkId,
  WorkKind,
} from "./schema";

/**
 * Joins the language-neutral catalog to the copy for one locale and returns
 * view models the components can render directly.
 *
 * This is a pure function with no I/O, so it is safe in a server component and
 * cheap enough to call once per request. Pass slices of the result down to
 * client components rather than the whole object: handing the entire bilingual
 * tree to a client boundary would serialise all of it into the RSC payload.
 */

const COPY: Record<Locale, Copy> = {
  id: copyId,
  en: copyEn,
};

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  features: string[];
  price: number;
  priceMax?: number;
  popular: boolean;
  /** Preformatted for display, so a component never formats money itself. */
  priceLabel: string;
}

export interface AddOn {
  id: AddOnId;
  name: string;
  body: string;
  price: number;
  priceLabel: string;
  unit?: string;
  /** True when the price is a floor rather than the whole cost. */
  from: boolean;
}

export interface MaintenancePlan {
  id: MaintenanceId;
  name: string;
  features: string[];
  pricePerMonth: number;
  priceLabel: string;
}

export interface Service {
  id: ServiceId;
  icon: ServiceIcon;
  title: string;
  summary: string;
  points: string[];
  detail: string;
  deliverables: string[];
}

export interface ProcessStep {
  id: ProcessStepId;
  title: string;
  subtitle: string;
  body: string;
  points: string[];
}

export interface Policy {
  id: PolicyId;
  icon: PolicyIcon;
  title: string;
  body: string;
}

export interface WorkItem {
  id: WorkId;
  category: WorkCategory;
  kind: WorkKind;
  title: string;
  client: string;
  before: string;
  solution: string;
  result: string;
  detail: string;
  stack: string[];
}

export interface SsbFeature {
  id: SsbFeatureId;
  title: string;
  body: string;
}

export interface Faq {
  id: FaqId;
  question: string;
  answer: string;
}

export interface Content {
  locale: Locale;
  ui: Copy["ui"];
  sectionIds: readonly SectionId[];
  nav: { id: SectionId; label: string }[];
  services: Service[];
  process: ProcessStep[];
  websitePlans: Plan[];
  webappPlans: Plan[];
  addOns: AddOn[];
  maintenance: MaintenancePlan[];
  policies: Policy[];
  work: WorkItem[];
  workCategories: readonly WorkCategory[];
  ssbFeatures: SsbFeature[];
  faqs: Faq[];
  launchYear: number;
  /** Cheapest website plan, for the supporting line under the statement. */
  entryPrice: string;
}

export function getContent(locale: Locale): Content {
  const copy = COPY[locale];
  const money = (value: number) => formatMoney(value, locale);

  const plan = (
    entry: { id: string; price: number; priceMax?: number; popular?: boolean },
  ): Plan => {
    const id = entry.id as PlanId;
    const c = copy.plans[id];
    return {
      id,
      name: c.name,
      tagline: c.tagline,
      features: [...c.features],
      price: entry.price,
      priceMax: entry.priceMax,
      popular: entry.popular === true,
      priceLabel:
        entry.priceMax === undefined
          ? money(entry.price)
          : formatMoneyRange(entry.price, entry.priceMax, locale),
    };
  };

  return {
    locale,
    ui: copy.ui,
    sectionIds: catalog.SECTION_IDS,

    nav: catalog.NAV_SECTIONS.map((id) => ({ id, label: copy.ui.nav.sections[id] })),

    services: catalog.SERVICES.map((entry) => ({
      id: entry.id,
      icon: entry.icon,
      ...copy.services[entry.id],
      points: [...copy.services[entry.id].points],
      deliverables: [...copy.services[entry.id].deliverables],
    })),

    process: catalog.PROCESS_STEPS.map((id) => ({
      id,
      ...copy.process[id],
      points: [...copy.process[id].points],
    })),

    websitePlans: catalog.WEBSITE_PLANS.map(plan),
    webappPlans: catalog.WEBAPP_PLANS.map(plan),

    addOns: catalog.ADD_ONS.map((entry) => ({
      id: entry.id,
      price: entry.price,
      priceLabel: money(entry.price),
      from: "from" in entry && entry.from === true,
      ...copy.addOns[entry.id],
    })),

    maintenance: catalog.MAINTENANCE_PLANS.map((entry) => ({
      id: entry.id,
      pricePerMonth: entry.pricePerMonth,
      priceLabel: money(entry.pricePerMonth),
      ...copy.maintenance[entry.id],
      features: [...copy.maintenance[entry.id].features],
    })),

    policies: catalog.POLICIES.map((entry) => ({
      id: entry.id,
      icon: entry.icon,
      ...copy.policies[entry.id],
    })),

    work: catalog.WORK.map((entry) => ({
      id: entry.id,
      category: entry.category,
      kind: entry.kind,
      ...copy.work[entry.id],
      stack: [...copy.work[entry.id].stack],
    })),

    workCategories: catalog.WORK_CATEGORIES,

    ssbFeatures: catalog.SSB_FEATURES.map((id) => ({ id, ...copy.ssbFeatures[id] })),

    faqs: catalog.FAQS.map((id) => ({ id, ...copy.faqs[id] })),

    launchYear: catalog.LAUNCH_YEAR,

    entryPrice: money(
      Math.min(...catalog.WEBSITE_PLANS.map((entry) => entry.price)),
    ),
  };
}
