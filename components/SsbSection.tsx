"use client";

import { CalendarDays, ClipboardList, Info, ShieldHalf, Users } from "lucide-react";
import { SSB_FEATURES } from "@/constants/site-data";
import { scrollToId } from "@/lib/utils";
import { InteractiveCard } from "./InteractiveCard";
import { Reveal } from "./ui";

const ICONS = { profil: ShieldHalf, ku: Users, jadwal: CalendarDays, daftar: ClipboardList } as const;

export function SsbSection() {
  return (
    <section id="ssb" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-charcoal p-8 text-white shadow-xl shadow-charcoal/20 sm:p-12">
            <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[18px] border-primary-green/20" />
            <div aria-hidden className="absolute -bottom-24 right-24 h-56 w-56 rounded-full border-[14px] border-primary-green/10" />
            <span className="relative inline-block rounded-full bg-primary-green/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-green">
              Spesialis Sekolah Sepak Bola
            </span>
            <h2 className="relative mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Calon pemain bisa mengenal dan mendaftar ke SSB kamu lewat satu website.
            </h2>
            <p className="relative mt-4 max-w-xl text-white/80">
              Berhenti menjawab pertanyaan yang sama di chat satu per satu. Biarkan website yang menjelaskan SSB Anda dan menerima pendaftaran.
            </p>
            <button
              type="button"
              onClick={() => scrollToId("kontak")}
              className="relative mt-7 rounded-full bg-primary-green px-6 py-3 text-sm font-bold text-charcoal shadow-lg shadow-primary-green/30 transition hover:bg-deep-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              Buat Website SSB Saya
            </button>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SSB_FEATURES.map((f, i) => {
            const Icon = ICONS[f.id as keyof typeof ICONS];
            return (
              <Reveal key={f.id} delay={i * 0.07}>
                <InteractiveCard className="h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-soft-green text-deep-green">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-charcoal">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{f.body}</p>
                </InteractiveCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary-green/30 bg-soft-green p-5 text-sm text-charcoal">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              <strong>Perlu diketahui:</strong> ini adalah <strong>website pendaftaran</strong>, bukan LMS atau database internal SSB yang lengkap
              (mis. absensi, keuangan, atau rapor pemain). Jika Anda membutuhkan sistem internal, kami bisa membahasnya sebagai proyek terpisah.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
