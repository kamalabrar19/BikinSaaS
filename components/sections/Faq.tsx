import { SectionIntro } from "@/components/primitives/SectionIntro";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import type { Faq as FaqItem } from "@/content";

/**
 * Native <details>, so the accordion works before any JavaScript loads and
 * carries the right semantics for free. No client component is needed for a
 * disclosure.
 */
export function Faq({
  id,
  title,
  faqs,
}: {
  id: string;
  title: string;
  faqs: FaqItem[];
}) {
  return (
    <section id={id} className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-section sm:px-8">
        <SectionIntro title={title} />

        <RevealGroup as="dl">
          {faqs.map((faq) => (
            <RevealItem key={faq.id}>
              <details className="py-5" name="faq">
                <summary className="press cursor-pointer font-display text-lead leading-snug text-ink">
                  {faq.question}
                </summary>
                <p className="mt-3 max-w-measure text-body text-ink">{faq.answer}</p>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
