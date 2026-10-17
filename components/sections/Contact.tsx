import { SectionIntro } from "@/components/primitives/SectionIntro";
import { Figure } from "@/components/primitives/Figure";
import { LeadForm } from "@/components/interactive/LeadForm";
import type { Content } from "@/content";
import type { Photo } from "@/content/photos";
import { CONTACT_SERVICES, BUDGET_BRACKETS } from "@/content/catalog";

export function Contact({
  id,
  content,
  photo,
}: {
  id: string;
  content: Content;
  photo: Photo;
}) {
  const { ui } = content;

  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-section sm:px-8">
      <SectionIntro title={ui.sections.contact.title} lead={ui.sections.contact.lead} />

      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[1.1fr_0.9fr]">
        <LeadForm
          ui={{
            ...ui.contact,
            waIntro: ui.wa.consult,
            labelName: ui.wa.labelName,
            labelBusiness: ui.wa.labelBusiness,
            labelService: ui.wa.labelService,
            labelBudget: ui.wa.labelBudget,
            labelNeed: ui.wa.labelNeed,
          }}
          serviceOptions={CONTACT_SERVICES.map((key) => ui.contact.services[key])}
          budgetOptions={BUDGET_BRACKETS.map((key) => ui.contact.budgets[key])}
          responseTime={ui.brand.responseTime}
          subject={ui.meta.title}
        />

        <Figure photo={photo} sizes="(min-width: 1024px) 40vw, 100vw" />
      </div>
    </section>
  );
}
