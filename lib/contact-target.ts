/**
 * The contact rules, with no I/O and no node built-ins, so the server and the
 * browser can share them: the server resolves which number is in force, the
 * browser builds the link when a visitor clicks.
 *
 * The business's own WhatsApp number is the default, so a fresh deploy already
 * reaches the right phone. NEXT_PUBLIC_WHATSAPP_NUMBER (or the admin panel)
 * overrides it. A made-up placeholder number must never come back: an earlier
 * version fell back to 6281234567890, which was a link to someone else's phone.
 */

/** The business's Instagram. NEXT_PUBLIC_INSTAGRAM_URL overrides it. */
export const DEFAULT_INSTAGRAM = "https://instagram.com/bikinsaas.id";

/** The profile link and its "@handle", for footers and contact cards. */
export function instagramProfile(): { url: string; handle: string } {
  const raw = (process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "").trim();
  const url = /^https?:\/\//i.test(raw) ? raw : DEFAULT_INSTAGRAM;
  const handle = url.replace(/\/+$/, "").split("/").pop()?.replace(/^@/, "") || "bikinsaas.id";
  return { url, handle: `@${handle}` };
}

/** 0819-5934-3683 in international form. */
export const DEFAULT_WHATSAPP = "6281959343683";

/**
 * Digits only, in international form for Indonesia: "0819 5343 683", "+62 819…"
 * and "819…" all become "62819…". Anything shorter than a real number is "".
 */
export function normalizeWhatsapp(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  return digits.length >= MIN_DIGITS ? digits : "";
}


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
    whatsapp: normalizeWhatsapp(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "") || DEFAULT_WHATSAPP,
    email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim(),
  };
}
