import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
// taste-skill-ignore. Plus Jakarta Sans is on the skill's default-font list, but
// it is kept deliberately: Tokotype designed it in Jakarta for the city's own
// identity, which is a real reason for an Indonesian agency rather than a
// default. The display face was moved off that list to Fraunces.
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { getContent } from "@/content";
import { htmlLang, isLocale, locales, ogLocale, otherLocale, type Locale } from "@/lib/locale";
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
  themeColor: "#F3F3F1",
  width: "device-width",
  initialScale: 1,
};

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
  const { ui } = getContent(locale);

  return (
    <html lang={htmlLang[locale]} className={`${text.variable} ${display.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-action focus:px-4 focus:py-2 focus:text-paper"
        >
          {ui.nav.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
