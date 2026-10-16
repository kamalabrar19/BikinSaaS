import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BikinSaaS — Pakar Website & Sistem Digital",
  description:
    "Punya kebutuhan website atau sistem untuk bisnis? Biar kami yang bikinin. Company profile, landing page, web app, SaaS MVP, dan otomasi WhatsApp dengan harga transparan.",
};

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
