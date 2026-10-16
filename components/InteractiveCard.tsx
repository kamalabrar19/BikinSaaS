"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  /** kartu bisa dipilih (menampilkan border glow + ceklist saat active) */
  selectable?: boolean;
  active?: boolean;
  onSelect?: () => void;
  /** besar kemiringan 3D dalam derajat */
  tilt?: number;
  /**
   * Jika false, kartu tidak dijadikan role="button" (mis. karena berisi tombol di dalamnya).
   * Seleksi lewat keyboard harus disediakan oleh kontrol di dalam kartu.
   */
  keyboardSelectable?: boolean;
  ariaLabel?: string;
}

const REST_SHADOW = "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -14px rgba(17,24,39,0.10)";
const HOVER_SHADOW = "0 0 0 1px rgba(37,211,102,0.55), 0 0 30px rgba(37,211,102,0.20), 0 20px 40px -18px rgba(18,140,74,0.35)";
const ACTIVE_SHADOW = "0 0 0 1.5px #25D366, 0 0 34px rgba(37,211,102,0.38), 0 22px 44px -16px rgba(18,140,74,0.45)";

export function InteractiveCard({
  children,
  className,
  selectable = false,
  active = false,
  onSelect,
  tilt = 6,
  keyboardSelectable = true,
  ariaLabel,
}: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), spring);
  const gx = useTransform(px, [0, 1], ["0%", "100%"]);
  const gy = useTransform(py, [0, 1], ["0%", "100%"]);
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${gx} ${gy}, rgba(37,211,102,0.12), transparent 70%)`;

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const asButton = selectable && keyboardSelectable;
  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!asButton) return;
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={selectable ? onSelect : undefined}
      onKeyDown={handleKey}
      role={asButton ? "button" : undefined}
      tabIndex={asButton ? 0 : undefined}
      aria-pressed={asButton ? active : undefined}
      aria-label={asButton ? ariaLabel : undefined}
      initial={false}
      animate={{
        boxShadow: active ? ACTIVE_SHADOW : REST_SHADOW,
        borderColor: active ? "rgba(37,211,102,1)" : "rgba(226,232,240,0.9)",
        y: active && !reduce ? -4 : 0,
      }}
      whileHover={reduce ? undefined : { y: active ? -8 : -6, boxShadow: active ? ACTIVE_SHADOW : HOVER_SHADOW, borderColor: "rgba(37,211,102,0.7)" }}
      whileTap={selectable && !reduce ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-white will-change-transform",
        selectable && "cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        className
      )}
    >
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}

      <div className="relative">{children}</div>

      <AnimatePresence>
        {selectable && active && (
          <motion.span
            key="check"
            aria-hidden
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary-green text-charcoal shadow-md"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.08 }}
              />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
