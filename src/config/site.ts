export const siteConfig = {
  name: "BikinSaaS",
  tagline: {
    id: "Pakar Website dan Sistem Digital untuk Segala Bisnis",
    en: "Website and Digital Systems Experts for Every Business",
  },
  defaultLocale: "id" as const,
  locales: ["id", "en"] as const,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "halo@bikinsaas.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://bikinsaas.com",
};

/**
 * Validates and retrieves current WhatsApp configuration.
 * Adheres strictly to the NO FAKE CONTACTS rule.
 */
export function getWhatsAppStatus() {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const cleaned = rawNumber.replace(/\D/g, "");
  
  // Real valid numbers typically have 10-15 digits
  const isConfigured = cleaned.length >= 10;
  
  return {
    isConfigured,
    number: cleaned,
    email: siteConfig.email,
  };
}

/**
 * Builds direct WhatsApp redirect link if configured; otherwise returns fallback info.
 */
export function buildWhatsAppLink(message: string): {
  url: string | null;
  isConfigured: boolean;
  email: string;
} {
  const status = getWhatsAppStatus();
  
  if (!status.isConfigured) {
    return {
      url: null,
      isConfigured: false,
      email: status.email,
    };
  }

  const encodedMessage = encodeURIComponent(message.trim());
  return {
    url: `https://wa.me/${status.number}?text=${encodedMessage}`,
    isConfigured: true,
    email: status.email,
  };
}
