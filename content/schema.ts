import type {
  ADD_ONS,
  BUDGET_BRACKETS,
  CONTACT_SERVICES,
  FAQS,
  MAINTENANCE_PLANS,
  POLICIES,
  PROCESS_STEPS,
  SECTION_IDS,
  SERVICES,
  SSB_FEATURES,
  WEBAPP_PLANS,
  WEBSITE_PLANS,
  WORK,
  WORK_CATEGORIES,
} from "./catalog";

/* ---------------------------------------------------------------- ids ---- */
/* Every union is derived from the catalog, never typed out by hand, so the
   two can never fall out of step. */

type IdOf<T extends readonly { id: string }[]> = T[number]["id"];

export type SectionId = (typeof SECTION_IDS)[number];
export type ServiceId = IdOf<typeof SERVICES>;
export type ProcessStepId = (typeof PROCESS_STEPS)[number];
export type WebsitePlanId = IdOf<typeof WEBSITE_PLANS>;
export type WebappPlanId = IdOf<typeof WEBAPP_PLANS>;
export type PlanId = WebsitePlanId | WebappPlanId;
export type AddOnId = IdOf<typeof ADD_ONS>;
export type MaintenanceId = IdOf<typeof MAINTENANCE_PLANS>;
export type PolicyId = IdOf<typeof POLICIES>;
export type WorkId = IdOf<typeof WORK>;
export type WorkCategory = (typeof WORK_CATEGORIES)[number];
export type WorkKind = "takeover" | "concept";
export type SsbFeatureId = (typeof SSB_FEATURES)[number];
export type FaqId = (typeof FAQS)[number];
export type ContactServiceId = (typeof CONTACT_SERVICES)[number];
export type BudgetBracketId = (typeof BUDGET_BRACKETS)[number];

export type ServiceIcon = (typeof SERVICES)[number]["icon"];
export type PolicyIcon = (typeof POLICIES)[number]["icon"];

/* -------------------------------------------------------------- pieces --- */

export interface ServiceCopy {
  title: string;
  summary: string;
  points: string[];
  detail: string;
  deliverables: string[];
}

export interface ProcessStepCopy {
  title: string;
  subtitle: string;
  body: string;
  points: string[];
}

export interface PlanCopy {
  name: string;
  tagline: string;
  features: string[];
}

export interface AddOnCopy {
  name: string;
  body: string;
  /** Unit suffix for a metered add-on, e.g. "/halaman". */
  unit?: string;
}

export interface MaintenanceCopy {
  name: string;
  features: string[];
}

export interface PolicyCopy {
  title: string;
  body: string;
}

export interface WorkCopy {
  title: string;
  client: string;
  before: string;
  solution: string;
  result: string;
  detail: string;
  stack: string[];
}

export interface SsbFeatureCopy {
  title: string;
  body: string;
}

export interface FaqCopy {
  question: string;
  answer: string;
}

/* ------------------------------------------------------------------ ui --- */
/* These strings used to live only inside JSX, which is why none of them had
   an English version. They are named and grouped here so a missing one is a
   type error. */

export interface UiCopy {
  brand: { tagline: string; responseTime: string };

  nav: {
    sections: Record<SectionId, string>;
    action: string;
    openMenu: string;
    closeMenu: string;
    langLabel: string;
    skipToContent: string;
  };

  hero: {
    /** Five words or fewer: it must hold to two lines at 390px. */
    statement: string;
    support: string;
    action: string;
    secondaryAction: string;
  };

  sections: Record<SectionId, { title: string; lead?: string }>;

  services: { whatYouGet: string; seeDetail: string; toPricing: string; toContact: string };

  pricing: {
    websiteTab: string;
    webappTab: string;
    addOnsTab: string;
    policyTab: string;
    addOnsTitle: string;
    addOnsLead: string;
    maintenanceTitle: string;
    maintenanceLead: string;
    from: string;
    upTo: string;
    perMonth: string;
    popular: string;
    pick: string;
    /** Template with a {count} placeholder: a function cannot cross
       the server-to-client boundary. */
    chosen: string;
    orderAddOns: string;
    estimateTotal: string;
    clearChoice: string;
  };

  work: {
    labelBefore: string;
    labelSolution: string;
    labelResult: string;
    /** A plain sentence, not a badge: a "DEMO" chip is a banned micro-label. */
    conceptNotice: string;
    takeoverNotice: string;
    categories: Record<"all" | WorkCategory, string>;
    seeCaseStudy: string;
    stackLabel: string;
  };

  ssb: {
    title: string;
    body: string;
    action: string;
    noticeLead: string;
    noticeBody: string;
  };

  mobile: { title: string; body: string; points: string[] };

  contact: {
    nameLabel: string;
    namePlaceholder: string;
    businessLabel: string;
    businessPlaceholder: string;
    serviceLabel: string;
    servicePlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    submit: string;
    sending: string;
    doneTitle: string;
    doneBody: string;
    again: string;
    errName: string;
    errService: string;
    errDescription: string;
    services: Record<ContactServiceId, string>;
    budgets: Record<BudgetBracketId, string>;
  };

  order: {
    modalTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    businessLabel: string;
    businessPlaceholder: string;
    noteLabel: string;
    notePlaceholder: string;
    submit: string;
    footnote: string;
    errName: string;
    estimate: string;
  };

  footer: {
    ctaTitle: string;
    ctaBody: string;
    actionChat: string;
    actionCall: string;
    tagline: string;
    place: string;
    rights: string;
    creditsLabel: string;
    creditsNote: string;
    emailLabel: string;
    whatsappLabel: string;
  };

  /** No WhatsApp number configured: the page offers email instead of a dead link. */
  fallback: { title: string; body: string; copyEmail: string; copied: string; close: string };

  /** Prefilled WhatsApp messages, so an English visitor does not send Indonesian. */
  wa: {
    consult: string;
    scheduleCall: string;
    planIntro: string;
    addOnIntro: string;
    maintenanceIntro: string;
    ssb: string;
    workSimilar: string;
    labelName: string;
    labelBusiness: string;
    labelService: string;
    labelBudget: string;
    labelNeed: string;
    labelNote: string;
    labelEstimate: string;
  };

  meta: { title: string; description: string; ogImageAlt: string };
}

/* --------------------------------------------------------------- whole --- */

export interface Copy {
  ui: UiCopy;
  services: Record<ServiceId, ServiceCopy>;
  process: Record<ProcessStepId, ProcessStepCopy>;
  plans: Record<PlanId, PlanCopy>;
  addOns: Record<AddOnId, AddOnCopy>;
  maintenance: Record<MaintenanceId, MaintenanceCopy>;
  policies: Record<PolicyId, PolicyCopy>;
  work: Record<WorkId, WorkCopy>;
  ssbFeatures: Record<SsbFeatureId, SsbFeatureCopy>;
  faqs: Record<FaqId, FaqCopy>;
}
