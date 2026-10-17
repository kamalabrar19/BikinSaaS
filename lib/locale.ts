export const locales = ["id", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** The other locale, for the language switch. */
export function otherLocale(locale: Locale): Locale {
  return locale === "id" ? "en" : "id";
}

/** BCP 47 tags for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = { id: "id", en: "en" };

/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = { id: "id_ID", en: "en_US" };
