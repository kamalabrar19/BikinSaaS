"use client";

import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { MOBILE_SOLUTION, TESTIMONIAL } from "@/constants/site-data";
import { scrollToId } from "@/lib/utils";
import { InteractiveCard } from "./InteractiveCard";
import { Monogram } from "./Logo";
import { Reveal, SectionHeading } from "./ui";

export function TestimonialSection() {
  return (
    <section id="testimonial" className="scroll-mt-20 bg-white/70 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Cerita dari klien yang sudah merasakan hasilnya"
          description="Kami percaya hasil kerja yang baik berbicara lebih keras dari janji."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Testimonial card */}
          <Reveal>
            <InteractiveCard className="flex h-full flex-col p-7 sm:p-9">
              <div className="flex h-full flex-col">
                <Quote className="h-9 w-9 text-primary-green" aria-hidden />
                <blockquote className="mt-5 flex-1 text-lg font-medium leading-relaxed text-charcoal sm:text-xl">
                  “{TESTIMONIAL.quote}”
                </blockquote>
                <div className="mt-7 flex items-center gap-4">
                  <span
                    aria-hidden
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-green to-deep-green text-lg font-black text-white ring-4 ring-soft-green"
                  >
                    {TESTIMONIAL.initials}
                  </span>
                  <div>
                    <p className="font-bold text-charcoal">{TESTIMONIAL.name}</p>
                    <p className="text-sm text-stone-500">
                      {TESTIMONIAL.role}, {TESTIMONIAL.company}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToId("portofolio")}
                  className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-primary-green px-5 py-2.5 text-sm font-semibold text-charcoal shadow-md shadow-primary-green/25 transition hover:bg-deep-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
                >
                  Lihat Cerita Sukses <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </InteractiveCard>
          </Reveal>

          {/* Dark Mobile Solution card */}
          <Reveal delay={0.1}>
            <InteractiveCard className="h-full !border-charcoal !bg-charcoal p-7 text-white sm:p-9">
              <div className="grid h-full items-center gap-6 sm:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="text-2xl font-extrabold leading-tight tracking-tight">
                    Dirancang <span className="text-primary-green">mobile-first</span>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{MOBILE_SOLUTION.description}</p>
                  <ul className="mt-5 space-y-2.5">
                    {MOBILE_SOLUTION.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-white/90">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-green shadow-[0_0_10px_#25D366]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.div
                  aria-hidden
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto w-32 rounded-[1.5rem] border border-white/10 bg-charcoal-alt p-1.5 shadow-[0_0_40px_rgba(37,211,102,0.25)]"
                >
                  <div className="relative aspect-[9/18] overflow-hidden rounded-[1.1rem] bg-white">
                    <div className="absolute left-1/2 top-1.5 h-2.5 w-10 -translate-x-1/2 rounded-full bg-charcoal" />
                    <div className="flex h-1/2 items-end justify-center bg-gradient-to-b from-primary-green to-deep-green pb-3">
                      <Monogram size={30} className="bg-white" />
                    </div>
                    <div className="space-y-1.5 p-2.5">
                      <div className="h-1.5 w-4/5 rounded bg-charcoal/15" />
                      <div className="h-1.5 w-3/5 rounded bg-charcoal/10" />
                      <div className="mt-2 h-6 rounded-full bg-primary-green" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </InteractiveCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
