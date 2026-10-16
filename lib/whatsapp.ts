export const WA_NUMBER = (process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890").replace(/\D/g, "");

export function waLink(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  if (typeof window === "undefined") return;
  window.open(waLink(message), "_blank", "noopener,noreferrer");
}
