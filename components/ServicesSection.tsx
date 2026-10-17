"use client";

import { ArrowRight, Bot, Boxes, Check, Layers, Palette, Rocket } from "lucide-react";
import { useCallback, useState } from "react";
import { SERVICES, type ServiceIcon } from "@/constants/site-data";
import { cn, scrollToId } from "@/lib/utils";
import { InteractiveCard } from "./InteractiveCard";
import { Modal } from "./Modal";
import { PrimaryButton, Reveal, SectionHeading } from "./ui";

const ICONS: Record<ServiceIcon, typeof Bot> = {
  palette: Palette,
  rocket: Rocket,
  layers: Layers,
  saas: Boxes,
  bot: Bot,
};

export function ServicesSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const close = useCallback(() => setOpenId(null), []);
  const current = SERVICES.find((s) => s.id === openId) ?? null;

  return (
    <section id="layanan" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Tailored services, designed exclusively for you"
          description="Pilih layanan yang paling dekat dengan kebutuhan Anda. Tidak yakin? Ceritakan saja, kami bantu tentukan."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, idx) => {
            const Icon = ICONS[s.icon];
            const tall = s.span.includes("row-span-2");
            const wide = s.span.includes("col-span-2") || s.span.includes("col-span-3");
            return (
              <Reveal key={s.id} delay={idx * 0.06} className={cn(s.span, wide && "sm:col-span-2")}>
                <InteractiveCard
                  selectable
                  keyboardSelectable={false}
                  active={selected === s.id}
                  onSelect={() => setSelected((cur) => (cur === s.id ? null : s.id))}
                  className="h-full p-6 sm:p-7"
                >
                  <div className="flex h-full flex-col">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-green text-deep-green">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 pr-8 text-xl font-bold tracking-tight text-charcoal">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">{s.description}</p>
                    <ul className={cn("mt-5 gap-2 text-sm text-charcoal", tall ? "space-y-2" : "flex flex-wrap")}>
                      {s.points.map((p) => (
                        <li
                          key={p}
                          className={
                            tall
                              ? "flex items-start gap-2"
                              : "inline-flex items-center gap-1.5 rounded-full bg-soft-green px-3 py-1 text-xs font-medium text-deep-green"
                          }
                        >
                          <Check className={tall ? "mt-0.5 h-4 w-4 shrink-0 text-primary-green" : "h-3 w-3"} />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(s.id);
                          setOpenId(s.id);
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-primary-green px-5 py-2.5 text-sm font-semibold text-charcoal shadow-md shadow-primary-green/25 transition hover:bg-deep-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
                      >
                        Lihat Detail <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </InteractiveCard>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Modal open={!!current} onClose={close} title={current?.title ?? ""} titleId="service-modal-title">
        {current && (
          <div className="space-y-5">
            <p className="leading-relaxed text-stone-700">{current.detail}</p>
            <div className="rounded-2xl bg-soft-green p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-deep-green">Yang Anda dapatkan</p>
              <ul className="mt-3 space-y-2">
                {current.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-charcoal">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-deep-green" /> {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <PrimaryButton
                className="flex-1"
                onClick={() => {
                  close();
                  setTimeout(() => scrollToId("harga"), 250);
                }}
              >
                Lihat Paket &amp; Harga
              </PrimaryButton>
              <PrimaryButton
                className="flex-1 !bg-charcoal !text-white hover:!bg-deep-green"
                onClick={() => {
                  close();
                  setTimeout(() => scrollToId("kontak"), 250);
                }}
              >
                Konsultasi Gratis
              </PrimaryButton>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
