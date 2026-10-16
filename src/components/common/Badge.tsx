import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "neutral" | "demo";
  className?: string;
}

export function Badge({ children, variant = "primary", className }: BadgeProps) {
  const variantStyles = {
    primary: "bg-primary-tint text-primary border border-primary-border",
    neutral: "bg-canvas text-ink-muted border border-ink-border",
    demo: "bg-canvas-alt text-ink font-medium border border-ink-border/80 tracking-wide",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
