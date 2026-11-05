import type { Locale } from "@/lib/locale";

/**
 * Structured data (schema.org JSON-LD), built only from facts that are
 * already true and already visible on the page: the brand name, the logo
 * the header renders, the WhatsApp/Instagram channels the footer and
 * contact page show, and — for `servicesJsonLd` — the exact service cards
 * the home page's "Capabilities" section renders. Nothing here may be
 * invented; see docs/BikinSaaS_SEO_GEO_Optimization_Pack/SEO_GEO_BRIEF.md §6.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Site-wide identity, rendered on every page via the root layout. */
export function organizationJsonLd(params: {
  locale: Locale;
  description: string;
  /** Digits only (international form), or "" when WhatsApp is not configured. */
  whatsapp: string;
  instagramUrl: string;
}) {
  const { locale, description, whatsapp, instagramUrl } = params;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BikinSaaS",
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/brand/logo.png`,
    description,
    sameAs: [instagramUrl],
    ...(whatsapp
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: `+${whatsapp}`,
            availableLanguage: ["id", "en"],
          },
        }
      : {}),
  };
}

/**
 * One `Service` entry per card the home page actually renders, in the same
 * order — not the full catalog of packages, which already has its own
 * prices on the pricing page and would duplicate them here.
 */
export function servicesJsonLd(
  locale: Locale,
  services: readonly { id: string; title: string; summary: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.summary,
        provider: { "@type": "Organization", name: "BikinSaaS", url: `${siteUrl}/${locale}` },
      },
    })),
  };
}
