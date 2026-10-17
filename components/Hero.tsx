"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { scrollToId } from "@/lib/utils";
import { Logo, Monogram } from "./Logo";
import { PrimaryButton, SecondaryButton } from "./ui";

const ROTATING = ["Company Profile", "Landing Page", "Sistem Custom", "SaaS MVP", "Otomasi WhatsApp"];

function DesktopMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]" aria-hidden>
      {/* layar iMac */}
      <div className="rounded-[1.6rem] bg-charcoal p-2.5 shadow-2xl shadow-charcoal/25">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-white via-soft-green to-white">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-primary-green/25 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-deep-green/15 blur-2xl" />
          {/* mini navbar */}
          <div className="relative flex items-center justify-between px-5 py-3">
            <Logo size={20} />
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-1.5 w-7 rounded-full bg-charcoal/15" />
              ))}
            </div>
          </div>
          {/* logo pusat */}
          <div className="relative flex h-[68%] flex-col items-center justify-center">
            <Monogram size={64} />
            <p className="mt-3 text-2xl font-black tracking-tight text-charcoal">
              Bikin<span className="text-deep-green">SaaS</span>
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/50">Website &amp; Sistem Digital</p>
            <span className="mt-4 rounded-full bg-primary-green px-4 py-1.5 text-[10px] font-bold text-charcoal">Konsultasi Gratis</span>
          </div>
        </div>
      </div>
      {/* dagu + penyangga */}
      <div className="mx-auto -mt-px h-3 w-[97%] rounded-b-2xl bg-gradient-to-b from-stone-200 to-stone-300" />
      <div className="mx-auto h-9 w-16 bg-gradient-to-b from-stone-300 to-stone-200 [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
      <div className="mx-auto h-1.5 w-32 rounded-full bg-stone-300" />
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="w-[7.6rem] rounded-[1.6rem] bg-charcoal p-1.5 shadow-2xl shadow-charcoal/30 sm:w-36" aria-hidden>
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.25rem] bg-white">
        <div className="absolute left-1/2 top-1.5 z-10 h-3 w-12 -translate-x-1/2 rounded-full bg-charcoal" />
        <div className="h-[46%] bg-gradient-to-b from-primary-green to-deep-green pt-7 text-center">
          <Monogram size={26} className="mx-auto bg-white" />
          <p className="mt-1.5 text-[10px] font-extrabold text-white">BikinSaaS</p>
        </div>
        <div className="space-y-1.5 p-2.5">
          <div className="h-1.5 w-4/5 rounded bg-charcoal/15" />
          <div className="h-1.5 w-3/5 rounded bg-charcoal/10" />
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <div className="h-10 rounded-lg bg-soft-green" />
            <div className="h-10 rounded-lg bg-soft-green" />
          </div>
          <div className="mt-1 h-6 rounded-full bg-primary-green" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % ROTATING.length), 2200);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:pb-28">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary-green/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-72 h-80 w-80 rounded-full bg-soft-green blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="text-4xl font-extrabold leading-[1.08] tracking-tight text-charcoal sm:text-5xl lg:text-[3.4rem]"
          >
            Pakar Website dan Sistem Digital untuk <span className="text-primary-green">Segala Bisnis</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600"
          >
            Punya kebutuhan website atau sistem untuk bisnis? Biar kami yang bikinin. Kami mengerjakan{" "}
            <span className="relative inline-flex h-[1.6em] min-w-[10.5rem] items-center overflow-hidden align-bottom font-semibold text-charcoal">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING[i]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute left-0 whitespace-nowrap border-b-2 border-primary-green"
                >
                  {ROTATING[i]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            dengan proses jelas dan harga transparan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.6 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <PrimaryButton onClick={() => scrollToId("kontak")}>
              Konsultasi Gratis <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <SecondaryButton onClick={() => scrollToId("harga")}>Lihat Paket &amp; Harga</SecondaryButton>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600"
          >
            {["Harga transparan", "Garansi bug 14 hari", "Respons 1x24 jam kerja"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-deep-green" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Presentation sheet: desktop + iPhone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative rounded-[2rem] bg-soft-green/70 px-4 pb-12 pt-10 sm:px-8"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
            <DesktopMockup />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -bottom-6 right-3 sm:right-8"
          >
            <PhoneMockup />
          </motion.div>
          <span className="absolute left-5 top-4 rounded-full bg-charcoal px-3 py-1 text-[11px] font-bold text-primary-green">
            Responsif di semua layar
          </span>
        </motion.div>
      </div>
    </section>
  );
}
