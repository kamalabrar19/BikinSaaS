import { readStore } from "@/lib/admin/store";
import {
  contactHref as buildHref,
  envContactSettings,
  MIN_DIGITS,
  type ContactSettings,
  type ContactTarget,
} from "@/lib/contact-target";

/**
 * Which contact details are in force, resolved on the server.
 *
 * The number can come from the environment (NEXT_PUBLIC_WHATSAPP_NUMBER) or
 * from the admin panel. The panel wins when it holds a usable number — it is
 * the place a non-developer can change it without a redeploy.
 *
 * Server-only. Everything is a function rather than a module constant, because
 * the value can change while the server is running. The browser gets the
 * resolved settings through <Providers contact={...}> so a click builds the
 * same link the server would have.
 *
 * Do not import this from a client component: it reads the filesystem. Use
 * @/lib/contact-target there and read the resolved values from context.
 */

export type { ContactSettings, ContactTarget } from "@/lib/contact-target";

/** Re-exported for server pages; client code should use @/lib/contact-target. */
export { composeMessage } from "@/lib/contact-target";

export function contactSettings(): ContactSettings {
  const saved = readStore()?.settings;
  const env = envContactSettings();
  const fromPanel = (saved?.whatsapp ?? "").replace(/\D/g, "");
  return {
    whatsapp: fromPanel.length >= MIN_DIGITS ? fromPanel : env.whatsapp,
    email: (saved?.email ?? "").trim() || env.email,
  };
}

export function isWhatsappConfigured(): boolean {
  return contactSettings().whatsapp.length >= MIN_DIGITS;
}

export function contactEmail(): string {
  return contactSettings().email;
}

/** Server-side link builder: pages render the href, client code rebuilds it. */
export function contactHref(message: string, subject = "BikinSaaS"): ContactTarget {
  return buildHref(message, subject, contactSettings());
}

/**
 * contactHref falls back to "#contact" when neither WhatsApp nor email is
 * configured. That anchor only exists on the home page, so every other page
 * would get a dead link; the contact page always works instead.
 */
export function consultTarget(locale: string, message: string, subject?: string): ContactTarget {
  const target = contactHref(message, subject);
  return target.href.startsWith("#") ? { ...target, href: `/${locale}/contact` } : target;
}
