"use client";

import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { ContactSettings } from "@/lib/contact-target";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export type Theme = "dark" | "light";

interface SiteContextValue {
  theme: Theme;
  toggleTheme: () => void;
  /** Smooth-scrolls to a selector ("#services") or a pixel offset. */
  scrollTo: (target: string | number) => void;
  /** Freezes page scroll while a menu or dialog is open. */
  lockScroll: (locked: boolean) => void;
  /**
   * The WhatsApp number and email in force, resolved on the server (admin panel
   * first, then the environment). Client code builds its link from these so a
   * visitor gets the number the server would have used.
   */
  contact: ContactSettings;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite(): SiteContextValue {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used inside <Providers>");
  return value;
}

/** The contact details in force, for client parts that build a link. */
export function useContact(): ContactSettings {
  return useSite().contact;
}

/** Clears the fixed header when scrolling to an anchor. */
const HEADER_OFFSET = -96;

function findAnchor(selector: string): Element | null {
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

export function Providers({ children, contact }: { children: ReactNode; contact: ContactSettings }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  /* The inline script in the layout has already applied the saved theme to
     <html> before paint; this only syncs React state with it. */
  useEffect(() => {
    const applied = document.documentElement.dataset.theme;
    if (applied === "light" || applied === "dark") setTheme(applied);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode: the choice just isn't remembered */
    }
  }, [theme]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };
    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target: string | number) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : HEADER_OFFSET });
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
      return;
    }
    const element = findAnchor(target);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    document.documentElement.classList.toggle("scroll-locked", locked);
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, []);

  /* A new page starts at the top, unless the link carried an anchor
     ("/id#services" from another page), in which case it glides there. */
  useEffect(() => {
    const { hash } = window.location;
    if (hash && findAnchor(hash)) {
      const frame = window.requestAnimationFrame(() => scrollTo(hash));
      return () => window.cancelAnimationFrame(frame);
    }
    lenisRef.current?.scrollTo(0, { immediate: true });
    return undefined;
  }, [pathname, scrollTo]);

  /* Cards with the `spot` class get a glow that follows the pointer. One
     listener for the whole page instead of one per card. */
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>(".spot");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, scrollTo, lockScroll, contact }),
    [theme, toggleTheme, scrollTo, lockScroll, contact],
  );

  return (
    <SiteContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SiteContext.Provider>
  );
}
