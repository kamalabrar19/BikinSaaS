import { dictionaries } from "@/config/content";
import { Locale, Dictionary } from "@/types";

export const defaultLocale: Locale = "id";
export const locales: Locale[] = ["id", "en"];

export function isValidLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}

export function getDictionary(lang: string): { dictionary: Dictionary; lang: Locale } {
  const activeLocale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  return {
    dictionary: dictionaries[activeLocale],
    lang: activeLocale,
  };
}
