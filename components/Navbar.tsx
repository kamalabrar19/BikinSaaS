"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_ITEMS, type SectionId } from "@/constants/site-data";
import { Logo } from "./Logo";
import { cn, scrollToId } from "@/lib/utils";

export function Navbar() {
  const [active, setActive] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const go = (id: SectionId) => {
    setOpen(false);
    scrollToId(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="sticky top-0 z-50 h-0">
      <div className="absolute inset-x-0 top-3 px-3 sm:top-4 sm:px-6">
        <nav
          className={cn(
            "mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-white/60 pl-4 pr-2 sm:pl-5",
            "bg-white/35 backdrop-blur-2xl backdrop-saturate-200",
            "shadow-[0_8px_32px_rgba(17,24,39,0.10),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.25)]",
            "transition-[background-color,box-shadow] duration-300",
            scrolled && "bg-white/55 shadow-[0_12px_40px_rgba(17,24,39,0.14),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.3)]"
          )}
          aria-label="Navigasi utama"
        >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActive(null);
          }}
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green"
        >
          <Logo size={34} />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.id);
                }}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green",
                  active === item.id ? "text-deep-green" : "text-stone-600 hover:text-charcoal"
                )}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-soft-green"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#kontak"
            onClick={(e) => {
              e.preventDefault();
              go("kontak");
            }}
            className="hidden rounded-full bg-primary-green px-5 py-2 text-sm font-semibold text-charcoal shadow-md shadow-primary-green/25 transition hover:bg-deep-green hover:text-white sm:inline-block"
          >
            Konsultasi Gratis
          </a>
          <button
            type="button"
            className="rounded-full p-2 text-stone-700 hover:bg-white/60 md:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-white/55 shadow-[0_12px_40px_rgba(17,24,39,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-200 md:hidden"
          >
            <ul className="space-y-1 px-4 py-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-base font-medium",
                      active === item.id ? "bg-soft-green/80 text-deep-green" : "text-stone-700 hover:bg-white/60"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
}
