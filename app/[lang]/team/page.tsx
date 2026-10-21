import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getContent } from "@/content";
import { HeroOrb } from "@/components/site/HeroOrb";
import { ShortLabel } from "@/components/site/ShortLabel";
import { Parallax, Reveal, RevealText } from "@/components/site/Motion";
import { Panel } from "@/components/site/Panel";
import { TeamGrid } from "@/components/site/TeamSection";
import { isLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { getSiteCopy } from "@/lib/site-content";

/* Read on every request: members added or edited in the panel show up at once. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = getSiteCopy(lang);
  return pageMetadata(lang, "/team", `${copy.nav.team} · BikinSaaS`, copy.team.lead);
}

export default async function TeamPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = getContent(lang);
  const copy = getSiteCopy(lang);
  const home = `/${lang}`;

  return (
    <>
      <Panel kicker="/ TEAM" tone="hero" className="page-hero page-hero-short" labelledBy="team-page-title">
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
            <p className="eyebrow">/ {copy.team.eyebrow}</p>
          </Reveal>
          <RevealText
            as="h1"
            id="team-page-title"
            onMount
            delay={0.1}
            text={copy.team.title}
            accent={copy.team.titleEm}
            className="page-title"
          />
          <Reveal delay={0.3}>
            <p className="page-lead">{copy.team.lead}</p>
          </Reveal>
        </div>
      </Panel>

      <Panel kicker="/ 01 — PEOPLE" className="panel-auto">
        {content.team.length ? (
          <TeamGrid members={content.team} />
        ) : (
          <p className="notice">{copy.team.empty}</p>
        )}
        <Reveal>
          <div className="team-cta">
            <Link className="button button-primary button-lg" href={`${home}/contact`}>
              <ShortLabel full={copy.team.cta} short={copy.common.talk} />
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </Panel>
    </>
  );
}
