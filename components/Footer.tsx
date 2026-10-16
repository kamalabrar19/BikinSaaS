"use client";

import { CalendarClock, MessageCircle, MapPin, Phone } from "lucide-react";
import { BRAND, FOOTER_COLUMNS } from "@/constants/site-data";
import { scrollToId } from "@/lib/utils";
import { openWhatsApp, waLink } from "@/lib/whatsapp";
import { Logo, Monogram } from "./Logo";

// Link sosial hanya tampil jika diisi lewat environment variable.
const SOCIALS = [
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
  { label: "GitHub", href: process.env.NEXT_PUBLIC_GITHUB_URL },
].filter((s): s is { label: string; href: string } => Boolean(s.href));

const PHONE = process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, "");

export function Footer() {
  return (
    <footer>
      {/* Pre-footer CTA */}
      <div className="px-4 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-charcoal px-6 py-14 text-center text-white sm:px-12">
          <div aria-hidden className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-green/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-deep-green/30 blur-3xl" />
          <Monogram size={52} className="relative mx-auto" />
          <h2 className="relative mx-auto mt-6 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Siap membuat bisnis Anda <span className="text-primary-green">tampil lebih profesional?</span>
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/70">
            Ceritakan kebutuhan Anda. {BRAND.responseTime}
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openWhatsApp("Halo BikinSaaS, saya ingin menghubungi tim Anda.")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-green px-8 py-4 text-base font-bold text-charcoal shadow-lg shadow-primary-green/30 transition hover:bg-deep-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" /> Contact us
            </button>
            <button
              type="button"
              onClick={() => openWhatsApp("Halo BikinSaaS, saya ingin menjadwalkan call untuk konsultasi. Hari/jam yang cocok untuk saya: ")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-green px-8 py-4 text-base font-bold text-primary-green transition hover:bg-primary-green hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:w-auto"
            >
              <CalendarClock className="h-5 w-5" /> Schedule a call
            </button>
          </div>
        </div>
      </div>

      {/* Footer utama */}
      <div className="mt-16 border-t border-stone-200/80 bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="md:col-span-2 lg:col-span-1">
            <Logo size={38} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-600">
              {BRAND.tagline}. Website, web app, dan otomasi untuk bisnis yang ingin bertumbuh.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-stone-600">
              {PHONE && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-deep-green" /> +{PHONE}
                </li>
              )}
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-deep-green" /> Indonesia (remote)
              </li>
            </ul>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-sm font-bold text-charcoal">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={`#${l.target}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(l.target);
                      }}
                      className="text-sm text-stone-600 transition hover:text-deep-green"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Social">
            <p className="text-sm font-bold text-charcoal">Social</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={waLink("Halo BikinSaaS, saya ingin bertanya.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-600 transition hover:text-deep-green"
                >
                  WhatsApp
                </a>
              </li>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-stone-600 transition hover:text-deep-green">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-stone-200/80 pt-6 text-xs text-stone-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. Semua hak dilindungi.
          </p>
          <p className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-green opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-green" />
            </span>
            Website online
          </p>
        </div>
      </div>
    </footer>
  );
}
