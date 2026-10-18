import { revalidatePath } from "next/cache";

import { locales } from "@/lib/locale";

/**
 * Marks every public page stale after a save, so the next visitor gets the new
 * version without a rebuild.
 *
 * `revalidatePath("/", "layout")` looks like the obvious call and does nothing
 * here: this app's root layout is `app/[lang]/layout.tsx`, so there is no layout
 * at "/" for Next to match. It answers 200 and every page stays as it was.
 * Revalidating the locale path with the "layout" type is what actually reaches
 * the pages underneath it, case studies included.
 *
 * Verified against `x-nextjs-cache: HIT` on /id before and after a save.
 */
export function revalidateSite(): void {
  for (const locale of locales) {
    revalidatePath(`/${locale}`, "layout");
  }
  /* Case studies for a slug the panel added after the last build. */
  revalidatePath("/[lang]/portfolio/[slug]", "page");
}
