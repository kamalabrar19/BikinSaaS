import { SectionIntro } from "@/components/primitives/SectionIntro";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { Estimator } from "@/components/interactive/Estimator";
import type { Content, Plan } from "@/content";
import type { Locale } from "@/lib/locale";
import { composeMessage, contactHref } from "@/lib/whatsapp";

/**
 * This section carries the page's idea: the rupiah figure, printed openly and
 * set as display type. Almost every Indonesian web agency hides its prices
 * behind "contact us", so a readable number is the one claim a competitor who
 * hides them cannot make.
 *
 * Every plan gets its own prefilled link, built at render time. That is what
 * keeps the list useful with JavaScript switched off.
 *
 * The generous vertical rhythm is load-bearing, not taste: on a phone each
 * row's action would otherwise sit close enough above the next row's price to
 * read as a label introducing it.
 */
function PlanRow({
  plan,
  pick,
  popularLabel,
  waIntro,
  subject,
}: {
  plan: Plan;
  pick: string;
  popularLabel: string;
  waIntro: string;
  subject: string;
}) {
  const target = contactHref(
    composeMessage(waIntro, [`• ${plan.name}: ${plan.priceLabel}`]),
    subject,
  );

  return (
    <RevealItem as="li" className="py-12 md:py-9">
      <div className="grid gap-x-10 gap-y-5 md:grid-cols-12 md:items-baseline">
        <p className="font-display text-title leading-none text-ink md:col-span-5">
          {plan.priceLabel}
        </p>

        <div className="md:col-span-4">
          <h3 className="font-display text-lead leading-snug text-ink">{plan.name}</h3>
          {plan.popular && (
            <p className="mt-1 text-meta font-semibold text-action">{popularLabel}</p>
          )}
          <p className="mt-2 text-body text-ink">{plan.tagline}</p>
        </div>

        <div className="md:col-span-3">
          <ul className="space-y-1 text-meta text-ink-quiet">
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <a
            href={target.href}
            {...(target.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className="press mt-5 inline-flex rounded-sm bg-action px-5 py-3 text-meta font-semibold text-paper transition-colors duration-150 hover:bg-action-deep"
          >
            {pick}
          </a>
        </div>
      </div>
    </RevealItem>
  );
}

export function Pricing({
  id,
  locale,
  content,
}: {
  id: string;
  locale: Locale;
  content: Content;
}) {
  const { ui } = content;
  const subject = ui.meta.title;

  const group = (heading: string, plans: Plan[], topMargin = false) => (
    <>
      <h3 className={`font-display text-lead leading-snug text-ink${topMargin ? " mt-24" : ""}`}>
        {heading}
      </h3>
      <RevealGroup as="ul" className="mt-4">
        {plans.map((plan) => (
          <PlanRow
            key={plan.id}
            plan={plan}
            pick={ui.pricing.pick}
            popularLabel={ui.pricing.popular}
            waIntro={ui.wa.planIntro}
            subject={subject}
          />
        ))}
      </RevealGroup>
    </>
  );

  return (
    <section id={id} className="bg-field">
      <div className="mx-auto max-w-6xl px-4 py-section sm:px-8">
      <SectionIntro title={ui.sections.pricing.title} lead={ui.sections.pricing.lead} />

      {group(ui.pricing.websiteTab, content.websitePlans)}
      {group(ui.pricing.webappTab, content.webappPlans, true)}

      <Estimator
        locale={locale}
        addOns={content.addOns}
        maintenance={content.maintenance}
        ui={{
          addOnsTitle: ui.pricing.addOnsTitle,
          addOnsLead: ui.pricing.addOnsLead,
          maintenanceTitle: ui.pricing.maintenanceTitle,
          maintenanceLead: ui.pricing.maintenanceLead,
          from: ui.pricing.from,
          perMonth: ui.pricing.perMonth,
          chosen: ui.pricing.chosen,
          orderAddOns: ui.pricing.orderAddOns,
          estimateTotal: ui.pricing.estimateTotal,
          clearChoice: ui.pricing.clearChoice,
          waAddOnIntro: ui.wa.addOnIntro,
          waLabelEstimate: ui.wa.labelEstimate,
          subject,
        }}
      />

      <div className="mt-24">
        <h3 className="font-display text-lead leading-snug text-ink">{ui.pricing.policyTab}</h3>
        <RevealGroup as="dl" className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {content.policies.map((policy) => (
            <RevealItem key={policy.id}>
              <dt className="text-body font-semibold text-ink">{policy.title}</dt>
              <dd className="mt-2 max-w-measure text-body text-ink">{policy.body}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
        </div>
      </div>
    </section>
  );
}
