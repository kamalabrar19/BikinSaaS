import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./admin.css";

/**
 * The panel's own root layout — app/ has no layout.tsx at the top, so this one
 * owns <html> for /admin and none of the public site's chrome or styles are
 * loaded here.
 *
 * The panel is not linked from anywhere and asks not to be indexed (the meta
 * tag below, plus an X-Robots-Tag header from next.config.mjs). It is
 * deliberately absent from robots.txt: a Disallow line would advertise the path
 * to anyone who reads that file.
 */
export const metadata: Metadata = {
  title: "Panel — BikinSaaS",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f3f1",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="admin-body">{children}</body>
    </html>
  );
}
