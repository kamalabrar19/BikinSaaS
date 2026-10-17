import { SectionIntro } from "@/components/primitives/SectionIntro";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import type { Service } from "@/content";

/**
 * Services read as a list of plain rows, not a grid of icon-topped cards.
 * Icon cards appeared on 28% of the weakest sites in the study and 1% of the
 * strongest, and an icon above a heading carries no information the heading
 * does not already give.
 */
export function Services({
  id,
  title,
  lead,
  services,
  whatYouGet,
}: {
  id: string;
  title: string;
  lead?: string;
  services: Service[];
  whatYouGet: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-section sm:px-8">
      <SectionIntro title={title} lead={lead} />

      <RevealGroup as="dl" className="grid gap-x-16 gap-y-12 md:grid-cols-2">
        {services.map((service) => (
          <RevealItem key={service.id}>
            <dt className="font-display text-lead leading-snug text-ink">{service.title}</dt>
            <dd className="mt-3 max-w-measure text-body text-ink">{service.summary}</dd>
            <dd className="mt-5">
              <p className="text-meta text-ink-quiet">{whatYouGet}</p>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-meta text-ink">
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </dd>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
