import { RevealGroup, RevealItem } from "./Reveal";

/**
 * A section opens with its heading and, when it earns one, a lead paragraph.
 * There is no label above the heading: a small tracked caps kicker is one of
 * the strongest generated-page tells, and it carries no information a reader
 * does not already have from the heading itself.
 *
 * Headings are left-anchored. A page where every heading is centred trips the
 * inspector's all-centred rule, and one centred moment is the budget.
 */
export function SectionIntro({ title, lead }: { title: string; lead?: string }) {
  return (
    <RevealGroup className="mb-14 max-w-measure sm:mb-20">
      <RevealItem as="h2" className="text-title text-ink">
        {title}
      </RevealItem>
      {lead && (
        <RevealItem as="p" className="mt-6 text-lead text-ink">
          {lead}
        </RevealItem>
      )}
    </RevealGroup>
  );
}
