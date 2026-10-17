"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/**
 * The orb and orbits from the approved design. The orbits spin on their own
 * (CSS), the orbs lean towards the mouse and the whole group drifts down as
 * the page scrolls, so the first screen is never static.
 */
export function HeroOrb({ label, className = "hero-visual" }: { label?: string; className?: string }) {
  const reduce = useReducedMotion();
  const pointerX = useSpring(0, { stiffness: 50, damping: 18 });
  const pointerY = useSpring(0, { stiffness: 50, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 2);
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY, reduce]);

  const { scrollY } = useScroll();
  const drift = useTransform(scrollY, [0, 900], reduce ? [0, 0] : [0, 180]);
  const largeX = useTransform(pointerX, (v) => v * 26);
  const largeY = useTransform(pointerY, (v) => v * 20);
  const smallX = useTransform(pointerX, (v) => v * -48);
  const smallY = useTransform(pointerY, (v) => v * -36);
  const orbitTilt = useTransform(pointerX, (v) => v * 8);

  return (
    <div className={className} aria-hidden="true">
      <motion.div className="hero-visual-inner" style={{ y: drift }}>
        <motion.div className="orbit-layer" style={{ rotate: orbitTilt }}>
          <div className="orbit orbit-one">
            <i />
          </div>
          <div className="orbit orbit-two">
            <i />
          </div>
        </motion.div>
        <motion.div className="orb-layer" style={{ x: largeX, y: largeY }}>
          <div className="orb orb-large" />
        </motion.div>
        <motion.div className="orb-layer orb-layer-small" style={{ x: smallX, y: smallY }}>
          <div className="orb orb-small" />
        </motion.div>
        {label ? <span className="hero-coordinate">{label}</span> : null}
      </motion.div>
    </div>
  );
}
