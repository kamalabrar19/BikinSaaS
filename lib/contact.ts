import type { ContactTarget } from "./contact-target";

/**
 * Client-safe helpers around a resolved contact target.
 *
 * `consultTarget` deliberately lives in ./whatsapp.ts instead: it reads the
 * admin document, and this module is imported by client components (the header,
 * the floating button). Keeping a filesystem read out of here is what stops
 * node:fs from being pulled into the browser bundle.
 */

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
