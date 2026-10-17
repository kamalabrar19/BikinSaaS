"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { useActiveSection } from "@/lib/use-active-section";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { LangSwitch } from "./LangSwitch";

/**
 * A plain bar: wordmark, four links, one action. The floating glass pill it
 * replaces was flagged three ways at once, and it carried seven links where
 * three to five is the readable limit.
 *
 * The bar is opaque and does not change on scroll. It sits on the page ground
 * and separates from the content by tone, not by a line.
 */
export function SiteNav({
  locale,
  nav,
  action,
  actionHref,
  actionExternal,
  openLabel,
  closeLabel,
  langLabel,
}: {
  locale: Locale;
  nav: { id: string; label: string }[];
  action: string;
  actionHref: string;
  actionExternal: boolean;
  openLabel: string;
  closeLabel: string;
  langLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(nav.map((item) => item.id));

  return (
    <header className="sticky top-0 z-40 bg-paper">
      <nav
        aria-label={nav.length > 0 ? undefined : "Navigasi"}
        className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 sm:px-8"
      >
        <a href={`/${locale}`} className="press shrink-0">
          <Logo />
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "text-meta transition-colors duration-150",
                  active === item.id ? "text-ink" : "text-ink-quiet hover:text-ink",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <LangSwitch current={locale} activeSection={active} label={langLabel} />

          <a
            href={actionHref}
            {...(actionExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className="press hidden rounded-sm bg-action px-5 py-2.5 text-meta font-semibold text-paper transition-colors duration-150 hover:bg-action-deep sm:inline-flex"
          >
            {action}
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? closeLabel : openLabel}
            className="press p-2 text-ink md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="nav-menu" className="bg-surface md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-4 sm:px-8">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-body text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <a
                href={actionHref}
                {...(actionExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className="press inline-flex rounded-sm bg-action px-5 py-3 text-meta font-semibold text-paper"
              >
                {action}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
