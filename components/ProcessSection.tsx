"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PROCESS } from "@/constants/site-data";
import { InteractiveCard } from "./InteractiveCard";
import { Monogram } from "./Logo";
import { Reveal, SectionHeading } from "./ui";

export function ProcessSection() {
  return (
    <section id="proses" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Proses"
          title="Empat langkah dari ide sampai online"
          description="Sederhana, terstruktur, dan Anda tahu apa yang terjadi di setiap tahap."
        />

        <div role="list" className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-[10%] right-[10%] top-[3.4rem] hidden h-0.5 origin-left bg-gradient-to-r from-primary-green/10 via-primary-green to-primary-green/10 lg:block"
          />
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.1}>
              <div role="listitem" className="h-full">
                <InteractiveCard className="h-full p-6">
                  <div className="flex items-center justify-between">
                    <Monogram size={44} />
                    <span className="text-4xl font-black tracking-tighter text-charcoal/10">{p.step}</span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wider text-deep-green">
                    Langkah {p.step}
                  </p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight text-charcoal">{p.title}</h3>
                  <p className="text-sm font-medium text-stone-500">{p.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{p.description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-sm text-charcoal">
                        <Check className="h-4 w-4 shrink-0 text-primary-green" /> {pt}
                      </li>
                    ))}
                  </ul>
                </InteractiveCard>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
