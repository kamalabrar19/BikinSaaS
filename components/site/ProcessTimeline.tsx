"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

import type { ProcessStep } from "@/content";
import { EASE } from "./Motion";

/** The four steps, with a line that fills as the visitor scrolls past them. */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <ol ref={ref} className="timeline">
      <span className="timeline-track" aria-hidden="true">
        <motion.span className="timeline-fill" style={{ scaleY: fill }} />
      </span>
      {steps.map((step, index) => (
        <motion.li
          key={step.id}
          className="timeline-step"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="timeline-dot" aria-hidden="true" />
          <p className="timeline-index">{String(index + 1).padStart(2, "0")}</p>
          <h3>{step.title}</h3>
          <span className="timeline-sub">{step.subtitle}</span>
          <p>{step.body}</p>
          <ul className="timeline-points">
            {step.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ol>
  );
}
