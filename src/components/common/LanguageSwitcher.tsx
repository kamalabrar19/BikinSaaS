"use client";

import React from "react";
import Link from "next/link";
import { Locale } from "@/types";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  currentLang: Locale;
  className?: string;
}

export function LanguageSwitcher({ currentLang, className }: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Pilihan Bahasa / Language Selection"
      className={cn(
        "inline-flex items-center p-1 rounded-full bg-canvas border border-ink-border text-xs font-semibold",
        className
      )}
    >
      <Link
        href="/id"
        aria-current={currentLang === "id" ? "true" : undefined}
        className={cn(
          "px-2.5 py-1 rounded-full transition-colors",
          currentLang === "id"
            ? "bg-panel text-ink shadow-sm font-bold border border-ink-border/50"
            : "text-ink-muted hover:text-ink"
        )}
      >
        ID
      </Link>
      <Link
        href="/en"
        aria-current={currentLang === "en" ? "true" : undefined}
        className={cn(
          "px-2.5 py-1 rounded-full transition-colors",
          currentLang === "en"
            ? "bg-panel text-ink shadow-sm font-bold border border-ink-border/50"
            : "text-ink-muted hover:text-ink"
        )}
      >
        EN
      </Link>
    </div>
  );
}
