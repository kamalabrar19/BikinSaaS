/**
 * A button label with a shorter twin for narrow screens. Both are in the DOM so
 * the server and the client render the same markup; CSS shows one of them
 * (`.lbl-short` replaces `.lbl-full` at 640px and below), and a screen reader
 * hears only the visible one because the hidden one is `display: none`.
 */
export function ShortLabel({ full, short }: { full: string; short: string }) {
  return (
    <>
      <span className="lbl-full">{full}</span>
      <span className="lbl-short">{short}</span>
    </>
  );
}
