"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * This is the only reason the page used to be a client component in full.
 * Isolated here, the page itself stays a server component and its children
 * still render on the server.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
