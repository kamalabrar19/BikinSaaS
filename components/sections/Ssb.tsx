import NextImage from "next/image";
import { Action } from "@/components/primitives/Action";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import type { Content } from "@/content";
import type { Photo } from "@/content/photos";

/**
 * Football schools are the one niche we handle specifically, so this section
 * gets the page's largest photograph and a layout no other section uses.
 *
 * The overlay is a flat colour, not a gradient. A neutral scrim over a
 * photograph is the single allowed exception to the no-gradient rule, but a
 * flat scrim does the same job and leaves nothing to argue about.
 */
export function Ssb({ id, content, photo }: { id: string; content: Content; photo: Photo }) {
  const { ui } = content;

  return (
    <section id={id}>
      <div className="relative isolate">
        <NextImage
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="100vw"
          className="h-[70vh] w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/60" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-8">
            <h2 className="max-w-[20ch] font-display text-title text-paper">
              {ui.ssb.title}
            </h2>
            <p className="mt-5 max-w-measure text-lead text-paper">{ui.ssb.body}</p>
            <Action href="#contact" size="lg" className="mt-8 bg-paper text-ink hover:bg-field">
              {ui.ssb.action}
            </Action>
          </div>
        </div>
      </div>

      <p className="mx-auto max-w-6xl px-4 pt-3 text-meta text-ink-quiet sm:px-8">
        {photo.title}, {photo.creator}, {photo.license}
      </p>

      <div className="mx-auto max-w-6xl px-4 py-section sm:px-8">
        <RevealGroup as="dl" className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {content.ssbFeatures.map((feature) => (
            <RevealItem key={feature.id}>
              <dt className="font-display text-lead leading-snug text-ink">{feature.title}</dt>
              <dd className="mt-2 text-body text-ink">{feature.body}</dd>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-12 max-w-measure bg-surface p-6 text-body text-ink">
          <strong className="font-semibold">{ui.ssb.noticeLead}</strong> {ui.ssb.noticeBody}
        </p>
      </div>
    </section>
  );
}
