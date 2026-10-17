import { cn } from "@/lib/utils";

/**
 * A plain wordmark in the display face. The previous version put a green
 * accent on "SaaS" and a coloured glow behind it. A styled accent word inside
 * a name, and depth on an element at rest, are both flagged tells.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-lead leading-none tracking-tight text-ink", className)}>
      BikinSaaS
    </span>
  );
}
