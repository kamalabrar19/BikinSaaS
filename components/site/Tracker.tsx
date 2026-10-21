"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Channel = "whatsapp" | "email" | "phone" | "form";

function send(payload: Record<string, string>): void {
  const body = JSON.stringify(payload);
  try {
    // sendBeacon survives the page being left right after the click, which is
    // exactly what opening WhatsApp in the same tab does.
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/track", { method: "POST", body, keepalive: true });
  } catch {
    /* counting must never break the page */
  }
}

/** For code that opens a contact link itself (the forms), not through an <a>. */
export function trackContact(channel: Channel): void {
  send({ type: "contact", channel });
}

function channelOf(href: string): Channel | null {
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return "whatsapp";
  return null;
}

/**
 * Counts one view per page the visitor opens, and one contact for every click
 * on a WhatsApp, email or phone link anywhere on the site. Renders nothing.
 */
export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    send({ type: "view", path: pathname, ref: document.referrer });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      const channel = link ? channelOf(link.getAttribute("href") ?? "") : null;
      if (channel) trackContact(channel);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
