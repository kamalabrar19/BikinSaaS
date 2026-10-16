import { buildWhatsAppLink, siteConfig } from "@/config/site";

export { buildWhatsAppLink, siteConfig };

export function handleWhatsAppClick(
  message: string,
  onFallback?: (email: string) => void
) {
  const linkInfo = buildWhatsAppLink(message);
  
  if (linkInfo.isConfigured && linkInfo.url) {
    window.open(linkInfo.url, "_blank", "noopener,noreferrer");
    return;
  }

  if (onFallback) {
    onFallback(linkInfo.email);
  } else {
    // Graceful fallback to mailto
    const subject = encodeURIComponent("Konsultasi Website & Sistem — BikinSaaS");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${linkInfo.email}?subject=${subject}&body=${body}`;
  }
}
