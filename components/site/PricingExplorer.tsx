"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Send, X } from "lucide-react";
import { useState } from "react";

import { formatMoney } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { EASE } from "./Motion";
import { OrderButton, OrderDialog, type OrderLabels } from "./OrderDialog";
import { PlanCard, type PlanCardData } from "./PlanCard";

type Tab = "website" | "webapp" | "addOns" | "maintenance";

export interface AddOnData {
  id: string;
  name: string;
  body: string;
  price: number;
  priceLabel: string;
  unit?: string;
  from: boolean;
}

export interface MaintenanceData {
  id: string;
  name: string;
  features: string[];
  priceLabel: string;
}

export interface PricingLabels {
  tabs: Record<Tab, string>;
  from: string;
  popular: string;
  order: string;
  orderAddOns: string;
  perMonth: string;
  perMonthShort: string;
  addOnsLead: string;
  maintenanceLead: string;
  chosen: string;
  estimateTotal: string;
  clearChoice: string;
  tabsLabel: string;
}

const panel = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.45, ease: EASE },
};

const stagger = (index: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay: index * 0.06 },
});

export function PricingExplorer({
  locale,
  labels,
  websitePlans,
  webappPlans,
  addOns,
  maintenance,
  intros,
  orderLabels,
  subject,
}: {
  locale: Locale;
  labels: PricingLabels;
  websitePlans: PlanCardData[];
  webappPlans: PlanCardData[];
  addOns: AddOnData[];
  maintenance: MaintenanceData[];
  intros: { plan: string; addOn: string; maintenance: string };
  orderLabels: OrderLabels;
  subject: string;
}) {
  const [tab, setTab] = useState<Tab>("website");
  const [selected, setSelected] = useState<string[]>([]);
  const [ordering, setOrdering] = useState(false);

  const chosen = addOns.filter((addOn) => selected.includes(addOn.id));
  const total = chosen.reduce((sum, addOn) => sum + addOn.price, 0);
  const isFloor = chosen.some((addOn) => addOn.from || addOn.unit);
  const estimate = `${isFloor ? `${labels.from} ` : ""}${formatMoney(total, locale)}`;

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  const tabs: Tab[] = ["website", "webapp", "addOns", "maintenance"];

  const planGrid = (plans: PlanCardData[]) => (
    <div className="plan-grid">
      {plans.map((plan, index) => (
        <motion.div key={plan.id} {...stagger(index)}>
          <PlanCard
            plan={plan}
            index={index}
            fromLabel={labels.from}
            popularLabel={labels.popular}
            action={
              <OrderButton
                label={labels.order}
                className={plan.popular ? "button button-primary" : "button button-ghost"}
                intro={intros.plan}
                lines={[{ name: plan.name, priceLabel: plan.priceLabel }]}
                labels={orderLabels}
                subject={subject}
              />
            }
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="pricing-explorer">
      <div className="tabs" role="tablist" aria-label={labels.tabsLabel}>
        {tabs.map((id) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="pricing-panel"
              className={cn("tab", isActive && "is-active")}
              onClick={() => setTab(id)}
            >
              {isActive ? (
                <motion.span
                  layoutId="tab-pill"
                  className="tab-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              {labels.tabs[id]}
              {id === "addOns" && selected.length > 0 ? <sup>{selected.length}</sup> : null}
            </button>
          );
        })}
      </div>

      <div id="pricing-panel" role="tabpanel">
        <AnimatePresence mode="wait">
          {tab === "website" ? (
            <motion.div key="website" {...panel}>
              {planGrid(websitePlans)}
            </motion.div>
          ) : null}

          {tab === "webapp" ? (
            <motion.div key="webapp" {...panel}>
              {planGrid(webappPlans)}
            </motion.div>
          ) : null}

          {tab === "addOns" ? (
            <motion.div key="addOns" {...panel}>
              <p className="tab-lead">{labels.addOnsLead}</p>
              <div className="addon-list">
                {addOns.map((addOn, index) => {
                  const isOn = selected.includes(addOn.id);
                  return (
                    <motion.button
                      key={addOn.id}
                      type="button"
                      className={cn("addon spot", isOn && "is-on")}
                      aria-pressed={isOn}
                      onClick={() => toggle(addOn.id)}
                      whileTap={{ scale: 0.98 }}
                      {...stagger(index)}
                    >
                      <span className="addon-check" aria-hidden="true">
                        <Check size={14} />
                      </span>
                      <span className="addon-text">
                        <strong>{addOn.name}</strong>
                        <span>{addOn.body}</span>
                      </span>
                      <span className="addon-price">
                        {addOn.from ? <small>{labels.from}</small> : null}
                        {addOn.priceLabel}
                        {addOn.unit ? <small>{addOn.unit}</small> : null}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {chosen.length > 0 ? (
                  <motion.div
                    className="addon-summary"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <div>
                      <span>{labels.chosen.replace("{count}", String(chosen.length))}</span>
                      <p>
                        {labels.estimateTotal}: <strong>{estimate}</strong>
                      </p>
                    </div>
                    <div className="addon-summary-actions">
                      <button type="button" className="button button-ghost" onClick={() => setSelected([])}>
                        <X size={14} />
                        {labels.clearChoice}
                      </button>
                      <button type="button" className="button button-primary" onClick={() => setOrdering(true)}>
                        {labels.orderAddOns}
                        <Send size={14} />
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}

          {tab === "maintenance" ? (
            <motion.div key="maintenance" {...panel}>
              <p className="tab-lead">{labels.maintenanceLead}</p>
              <div className="plan-grid">
                {maintenance.map((plan, index) => (
                  <motion.div key={plan.id} {...stagger(index)}>
                    <PlanCard
                      plan={plan}
                      index={index}
                      fromLabel={labels.perMonth}
                      popularLabel={labels.popular}
                      action={
                        <OrderButton
                          label={labels.order}
                          className="button button-ghost"
                          intro={intros.maintenance}
                          lines={[{ name: plan.name, priceLabel: `${plan.priceLabel} ${labels.perMonth}` }]}
                          labels={orderLabels}
                          subject={subject}
                        />
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <OrderDialog
        open={ordering}
        onClose={() => setOrdering(false)}
        intro={intros.addOn}
        lines={chosen.map((addOn) => ({
          name: addOn.name,
          priceLabel: `${addOn.from ? `${labels.from} ` : ""}${addOn.priceLabel}${addOn.unit ?? ""}`,
        }))}
        estimate={estimate}
        labels={orderLabels}
        subject={subject}
      />
    </div>
  );
}
