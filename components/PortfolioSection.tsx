"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  PORTFOLIO,
  PORTFOLIO_FILTERS,
  type PortfolioCategory,
  type PortfolioItem,
  type PreviewVariant,
} from "@/constants/site-data";
import { cn, scrollToId } from "@/lib/utils";
import { InteractiveCard } from "./InteractiveCard";
import { Modal } from "./Modal";
import { Reveal, SectionHeading } from "./ui";

function MockPreview({ variant }: { variant: PreviewVariant }) {
  // Desktop (browser) + iPhone overlay, isi menyesuaikan jenis proyek.
  const screen =
    variant === "dashboard" ? (
      <div className="p-2.5">
        <div className="mb-2 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-6 flex-1 rounded-md bg-soft-green" />
          ))}
        </div>
        <div className="flex h-16 items-end gap-1 rounded-lg bg-stone-50 p-2">
          {[35, 60, 45, 80, 55, 90, 70, 85].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-deep-green to-primary-green" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    ) : variant === "store" ? (
      <div className="grid grid-cols-3 gap-1.5 p-2.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-md bg-stone-50 p-1">
            <div className={cn("h-8 rounded", i % 2 ? "bg-primary-green/40" : "bg-stone-200")} />
            <div className="mt-1 h-1 w-3/4 rounded bg-stone-200" />
            <div className="mt-0.5 h-1 w-1/3 rounded bg-deep-green/70" />
          </div>
        ))}
      </div>
    ) : variant === "ssb" ? (
      <div className="relative h-full bg-gradient-to-br from-soft-green to-white p-2.5">
        <div className="absolute inset-x-4 top-1/2 h-px bg-primary-green/40" />
        <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-green/50" />
        <div className="relative h-2.5 w-20 rounded bg-charcoal/20" />
        <div className="relative mt-12 h-6 w-24 rounded-full bg-primary-green" />
      </div>
    ) : (
      <div className="p-2.5">
        <div className="h-14 rounded-lg bg-gradient-to-r from-primary-green to-deep-green" />
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-9 rounded-md bg-stone-50" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-soft-green via-white to-soft-green p-4" aria-hidden>
      {/* desktop */}
      <div className="w-[78%] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-md">
        <div className="flex items-center gap-1 border-b border-stone-100 bg-stone-50 px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary-green" />
        </div>
        <div className="h-[6.2rem] overflow-hidden">{screen}</div>
      </div>
      {/* iPhone */}
      <div className="absolute bottom-3 right-4 w-[4.2rem] rounded-[0.9rem] bg-charcoal p-[3px] shadow-xl">
        <div className="relative aspect-[9/17] overflow-hidden rounded-[0.7rem] bg-white">
          <div className="absolute left-1/2 top-1 h-1.5 w-6 -translate-x-1/2 rounded-full bg-charcoal" />
          <div className="h-[42%] bg-gradient-to-b from-primary-green to-deep-green" />
          <div className="space-y-1 p-1.5">
            <div className="h-1 w-4/5 rounded bg-charcoal/15" />
            <div className="h-1 w-3/5 rounded bg-charcoal/10" />
            <div className="h-3.5 rounded-full bg-primary-green" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: PortfolioItem["status"] }) {
  const takeover = status === "Client Takeover";
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        takeover ? "bg-primary-green text-charcoal" : "bg-charcoal/10 text-charcoal"
      )}
    >
      {status}
    </span>
  );
}

export function PortfolioSection() {
  const [filter, setFilter] = useState<"all" | PortfolioCategory>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const close = useCallback(() => setOpenId(null), []);

  const items = useMemo(() => PORTFOLIO.filter((p) => filter === "all" || p.category === filter), [filter]);
  const current = PORTFOLIO.find((p) => p.id === openId) ?? null;

  return (
    <section id="portofolio" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Portofolio"
          title="Dari nol, maupun menyelamatkan sistem yang sudah ada"
          description="Selain membangun dari awal, kami mengambil alih (takeover) dan merapikan sistem atau website yang bermasalah."
        />

        <Reveal className="mb-10">
          <div role="group" aria-label="Filter portofolio" className="flex flex-wrap justify-center gap-2">
            {PORTFOLIO_FILTERS.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green",
                    isActive ? "border-transparent text-charcoal" : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="portfolio-filter-pill"
                      className="absolute inset-0 rounded-full bg-primary-green shadow-md shadow-primary-green/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <InteractiveCard
                  selectable
                  keyboardSelectable={false}
                  active={selected === p.id}
                  onSelect={() => setSelected(p.id)}
                  className="flex h-full flex-col p-4"
                >
                  <div className="flex h-full flex-col">
                    <MockPreview variant={p.preview} />
                    <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                      <div className="flex items-center justify-between gap-2 pr-8">
                        <StatusBadge status={p.status} />
                      </div>
                      <h3 className="mt-3 text-lg font-bold leading-snug text-charcoal">{p.title}</h3>
                      <p className="text-xs text-stone-500">{p.client}</p>

                      <dl className="mt-4 flex-1 space-y-2.5 text-sm">
                        <div>
                          <dt className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Masalah sebelum</dt>
                          <dd className="text-stone-700">{p.before}</dd>
                        </div>
                        <div>
                          <dt className="text-[11px] font-bold uppercase tracking-wide text-deep-green">Solusi agency</dt>
                          <dd className="text-stone-700">{p.solution}</dd>
                        </div>
                        <div>
                          <dt className="text-[11px] font-bold uppercase tracking-wide text-emerald-600">Hasil operasional</dt>
                          <dd className="text-stone-700">{p.result}</dd>
                        </div>
                      </dl>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(p.id);
                          setOpenId(p.id);
                        }}
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-primary-green hover:text-deep-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green"
                      >
                        Lihat Detail Case Study <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </InteractiveCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Modal open={!!current} onClose={close} title={current?.title ?? ""} titleId="case-modal-title">
        {current && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={current.status} />
              <span className="text-sm text-stone-500">{current.client}</span>
            </div>
            <MockPreview variant={current.preview} />
            <p className="leading-relaxed text-stone-700">{current.detail}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { l: "Masalah sebelum", t: current.before, c: "text-stone-500" },
                { l: "Solusi agency", t: current.solution, c: "text-deep-green" },
                { l: "Hasil operasional", t: current.result, c: "text-emerald-600" },
              ].map((b) => (
                <div key={b.l} className="rounded-2xl bg-stone-50 p-4">
                  <p className={cn("text-[11px] font-bold uppercase tracking-wide", b.c)}>{b.l}</p>
                  <p className="mt-1 text-sm text-stone-700">{b.t}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {current.stack.map((s) => (
                <span key={s} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                  {s}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                close();
                setTimeout(() => scrollToId("kontak"), 250);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-green px-6 py-3 text-sm font-semibold text-charcoal shadow-md shadow-primary-green/25 transition hover:bg-deep-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
            >
              Punya kasus serupa? Konsultasi gratis <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
