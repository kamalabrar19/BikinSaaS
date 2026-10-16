"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Locale, Dictionary } from "@/types";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ContactFallbackModal } from "./ContactFallbackModal";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  lang: Locale;
  dict: Dictionary;
}

export function Navbar({ lang, dict }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fallbackModalOpen, setFallbackModalOpen] = useState(false);

  const handleCtaClick = () => {
    handleWhatsAppClick(dict.hero.primaryCta.waMessage, () => {
      setFallbackModalOpen(true);
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full pt-3 md:pt-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <nav
            aria-label="Navigasi Utama"
            className="bg-panel border border-ink-border rounded-2xl md:rounded-full px-4 sm:px-6 py-3 shadow-panel flex items-center justify-between transition-all"
          >
            {/* Brand Wordmark */}
            <Link
              href={`/${lang}`}
              className="flex items-center gap-1.5 font-bold text-lg md:text-xl tracking-tight text-ink group"
              aria-label="BikinSaaS Beranda"
            >
              <span>BikinSaaS</span>
              <span className="w-2 h-2 rounded-full bg-primary inline-block transition-transform group-hover:scale-125" />
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-muted">
              {dict.nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-ink transition-colors py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Actions: Language Switcher + CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher currentLang={lang} />
              <button
                onClick={handleCtaClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold transition-all shadow-sm group"
              >
                <span>{dict.nav.cta}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher currentLang={lang} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
                className="p-2 rounded-xl text-ink hover:bg-canvas transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div
              className="md:hidden mt-2 p-5 bg-panel border border-ink-border rounded-2xl shadow-panel animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <ul className="flex flex-col gap-3 text-base font-medium text-ink">
                {dict.nav.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 rounded-lg hover:bg-canvas text-ink-muted hover:text-ink transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-ink-border">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleCtaClick();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{dict.nav.cta}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Honest Contact Fallback Dialog */}
      <ContactFallbackModal
        isOpen={fallbackModalOpen}
        onClose={() => setFallbackModalOpen(false)}
        message={dict.hero.primaryCta.waMessage}
        lang={lang}
      />
    </>
  );
}
