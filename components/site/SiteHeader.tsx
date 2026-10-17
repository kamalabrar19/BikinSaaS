"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

import { targetProps } from "@/lib/contact";
import type { Locale } from "@/lib/locale";
import type { SiteCopy } from "@/lib/site-copy";
import { cn } from "@/lib/utils";
import type { ContactTarget } from "@/lib/whatsapp";
import { EASE } from "./Motion";
import { useSite } from "./Providers";

interface NavLink {
  href: string;
  label: string;
  /** Set for links to a section of the home page. */
  hash?: `#${string}`;
}

export function SiteHeader({
  locale,
  nav,
  action,
  actionTarget,
}: {
  locale: Locale;
  nav: SiteCopy["nav"];
  action: string;
  actionTarget: ContactTarget;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme, scrollTo, lockScroll } = useSite();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  /* Hide while reading downwards, come back as soon as the visitor scrolls up. */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    setHidden(latest > previous && latest > 260);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lockScroll]);

  const home = `/${locale}`;
  const links: NavLink[] = [
    { href: `${home}#services`, label: nav.services, hash: "#services" },
    { href: `${home}#process`, label: nav.process, hash: "#process" },
    { href: `${home}/portfolio`, label: nav.work },
    { href: `${home}/pricing`, label: nav.pricing },
    { href: `${home}/contact`, label: nav.contact },
  ];

  const other: Locale = locale === "id" ? "en" : "id";
  const switchHref = pathname.replace(/^\/(id|en)(?=\/|$)/, `/${other}`);

  const isActive = (link: NavLink) => !link.hash && pathname.startsWith(link.href);

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (link.hash && pathname === home) {
      event.preventDefault();
      scrollTo(link.hash);
    }
    setOpen(false);
  };

  return (
    <>
      <motion.header
        className={cn("site-header", scrolled && "is-scrolled")}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <Link href={home} className="site-logo" aria-label="BikinSaaS">
          <span className="site-logo-mark">B</span>
          <span className="site-logo-word">BikinSaaS</span>
        </Link>

        <nav className="site-nav" aria-label={nav.primary}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => onNavigate(event, link)}
              className={isActive(link) ? "is-active" : undefined}
              aria-current={isActive(link) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-actions">
          <Link className="icon-button lang-switch" href={switchHref} hrefLang={other} aria-label={nav.switchLang}>
            {other.toUpperCase()}
          </Link>
          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? nav.toLight : nav.toDark}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                className="theme-icon"
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <a className="header-cta" {...targetProps(actionTarget)}>
            <span>{action}</span>
            <ArrowUpRight size={14} />
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.close : nav.menu}
            onClick={() => setOpen((current) => !current)}
          >
            <span />
            <span />
          </button>
        </div>

        <motion.span className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <nav aria-label={nav.primary}>
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + index * 0.06, duration: 0.6, ease: EASE }}
                >
                  <Link href={link.href} onClick={(event) => onNavigate(event, link)}>
                    <small>0{index + 1}</small>
                    {link.label}
                    <ArrowUpRight size={22} />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.a
              className="button button-primary button-lg"
              {...targetProps(actionTarget)}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
            >
              {action}
              <ArrowUpRight size={16} />
            </motion.a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
