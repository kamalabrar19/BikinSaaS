# Design checks

The look of this site is measured, not argued about. Two tools run against it,
both from the `design-taste-frontend` skill in `.agents/skills`. Install the
skills first if the directory is missing:

```bash
npx skills add Leonxlnx/taste-skill
```

## Static scan

```bash
node .agents/skills/design-taste-frontend/scripts/lint.mjs app components content lib
```

Reads the source for banned patterns: gradients, shadows on elements at rest,
hairline dividers, tiny tracked-caps labels, glass panels, index numbering.
Exit 0 means no failures. It was at 52 failures before the rebuild.

Two escapes exist and both are deliberate:

- `data-ui` on the same line as the class list exempts real form fields and
  overlays, which are allowed their borders and shadows.
- `taste-skill-ignore` on a line skips it entirely. It is used exactly once, on
  the font import in `app/[lang]/layout.tsx`, with the reason in the comment
  above it.

## Rendered scan

```bash
npx next build && npx next start -p 3200

export CHROME_PATH=/path/to/chrome
node .agents/skills/design-taste-frontend/scripts/inspect.mjs \
  http://localhost:3200/id --widths 1440,768,390
node .agents/skills/design-taste-frontend/scripts/inspect.mjs \
  http://localhost:3200/en --widths 1440,768,390
```

Drives a real browser and measures the page: headline line counts at every
width, the number of type sizes, the palette, contrast, overflow, how many
elements move, how many screens are near-empty. Exit 0 means no failures.

Run it against `next start`, not `next dev`: the dev overlay adds its own
elements and skews the motion count.

Both locales must pass separately. English runs longer than Indonesian for the
same idea, so a headline that fits on `/id` can wrap past the limit on `/en`.

### If Chrome aborts

The script spawns Chrome itself and passes no sandbox flag. On machines where
Chrome will not start without one, point `CHROME_PATH` at a small wrapper:

```bash
#!/usr/bin/env bash
exec /path/to/chrome --no-sandbox "$@"
```

## Constraints worth knowing before editing

- **Five type sizes.** `tailwind.config.ts` defines `meta`, `body`, `lead`,
  `title`, `statement`. Adding a sixth trips `size-count`.
- **The first screen's statement stays at four or five words.** The two-line
  limit applies at 390px too, where the type is still far above the size that
  would let it count as a paragraph.
- **Running text uses full ink.** Grey body copy is flagged; `ink-quiet` is for
  genuinely secondary meta only.
- **The pricing section keeps its own background.** A run of tall, airy rows on
  the page ground measured as empty screens.
- **At least four photographs, and one moving picture.** Drawings in SVG do not
  count toward either.
