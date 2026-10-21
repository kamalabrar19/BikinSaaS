import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { categoryLabel, getContent } from "@/content";
import { Magnetic, Parallax, Reveal, RevealText } from "@/components/site/Motion";
import { Panel } from "@/components/site/Panel";
import { WorkArt, WorkCover } from "@/components/site/WorkCard";
import { targetProps } from "@/lib/contact";
import { isLocale, locales } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { getSiteCopy } from "@/lib/site-content";
import { composeMessage, consultTarget } from "@/lib/whatsapp";

/* Slugs come from the content the site actually serves (the seed plus anything
   the panel added), so an item created in the panel is prerendered too. A slug
   that appears after a build still renders on demand. */
export const dynamicParams = true;

/* Safety net; the panel revalidates every page on save. */
export const revalidate = 300;

export function generateStaticParams() {
  return locales.flatMap((lang) => getContent(lang).work.map((entry) => ({ lang, slug: entry.id })));
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const item = getContent(lang).work.find((entry) => entry.id === slug);
  if (!item) return {};
  return pageMetadata(lang, `/portfolio/${item.id}`, `${item.title} · BikinSaaS`, item.solution);
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const content = getContent(lang);
  const { ui } = content;
  const copy = getSiteCopy(lang);
  const home = `/${lang}`;

  const index = content.work.findIndex((entry) => entry.id === slug);
  const item = content.work[index];
  if (!item) notFound();

  const next = content.work[(index + 1) % content.work.length];
  const kindLabel = item.kind === "takeover" ? copy.work.client : copy.work.concept;
  const similar = consultTarget(
    lang,
    composeMessage(ui.wa.workSimilar, [`${copy.nav.work}: ${item.title}`]),
    ui.meta.title,
  );

  const blocks = [
    { label: ui.work.labelBefore, text: item.before },
    { label: ui.work.labelSolution, text: item.solution },
    { label: ui.work.labelResult, text: item.result },
  ];

  return (
    <>
      <Panel
        kicker={`/ ${copy.caseStudy.eyebrow.toUpperCase()} ${String(index + 1).padStart(2, "0")}`}
        tone="hero"
        className="page-hero case-hero"
        labelledBy="case-title"
      >
        <div className="page-hero-body">
          <Reveal y={12}>
            <Link className="back-link" href={`${home}/portfolio`}>
              <ArrowLeft size={14} />
              {copy.caseStudy.back}
            </Link>
          </Reveal>
          <Reveal y={16}>
            <div className="case-tags">
              <span className="tag tag-accent">{kindLabel}</span>
              {categoryLabel(content, item.category) ? <span className="tag">{categoryLabel(content, item.category)}</span> : null}
            </div>
          </Reveal>
          <RevealText as="h1" id="case-title" onMount delay={0.1} text={item.title} className="page-title case-title" />
          <Reveal delay={0.3}>
            <p className="page-lead">{item.client}</p>
          </Reveal>
          {item.website ? (
            <Reveal delay={0.4}>
              <a className="button button-primary" href={item.website} target="_blank" rel="noopener noreferrer">
                {copy.caseStudy.visit}
                <ArrowUpRight size={16} />
              </a>
            </Reveal>
          ) : null}
        </div>
      </Panel>

      {item.cover ? (
        <div className="case-art-frame">
          <WorkCover src={item.cover} className="work-art case-art" alt={item.title} />
        </div>
      ) : (
        <div className="case-art-frame">
          <Parallax distance={40}>
            <WorkArt index={index} className="work-art case-art" />
          </Parallax>
        </div>
      )}

      <Panel kicker="/ 01 — OVERVIEW" className="panel-auto">
        <div className="case-columns">
          {blocks.map((block, blockIndex) => (
            <Reveal key={block.label} delay={blockIndex * 0.1}>
              <article className="case-block spot">
                <span>{String(blockIndex + 1).padStart(2, "0")}</span>
                <h2>{block.label}</h2>
                <p>{block.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="case-detail">
          <Reveal>
            <p className="case-detail-text">{item.detail}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <p className="eyebrow">{ui.work.stackLabel}</p>
              <ul className="stack">
                {item.stack.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Uploaded from the panel. Pictures and videos share the block, so a
            work item can show a screen recording next to its screenshots. */}
        {item.gallery?.length ? (
          <div className="case-gallery">
            {item.gallery.map((media, mediaIndex) => (
              <figure className="case-shot" key={`${media.src}-${mediaIndex}`}>
                <WorkCover
                  src={media.src}
                  className="case-shot-frame"
                  alt={media.alt || item.title}
                />
                {media.caption ? <figcaption>{media.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        ) : null}
      </Panel>

      <Panel kicker="/ 02 — NEXT" tone="accent" labelledBy="case-cta">
        <div className="cta-block">
          <p className="eyebrow">{copy.caseStudy.nextEyebrow}</p>
          <RevealText
            id="case-cta"
            text={copy.pricing.custom.title}
            accent={copy.pricing.custom.titleEm}
            className="cta-title"
          />
          <Reveal delay={0.15}>
            <div className="cta-actions">
              <Magnetic>
                <a className="button button-primary button-lg" {...targetProps(similar)}>
                  {copy.caseStudy.similar}
                  <ArrowUpRight size={16} />
                </a>
              </Magnetic>
            </div>
          </Reveal>
          {next && next.id !== item.id ? (
            <Link className="next-project" href={`${home}/portfolio/${next.id}`}>
              <span>
                <small>{copy.caseStudy.next}</small>
                <strong>{next.title}</strong>
              </span>
              <ArrowRight size={28} />
            </Link>
          ) : null}
        </div>
      </Panel>
    </>
  );
}
