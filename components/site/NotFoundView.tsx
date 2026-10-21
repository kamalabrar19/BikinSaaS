"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { isLocale, type Locale } from "@/lib/locale";

const TEXT: Record<
  Locale,
  {
    kicker: string;
    title: string;
    em: string;
    lead: string;
    home: string;
    pricing: string;
    tried: string;
    jump: string;
    links: { label: string; path: string }[];
  }
> = {
  id: {
    kicker: "Tidak ditemukan",
    title: "Halaman ini",
    em: "tersesat.",
    lead: "Alamat yang Anda buka tidak ada, mungkin sudah dipindah atau salah ketik. Tenang, semua yang Anda cari masih ada di beranda.",
    home: "Kembali ke beranda",
    pricing: "Lihat harga",
    tried: "Alamat yang dibuka",
    jump: "Atau langsung ke",
    links: [
      { label: "Layanan", path: "#services" },
      { label: "Portofolio", path: "/portfolio" },
      { label: "Tim", path: "#team" },
      { label: "Harga", path: "/pricing" },
      { label: "Kontak", path: "/contact" },
    ],
  },
  en: {
    kicker: "Not found",
    title: "This page",
    em: "got lost.",
    lead: "The address you opened does not exist. It may have moved, or been mistyped. Don't worry, everything you were looking for is still on the home page.",
    home: "Back to home",
    pricing: "See prices",
    tried: "Address you opened",
    jump: "Or jump straight to",
    links: [
      { label: "Services", path: "#services" },
      { label: "Portfolio", path: "/portfolio" },
      { label: "Team", path: "#team" },
      { label: "Pricing", path: "/pricing" },
      { label: "Contact", path: "/contact" },
    ],
  },
};

/** The locale in the URL, else the browser's, else Indonesian. */
function useLocale(): Locale {
  const pathname = usePathname() ?? "";
  const first = pathname.split("/")[1] ?? "";
  const [fallback, setFallback] = useState<Locale>("id");

  useEffect(() => {
    if (!isLocale(first)) setFallback(navigator.language?.toLowerCase().startsWith("en") ? "en" : "id");
  }, [first]);

  return isLocale(first) ? first : fallback;
}

/**
 * The 404 screen. The zero is the site's own orb, so the page still looks like
 * BikinSaaS rather than a framework error; it leans towards the pointer.
 */
export function NotFoundView() {
  const locale = useLocale();
  const pathname = usePathname() ?? "/";
  const t = TEXT[locale];
  const code = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = code.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      node.style.setProperty("--px", String((event.clientX / window.innerWidth - 0.5) * 2));
      node.style.setProperty("--py", String((event.clientY / window.innerHeight - 0.5) * 2));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const base = `/${locale}`;
  const shown = pathname.length > 48 ? `${pathname.slice(0, 47)}…` : pathname;

  return (
    <section className="nf" aria-labelledby="nf-title">
      <p className="nf-kicker">
        <span className="status-dot" />/ 404 — {t.kicker.toUpperCase()}
      </p>

      <div className="nf-code" ref={code} aria-hidden="true">
        <span className="nf-digit">4</span>
        <span className="nf-zero">
          <i className="nf-ring nf-ring-a" />
          <i className="nf-ring nf-ring-b" />
          <i className="nf-orb" />
          <i className="nf-moon" />
        </span>
        <span className="nf-digit">4</span>
      </div>

      <h1 id="nf-title" className="nf-title">
        {t.title} <em>{t.em}</em>
      </h1>
      <p className="nf-lead">{t.lead}</p>

      <p className="nf-path">
        <span>{t.tried}</span>
        <code>{shown}</code>
      </p>

      <div className="nf-actions">
        <Link className="button button-primary button-lg" href={base}>
          {t.home}
          <ArrowRight size={16} />
        </Link>
        <Link className="button button-ghost button-lg" href={`${base}/pricing`}>
          {t.pricing}
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <nav className="nf-jump" aria-label={t.jump}>
        <span>{t.jump}</span>
        <ul>
          {t.links.map((link) => (
            <li key={link.label}>
              <Link href={`${base}${link.path}`}>
                {link.label}
                <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
