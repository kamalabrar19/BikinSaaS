"use client";

import { useState } from "react";
import { ArrowUpRight, Check, ChevronDown, MessageCircle, ShieldCheck } from "lucide-react";
import { addOnGroups, applicationPackages, pricingPolicies, websitePackages, type PricingPackage } from "../../../constants/site-data";
import { buildWhatsAppLink, siteConfig } from "@/config/site";

function PackageCard({ item }: { item: PricingPackage }) {
  const message = `Halo BikinSaaS, saya tertarik dengan paket ${item.name} (${item.price}). Saya ingin konsultasi detail paketnya.`;
  const contact = buildWhatsAppLink(message);
  const href = contact.url ?? `mailto:${siteConfig.email}?subject=${encodeURIComponent(`Konsultasi ${item.name}`)}&body=${encodeURIComponent(message)}`;
  return <article className={`price-card ${item.badge ? "price-card-featured" : ""}`}>
    {item.badge && <span className="price-badge">{item.badge}</span>}
    <div className="price-card-head"><span className="price-dot" /><span>BIKINSaaS / PACKAGE</span></div>
    <h3>{item.name}</h3><p className="price-value">{item.price}</p><p className="price-description">{item.description}</p>
    <ul>{item.features.map((feature) => <li key={feature}><Check className="h-4 w-4" />{feature}</li>)}</ul>
    <a className="price-cta" href={href} target={contact.url ? "_blank" : undefined} rel={contact.url ? "noreferrer" : undefined}>Pilih Paket <ArrowUpRight className="h-4 w-4" /></a>
  </article>;
}

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<"website" | "application">("website");
  const packages = activeTab === "website" ? websitePackages : applicationPackages;
  const customMessage = "Halo BikinSaaS, saya punya kebutuhan spesifik di luar paket dan ingin konsultasi kustom.";
  const contact = buildWhatsAppLink(customMessage);
  const contactHref = contact.url ?? `mailto:${siteConfig.email}?subject=Konsultasi Kustom BikinSaaS&body=${encodeURIComponent(customMessage)}`;

  return <div className="pricing-page">
    <header className="pricing-nav"><a href="/id" className="pricing-logo">Bikin<span>SaaS</span><b>BS</b></a><nav><a href="/id#layanan">Layanan</a><a href="/id#process">Cara kerja</a><a href="/harga" aria-current="page">Harga</a></nav><a className="pricing-nav-cta" href={contactHref} target={contact.url ? "_blank" : undefined} rel={contact.url ? "noreferrer" : undefined}>Konsultasi <ArrowUpRight className="h-4 w-4" /></a></header>

    <main>
      <section className="pricing-hero"><span className="pricing-kicker"><i /> INVESTASI YANG TERUKUR</span><h1>Transparan.<br /><em>Sesuai kebutuhan.</em></h1><p>Mulai dari website sederhana hingga aplikasi bisnis custom. Pilih fondasi yang sesuai, lalu kembangkan saat bisnis siap.</p><div className="pricing-trust"><span><ShieldCheck className="h-4 w-4" /> Scope jelas</span><span><ShieldCheck className="h-4 w-4" /> Tanpa biaya tersembunyi</span><span><ShieldCheck className="h-4 w-4" /> Bisa konsultasi dulu</span></div></section>

      <section className="pricing-section package-section"><div className="section-title-row"><div><span className="pricing-kicker"><i /> PILIH JALUR</span><h2>Mulai dari kebutuhan<br />yang paling dekat.</h2></div><p>Belum yakin? Ceritakan alur bisnis Anda. Kami bantu memetakan paket yang paling masuk akal.</p></div><div className="pricing-tabs" role="tablist"><button className={activeTab === "website" ? "active" : ""} onClick={() => setActiveTab("website")} role="tab" aria-selected={activeTab === "website"}>Website Development <span>06</span></button><button className={activeTab === "application" ? "active" : ""} onClick={() => setActiveTab("application")} role="tab" aria-selected={activeTab === "application"}>Web Application <span>03</span></button></div><div className="price-grid">{packages.map((item) => <PackageCard key={item.name} item={item} />)}</div></section>

      <section className="pricing-section addon-section"><div className="section-title-row"><div><span className="pricing-kicker"><i /> TAMBAHKAN SAAT PERLU</span><h2>Layanan tambahan,<br /><em>tetap transparan.</em></h2></div><p>Mulai dengan scope inti. Tambahkan kebutuhan lain ketika memang sudah memberi dampak untuk operasional Anda.</p></div><div className="addon-grid">{addOnGroups.map((group) => <details className="addon-panel" key={group.title} open><summary><span>{group.title}</span><ChevronDown className="h-4 w-4" /></summary><div>{group.items.map((item) => <div className="addon-row" key={item.name}><span>{item.name}</span><b>{item.price}</b></div>)}</div></details>)}</div></section>

      <section className="pricing-section policy-section"><div className="section-title-row"><div><span className="pricing-kicker"><i /> KEBIJAKAN KERJA</span><h2>Jelas sejak awal.<br /><em>Nyaman saat jalan.</em></h2></div><p>Aturan sederhana ini menjaga ekspektasi, ritme kerja, dan kualitas hasil tetap sehat untuk kedua pihak.</p></div><div className="policy-grid">{pricingPolicies.map((policy, index) => <article key={policy.title}><span>0{index + 1}</span><h3>{policy.title}</h3><p>{policy.detail}</p></article>)}</div></section>

      <section className="pricing-cta"><div><span className="pricing-kicker"><i /> BUTUH ARAH?</span><h2>Punya kebutuhan spesifik<br />di luar paket?</h2><p>Mari diskusikan alur bisnis dan targetnya. Kami akan bantu menyusun scope yang realistis.</p></div><a className="pricing-cta-button" href={contactHref} target={contact.url ? "_blank" : undefined} rel={contact.url ? "noreferrer" : undefined}><MessageCircle className="h-5 w-5" /> Konsultasi Kustom <ArrowUpRight className="h-4 w-4" /></a></section>
    </main>
    <footer className="pricing-footer"><a href="/id" className="pricing-logo">Bikin<span>SaaS</span><b>BS</b></a><span>Website and digital systems experts for every business.</span><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><small>© {new Date().getFullYear()} BikinSaaS</small></footer>
  </div>;
}
