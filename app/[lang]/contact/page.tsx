import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getContent } from "@/content";
import { ContactChannels } from "@/components/site/ContactChannels";
import { ContactForm } from "@/components/site/ContactForm";
import { HeroOrb } from "@/components/site/HeroOrb";
import { buildContactLabels } from "@/components/site/labels";
import { Parallax, Reveal, RevealText } from "@/components/site/Motion";
import { Panel } from "@/components/site/Panel";
import { consultTarget } from "@/lib/whatsapp";
import { isLocale, locales } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { getSiteCopy } from "@/lib/site-content";

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
    "/contact",
    `${ui.sections.contact.title} · BikinSaaS`,
    ui.sections.contact.lead ?? ui.meta.description,
  );
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = getContent(lang);
  const { ui } = content;
  const copy = getSiteCopy(lang);
  const home = `/${lang}`;
  const consult = consultTarget(lang, ui.wa.consult, ui.meta.title);

  return (
    <>
      <Panel kicker="/ CONTACT" tone="hero" className="page-hero page-hero-short" labelledBy="contact-page-title">
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
            <p className="eyebrow">/ {copy.contact.eyebrow}</p>
          </Reveal>
          <RevealText
            as="h1"
            id="contact-page-title"
            onMount
            delay={0.1}
            text={copy.contact.title}
            accent={copy.contact.titleEm}
            className="page-title"
          />
          <Reveal delay={0.3}>
            <p className="page-lead">{ui.sections.contact.lead}</p>
          </Reveal>
        </div>
      </Panel>

      <Panel id="contact" kicker="/ 01 — BRIEF" className="panel-auto">
        <div className="contact-layout contact-layout-page">
          <Reveal>
            <h2 className="subhead">{copy.contact.formTitle}</h2>
            <ContactForm
              labels={buildContactLabels(ui, copy)}
              services={Object.values(ui.contact.services)}
              budgets={Object.values(ui.contact.budgets)}
              subject={ui.meta.title}
            />
          </Reveal>
          <aside className="contact-aside">
            <Reveal delay={0.1}>
              <ContactChannels copy={copy} consult={consult} place={ui.footer.place} />
            </Reveal>
            <Reveal delay={0.2}>
              <div className="after-steps">
                <p className="eyebrow">{copy.contact.stepsTitle}</p>
                <ol>
                  {copy.contact.steps.map((step, index) => (
                    <li key={step.title}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link className="button button-ghost" href={`${home}/pricing`}>
                  {copy.contact.seePricing}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </Panel>
    </>
  );
}
