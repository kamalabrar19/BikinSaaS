import type { Metadata, Viewport } from "next";
import { defaultLocale, locales, getDictionary, isValidLocale } from "@/lib/i18n";

import { siteConfig } from "@/config/site";
import { Locale } from "@/types";


export const viewport: Viewport = {
  themeColor: "#25D366",
  width: "device-width",
  initialScale: 1,
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = isValidLocale(rawLang) ? rawLang : defaultLocale;
  const { dictionary } = getDictionary(lang);

  const url = `${siteConfig.siteUrl}/${lang}`;

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical: url,
      languages: {
        id: `${siteConfig.siteUrl}/id`,
        en: `${siteConfig.siteUrl}/en`,
      },
    },
    openGraph: {
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      url,
      siteName: siteConfig.name,
      locale: lang === "id" ? "id_ID" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.meta.title,
      description: dictionary.meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isValidLocale(rawLang) ? rawLang : defaultLocale;
  return <>{children}</>;
}
