import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getContent, type Plan } from "@/content";
import { ContactChannels } from "@/components/site/ContactChannels";
import { ContactForm } from "@/components/site/ContactForm";
import { HeroOrb } from "@/components/site/HeroOrb";
import { buildContactLabels, buildOrderLabels } from "@/components/site/labels";
import { Marquee } from "@/components/site/Marquee";
import { CountUp, Magnetic, Reveal, RevealText } from "@/components/site/Motion";
import { OrderButton } from "@/components/site/OrderDialog";
import { Panel, SectionHeading } from "@/components/site/Panel";
import { PlanCard } from "@/components/site/PlanCard";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { ScrollLink } from "@/components/site/ScrollLink";
import { WorkCard } from "@/components/site/WorkCard";
import { consultTarget, targetProps } from "@/lib/contact";
import { isLocale } from "@/lib/locale";
import { siteCopy } from "@/lib/site-copy";

/** The three plans shown on the home page: cheapest, most chosen website, most chosen app. */
const TEASER_PLANS = ["lp-starter", "cp-plus", "biz-app"] as const;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = getContent(lang);
  const { ui } = content;
  const copy = siteCopy[lang];
  const home = `/${lang}`;
  const consult = consultTarget(lang, ui.wa.consult, ui.meta.title);
  const orderLabels = buildOrderLabels(ui, copy);

  const allPlans = [...content.websitePlans, ...content.webappPlans];
  const teaserPlans = TEASER_PLANS.map((id) => allPlans.find((plan) => plan.id === id)).filter(
    (plan): plan is Plan => plan !== undefined,
  );

  return (
    <>
      {/* 01 — Hero */}
      <Panel kicker="/ 01 — INTRO" tone="hero" className="hero" labelledBy="hero-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <Reveal y={16}>
              <p className="hero-overline">
                <span className="pulse-dot" />
                {copy.hero.overline}
              </p>
            </Reveal>
            <RevealText as="h1" id="hero-title" onMount delay={0.1} text={ui.hero.statement} className="hero-title" />
            <Reveal delay={0.35}>
              <p className="hero-description">{ui.hero.support}</p>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="hero-actions">
                <Magnetic>
                  <a className="button button-primary button-lg" {...targetProps(consult)}>
                    {ui.hero.action}
                    <ArrowRight size={17} />
                  </a>
                </Magnetic>
                <Link className="button button-ghost button-lg" href={`${home}/pricing`}>
                  {ui.hero.secondaryAction}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
          <HeroOrb label="IDN — REMOTE" />
        </div>
        <div className="hero-footer">
          <span>{ui.footer.place}</span>
          <ScrollLink href="#services" className="scroll-cue">
            {copy.hero.scroll}
            <span className="scroll-cue-line" />
          </ScrollLink>
          <span>© {content.launchYear}</span>
        </div>
      </Panel>

      <Marquee items={copy.marquee} />

      {/* 02 — Services */}
      <Panel id="services" kicker="/ 02 — CAPABILITIES" labelledBy="services-title">
        <SectionHeading
          id="services-title"
          eyebrow={copy.services.eyebrow}
          title={ui.sections.services.title}
          lead={ui.sections.services.lead}
        />
        <div className="service-grid">
          {content.services.map((service, index) => (
            <Reveal key={service.id} className="service-cell" delay={(index % 3) * 0.08}>
              <article className="service-card spot">
                <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="service-arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <ul className="service-points">
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
          <Reveal className="service-cell" delay={0.16}>
            <Link className="service-card service-card-cta spot" href={`${home}/contact`}>
              <span className="service-number">+</span>
              <span className="service-arrow" aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
              <h3>{copy.services.customTitle}</h3>
              <p>{copy.services.customBody}</p>
            </Link>
          </Reveal>
        </div>
      </Panel>

      {/* 03 — Numbers */}
      <section className="stats-band" aria-labelledby="stats-title">
        <div className="stats-intro">
          <p className="eyebrow">/ 03 — {copy.stats.eyebrow}</p>
          <RevealText id="stats-title" text={copy.stats.title} accent={copy.stats.titleEm} className="stats-title" />
        </div>
        <div className="stats-list">
          {copy.stats.items.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.08}>
              <div className="stat">
                <CountUp value={item.value} prefix={item.prefix} suffix={item.suffix} className="stat-value" />
                <p>{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 04 — Process */}
      <Panel id="process" kicker="/ 04 — METHOD" labelledBy="process-title">
        <div className="process-layout">
          <div className="process-sticky">
            <SectionHeading
              id="process-title"
              eyebrow={copy.process.eyebrow}
              title={ui.sections.process.title}
              lead={ui.sections.process.lead}
            />
          </div>
          <ProcessTimeline steps={content.process} />
        </div>
      </Panel>

      {/* 05 — Selected work */}
      <Panel id="work" kicker="/ 05 — SELECTED WORK" labelledBy="work-title">
        <div className="section-head-row">
          <SectionHeading
            id="work-title"
            eyebrow={copy.work.eyebrow}
            title={ui.sections.work.title}
            lead={ui.sections.work.lead}
          />
          <Reveal>
            <Link className="button button-ghost" href={`${home}/portfolio`}>
              {copy.work.viewAll}
              <ArrowUpRight size={15} />
            </Link>
          </Reveal>
        </div>
        <div className="work-grid">
          {content.work.slice(0, 4).map((item, index) => (
            <Reveal key={item.id} delay={(index % 2) * 0.1}>
              <WorkCard
                item={item}
                artIndex={index}
                href={`${home}/portfolio/${item.id}`}
                kindLabel={item.kind === "takeover" ? copy.work.client : copy.work.concept}
                categoryLabel={ui.work.categories[item.category]}
              />
            </Reveal>
          ))}
        </div>
      </Panel>

      {/* 06 — Pricing */}
      <Panel id="pricing" kicker="/ 06 — PRICING" labelledBy="pricing-title">
        <div className="section-head-row">
          <SectionHeading
            id="pricing-title"
            eyebrow={copy.pricing.eyebrow}
            title={ui.sections.pricing.title}
            lead={ui.sections.pricing.lead}
          />
          <Reveal>
            <Link className="button button-ghost" href={`${home}/pricing`}>
              {copy.pricing.viewAll}
              <ArrowUpRight size={15} />
            </Link>
          </Reveal>
        </div>
        <div className="plan-grid">
          {teaserPlans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 0.08}>
              <PlanCard
                plan={plan}
                index={index}
                fromLabel={ui.pricing.from}
                popularLabel={ui.pricing.popular}
                action={
                  <OrderButton
                    label={copy.pricing.order}
                    className={plan.popular ? "button button-primary" : "button button-ghost"}
                    intro={ui.wa.planIntro}
                    lines={[{ name: plan.name, priceLabel: plan.priceLabel }]}
                    labels={orderLabels}
                    subject={ui.meta.title}
                  />
                }
              />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="custom-strip spot">
            <div>
              <p className="eyebrow">{copy.pricing.custom.eyebrow}</p>
              <h3>
                {copy.pricing.custom.title} <em>{copy.pricing.custom.titleEm}</em>
              </h3>
              <p>{copy.pricing.custom.body}</p>
            </div>
            <Magnetic>
              <Link className="button button-primary button-lg" href={`${home}/contact`}>
                {copy.pricing.custom.action}
                <ArrowRight size={16} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </Panel>

      {/* 07 — Contact */}
      <Panel id="contact" kicker="/ 07 — LET'S TALK" labelledBy="contact-title">
        <div className="contact-layout">
          <div>
            <SectionHeading
              id="contact-title"
              eyebrow={copy.contact.eyebrow}
              title={ui.sections.contact.title}
              lead={ui.sections.contact.lead}
            />
            <Reveal delay={0.2}>
              <ContactChannels copy={copy} consult={consult} place={ui.footer.place} />
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ContactForm
              labels={buildContactLabels(ui, copy)}
              services={Object.values(ui.contact.services)}
              budgets={Object.values(ui.contact.budgets)}
              subject={ui.meta.title}
            />
          </Reveal>
        </div>
      </Panel>
    </>
  );
}
