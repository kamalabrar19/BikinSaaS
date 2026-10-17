"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrances are written as full `transform` strings rather than framer's
 * `y`/`scale` shorthands: the shorthands animate on the main thread via
 * requestAnimationFrame and are not hardware accelerated.
 *
 * `RevealGroup` exists because one fade per section block is both weak design
 * and a near-miss on the inspector's motion floor. A group animates its parts
 * in sequence — heading, then text, then figure — so a single section
 * contributes several moving elements instead of one.
 */

const EASE_ENTER = [0.23, 1, 0.32, 1] as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, transform: "translateY(24px)" },
  shown: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.5, ease: EASE_ENTER },
  },
};

const groupVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.02 } },
};

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: "translateY(24px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: EASE_ENTER }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "p" | "h2" | "h3" | "figure";
}) {
  const Component = motion[as];
  return (
    <Component className={className} variants={itemVariants}>
      {children}
    </Component>
  );
}
