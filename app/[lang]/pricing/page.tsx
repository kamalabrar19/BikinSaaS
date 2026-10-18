import { ArrowLeft, ArrowRight, RefreshCw, Server, ShieldCheck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getContent, type Policy } from "@/content";
import { Faq } from "@/components/site/Faq";
import { HeroOrb } from "@/components/site/HeroOrb";
import { buildOrderLabels } from "@/components/site/labels";
import { Magnetic, Parallax, Reveal, RevealText } from "@/components/site/Motion";
import { Panel, SectionHeading } from "@/components/site/Panel";
import { PricingExplorer } from "@/components/site/PricingExplorer";
import { isLocale, locales } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { getSiteCopy } from "@/lib/site-content";

const POLICY_ICONS: Record<Policy["icon"], LucideIcon> = {
  wallet: Wallet,
  shield: ShieldCheck,
  refresh: RefreshCw,
  server: Server,
};

/* Safety net; the panel revalidates every page on save. */
export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { ui } = getContent(lang);
  return pageMetadata(
    lang,
    "/pricing",
    `${ui.sections.pricing.title} · BikinSaaS`,
    ui.sections.pricing.lead ?? ui.meta.description,
  );
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
                  {copy.pricing.custom.action}
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
