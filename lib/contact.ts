import type { Locale } from "./locale";
import { contactHref, type ContactTarget } from "./whatsapp";

/**
 * contactHref falls back to "#contact" when neither WhatsApp nor email is
 * configured. That anchor only exists on the home page, so every other page
 * would get a dead link; the contact page always works instead.
 */
export function consultTarget(locale: Locale, message: string, subject?: string): ContactTarget {
  const target = contactHref(message, subject);
  return target.href.startsWith("#") ? { ...target, href: `/${locale}/contact` } : target;
}

export interface AnchorTargetProps {
  href: string;
  target?: string;
  rel?: string;
}

/** Props for an <a> that points at a ContactTarget. */
export function targetProps(target: ContactTarget): AnchorTargetProps {
  return target.external
    ? { href: target.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: target.href };
}
