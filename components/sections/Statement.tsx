import { Action } from "@/components/primitives/Action";

/**
 * The first screen is words, colour and space — the dealt direction is "type
 * and nothing else", and the page has no photographs of its own to open with.
 *
 * Two things are deliberate:
 *
 * 1. The section carries its own full-bleed ground, a tone step away from the
 *    page paper. A type-only screen on bare paper measures as a near-empty
 *    screen, and only one of those is allowed on the page.
 * 2. The statement is four words. The two-line limit is enforced at every
 *    width including 390px, where this type size is far above the threshold
 *    that would let it count as a statement rather than a headline. Short copy
 *    is the fix; shrinking the type below the scale is not.
 */
export function Statement({
  statement,
  support,
  action,
  actionHref,
  actionExternal,
  secondaryAction,
}: {
  statement: string;
  support: string;
  action: string;
  actionHref: string;
  actionExternal: boolean;
  secondaryAction: string;
}) {
  return (
    <section className="bg-field">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-6xl flex-col justify-between px-4 pb-14 pt-[12vh] sm:px-8">
        <h1 className="font-display text-statement text-ink">{statement}</h1>

        <div className="mt-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <p className="max-w-measure text-lead text-ink">{support}</p>

          <div className="flex shrink-0 items-center gap-6">
            <Action href={actionHref} external={actionExternal} size="lg">
              {action}
            </Action>
            <Action href="#pricing" tone="quiet">
              {secondaryAction}
            </Action>
          </div>
        </div>
      </div>
    </section>
  );
}
