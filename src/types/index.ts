export type Locale = "id" | "en";

export interface NavItem {
  label: string;
  href: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryCta: {
    label: string;
    waMessage: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  trustHighlights: Array<{
    title: string;
    description: string;
  }>;
  conceptPreviewCard: {
    badge: string;
    title: string;
    clientType: string;
    deliverables: string[];
    timeline: string;
    guaranteeText: string;
  };
}

export interface PainPointItem {
  id: string;
  title: string;
  description: string;
  solutionImpact: string;
}

export interface ServiceItem {
  id: string;
  badge: string;
  title: string;
  plainDescription: string;
  forWhom: string;
  features: string[];
}

export interface ProcessStage {
  step: string;
  title: string;
  description: string;
  clientTask: string;
  ourTask: string;
}

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  startingPrice: string;
  priceNote: string;
  description: string;
  idealFor: string;
  features: string[];
  waMessage: string;
  isPopular?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  isDemoConcept: boolean; // Mandated: Must be true for non-client demo concepts
  description: string;
  tags: string[];
  highlights: string[];
}

export interface WhyUsItem {
  number: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
    tagline: string;
    ogImageAlt: string;
  };
  nav: {
    links: NavItem[];
    cta: string;
    languageSwitchLabel: string;
  };
  hero: HeroContent;
  painPoints: {
    sectionBadge: string;
    title: string;
    description: string;
    items: PainPointItem[];
  };
  services: {
    sectionBadge: string;
    title: string;
    description: string;
    items: ServiceItem[];
  };
  howItWorks: {
    sectionBadge: string;
    title: string;
    description: string;
    stages: ProcessStage[];
  };
  pricing: {
    sectionBadge: string;
    title: string;
    description: string;
    disclaimer: {
      title: string;
      description: string;
      items: string[];
    };
    tiers: PricingTier[];
  };
  portfolio: {
    sectionBadge: string;
    title: string;
    description: string;
    demoNotice: string;
    items: PortfolioItem[];
  };
  whyUs: {
    sectionBadge: string;
    title: string;
    description: string;
    items: WhyUsItem[];
  };
  faq: {
    sectionBadge: string;
    title: string;
    description: string;
    items: FaqItem[];
  };
  preFooter: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    waMessage: string;
  };
  footer: {
    tagline: string;
    rights: string;
    contactLabel: string;
    emailLabel: string;
    disclaimer: string;
  };
  contactFallback: {
    title: string;
    description: string;
    copyEmail: string;
    close: string;
  };
}
