import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
// taste-skill-ignore. Plus Jakarta Sans is on the skill's default-font list, but
// it is kept deliberately: Tokotype designed it in Jakarta for the city's own
// identity, which is a real reason for an Indonesian agency rather than a
// default. The display face was moved off that list to Fraunces.
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { getContent } from "@/content";
import { FloatingContact } from "@/components/site/FloatingContact";
import { Providers } from "@/components/site/Providers";
import { SiteBackdrop } from "@/components/site/SiteBackdrop";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { consultTarget, contactSettings } from "@/lib/whatsapp";
import { htmlLang, isLocale, locales, ogLocale, otherLocale, type Locale } from "@/lib/locale";
import { getSiteCopy } from "@/lib/site-content";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "../globals.css";

/* Both faces are variable, so no `weight` is passed: naming weights makes
   next/font download static instances and the variable axes are lost. Both are
   self-hosted at build time, so there is no request to Google at runtime. */
const text = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-text",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#f3f3f1",
  width: "device-width",
  initialScale: 1,
};

/* Runs before first paint so a visitor who chose the dark theme never sees a
   light flash. Light is the default. */
const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){}`;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/* An unknown locale 404s at build rather than being rendered on demand. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const { ui } = getContent(lang);
  const path = `/${lang}`;

  return {
    title: ui.meta.title,
    description: ui.meta.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: path,
      languages: {
        id: "/id",
        en: "/en",
        "x-default": "/id",
      },
    },
    openGraph: {
      type: "website",
      siteName: "BikinSaaS",
      title: ui.meta.title,
      description: ui.meta.description,
      url: path,
      locale: ogLocale[lang],
      alternateLocale: ogLocale[otherLocale(lang)],
    },
    twitter: {
      card: "summary_large_image",
      title: ui.meta.title,
      description: ui.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const content = getContent(locale);
  const { ui } = content;
  const copy = getSiteCopy(locale);
  const consult = consultTarget(locale, ui.wa.consult, ui.meta.title);
  /* Resolved here so the client parts that build a link (the order dialog, the
     contact form) use the same number the server would. */
  const contact = contactSettings();

  return (
    <html
      lang={htmlLang[locale]}
      data-theme="light"
      className={`${text.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {ui.nav.skipToContent}
        </a>
        <Providers contact={contact}>
          <SiteBackdrop />
          <SiteHeader locale={locale} nav={copy.nav} action={ui.nav.action} actionTarget={consult} />
          <div className="site-frame">
            <main id="main" className="site-main">
              {children}
            </main>
            <SiteFooter locale={locale} content={content} copy={copy} consult={consult} />
          </div>
          <FloatingContact label={copy.floating} target={consult} />
        </Providers>
      </body>
    </html>
  );
}
