"use client";

import { CalendarDays } from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "@/constants/site-data";
import { formatDateID } from "@/lib/utils";
import { InteractiveCard } from "./InteractiveCard";
import { Monogram } from "./Logo";
import { Reveal, SectionHeading } from "./ui";

function BlogVisual({ view }: { view: BlogPost["view"] }) {
  const bg = "relative flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-soft-green via-white to-soft-green";
  const glow = <div aria-hidden className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-green/25 blur-2xl" />;

  if (view === "mobile") {
    return (
      <div className={bg} aria-hidden>
        {glow}
        <div className="relative w-20 rounded-[1.1rem] bg-charcoal p-1 shadow-xl">
          <div className="aspect-[9/17] overflow-hidden rounded-[0.85rem] bg-white">
            <div className="flex h-1/2 items-center justify-center bg-gradient-to-b from-primary-green to-deep-green">
              <Monogram size={22} className="bg-white" />
            </div>
            <div className="space-y-1 p-1.5">
              <div className="h-1 w-4/5 rounded bg-charcoal/15" />
              <div className="h-4 rounded-full bg-primary-green" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (view === "laptop") {
    return (
      <div className={bg} aria-hidden>
        {glow}
        <div className="relative w-44">
          <div className="rounded-t-lg bg-charcoal p-1.5">
            <div className="aspect-[16/10] rounded bg-white p-2">
              <div className="h-1/2 rounded bg-gradient-to-r from-primary-green to-deep-green" />
              <div className="mt-1.5 grid grid-cols-3 gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-4 rounded bg-soft-green" />
                ))}
              </div>
            </div>
          </div>
          <div className="mx-auto h-1.5 w-[112%] -translate-x-[5.5%] rounded-b-xl bg-gradient-to-b from-stone-300 to-stone-400" />
        </div>
      </div>
    );
  }
  return (
    <div className={bg} aria-hidden>
      {glow}
      <div className="relative w-40">
        <div className="rounded-lg bg-charcoal p-1.5">
          <div className="aspect-[16/10] rounded bg-white p-2">
            <div className="flex h-3 items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-green" />
              <span className="h-1 w-8 rounded bg-charcoal/15" />
            </div>
            <div className="mt-1.5 flex h-[55%] items-end gap-1 rounded bg-soft-green p-1.5">
              {[40, 70, 55, 90, 65].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-primary-green" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto h-4 w-6 bg-stone-300 [clip-path:polygon(20%_0,80%_0,100%_100%,0_100%)]" />
        <div className="mx-auto h-1 w-16 rounded-full bg-stone-300" />
      </div>
    </div>
  );
}

export function BlogSection() {
  return (
    <section id="blog" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Blog" title="Latest insights" description="Tulisan singkat seputar branding, pemasaran, dan sistem digital untuk bisnis." />
        <div className="grid gap-5 md:grid-cols-3">
          {BLOG_POSTS.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <InteractiveCard className="h-full p-4">
                <BlogVisual view={post.view} />
                <div className="px-2 pb-2 pt-5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="rounded-full bg-soft-green px-3 py-1 font-bold text-deep-green">{post.category}</span>
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <time dateTime={post.date}>{formatDateID(post.date)}</time>
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-charcoal">{post.title}</h3>
                </div>
              </InteractiveCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
