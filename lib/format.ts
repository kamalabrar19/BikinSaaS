import type { Locale } from "./locale";

/**
 * Money and dates are formatted by hand, on purpose.
 *
 * Intl.NumberFormat with currency "IDR" is NOT safe here: Node's ICU and the
 * browser's ICU disagree about the space after "Rp" (one emits U+00A0, another
 * a plain space or none) depending on the ICU version and whether Node was
 * built with full-icu. Prices appear more than twenty times on the page, so
 * that difference shows up as a React hydration mismatch. Plain string
 * arithmetic is byte-identical on the server and in the browser, always.
 */

const GROUP_SEPARATOR: Record<Locale, string> = { id: ".", en: "," };

function groupDigits(value: number, locale: Locale): string {
  const digits = Math.round(Math.abs(value)).toString();
  const separator = GROUP_SEPARATOR[locale];
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += separator;
    out += digits[i];
  }
  return value < 0 ? `-${out}` : out;
}

/** "Rp399.000" in Indonesian, "Rp399,000" in English. */
export function formatMoney(value: number, locale: Locale): string {
  return `Rp${groupDigits(value, locale)}`;
}

/** "Rp3.499.000 – Rp4.900.000" */
export function formatMoneyRange(min: number, max: number, locale: Locale): string {
  return `${formatMoney(min, locale)} – ${formatMoney(max, locale)}`;
}

const MONTHS: Record<Locale, readonly string[]> = {
  id: [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

/**
 * Formats an ISO "yyyy-mm-dd" string. The string is split rather than parsed
 * into a Date, because `new Date("2026-10-08")` is UTC midnight and shifts to
 * the previous day for anyone behind UTC.
 */
export function formatDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split("-");
  const name = MONTHS[locale][Number(month) - 1];
  if (!name) return iso;
  return locale === "id"
    ? `${Number(day)} ${name} ${year}`
    : `${name} ${Number(day)}, ${year}`;
}
