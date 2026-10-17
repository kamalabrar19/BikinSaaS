import { SectionIntro } from "@/components/primitives/SectionIntro";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import type { Content } from "@/content";

/**
 * Five of the seven entries are concepts we built to show how we work, not
 * client projects. That is said in a plain sentence in the section lead and
 * again on each entry, in running text.
 *
 * It is deliberately not a "DEMO" chip: a tiny uppercase letter-spaced badge
 * is a flagged tell, and a sentence is both honest and easier to read.
 *
 * Detail opens with a native <details>, so it works with JavaScript off and
 * needs no focus-trapped dialog.
 */
export function Work({ id, content }: { id: string; content: Content }) {
  const { ui } = content;

  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-section sm:px-8">
      <SectionIntro title={ui.sections.work.title} lead={ui.sections.work.lead} />

      <p className="mb-12 max-w-measure text-body text-ink">{ui.work.conceptNotice}</p>

      <RevealGroup as="ul" className="grid gap-x-16 gap-y-14 md:grid-cols-2">
        {content.work.map((item) => (
          <RevealItem as="li" key={item.id}>
            <h3 className="font-display text-lead leading-snug text-ink">{item.title}</h3>
            <p className="mt-2 text-meta text-ink-quiet">{item.client}</p>

            <dl className="mt-5 space-y-3 text-body">
              <div>
                <dt className="text-meta text-ink-quiet">{ui.work.labelBefore}</dt>
                <dd className="text-ink">{item.before}</dd>
              </div>
              <div>
                <dt className="text-meta text-ink-quiet">{ui.work.labelSolution}</dt>
                <dd className="text-ink">{item.solution}</dd>
              </div>
              <div>
                <dt className="text-meta text-ink-quiet">{ui.work.labelResult}</dt>
                <dd className="text-ink">{item.result}</dd>
              </div>
            </dl>

            <details className="mt-5 group">
              <summary className="press cursor-pointer text-meta font-semibold text-action">
                {ui.work.seeCaseStudy}
              </summary>
              <p className="mt-3 max-w-measure text-body text-ink">{item.detail}</p>
              <p className="mt-3 text-meta text-ink-quiet">
                {ui.work.stackLabel}: {item.stack.join(", ")}
              </p>
            </details>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
