import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getContent } from "@/content";
import { HeroOrb } from "@/components/site/HeroOrb";
import { Magnetic, Reveal, RevealText } from "@/components/site/Motion";
import { Panel } from "@/components/site/Panel";
import { PortfolioExplorer, type ExplorerEntry } from "@/components/site/PortfolioExplorer";
import { isLocale, locales } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { siteCopy } from "@/lib/site-copy";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { ui } = getContent(lang);
  return pageMetadata(
    lang,
    "/portfolio",
    `${ui.sections.work.title} · BikinSaaS`,
    ui.sections.work.lead ?? ui.meta.description,
  );
}

export default async function PortfolioPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = getContent(lang);
  const { ui } = content;
  const copy = siteCopy[lang];
  const home = `/${lang}`;

  const entries: ExplorerEntry[] = content.work.map((item, index) => ({
    item,
    artIndex: index,
    href: `${home}/portfolio/${item.id}`,
    kindLabel: item.kind === "takeover" ? copy.work.client : copy.work.concept,
    categoryLabel: ui.work.categories[item.category],
  }));

  const categories = content.workCategories.map((id) => ({ id, label: ui.work.categories[id] }));

  return (
    <>
      <Panel kicker="/ PORTFOLIO" tone="hero" className="page-hero" labelledBy="portfolio-title">
        <HeroOrb className="page-orb" />
        <div className="page-hero-body">
          <Reveal y={12}>
            <Link className="back-link" href={home}>
              <ArrowLeft size={14} />
              {copy.common.backHome}
            </Link>
          </Reveal>
          <Reveal y={16}>
            <p className="eyebrow">/ {copy.portfolio.eyebrow}</p>
          </Reveal>
          <RevealText
            as="h1"
            id="portfolio-title"
            onMount
            delay={0.1}
            text={copy.portfolio.title}
            accent={copy.portfolio.titleEm}
            className="page-title"
          />
          <Reveal delay={0.3}>
            <p className="page-lead">{ui.sections.work.lead}</p>
            <p className="notice">{ui.work.conceptNotice}</p>
          </Reveal>
        </div>
      </Panel>

      <Panel kicker={`/ 01 — ${copy.portfolio.filter}`} className="panel-auto">
        <PortfolioExplorer
          entries={entries}
          categories={categories}
          allLabel={ui.work.categories.all}
          countTemplate={copy.portfolio.count}
          emptyLabel={copy.portfolio.empty}
          filterLabel={copy.portfolio.filter}
        />
      </Panel>

      <Panel kicker="/ 02 — CUSTOM" tone="accent" labelledBy="portfolio-cta">
        <div className="cta-block">
          <p className="eyebrow">{copy.pricing.custom.eyebrow}</p>
          <RevealText
            id="portfolio-cta"
            text={copy.pricing.custom.title}
            accent={copy.pricing.custom.titleEm}
            className="cta-title"
          />
          <Reveal delay={0.15}>
            <p className="cta-body">{copy.pricing.custom.body}</p>
            <div className="cta-actions">
              <Magnetic>
                <Link className="button button-primary button-lg" href={`${home}/contact`}>
                  {copy.pricing.custom.action}
                  <ArrowRight size={16} />
                </Link>
              </Magnetic>
              <Link className="button button-ghost button-lg" href={`${home}/pricing`}>
                {copy.pricing.viewAll}
              </Link>
            </div>
          </Reveal>
        </div>
      </Panel>
    </>
  );
}
