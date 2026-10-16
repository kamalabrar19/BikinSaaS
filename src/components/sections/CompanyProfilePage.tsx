import { ArrowUpRight, Check, ChevronRight, Menu, Play, Sparkles } from "lucide-react";
import { Dictionary, Locale } from "@/types";
import { siteConfig } from "@/config/site";

type ProfileProps = { dict: Dictionary; lang: Locale };

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return <span className={`brand-mark ${inverse ? "brand-mark-inverse" : ""}`} aria-hidden="true">BS</span>;
}

function Phone({ title, eyebrow, dark = false, children }: { title: string; eyebrow: string; dark?: boolean; children?: React.ReactNode }) {
  return <div className={`mock-phone ${dark ? "mock-phone-dark" : ""}`}>
    <div className="phone-speaker" />
    <div className="phone-screen">
      <div className="phone-top"><BrandMark inverse={dark} /><span>09:41</span><Menu className="h-3.5 w-3.5" /></div>
      <p className="mock-eyebrow">{eyebrow}</p>
      <h3 className="phone-title">{title}</h3>
      {children ?? <div className="phone-art"><span>B</span><span>S</span></div>}
      <div className="phone-line"><span /> <span /> <span /></div>
    </div>
  </div>;
}

function BrowserPanel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return <div className={`mock-browser ${className}`}><div className="browser-bar"><span className="browser-dots"><i /><i /><i /></span><span className="browser-url">bikinsaas.com / {title.toLowerCase().replaceAll(" ", "-")}</span><ArrowUpRight className="h-3.5 w-3.5" /></div><div className="browser-content">{children}</div></div>;
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="sheet-intro"><span className="section-kicker"><span className="kicker-dot" />{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function CompanyProfilePage({ dict, lang }: ProfileProps) {
  const { hero, services, howItWorks, portfolio, preFooter, footer } = dict;
  const email = siteConfig.email;
  const mailto = `mailto:${email}?subject=${encodeURIComponent("Konsultasi BikinSaaS")}`;

  return <div className="profile-page">
    <header className="profile-nav">
      <a href={`/${lang}`} className="profile-logo" aria-label="BikinSaaS home">Bikin<span>SaaS</span><BrandMark /></a>
      <nav className="profile-links" aria-label="Primary navigation"><a href="#services">Services</a><a href="#process">Process</a><a href="#work">Work</a><a href="#contact">Contact</a></nav>
      <div className="profile-nav-actions"><a href={lang === "id" ? "/en" : "/id"} className="language-link">{lang === "id" ? "EN" : "ID"}</a><a href={mailto} className="green-button compact">Start a project <ArrowUpRight className="h-4 w-4" /></a></div>
    </header>

    <main>
      <section className="profile-hero">
        <div className="hero-copy"><span className="section-kicker"><span className="kicker-dot" />{hero.badge.replace("✦ ", "")}</span><h1>{hero.title} <em>{hero.highlightedTitle}</em></h1><p>{hero.description}</p><div className="hero-actions"><a href={mailto} className="green-button">{hero.primaryCta.label}<ArrowUpRight className="h-4 w-4" /></a><a href="#services" className="text-button">Explore services <ChevronRight className="h-4 w-4" /></a></div><div className="hero-note"><span className="pulse-dot" /> Plain language, clear scope, real support</div></div>
        <div className="hero-board" aria-label="BikinSaaS interface previews"><div className="board-label">Selected interface studies <span>01 — 06</span></div><div className="hero-devices"><Phone title="Tailored services" eyebrow="For every business" /><Phone title="Outstanding experience" eyebrow="Built around you" dark /></div><BrowserPanel title="Process outline" className="hero-browser"><p className="mock-eyebrow">A clear path forward</p><h3>Here's a process outline<br />for your services.</h3><div className="process-mini"><span>01</span><div><b>Discovery</b><small>Understand the real problem.</small></div><span>02</span><div><b>Research</b><small>Find the simplest useful answer.</small></div></div><a href="#process" className="mini-link">See our process <ArrowUpRight className="h-3.5 w-3.5" /></a></BrowserPanel></div>
      </section>

      <section className="sheet-section visual-sheet" id="services"><SectionIntro eyebrow="The BikinSaaS approach" title="Tailored digital services, designed exclusively for you." text={services.description} /><div className="sheet-grid top-grid"><BrowserPanel title="Tailored services" className="services-browser"><div className="mock-browser-brand"><BrandMark /><span>BikinSaaS</span></div><h3>Made to fit<br /><span>your next move.</span></h3><ul>{services.items.slice(0, 3).map((item) => <li key={item.id}><Check className="h-4 w-4" />{item.title}</li>)}</ul><a href="#contact" className="green-button compact">Let's talk <ArrowUpRight className="h-4 w-4" /></a></BrowserPanel><div className="imac-card"><div className="imac-screen"><BrandMark /><strong>Bikin<span>SaaS</span></strong><small>WEBSITE & DIGITAL SYSTEMS FOR EVERY BUSINESS</small></div><div className="imac-stand" /></div><div className="service-list-card"><span className="number-label">01 / SERVICES</span><h3>Design systems<br />that work hard.</h3><ul>{services.items.slice(0, 3).map((item, index) => <li key={item.id}><span>0{index + 1}</span>{item.badge}</li>)}</ul><a href="#contact" className="circle-link" aria-label="Explore services"><ArrowUpRight className="h-5 w-5" /></a></div></div></section>

      <section className="sheet-section process-section" id="process"><SectionIntro eyebrow="A better way to build" title="From a friendly chat to a product that works." text={howItWorks.description} /><div className="process-layout"><div className="quote-card"><div className="quote-avatar">KW</div><span className="quote-mark">“</span><blockquote>Good digital work should feel clear from day one. No jargon, no guessing, just a better way forward.</blockquote><div className="quote-author"><b>Kane Williams</b><span>Founder, product builder</span></div><a href="#contact" className="mini-link">View more <ArrowUpRight className="h-3.5 w-3.5" /></a></div><BrowserPanel title="How we work" className="process-browser"><div className="process-browser-head"><BrandMark /><span>How we work</span><Play className="h-4 w-4" /></div><h3>Every project starts<br /><span>with understanding.</span></h3><div className="process-steps">{howItWorks.stages.map((stage) => <div className="process-step" key={stage.step}><span>{stage.step}</span><div><b>{stage.title}</b><p>{stage.description}</p></div><ChevronRight className="h-4 w-4" /></div>)}</div></BrowserPanel><Phone title="Built for the real world" eyebrow="Digital systems" dark><div className="phone-dark-art"><span>◎</span><b>Make work<br />feel lighter.</b><small>Web apps, internal tools, and SaaS MVPs.</small></div></Phone></div></section>

      <section className="sheet-section work-section" id="work"><div className="work-head"><SectionIntro eyebrow="Concepts with intention" title="A glimpse into what we can make together." text={portfolio.description} /><a href="#contact" className="text-button">See all concepts <ArrowUpRight className="h-4 w-4" /></a></div><div className="work-grid">{portfolio.items.map((item, index) => <article className={`work-card work-card-${index + 1}`} key={item.id}><div className="work-card-top"><span>0{index + 1}</span><Sparkles className="h-4 w-4" /></div><div><p>{item.category}</p><h3>{item.title}</h3><div className="tag-row">{item.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div></div><a href={mailto} aria-label={`Discuss ${item.title}`} className="circle-link"><ArrowUpRight className="h-5 w-5" /></a></article>)}</div></section>

      <section className="contact-sheet" id="contact"><div className="contact-sheet-copy"><span className="section-kicker"><span className="kicker-dot" />Let's make it useful</span><h2>Ready to make your business easier to run?</h2><p>{preFooter.description}</p><div className="contact-actions"><a href={mailto} className="contact-button">Contact us <ArrowUpRight className="h-5 w-5" /></a><a href={`mailto:${email}?subject=${encodeURIComponent("Schedule a call with BikinSaaS")}`} className="contact-button outline">Schedule a call <ArrowUpRight className="h-5 w-5" /></a></div></div><div className="contact-orbit"><BrandMark inverse /><span>BS</span><small>WEBSITE<br />SYSTEMS<br />AUTOMATION</small></div></section>
    </main>

    <footer className="profile-footer"><div><a href={`/${lang}`} className="profile-logo">Bikin<span>SaaS</span><BrandMark /></a><p>{footer.tagline}</p></div><div className="footer-columns"><div><b>Explore</b><a href="#services">Services</a><a href="#process">Process</a><a href="#work">Work</a></div><div><b>Contact</b><a href={mailto}>{email}</a><a href={mailto}>Start a project</a></div><div><b>Language</b><a href={lang === "id" ? "/en" : "/id"}>{lang === "id" ? "English" : "Bahasa Indonesia"}</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} BikinSaaS. {footer.rights}</span><span className="footer-monogram"><BrandMark /> Built with clarity.</span></div></footer>
  </div>;
}
