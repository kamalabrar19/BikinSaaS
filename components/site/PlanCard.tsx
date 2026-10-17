import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PlanCardData {
  id: string;
  name: string;
  tagline?: string;
  features: string[];
  priceLabel: string;
  popular?: boolean;
}

export function PlanCard({
  plan,
  index,
  fromLabel,
  popularLabel,
  priceSuffix,
  action,
}: {
  plan: PlanCardData;
  index: number;
  fromLabel: string;
  popularLabel: string;
  priceSuffix?: string;
  action: ReactNode;
}) {
  return (
    <article className={cn("plan-card spot", plan.popular && "is-popular")}>
      <div className="plan-top">
        <span>{String(index + 1).padStart(2, "0")}</span>
        {plan.popular ? <span className="plan-badge">{popularLabel}</span> : null}
      </div>
      <h3>{plan.name}</h3>
      {plan.tagline ? <p className="plan-tagline">{plan.tagline}</p> : null}
      <div className="plan-price">
        <span>{fromLabel}</span>
        <strong>
          {plan.priceLabel}
          {priceSuffix ? <small>{priceSuffix}</small> : null}
        </strong>
      </div>
      <ul className="plan-features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <Check size={15} aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      {action}
    </article>
  );
}
