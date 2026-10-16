"use client";

import React, { useState } from "react";
import { Dictionary, Locale } from "@/types";
import { Badge } from "@/components/common/Badge";
import { ContactFallbackModal } from "@/components/common/ContactFallbackModal";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import { ArrowUpRight, MessageCircle, CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react";

interface HeroSectionProps {
  dict: Dictionary;
  lang: Locale;
}

export function HeroSection({ dict, lang }: HeroSectionProps) {
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const { hero } = dict;

  const onPrimaryCtaClick = () => {
    handleWhatsAppClick(hero.primaryCta.waMessage, () => {
      setFallbackOpen(true);
    });
  };

  return (
    <section
      id="beranda"
      aria-label="Hero Section"
      className="w-full py-6 md:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Main White Rounded Panel */}
        <div className="bg-panel rounded-panel md:rounded-panel-lg border border-ink-border p-6 sm:p-10 md:p-14 lg:p-16 shadow-panel">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Editorial Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block">
                <Badge variant="primary" className="text-xs">
                  {hero.badge}
                </Badge>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-ink tracking-tightest leading-[1.12]">
                  {hero.title}{" "}
                  <span className="text-primary underline decoration-primary/30 decoration-wavy decoration-1 underline-offset-8">
                    {hero.highlightedTitle}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-normal max-w-xl pt-2">
                  {hero.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onPrimaryCtaClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-base font-semibold shadow-sm transition-all group"
                >
                  <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>{hero.primaryCta.label}</span>
                </button>

                <a
                  href={hero.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-canvas hover:bg-canvas-alt text-ink text-base font-semibold border border-ink-border transition-colors group"
                >
                  <span>{hero.secondaryCta.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-ink-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Mini trust footnote */}
              <p className="text-xs text-ink-soft flex items-center gap-2 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>
                  {lang === "id"
                    ? "Konsultasi santai • Tanpa paksaan • Respon dalam hitungan jam"
                    : "Friendly chat • Zero pressure • Direct reply within hours"}
                </span>
              </p>
            </div>

            {/* Right Column: Editorial Visual Card (Demo Konsep Preview) */}
            <div className="lg:col-span-5">
              <div className="bg-canvas border border-ink-border rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
                {/* Demo Concept Tag (Mandatory per constraint) */}
                <div className="flex items-center justify-between gap-2 border-b border-ink-border/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-ink">
                      {hero.conceptPreviewCard.badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-panel text-ink-muted px-2 py-0.5 rounded border border-ink-border">
                    {lang === "id" ? "Bukan Data Klien" : "Concept Demo"}
                  </span>
                </div>

                {/* Card Title & Client Type */}
                <div>
                  <h2 className="text-base font-bold text-ink leading-snug">
                    {hero.conceptPreviewCard.title}
                  </h2>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {hero.conceptPreviewCard.clientType}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2.5 py-1">
                  {hero.conceptPreviewCard.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-ink leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Timeline and Guarantee Footer */}
                <div className="pt-3 border-t border-ink-border/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                    <Clock className="w-4 h-4 text-ink-soft" />
                    <span>{hero.conceptPreviewCard.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>{hero.conceptPreviewCard.guaranteeText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: 3 Editorial Value Pillars (Transparent Promises) */}
          <div className="mt-12 pt-10 border-t border-ink-border grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {hero.trustHighlights.map((highlight, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                    {highlight.title}
                  </h3>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fallback dialog */}
      <ContactFallbackModal
        isOpen={fallbackOpen}
        onClose={() => setFallbackOpen(false)}
        message={hero.primaryCta.waMessage}
        lang={lang}
      />
    </section>
  );
}
