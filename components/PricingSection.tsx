"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, Globe, Puzzle, RefreshCw, Server, ShieldCheck, Wallet, AppWindow } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  ADD_ONS,
  MAINTENANCE_PLANS,
  POLICIES,
  WEBAPP_PLANS,
  WEBSITE_PLANS,
  type PolicyItem,
  type PricingPlan,
} from "@/constants/site-data";
import { cn, formatRupiah } from "@/lib/utils";
import { InteractiveCard } from "./InteractiveCard";
import { OrderModal, type OrderSelection } from "./OrderModal";
import { Reveal, SectionHeading } from "./ui";

type TabId = "website" | "webapp" | "addons" | "policy";

const TABS: { id: TabId; label: string; icon: typeof Globe }[] = [
  { id: "website", label: "Website Development", icon: Globe },
  { id: "webapp", label: "Web App & SaaS", icon: AppWindow },
  { id: "addons", label: "Add-Ons & Maintenance", icon: Puzzle },
  { id: "policy", label: "Garansi & Kebijakan", icon: ShieldCheck },
];

const POLICY_ICONS: Record<PolicyItem["icon"], typeof Wallet> = {
  wallet: Wallet,
  shield: ShieldCheck,
  refresh: RefreshCw,
  server: Server,
};

function priceLabel(p: PricingPlan) {
  return p.priceMax ? `${formatRupiah(p.price)} – ${formatRupiah(p.priceMax)}` : formatRupiah(p.price);
}

