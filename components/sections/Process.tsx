import { SectionIntro } from "@/components/primitives/SectionIntro";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import type { ProcessStep } from "@/content";

/**
 * Four steps, carried by their own names rather than by printed 01/02/03
 * numbering. The sequence is already obvious from the reading order, so the
 * numbers would be decoration, and index numbering is a flagged tell.
 *
 * This sits on the surface tone so it separates from the sections either side
 * without a rule between them.
 */
export function Process({
  id,
  title,
  lead,
  steps,
}: {
  id: string;
  title: string;
  lead?: string;
  steps: ProcessStep[];
}) {
  return (
    <section id={id} className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-section sm:px-8">
        <SectionIntro title={title} lead={lead} />

        <RevealGroup as="ol" className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <RevealItem as="li" key={step.id}>
              <p className="text-meta text-ink-quiet">{step.subtitle}</p>
              <h3 className="mt-1 font-display text-lead leading-snug text-ink">{step.title}</h3>
              <p className="mt-3 text-body text-ink">{step.body}</p>
              <ul className="mt-4 space-y-1 text-meta text-ink-quiet">
                {step.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
