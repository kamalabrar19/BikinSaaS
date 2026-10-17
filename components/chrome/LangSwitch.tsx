"use client";

import Link from "next/link";
import { locales, type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * Both locales are always rendered as real links, so the switch works without
 * JavaScript and search engines see the pair.
 *
 * The active section id is appended so a visitor who switches language lands
 * on the same section. A pixel offset would be meaningless: the two
 * translations are different heights.
 */
export function LangSwitch({
  current,
  activeSection,
  label,
}: {
  current: Locale;
  activeSection: string | null;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 text-meta" role="group" aria-label={label}>
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && <span aria-hidden className="text-ink-quiet">/</span>}
          <Link
            href={activeSection ? `/${locale}#${activeSection}` : `/${locale}`}
            hrefLang={locale}
            aria-current={locale === current ? "true" : undefined}
            className={cn(
              "px-1 py-1 uppercase transition-colors duration-150",
              locale === current ? "font-semibold text-ink" : "text-ink-quiet hover:text-ink",
            )}
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}
