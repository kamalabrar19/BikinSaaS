"use client";

import React, { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Mail, Check, X, AlertCircle } from "lucide-react";

interface ContactFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  lang?: "id" | "en";
}

export function ContactFallbackModal({
  isOpen,
  onClose,
  message,
  lang = "id",
}: ContactFallbackModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isId = lang === "id";
  const title = isId ? "Saluran WhatsApp Sedang Dikonfigurasi" : "WhatsApp Setup In Progress";
  const desc = isId
    ? "Nomor WhatsApp resmi sedang dalam proses verifikasi environment. Untuk konsultasi langsung tanpa perantara, silakan hubungi tim BikinSaaS via email resmi:"
    : "The official WhatsApp line is currently being verified in the environment. For direct consultation, please reach out to our official email:";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleMailto = () => {
    const subject = encodeURIComponent(
      isId ? "Konsultasi Website & Sistem — BikinSaaS" : "Website & Digital Systems Consultation — BikinSaaS"
    );
    const body = encodeURIComponent(message || (isId ? "Halo tim BikinSaaS," : "Hello BikinSaaS team,"));
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fallback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-panel rounded-panel border border-ink-border p-6 md:p-8 shadow-panel relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label={isId ? "Tutup modal" : "Close dialog"}
          className="absolute top-5 right-5 p-2 rounded-full text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-tint border border-primary-border flex items-center justify-center text-primary">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {isId ? "Informasi Kontak" : "Contact Notice"}
            </span>
            <h2 id="fallback-modal-title" className="text-lg font-bold text-ink leading-tight">
              {title}
            </h2>
          </div>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed mb-6">
          {desc}
        </p>

        <div className="p-3 rounded-xl bg-canvas border border-ink-border flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm font-mono text-ink font-semibold">
            <Mail className="w-4 h-4 text-primary" />
            <span>{siteConfig.email}</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-panel hover:bg-white text-ink border border-ink-border font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>{isId ? "Tersalin!" : "Copied!"}</span>
              </>
            ) : (
              <span>{isId ? "Salin" : "Copy"}</span>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleMailto}
            className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold text-center transition-colors shadow-sm"
          >
            {isId ? "Kirim Email Sekarang" : "Open Email Client"}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-canvas hover:bg-canvas-alt text-ink text-sm font-medium transition-colors"
          >
            {isId ? "Tutup" : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
}
