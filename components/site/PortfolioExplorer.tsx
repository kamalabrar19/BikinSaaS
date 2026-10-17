"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

import type { WorkItem } from "@/content";
import { cn } from "@/lib/utils";
import { EASE } from "./Motion";
import { WorkCard } from "./WorkCard";

export interface ExplorerEntry {
  item: WorkItem;
  artIndex: number;
  href: string;
  kindLabel: string;
  categoryLabel: string;
}

export function PortfolioExplorer({
  entries,
  categories,
  allLabel,
  countTemplate,
  emptyLabel,
  filterLabel,
}: {
  entries: ExplorerEntry[];
  categories: { id: string; label: string }[];
  allLabel: string;
  countTemplate: string;
  emptyLabel: string;
  filterLabel: string;
}) {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? entries : entries.filter((entry) => entry.item.category === active);
  const countFor = (id: string) =>
    id === "all" ? entries.length : entries.filter((entry) => entry.item.category === id).length;

  const filters = [{ id: "all", label: allLabel }, ...categories];

  return (
    <LayoutGroup>
      <div className="filter-bar">
        <div className="filters" role="group" aria-label={filterLabel}>
          {filters.map((filter) => {
            const isActive = active === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                className={cn("filter", isActive && "is-active")}
                aria-pressed={isActive}
                onClick={() => setActive(filter.id)}
              >
                {isActive ? (
                  <motion.span
                    layoutId="filter-pill"
                    className="filter-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span>{filter.label}</span>
                <sup>{countFor(filter.id)}</sup>
              </button>
            );
          })}
        </div>
        <p className="filter-count" aria-live="polite">
          {countTemplate.replace("{count}", String(visible.length))}
        </p>
      </div>

      <motion.div layout className="portfolio-grid">
        <AnimatePresence mode="popLayout">
          {visible.map((entry) => (
            <motion.div
              key={entry.item.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <WorkCard
                item={entry.item}
                artIndex={entry.artIndex}
                href={entry.href}
                kindLabel={entry.kindLabel}
                categoryLabel={entry.categoryLabel}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 ? <p className="empty">{emptyLabel}</p> : null}
    </LayoutGroup>
  );
}
