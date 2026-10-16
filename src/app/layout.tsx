import "@/app/globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "BikinSaaS | Website & Sistem Digital",
  description: "Solusi website dan sistem digital untuk bisnis.",
};

export const viewport: Viewport = {
  themeColor: "#25D366",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
