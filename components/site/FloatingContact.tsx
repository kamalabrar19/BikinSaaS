"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { targetProps } from "@/lib/contact";
import type { ContactTarget } from "@/lib/contact-target";
import { EASE } from "./Motion";

/** A chat button that slides in once the visitor has left the first screen. */
export function FloatingContact({ label, target }: { label: string; target: ContactTarget }) {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => setVisible(latest > 520));

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          className="float-cta"
          {...targetProps(target)}
          aria-label={label}
          initial={{ y: 90, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 90, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: EASE }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="float-cta-icon">
            <MessageCircle size={18} />
          </span>
          <span className="float-cta-label">{label}</span>
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
