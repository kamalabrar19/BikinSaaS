import type { Metadata } from "next";

import { ogLocale, otherLocale, type Locale } from "./locale";

/**
 * Metadata for an inner page. The layout's metadata points every page's
 * canonical and hreflang at the home page; each page overrides them with
 * its own path so search engines index it as a page of its own.
 *
 * @param path the path after the locale, starting with "/" (e.g. "/pricing")
 */
export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const url = `/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { id: `/id${path}`, en: `/en${path}`, "x-default": `/id${path}` },
    },
    openGraph: {
      type: "website",
      siteName: "BikinSaaS",
      title,
      description,
      url,
      locale: ogLocale[locale],
      alternateLocale: ogLocale[otherLocale(locale)],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
