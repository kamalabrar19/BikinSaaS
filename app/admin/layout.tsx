import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./admin.css";

/**
 * The panel's own root layout — app/ has no layout.tsx at the top, so this one
 * owns <html> for /admin and none of the public site's chrome is loaded here.
 *
 * It does share the site's two typefaces and its light/dark choice, so the panel
 * reads as the same product as the company profile.
 *
 * The panel is not linked from anywhere and asks not to be indexed (the meta
 * tag below, plus an X-Robots-Tag header from next.config.mjs). It is
 * deliberately absent from robots.txt: a Disallow line would advertise the path
 * to anyone who reads that file.
 */
const text = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-text",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "Panel — BikinSaaS",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f3f1",
};

/* Same key and same default (light) as the public site. */
const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){}`;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" data-theme="light" className={`${text.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="admin-body">{children}</body>
    </html>
  );
}
