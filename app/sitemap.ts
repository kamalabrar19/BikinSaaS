import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { locales, type Locale } from "@/lib/locale";

/* Without this, `next build` prerenders the file once (nothing here reads a
   request-specific API, so Next treats it as static by default) and a case
   study the panel adds later never appears until the next deploy — the
   same reason /[lang]/portfolio/[slug] forces dynamic. */
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Every static route under `/[lang]`, besides the home page itself. */
const STATIC_PATHS = ["/pricing", "/portfolio", "/team", "/contact"] as const;

function entry(
  locale: Locale,
  path: string,
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: Object.fromEntries(locales.map((other) => [other, `${siteUrl}/${other}${path}`])),
    },
  };
}

/**
 * Every locale is listed, each pointing at the other through `alternates`,
 * so a search engine reads them as one page in two languages rather than as
 * duplicate content. Case-study slugs come from `getContent`, the same
 * admin-editable list the `/portfolio` pages render, so a project the panel
 * just added (or removed) is reflected here too — there is no build-time
 * list to go stale.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => {
    const { work } = getContent(locale);
    return [
      entry(locale, "", locale === "id" ? 1 : 0.8),
      ...STATIC_PATHS.map((path) => entry(locale, path, 0.7)),
      ...work.map((item) => entry(locale, `/portfolio/${item.id}`, 0.6)),
    ];
  });
}
