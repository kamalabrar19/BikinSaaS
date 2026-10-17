/**
 * A plain class joiner. It does not merge conflicting Tailwind classes, so
 * never pass two classes that set the same property and expect the later one
 * to win; put the conditional branch in one string instead.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
