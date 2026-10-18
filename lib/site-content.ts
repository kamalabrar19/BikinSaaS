import { readStore } from "@/lib/admin/store";
import { rowText, type StatRow } from "@/lib/admin/types";
import type { Locale } from "@/lib/locale";
import { siteCopy, type SiteCopy, type StatItem } from "@/lib/site-copy";

/**
 * The chrome copy for a locale, with anything the admin panel changed laid over
 * it. Only the statistics are editable: they are the one part of this file a
 * business owner actually changes (numbers and their captions).
 *
 * Kept out of lib/site-copy.ts on purpose — that file is imported for its types
 * by client components and must stay free of node built-ins.
 */

function statFrom(row: StatRow, locale: Locale): StatItem {
  return {
    value: row.value,
    prefix: row.prefix || undefined,
    suffix: rowText(row, locale, "suffix") || undefined,
    label: rowText(row, locale, "label"),
  };
}

export function getSiteCopy(locale: Locale): SiteCopy {
  const base = siteCopy[locale];
  const rows = readStore()?.stats;
  if (!rows || !rows.length) return base;
  return { ...base, stats: { ...base.stats, items: rows.map((row) => statFrom(row, locale)) } };
}
