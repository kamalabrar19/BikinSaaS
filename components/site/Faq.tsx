"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { EASE } from "./Motion";

/**
 * Answers stay in the DOM when collapsed (height 0, not unmounted), so they
 * are still read by search engines.
 */
export function Faq({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="faq">
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `faq-${item.id}`;
        return (
          <div key={item.id} className={cn("faq-item", isOpen && "is-open")}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              <span>{item.question}</span>
              <span className="faq-icon" aria-hidden="true">
                <Plus size={16} />
              </span>
            </button>
            <motion.div
              id={panelId}
              className="faq-a"
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              aria-hidden={!isOpen}
            >
              <p>{item.answer}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
