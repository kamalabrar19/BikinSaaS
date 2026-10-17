"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 58%"] });
  const y = useTransform(scrollYProgress, [0, 1], [42, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return <motion.div ref={ref} style={{ y, opacity }} transition={{ duration: 0.7, delay }} className={className}>{children}</motion.div>;
}

export function Parallax({ children, className = "", distance = 70 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}
