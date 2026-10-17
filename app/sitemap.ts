import type { MetadataRoute } from "next";
import { locales } from "@/lib/locale";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Both locales are listed, each pointing at the other through `alternates`,
 * so a search engine reads them as one page in two languages rather than as
 * duplicate content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: locale === "id" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(locales.map((other) => [other, `${siteUrl}/${other}`])),
    },
  }));
}