export function PricingSection() {
  const [tab, setTab] = useState<TabId>("website");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedMaint, setSelectedMaint] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderSelection | null>(null);
  const closeOrder = useCallback(() => setOrder(null), []);

  const addOnTotal = useMemo(
    () => ADD_ONS.filter((a) => selectedAddOns.includes(a.id)).reduce((sum, a) => sum + a.price, 0),
    [selectedAddOns]
  );

  const pickPlan = (p: PricingPlan) => {
    setSelectedPlan(p.id);
    setOrder({
      title: `Paket ${p.name}`,
      lines: p.features,
      total: priceLabel(p),
    });
  };

  const onTabKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (idx + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    document.getElementById(`tab-${TABS[next].id}`)?.focus();
  };

  const renderPlans = (plans: PricingPlan[]) => (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((p) => (
        <InteractiveCard
          key={p.id}
          selectable
          keyboardSelectable={false}
          active={selectedPlan === p.id}
          onSelect={() => setSelectedPlan(p.id)}
          className="flex h-full flex-col p-6"
        >
          <div className="flex h-full flex-col">
            {p.popular && (
              <span className="mb-3 inline-block w-fit rounded-full bg-primary-green px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-charcoal">
                Terpopuler
              </span>
            )}
            <h3 className="pr-8 text-lg font-bold text-charcoal">{p.name}</h3>
            <p className="mt-1 text-sm text-stone-600">{p.tagline}</p>
            <p className="mt-5 text-3xl font-extrabold tracking-tight text-charcoal">
              {p.priceMax ? <span className="mr-1 text-base font-semibold text-stone-500">mulai</span> : null}
              {formatRupiah(p.price)}
            </p>
            {p.priceMax && <p className="text-xs text-stone-500">hingga {formatRupiah(p.priceMax)} sesuai lingkup</p>}
            <ul className="mt-5 flex-1 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-green" /> {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                pickPlan(p);
              }}
              className="mt-6 w-full rounded-full bg-primary-green px-5 py-3 text-sm font-semibold text-charcoal shadow-md shadow-primary-green/25 transition hover:bg-deep-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
            >
              Pilih Paket Ini
            </button>
          </div>
        </InteractiveCard>
      ))}
    </div>
  );

  return (
    <section id="harga" className="scroll-mt-20 bg-white/60 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Pricelist jelas, tanpa biaya tersembunyi"
          description="Semua paket, add-on, maintenance, dan kebijakan ada di satu tempat. Klik “Pilih Paket Ini” untuk langsung kirim pesanan via WhatsApp."
        />

        {/* Tabs */}
        <Reveal className="mb-10">
          <div
            role="tablist"
            aria-label="Kategori harga"
            className="mx-auto flex max-w-full gap-1 overflow-x-auto rounded-full border border-stone-200/80 bg-white p-1.5 shadow-soft sm:w-fit"
          >
            {TABS.map((t, idx) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, idx)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green",
                    isActive ? "text-charcoal" : "text-stone-600 hover:text-charcoal"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="pricing-tab-pill"
                      className="absolute inset-0 rounded-full bg-primary-green shadow-md shadow-primary-green/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-4 w-4" /> {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            {tab === "website" && renderPlans(WEBSITE_PLANS)}
            {tab === "webapp" && renderPlans(WEBAPP_PLANS)}

            {tab === "addons" && (
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold text-charcoal">Fitur tambahan</h3>
                  <p className="mt-1 text-sm text-stone-600">Pilih satu atau beberapa add-on. Total estimasi dihitung otomatis.</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {ADD_ONS.map((a) => {
                      const on = selectedAddOns.includes(a.id);
                      return (
                        <InteractiveCard
                          key={a.id}
                          selectable
                          active={on}
                          tilt={4}
                          ariaLabel={`Add-on ${a.name}`}
                          onSelect={() =>
                            setSelectedAddOns((cur) => (cur.includes(a.id) ? cur.filter((x) => x !== a.id) : [...cur, a.id]))
                          }
                          className="h-full p-5"
                        >
                          <h4 className="pr-8 text-sm font-bold text-charcoal">{a.name}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-stone-600">{a.description}</p>
                          <p className="mt-3 text-lg font-extrabold text-charcoal">
                            {formatRupiah(a.price)}
                            {a.unit && <span className="ml-1 text-xs font-medium text-stone-500">{a.unit}</span>}
                          </p>
                        </InteractiveCard>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {selectedAddOns.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-3xl border border-primary-green/30 bg-soft-green p-5 sm:flex-row sm:items-center">
                          <div>
                            <p className="text-sm text-stone-700">{selectedAddOns.length} add-on dipilih</p>
                            <p className="text-2xl font-extrabold text-charcoal">{formatRupiah(addOnTotal)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setOrder({
                                title: "Add-On Tambahan",
                                lines: ADD_ONS.filter((a) => selectedAddOns.includes(a.id)).map(
                                  (a) => `${a.name} (${formatRupiah(a.price)}${a.unit ?? ""})`
                                ),
                                total: formatRupiah(addOnTotal),
                              })
                            }
                            className="rounded-full bg-primary-green px-6 py-3 text-sm font-semibold text-charcoal shadow-md shadow-primary-green/25 transition hover:bg-deep-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
                          >
                            Pesan Add-On Ini
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-charcoal">Paket maintenance</h3>
                  <p className="mt-1 text-sm text-stone-600">Rp150.000 – Rp750.000 per bulan. Opsional, tidak wajib.</p>
                  <div className="mt-5 grid gap-5 md:grid-cols-3">
                    {MAINTENANCE_PLANS.map((m) => (
                      <InteractiveCard
                        key={m.id}
                        selectable
                        keyboardSelectable={false}
                        active={selectedMaint === m.id}
                        onSelect={() => setSelectedMaint(m.id)}
                        className="flex h-full flex-col p-6"
                      >
                        <div className="flex h-full flex-col">
                          <h4 className="pr-8 text-lg font-bold text-charcoal">{m.name}</h4>
                          <p className="mt-3 text-3xl font-extrabold tracking-tight text-charcoal">
                            {formatRupiah(m.pricePerMonth)}
                            <span className="text-sm font-medium text-stone-500"> /bulan</span>
                          </p>
                          <ul className="mt-4 flex-1 space-y-2">
                            {m.features.map((f) => (
                              <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-green" /> {f}
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMaint(m.id);
                              setOrder({
                                title: m.name,
                                lines: m.features,
                                total: `${formatRupiah(m.pricePerMonth)}/bulan`,
                              });
                            }}
                            className="mt-6 w-full rounded-full bg-primary-green px-5 py-3 text-sm font-semibold text-charcoal shadow-md shadow-primary-green/25 transition hover:bg-deep-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
                          >
                            Pilih Paket Ini
                          </button>
                        </div>
                      </InteractiveCard>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "policy" && (
              <div className="grid gap-5 sm:grid-cols-2">
                {POLICIES.map((p) => {
                  const Icon = POLICY_ICONS[p.icon] ?? FileText;
                  return (
                    <InteractiveCard key={p.id} className="h-full p-6">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-soft-green text-deep-green">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-lg font-bold text-charcoal">{p.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">{p.body}</p>
                    </InteractiveCard>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <OrderModal selection={order} onClose={closeOrder} />
    </section>
  );
}
