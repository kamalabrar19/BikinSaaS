/**
 * The contact rules, with no I/O and no node built-ins, so the server and the
 * browser can share them: the server resolves which number is in force, the
 * browser builds the link when a visitor clicks.
 *
 * An unconfigured number must never become a working-looking link — the
 * previous version fell back to the placeholder 6281234567890, which shipped a
 * link to someone else's phone.
 */

export interface ContactSettings {
  /** Digits only, or "" when not configured. */
  whatsapp: string;
  email: string;
}

export interface ContactTarget {
  /** An href that is always safe to render. */
  href: string;
  /** False when the href is a mailto fallback rather than WhatsApp. */
  isWhatsApp: boolean;
  external: boolean;
}

/** Real international numbers are at least 10 digits. */
export const MIN_DIGITS = 10;

export function isConfigured(settings: ContactSettings): boolean {
  return settings.whatsapp.length >= MIN_DIGITS;
}

export function contactHref(message: string, subject: string, settings: ContactSettings): ContactTarget {
  const body = encodeURIComponent(message.trim());

  if (settings.whatsapp.length >= MIN_DIGITS) {
    return { href: `https://wa.me/${settings.whatsapp}?text=${body}`, isWhatsApp: true, external: true };
  }

  if (settings.email) {
    return {
      href: `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${body}`,
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

/** The build-time environment. Next inlines these two into the client bundle. */
export function envContactSettings(): ContactSettings {
  return {
    whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
    email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim(),
  };
}
