import { cn } from "@/lib/utils";

/** Monogram B-S: ikon hijau dengan huruf B (charcoal) dan S (putih) yang saling menimpa. */
export function Monogram({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-[28%] bg-primary-green font-black leading-none tracking-tighter shadow-sm shadow-primary-green/40",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.46 }}
    >
      <span className="text-charcoal">B</span>
      <span className="-ml-[0.06em] text-white">S</span>
    </span>
  );
}

/** Logo lengkap: monogram + wordmark "BikinSaaS". `tone="light"` untuk latar gelap. */
export function Logo({ size = 36, tone = "dark", className }: { size?: number; tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Monogram size={size} />
      <span
        className={cn("font-extrabold tracking-tight", tone === "light" ? "text-white" : "text-charcoal")}
        style={{ fontSize: size * 0.56 }}
      >
        Bikin<span className={tone === "light" ? "text-primary-green" : "text-deep-green"}>SaaS</span>
      </span>
    </span>
  );
}
