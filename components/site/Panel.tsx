import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal, RevealText } from "./Motion";

/**
 * The bordered panel from the approved design: a mono kicker with a status
 * dot, then content. Every section on every page is one of these, full width
 * and (on larger screens) at least one screen tall.
 */
export function Panel({
  id,
  kicker,
  tone,
  className,
  labelledBy,
  children,
}: {
  id?: string;
  kicker: string;
  tone?: "hero" | "accent";
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("panel", tone && `panel-${tone}`, className)}
    >
      <div className="panel-kicker">
        <span className="status-dot" />
        {kicker}
      </div>
      {children}
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  accent,
  lead,
  className,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={cn("section-head", className)}>
      <Reveal y={16}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <RevealText id={id} text={title} accent={accent} className="section-title" />
      {lead ? (
        <Reveal delay={0.15}>
          <p className="section-lead">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
