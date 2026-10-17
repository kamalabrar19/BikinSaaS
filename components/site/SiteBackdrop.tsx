"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * The ambient layer behind every page. The dot grid stays put; the two glows
 * drift against the scroll, which is where most of the page's sense of depth
 * comes from. Decorative only, so it is hidden from assistive technology.
 */
export function SiteBackdrop() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const first = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -240]);
  const second = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 360]);

  return (
    <div className="site-bg" aria-hidden="true">
      <motion.span className="bg-drift bg-drift-a" style={{ y: first }} />
      <motion.span className="bg-drift bg-drift-b" style={{ y: second }} />
    </div>
  );
}
