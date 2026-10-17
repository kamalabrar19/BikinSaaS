import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one accent colour belongs to actions and nothing else. Buttons are flat
 * and nearly square: in the study, a soft 9-16px radius was the weak-site
 * default, and depth on an element at rest is a flagged tell.
 */

const base =
  "press inline-flex items-center justify-center gap-2 rounded-sm text-meta font-semibold transition-colors duration-150 ease-enter";

const sizes = {
  lg: "px-7 py-4",
  md: "px-5 py-3",
};

const tones = {
  solid: "bg-action text-paper hover:bg-action-deep",
  plain: "bg-surface text-ink hover:bg-field",
  quiet: "text-ink underline decoration-1 underline-offset-4 hover:text-action",
};

export function Action({
  href,
  children,
  tone = "solid",
  size = "md",
  external = false,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={cn(base, tone !== "quiet" && sizes[size], tones[tone], className)}
    >
      {children}
    </a>
  );
}
