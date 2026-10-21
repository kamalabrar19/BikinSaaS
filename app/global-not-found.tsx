import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { NotFoundView } from "@/components/site/NotFoundView";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

/**
 * The 404 for addresses outside any locale (/nope, /admin/nope). It owns its
 * own <html> because no layout wraps it, so it repeats the site's fonts and
 * theme script. The in-locale 404 is app/[lang]/not-found.tsx.
 */
const text = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-text",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "404 · BikinSaaS",
  robots: { index: false, follow: false },
};

const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){}`;

export default function GlobalNotFound() {
  return (
    <html lang="id" data-theme="light" className={`${text.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="site-bg" aria-hidden="true" />
        <div className="nf-standalone">
          <a className="nf-brand" href="/id" aria-label="BikinSaaS">
            <span className="nf-brand-mark">B</span>
            BikinSaaS
          </a>
          <NotFoundView />
        </div>
      </body>
    </html>
  );
}
