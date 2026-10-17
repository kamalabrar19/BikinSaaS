import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { WorkItem } from "@/content";

/**
 * A portfolio card. The artwork is abstract on purpose: the client projects
 * are shown without names, and the concepts have no screenshots to show.
 * `artIndex` is the item's position in the full list, so a project keeps the
 * same artwork on the home page, the portfolio and its case study.
 */
export function WorkCard({
  item,
  artIndex,
  href,
  kindLabel,
  categoryLabel,
}: {
  item: WorkItem;
  artIndex: number;
  href: string;
  kindLabel: string;
  categoryLabel: string;
}) {
  return (
    <Link href={href} className="work-card spot">
      <WorkArt index={artIndex} kindLabel={kindLabel} />
      <div className="work-meta">
        <div>
          <p className="work-category">{categoryLabel}</p>
          <h3>{item.title}</h3>
          <p className="work-client">{item.client}</p>
        </div>
        <span className="work-go" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}

export function WorkArt({
  index,
  kindLabel,
  className = "work-art",
}: {
  index: number;
  kindLabel?: string;
  className?: string;
}) {
  return (
    <div className={`${className} art-${index % 4}`} aria-hidden="true">
      <span className="work-art-ring" />
      <span className="work-art-index">{String(index + 1).padStart(2, "0")}</span>
      {kindLabel ? <span className="work-art-kind">{kindLabel}</span> : null}
    </div>
  );
}
