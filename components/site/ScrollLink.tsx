"use client";

import { ArrowUp } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";

import { useSite } from "./Providers";

/** An in-page anchor that glides with Lenis instead of jumping. */
export function ScrollLink({
  href,
  className,
  children,
}: {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
}) {
  const { scrollTo } = useSite();
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollTo(href);
  };
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export function BackToTop({ label }: { label: string }) {
  const { scrollTo } = useSite();
  return (
    <button type="button" className="to-top" onClick={() => scrollTo(0)}>
      {label}
      <ArrowUp size={14} />
    </button>
  );
}
