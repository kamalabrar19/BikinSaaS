"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Fades and lifts a block the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const textTags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p } as const;

/**
 * A heading whose words rise out of a mask one after another. `accent` is a
 * second line in the accent colour. Real text stays in the DOM, so search
 * engines and screen readers read it normally.
 */
export function RevealText({
  text,
  accent,
  as = "h2",
  id,
  className,
  delay = 0,
  onMount = false,
}: {
  text: string;
  accent?: string;
  as?: keyof typeof textTags;
  id?: string;
  className?: string;
  delay?: number;
  /** Animate on page load instead of on scroll (for the first screen). */
  onMount?: boolean;
}) {
  const Tag = textTags[as];
  const container = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.055, delayChildren: delay } },
  };
  const word = {
    hidden: { y: "110%" },
    shown: { y: "0%", transition: { duration: 0.9, ease: EASE } },
  };

  const renderWords = (line: string, em: boolean, keyPrefix: string) =>
    line.split(" ").map((part, index) => (
      <Fragment key={`${keyPrefix}-${index}`}>
        <span className="rt-word">
          <motion.span className={em ? "rt-inner rt-em" : "rt-inner"} variants={word}>
            {part}
          </motion.span>
        </span>{" "}
      </Fragment>
    ));

  const trigger = onMount
    ? { animate: "shown" as const }
    : { whileInView: "shown" as const, viewport: VIEWPORT };

  return (
    <Tag id={id} className={className} variants={container} initial="hidden" {...trigger}>
      {renderWords(text, false, "a")}
      {accent ? (
        <>
          <br />
          {renderWords(accent, true, "b")}
        </>
      ) : null}
    </Tag>
  );
}

/** Moves its children against the scroll, for depth. Decorative only. */
export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-distance, distance]);

  return (
    <motion.div ref={ref} className={className} style={{ y }} aria-hidden="true">
      {children}
    </motion.div>
  );
}

/** Counts up from zero the first time the number is seen. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {display}
        <small>{suffix}</small>
      </span>
    </span>
  );
}

/** Pulls its child a little towards the mouse pointer. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className="magnetic" style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}
