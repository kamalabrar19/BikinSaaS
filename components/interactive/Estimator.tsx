"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { AddOn, MaintenancePlan } from "@/content";
import type { Locale } from "@/lib/locale";
import { formatMoney } from "@/lib/format";
import { composeMessage, contactHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * The page's one live element: a visitor assembles their own scope and the
 * WhatsApp message arrives already itemised, so the first reply can be about
 * the work rather than about what they wanted.
 *
 * Without JavaScript this still renders every add-on and its price as a plain
 * list, and the section's own consult link still works. What is lost is only
 * the arithmetic, which is additive and easily settled in chat. Making the sum
 * work without JavaScript would need a GET form and server-read searchParams,
 * which would turn this statically generated page dynamic — a bad trade for
 * one subtotal.
 */
export function Estimator({
  locale,
  addOns,
  maintenance,
  ui,
}: {
  locale: Locale;
  addOns: AddOn[];
  maintenance: MaintenancePlan[];
  ui: {
    addOnsTitle: string;
    addOnsLead: string;
    maintenanceTitle: string;
    maintenanceLead: string;
    from: string;
    perMonth: string;
    chosen: string;
    orderAddOns: string;
    estimateTotal: string;
    clearChoice: string;
    waAddOnIntro: string;
    waLabelEstimate: string;
    subject: string;
  };
}) {
  const [picked, setPicked] = useState<string[]>([]);

  const total = useMemo(
    () => addOns.filter((item) => picked.includes(item.id)).reduce((sum, item) => sum + item.price, 0),
    [addOns, picked],
  );

  const chosenItems = addOns.filter((item) => picked.includes(item.id));

  const message = composeMessage(
    ui.waAddOnIntro,
    [
      ...chosenItems.map((item) => `• ${item.name}: ${item.priceLabel}${item.unit ?? ""}`),
      chosenItems.length > 0 ? `${ui.waLabelEstimate}: ${formatMoney(total, locale)}` : "",
    ],
  );
  const target = contactHref(message, ui.subject);

  const toggle = (id: string) =>
    setPicked((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  return (
    <div className="mt-24">
      <h3 className="font-display text-lead leading-snug text-ink">{ui.addOnsTitle}</h3>
      <p className="mt-3 max-w-measure text-body text-ink">{ui.addOnsLead}</p>

      <ul className="mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
        {addOns.map((item) => {
          const on = picked.includes(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={on}
                className={cn(
                  "press flex w-full items-baseline justify-between gap-6 rounded-sm px-4 py-4 text-left transition-colors duration-150",
                  on ? "bg-action text-paper" : "bg-surface text-ink hover:bg-field",
                )}
              >
                <span className="flex items-baseline gap-2">
                  <span
                    aria-hidden
                    className={cn("inline-flex w-4 shrink-0", on ? "opacity-100" : "opacity-0")}
                  >
                    <Check className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-body font-medium">{item.name}</span>
                    <span className={cn("block text-meta", on ? "text-paper/80" : "text-ink-quiet")}>
                      {item.body}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 whitespace-nowrap text-meta font-semibold">
                  {item.from ? `${ui.from} ` : ""}
                  {item.priceLabel}
                  {item.unit ?? ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {picked.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-5 bg-field px-5 py-5">
          <p className="text-body text-ink">
            {ui.chosen.replace("{count}", String(picked.length))}
            <span className="ml-3 font-display text-lead leading-none">
              {ui.estimateTotal} {formatMoney(total, locale)}
            </span>
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setPicked([])}
              className="press text-meta text-ink underline decoration-1 underline-offset-4"
            >
              {ui.clearChoice}
            </button>
            <a
              href={target.href}
              {...(target.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="press inline-flex rounded-sm bg-action px-5 py-3 text-meta font-semibold text-paper hover:bg-action-deep"
            >
              {ui.orderAddOns}
            </a>
          </div>
        </div>
      )}

      <h3 className="mt-24 font-display text-lead leading-snug text-ink">{ui.maintenanceTitle}</h3>
      <p className="mt-3 max-w-measure text-body text-ink">{ui.maintenanceLead}</p>

      <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-3">
        {maintenance.map((item) => (
          <li key={item.id}>
            <p className="font-display text-lead leading-none text-ink">{item.priceLabel}</p>
            <p className="mt-1 text-meta text-ink-quiet">{ui.perMonth}</p>
            <p className="mt-3 text-body font-medium text-ink">{item.name}</p>
            <ul className="mt-2 space-y-1 text-meta text-ink-quiet">
              {item.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
