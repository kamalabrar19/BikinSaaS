/**
 * WhatsApp is the main conversion path, so an unconfigured number must never
 * silently become a working-looking link. The previous version fell back to
 * the placeholder 6281234567890, which shipped a link to someone else's
 * number. Here an unconfigured number returns null and the caller offers
 * email instead.
 */

const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const digits = rawNumber.replace(/\D/g, "");

/** Real international numbers are at least 10 digits. */
export const whatsappConfigured = digits.length >= 10;

export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

export interface ContactTarget {
  /** An href that is always safe to render. */
  href: string;
  /** False when the href is a mailto fallback rather than WhatsApp. */
  isWhatsApp: boolean;
  external: boolean;
}

export function contactHref(message: string, subject = "BikinSaaS"): ContactTarget {
  const body = encodeURIComponent(message.trim());

  if (whatsappConfigured) {
    return { href: `https://wa.me/${digits}?text=${body}`, isWhatsApp: true, external: true };
  }

  if (contactEmail) {
    return {
      href: `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${body}`,
      isWhatsApp: false,
      external: false,
    };
  }

  /* Neither configured: point at the contact form, which always works. */
  return { href: "#contact", isWhatsApp: false, external: false };
}

/** Joins labelled lines into a message, dropping the empty ones. */
export function composeMessage(intro: string, lines: (string | false | null | undefined)[]): string {
  return [intro, "", ...lines.filter((line): line is string => Boolean(line))].join("\n");
}
