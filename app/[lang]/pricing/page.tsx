import { ArrowLeft, ArrowRight, RefreshCw, Server, ShieldCheck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getContent, type Policy } from "@/content";
import { Faq } from "@/components/site/Faq";
import { ShortLabel } from "@/components/site/ShortLabel";
import { HeroOrb } from "@/components/site/HeroOrb";
import { buildOrderLabels } from "@/components/site/labels";
import { Magnetic, Parallax, Reveal, RevealText } from "@/components/site/Motion";
import { Panel, SectionHeading } from "@/components/site/Panel";
import { PricingExplorer } from "@/components/site/PricingExplorer";
import { isLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { getSiteCopy } from "@/lib/site-content";

const SERVICE_CATALOG = {
  id: [
    {
      id: "wedding",
      title: "Undangan Pernikahan Digital",
      lead: "Undangan online yang mudah dibagikan lewat WhatsApp.",
      plans: [
        { id: "wedding-basic", name: "Basic", tagline: "Satu halaman undangan siap bagikan.", features: ["Template pilihan", "Detail acara", "Tombol konfirmasi hadir"], priceLabel: "Rp99.000" },
        { id: "wedding-standard", name: "Standard", tagline: "Lebih lengkap untuk cerita hari spesial Anda.", features: ["Semua fitur Basic", "Galeri foto", "Peta lokasi dan countdown"], priceLabel: "Rp149.000", popular: true },
        { id: "wedding-pro", name: "Pro", tagline: "Undangan personal dengan detail yang lebih lengkap.", features: ["Semua fitur Standard", "Ucapan tamu", "Musik latar dan domain 1 tahun"], priceLabel: "Rp249.000" },
      ],
    },
    {
      id: "broadcast",
      title: "Jasa Broadcast WhatsApp",
      lead: "Kami bantu siapkan dan kirim pesan ke kontak yang Anda sediakan.",
      plans: [
        { id: "broadcast-basic", name: "Basic", tagline: "Untuk hingga 100 kontak.", features: ["Hingga 100 kontak", "1 template pesan", "Laporan pengiriman"], priceLabel: "Rp75.000" },
        { id: "broadcast-standard", name: "Standard", tagline: "Untuk hingga 500 kontak.", features: ["Hingga 500 kontak", "Hingga 2 template pesan", "Laporan pengiriman"], priceLabel: "Rp150.000", popular: true },
        { id: "broadcast-pro", name: "Pro", tagline: "Untuk hingga 1.000 kontak.", features: ["Hingga 1.000 kontak", "Hingga 3 template pesan", "Laporan pengiriman"], priceLabel: "Rp275.000" },
      ],
    },
    {
      id: "portfolio",
      title: "Desain Web Portofolio Kustom",
      lead: "Tampilan portofolio personal yang rapi dan siap dibagikan.",
      plans: [
        { id: "portfolio-basic", name: "Basic", tagline: "Satu halaman portofolio yang sederhana.", features: ["1 halaman", "Desain responsif", "Tautan kontak"], priceLabel: "Rp149.000" },
        { id: "portfolio-standard", name: "Standard", tagline: "Ruang lebih untuk karya dan pengalaman.", features: ["Hingga 3 halaman", "Galeri karya", "Form kontak"], priceLabel: "Rp199.000", popular: true },
        { id: "portfolio-pro", name: "Pro", tagline: "Portofolio yang lebih lengkap dan personal.", features: ["Hingga 5 halaman", "Galeri dan animasi ringan", "Domain 1 tahun"], priceLabel: "Rp299.000" },
      ],
    },
  ],
  en: [
    {
      id: "wedding", title: "Digital Wedding Invitations", lead: "Online invitations that are easy to share on WhatsApp.",
      plans: [
        { id: "wedding-basic", name: "Basic", tagline: "A share-ready one-page invitation.", features: ["Choice of template", "Event details", "RSVP button"], priceLabel: "Rp99,000" },
        { id: "wedding-standard", name: "Standard", tagline: "More space for your special-day story.", features: ["Everything in Basic", "Photo gallery", "Location map and countdown"], priceLabel: "Rp149,000", popular: true },
        { id: "wedding-pro", name: "Pro", tagline: "A personal invitation with fuller details.", features: ["Everything in Standard", "Guest messages", "Background music and 1-year domain"], priceLabel: "Rp249,000" },
      ],
    },
    {
      id: "broadcast", title: "WhatsApp Broadcast Service", lead: "We prepare and send your message to the contacts you provide.",
      plans: [
        { id: "broadcast-basic", name: "Basic", tagline: "For up to 100 contacts.", features: ["Up to 100 contacts", "1 message template", "Delivery report"], priceLabel: "Rp75,000" },
        { id: "broadcast-standard", name: "Standard", tagline: "For up to 500 contacts.", features: ["Up to 500 contacts", "Up to 2 message templates", "Delivery report"], priceLabel: "Rp150,000", popular: true },
        { id: "broadcast-pro", name: "Pro", tagline: "For up to 1,000 contacts.", features: ["Up to 1,000 contacts", "Up to 3 message templates", "Delivery report"], priceLabel: "Rp275,000" },
      ],
    },
    {
      id: "portfolio", title: "Custom Portfolio Website Design", lead: "A polished personal portfolio ready to share.",
      plans: [
        { id: "portfolio-basic", name: "Basic", tagline: "A simple one-page portfolio.", features: ["1 page", "Responsive design", "Contact links"], priceLabel: "Rp149,000" },
        { id: "portfolio-standard", name: "Standard", tagline: "More room for work and experience.", features: ["Up to 3 pages", "Work gallery", "Contact form"], priceLabel: "Rp199,000", popular: true },
        { id: "portfolio-pro", name: "Pro", tagline: "A fuller, more personal portfolio.", features: ["Up to 5 pages", "Gallery and subtle animation", "1-year domain"], priceLabel: "Rp299,000" },
      ],
    },
  ],
} as const;

const POLICY_ICONS: Record<Policy["icon"], LucideIcon> = {
  wallet: Wallet,
  shield: ShieldCheck,
  refresh: RefreshCw,
  server: Server,
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { ui } = getContent(lang);
  return pageMetadata(lang, "/pricing", ui.meta.pages.pricing.title, ui.meta.pages.pricing.description);
}

export default async function PricingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = getContent(lang);
  const { ui } = content;
  const copy = getSiteCopy(lang);
  const home = `/${lang}`;

  return (
    <>
      <Panel kicker="/ PRICING" tone="hero" className="page-hero" labelledBy="pricing-title">
        <Parallax className="page-orb" distance={60}>
          <HeroOrb className="page-orb-body" />
        </Parallax>
        <div className="page-hero-body">
          <Reveal y={12}>
            <Link className="back-link" href={home}>
              <ArrowLeft size={14} />
              {copy.common.backHome}
            </Link>
          </Reveal>
          <Reveal y={16}>
            <p className="eyebrow">/ {copy.pricing.eyebrow}</p>
          </Reveal>
          <RevealText
            as="h1"
            id="pricing-title"
            onMount
            delay={0.1}
            text={copy.pricing.pageTitle}
            accent={copy.pricing.pageTitleEm}
            className="page-title"
          />
          <Reveal delay={0.3}>
            <p className="page-lead">{ui.sections.pricing.lead}</p>
            <div className="hero-chips">
              <span>
                {copy.pricing.chips.from} <b>{content.entryPrice}</b>
              </span>
              <span>{copy.pricing.chips.dp}</span>
              <span>{copy.pricing.chips.warranty}</span>
            </div>
          </Reveal>
        </div>
      </Panel>

      <Panel id="plans" kicker="/ 01 — PACKAGES" className="panel-auto">
        <PricingExplorer
          locale={lang}
          labels={{
            tabs: {
              website: ui.pricing.websiteTab,
              webapp: ui.pricing.webappTab,
              catalog: lang === "id" ? "Katalog layanan" : "Service catalogue",
              addOns: ui.pricing.addOnsTab,
              maintenance: ui.pricing.maintenanceTitle,
            },
            tabsLabel: copy.pricing.eyebrow,
            from: ui.pricing.from,
            popular: ui.pricing.popular,
            order: copy.pricing.order,
            orderAddOns: copy.pricing.orderAddOns,
            perMonth: ui.pricing.perMonth,
            perMonthShort: copy.pricing.perMonthShort,
            addOnsLead: ui.pricing.addOnsLead,
            maintenanceLead: ui.pricing.maintenanceLead,
            chosen: ui.pricing.chosen,
            estimateTotal: ui.pricing.estimateTotal,
            clearChoice: ui.pricing.clearChoice,
          }}
          websitePlans={content.websitePlans}
          webappPlans={content.webappPlans}
          serviceCatalog={SERVICE_CATALOG[lang]}
          addOns={content.addOns}
          maintenance={content.maintenance}
          intros={{ plan: ui.wa.planIntro, addOn: ui.wa.addOnIntro, maintenance: ui.wa.maintenanceIntro }}
          orderLabels={buildOrderLabels(ui, copy)}
          subject={ui.meta.title}
        />
      </Panel>

      <Panel kicker="/ 02 — HOW TO ORDER" className="panel-auto" labelledBy="how-title">
        <SectionHeading id="how-title" eyebrow={copy.pricing.how.eyebrow} title={copy.pricing.how.title} />
        <ol className="steps">
          {copy.pricing.how.steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.1}>
              <li className="step spot">
                <span className="step-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Panel>

      <Panel kicker="/ 03 — CUSTOM" tone="accent" labelledBy="custom-title">
        <div className="cta-block">
          <p className="eyebrow">{copy.pricing.custom.eyebrow}</p>
          <RevealText
            id="custom-title"
            text={copy.pricing.custom.title}
            accent={copy.pricing.custom.titleEm}
            className="cta-title"
          />
          <Reveal delay={0.15}>
            <p className="cta-body">{copy.pricing.custom.body}</p>
            <div className="cta-actions">
              <Magnetic>
                <Link className="button button-primary button-lg" href={`${home}/contact`}>
                  <ShortLabel full={copy.pricing.custom.action} short={copy.common.request} />
                  <ArrowRight size={16} />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </Panel>

      <Panel kicker="/ 04 — GOOD TO KNOW" className="panel-auto" labelledBy="policies-title">
        <div className="good-to-know">
          <div>
            <Reveal>
              <h2 id="policies-title" className="subhead">
                {copy.pricing.policiesTitle}
              </h2>
            </Reveal>
            <div className="policies">
              {content.policies.map((policy, index) => {
                const Icon = POLICY_ICONS[policy.icon];
                return (
                  <Reveal key={policy.id} delay={(index % 2) * 0.08} className="policy-cell">
                    <article className="policy spot">
                      <Icon size={20} aria-hidden="true" />
                      <h3>{policy.title}</h3>
                      <p>{policy.body}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
          <div>
            <Reveal>
              <h2 className="subhead">{ui.sections.faq.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Faq items={content.faqs} />
            </Reveal>
          </div>
        </div>
      </Panel>
    </>
  );
}
