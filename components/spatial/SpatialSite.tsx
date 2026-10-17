"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ExternalLink,
  Grid2X2,
  Linkedin,
  Mail,
  Maximize2,
  Menu,
  Minus,
  Move,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Content } from "@/content";
import { contactHref } from "@/lib/whatsapp";
import { Reveal, Parallax } from "@/components/spatial/ScrollMotion";
import { SmoothScroll } from "@/components/spatial/SmoothScroll";

const WORLD = { width: 2700, height: 2100 } as const;
const BOUNDS = { minX: -720, maxX: 120, minY: -360, maxY: 220 } as const;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.8;

type Point = { x: number; y: number };
type PanelId = "hero" | "services" | "pricing" | "metrics" | "process" | "work" | "contact";

const positions: Record<PanelId, { x: number; y: number; width: number; height: number }> = {
  hero: { x: 160, y: 190, width: 850, height: 600 },
  services: { x: 1190, y: 190, width: 820, height: 590 },
  metrics: { x: 2130, y: 190, width: 410, height: 590 },
  process: { x: 160, y: 940, width: 720, height: 850 },
  work: { x: 970, y: 940, width: 1060, height: 850 },
  contact: { x: 2120, y: 940, width: 420, height: 850 },
  pricing: { x: 160, y: 190, width: 850, height: 600 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function Panel({
  id,
  label,
  children,
  className = "",
}: {
  id: PanelId;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={`panel-${id}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: id === "hero" ? 0.1 : 0.2 }}
      aria-labelledby={`${id}-heading`}
      className={`spatial-panel absolute overflow-hidden ${className}`}
      style={{ left: positions[id].x, top: positions[id].y, width: positions[id].width, minHeight: positions[id].height }}
    >
      <div className="panel-kicker"><span className="status-dot" />{label}</div>
      {children}
    </motion.section>
  );
}

function PanelTitle({ eyebrow, title, body, id }: { eyebrow?: string; title: string; body?: string; id: string }) {
  return (
    <div className="panel-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={`${id}-heading`}>{title}</h2>
      {body && <p className="panel-lead">{body}</p>}
    </div>
  );
}

export function SpatialSite({ content, locale }: { content: Content; locale: "id" | "en" }) {
  const [offset, setOffset] = useState<Point>({ x: -80, y: -80 });
  const [zoom, setZoom] = useState(0.75);
  const [miniMap, setMiniMap] = useState(true);
  const [shortcuts, setShortcuts] = useState(false);
  const [listView, setListView] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const drag = useRef<{ point: Point; offset: Point } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const ui = content.ui;
  const otherLocale = locale === "id" ? "en" : "id";
  const consult = contactHref(ui.wa.consult, ui.meta.title);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("bikinsaas-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("bikinsaas-theme", nextTheme);
  };

  const move = useCallback((dx: number, dy: number) => {
    setOffset((current) => ({
      x: clamp(current.x + dx, BOUNDS.minX, BOUNDS.maxX),
      y: clamp(current.y + dy, BOUNDS.minY, BOUNDS.maxY),
    }));
  }, []);

  const reset = useCallback(() => {
    setOffset({ x: -80, y: -80 });
    setZoom(0.75);
  }, []);

  const zoomBy = useCallback((amount: number) => setZoom((current) => clamp(Number((current + amount).toFixed(2)), MIN_ZOOM, MAX_ZOOM)), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      if (event.key === "ArrowLeft") move(100, 0);
      if (event.key === "ArrowRight") move(-100, 0);
      if (event.key === "ArrowUp") move(0, 100);
      if (event.key === "ArrowDown") move(0, -100);
      if (event.key === "+" || event.key === "=") zoomBy(0.1);
      if (event.key === "-") zoomBy(-0.1);
      if (event.key === "Home") reset();
      if (event.key === "End") setOffset({ x: BOUNDS.minX, y: BOUNDS.minY });
      if (event.key.toLowerCase() === "m") setMiniMap((current) => !current);
      if (event.key === "?") setShortcuts((current) => !current);
      if (event.key === "Escape") { setShortcuts(false); setMobileMenu(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, reset, zoomBy]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button, a, input, textarea, select")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { point: { x: event.clientX, y: event.clientY }, offset };
    setDragging(true);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.point.x;
    const dy = event.clientY - drag.current.point.y;
    setOffset({
      x: clamp(drag.current.offset.x + dx, BOUNDS.minX, BOUNDS.maxX),
      y: clamp(drag.current.offset.y + dy, BOUNDS.minY, BOUNDS.maxY),
    });
  };
  const stopDragging = () => { drag.current = null; setDragging(false); };
  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomBy(event.deltaY > 0 ? -0.06 : 0.06);
  };

  const goTo = (id: PanelId) => {
    document.getElementById(`panel-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenu(false);
  };

  const navItems = useMemo(() => [
    { id: "services" as PanelId, label: ui.nav.sections.services, href: undefined },
    { id: "process" as PanelId, label: ui.nav.sections.process, href: undefined },
    { id: "work" as PanelId, label: ui.nav.sections.work, href: `/${locale}/portfolio` },
    { id: "pricing" as PanelId, label: ui.nav.sections.pricing, href: `/${locale}/pricing` },
    { id: "contact" as PanelId, label: ui.nav.sections.contact, href: undefined },
  ], [locale, ui.nav.sections]);

  return (
    <SmoothScroll>
    <div className={`spatial-shell theme-${theme} ${listView ? "list-view" : ""}`}>
      <header className="spatial-header">
        <Link href={`/${locale}`} className="spatial-logo" aria-label="BikinSaaS home"><span>B</span> BikinSaaS</Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => item.href ? <Link key={item.id} href={item.href}>{item.label}</Link> : <button key={item.id} onClick={() => goTo(item.id)}>{item.label}</button>)}
        </nav>
        <div className="header-actions">
          <Link className="language-link" href={`/${otherLocale}`} hrefLang={otherLocale}>{locale === "id" ? "EN" : "ID"}</Link>
          <button className="theme-button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>{theme === "dark" ? <Sun size={16} /> : <MoonIcon />}</button>
          <a className="header-cta" href={consult.href} target={consult.external ? "_blank" : undefined} rel={consult.external ? "noreferrer" : undefined}>{ui.nav.action}<ExternalLink size={14} /></a>
          <button className="menu-button" aria-label="Menu" onClick={() => setMobileMenu((current) => !current)}>{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      {mobileMenu && <div className="mobile-nav">{navItems.map((item) => item.href ? <Link key={item.id} href={item.href}>{item.label}<ArrowRight size={16} /></Link> : <button key={item.id} onClick={() => goTo(item.id)}>{item.label}<ArrowRight size={16} /></button>)}</div>}

      <main id="main" className="canvas-stage" ref={canvasRef}>
        <div className="canvas-grid" />
        <div className="canvas-world" style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})` }}>
          <div className="world-label world-label-one">01 / BUILD WITH INTENT</div>
          <div className="world-label world-label-two">02 / SYSTEMS THAT SCALE</div>
          <div className="connector connector-one" />
          <div className="connector connector-two" />
          <div className="connector connector-three" />

          <Panel id="hero" label="/ 01 — INTRO">
            <div className="hero-panel-content">
              <div className="hero-copy">
                <p className="hero-overline"><Sparkles size={15} /> Digital partner for ambitious teams</p>
                <h1>{ui.hero.statement}</h1>
                <p className="hero-description">{ui.hero.support}</p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#panel-contact" onClick={(event) => { event.preventDefault(); goTo("contact"); }}>{ui.hero.action}<ArrowRight size={17} /></a>
                  <button className="button button-ghost" onClick={() => goTo("work")}>{ui.hero.secondaryAction}<ArrowDown size={16} /></button>
                </div>
              </div>
              <Parallax className="hero-visual" aria-hidden="true" distance={38}><div className="orb orb-large" /><div className="orb orb-small" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="hero-coordinate">-06° 12&apos; 08&quot;</span></Parallax>
            </div>
            <div className="hero-footer"><span>Jakarta / Indonesia</span><span>Scroll to navigate <ArrowDown size={13} /></span><span>© 2026</span></div>
          </Panel>

          <Panel id="pricing" label="/ 03 — PRICING">
            <PanelTitle id="pricing" eyebrow="Clear by design" title={content.ui.sections.pricing.title} body={content.ui.sections.pricing.lead} />
            <div className="price-strip"><div><span>FROM</span><strong>{content.entryPrice}</strong></div><p>Website, aplikasi web, dan sistem khusus. Pilih paket sebagai titik awal, atau mulai percakapan untuk kebutuhan custom.</p><Link className="button button-primary" href={`/${locale}/pricing`}>Lihat semua harga<ArrowRight size={16} /></Link></div>
          </Panel>

          <Panel id="services" label="/ 02 — CAPABILITIES">
            <PanelTitle id="services" eyebrow="What we do" title={ui.sections.services.title} body={ui.sections.services.lead} />
            <div className="service-grid">{content.services.slice(0, 4).map((service, index) => <article className="service-card" key={service.id}><span className="service-number">0{index + 1}</span><h3>{service.title}</h3><p>{service.summary}</p><span className="service-arrow"><ArrowUpRight /></span></article>)}</div>
          </Panel>

          <Panel id="metrics" label="/ 03 — SIGNALS" className="metrics-panel">
            <div className="metric-intro"><Zap size={18} /><span>Since 2021</span></div><h2 id="metrics-heading">Small team.<br /><em>Large output.</em></h2>
            <div className="metric-list"><div><strong>50<span>+</span></strong><p>Projects shipped</p></div><div><strong>99.9<span>%</span></strong><p>Uptime mindset</p></div><div><strong>3<span>x</span></strong><p>Average efficiency</p></div></div>
            <div className="metric-bottom">A systems-first digital agency for modern business.</div>
          </Panel>

          <Panel id="process" label="/ 04 — METHOD">
            <PanelTitle id="process" eyebrow="How we work" title={ui.sections.process.title} body={ui.sections.process.lead} />
            <div className="process-list">{content.process.map((step, index) => <div className="process-step" key={step.id}><div className="process-index">0{index + 1}</div><div><h3>{step.title}</h3><p>{step.body}</p></div><span className="process-time">{step.subtitle}</span></div>)}</div>
          </Panel>

          <Panel id="work" label="/ 05 — SELECTED WORK">
            <PanelTitle id="work" eyebrow="Selected work" title={ui.sections.work.title} body={ui.sections.work.lead} />
            <div className="work-grid">{content.work.slice(0, 4).map((item, index) => <Reveal key={item.id} delay={index * .06}><article className={`work-card work-${index + 1}`}><div className="work-image"><div className="work-image-glow" /><span>0{index + 1}</span></div><div className="work-meta"><div><h3>{item.title}</h3><p>{item.client}</p></div><ArrowUpRight size={18} /></div></article></Reveal>)}</div>
          </Panel>

          <Panel id="contact" label="/ 06 — LET&apos;S TALK">
            <PanelTitle id="contact" eyebrow="Start a conversation" title={ui.sections.contact.title} body={ui.sections.contact.lead} />
            {submitted ? <div className="success-state"><div className="success-icon"><Check /></div><h3>{ui.contact.doneTitle}</h3><p>{ui.contact.doneBody}</p><button className="button button-ghost" onClick={() => setSubmitted(false)}>{ui.contact.again}</button></div> : <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label>{ui.contact.nameLabel}<input required name="name" placeholder={ui.contact.namePlaceholder} /></label><label>{ui.contact.businessLabel}<input name="business" placeholder={ui.contact.businessPlaceholder} /></label><label>{ui.contact.descriptionLabel}<textarea required minLength={10} name="description" placeholder={ui.contact.descriptionPlaceholder} /></label><button className="button button-primary" type="submit">{ui.contact.submit}<Send size={15} /></button></form>}
            <div className="contact-direct"><a href="mailto:hello@bikinsaas.com"><Mail size={16} /> hello@bikinsaas.com</a><span>Jakarta, Indonesia</span></div>
          </Panel>
        </div>

        <div className="canvas-toolbar" aria-label="Canvas controls">
          <button onClick={() => zoomBy(0.1)} aria-label="Zoom in"><Plus /></button><span>{Math.round(zoom * 100)}%</span><button onClick={() => zoomBy(-0.1)} aria-label="Zoom out"><Minus /></button><i /><button onClick={reset} aria-label="Reset view"><RotateCcw /></button><button onClick={() => setListView((current) => !current)} aria-label="Toggle list view"><Grid2X2 /></button>
        </div>
        <div className="canvas-help"><span><Move size={13} /> drag</span><span>scroll to zoom</span><button onClick={() => setShortcuts(true)}>?</button></div>

        {miniMap && <div className="mini-map" aria-label="Canvas mini-map"><div className="mini-world"><div className="mini-block mini-hero" /><div className="mini-block mini-services" /><div className="mini-block mini-process" /><div className="mini-block mini-work" /><div className="mini-block mini-contact" /><div className="mini-viewport" style={{ left: `${clamp((-offset.x / 720) * 52, 0, 55)}%`, top: `${clamp((-offset.y / 500) * 50, 0, 55)}%` }} /></div><div className="mini-label">MAP / M</div></div>}
      </main>

      <div className="key-hint"><span>Press</span><kbd>?</kbd><span>for shortcuts</span></div>
      <AnimatePresence>{shortcuts && <motion.div className="shortcut-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShortcuts(false)}><motion.div className="shortcut-modal" initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 15, opacity: 0 }} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShortcuts(false)}><X /></button><p className="eyebrow">Navigation guide</p><h2>Keyboard shortcuts</h2><div className="shortcut-list"><span><kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd><b>Move canvas</b></span><span><kbd>+</kbd><kbd>−</kbd><b>Zoom in / out</b></span><span><kbd>Home</kbd><b>Reset view</b></span><span><kbd>M</kbd><b>Toggle mini-map</b></span><span><kbd>Tab</kbd><b>Move through controls</b></span></div></motion.div></motion.div>}</AnimatePresence>
    </div>
    </SmoothScroll>
  );
}

function MoonIcon() { return <span className="moon-icon" aria-hidden="true">◐</span>; }
function ArrowUpRight({ size = 16 }: { size?: number }) { return <ArrowRight className="arrow-up-right" size={size} />; }
