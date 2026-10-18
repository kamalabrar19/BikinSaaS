import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Content } from "@/content";
import { targetProps } from "@/lib/contact";
import type { Locale } from "@/lib/locale";
import type { SiteCopy } from "@/lib/site-copy";
import { contactEmail, isWhatsappConfigured, type ContactTarget } from "@/lib/whatsapp";
import { Magnetic, Reveal, RevealText } from "./Motion";
import { BackToTop } from "./ScrollLink";

export function SiteFooter({
  locale,
  content,
  copy,
  consult,
}: {
  locale: Locale;
  content: Content;
  copy: SiteCopy;
  consult: ContactTarget;
}) {
  const { ui } = content;
  const home = `/${locale}`;
  /* Resolved per render: the admin panel can change these while the server runs. */
  const email = contactEmail();
  const hasWhatsapp = isWhatsappConfigured();
  const pages = [
    { href: home, label: copy.common.backHome },
    { href: `${home}/portfolio`, label: copy.nav.work },
    { href: `${home}/pricing`, label: copy.nav.pricing },
    { href: `${home}/contact`, label: copy.nav.contact },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Reveal y={16}>
            <p className="eyebrow">/ {copy.footer.eyebrow}</p>
          </Reveal>
          <RevealText text={copy.footer.title} accent={copy.footer.titleEm} className="footer-title" />
        </div>
        <Reveal delay={0.15}>
          <p className="footer-body">{ui.footer.ctaBody}</p>
          <div className="footer-actions">
            <Magnetic>
              <a className="button button-primary button-lg" {...targetProps(consult)}>
                {ui.footer.actionChat}
                <ArrowUpRight size={16} />
              </a>
            </Magnetic>
            <Link className="button button-ghost button-lg" href={`${home}/pricing`}>
              {copy.pricing.viewAll}
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <Link href={home} className="site-logo">
            <span className="site-logo-mark">B</span>
            <span className="site-logo-word">BikinSaaS</span>
          </Link>
          <p>{ui.footer.tagline}</p>
        </div>
        <div className="footer-col">
          <h4>{copy.footer.pages}</h4>
          <ul>
            {pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href}>{page.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>{copy.footer.reach}</h4>
          <ul>
            {hasWhatsapp ? (
              <li>
                <a {...targetProps(consult)}>{ui.footer.whatsappLabel}</a>
              </li>
            ) : null}
            {email ? (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            ) : null}
            <li>
              <Link href={`${home}/contact`}>{copy.contact.formTitle}</Link>
            </li>
            <li>
              <span>{ui.footer.place}</span>
            </li>
          </ul>
        </div>
      </div>

      <p className="footer-wordmark" aria-hidden="true">
        BikinSaaS
      </p>

      <div className="footer-bottom">
        <span>
          © {content.launchYear} BikinSaaS. {ui.footer.rights}
        </span>
        <BackToTop label={copy.footer.toTop} />
      </div>
    </footer>
  );
}
