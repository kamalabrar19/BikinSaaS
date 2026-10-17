import NextImage from "next/image";
import type { Photo } from "@/content/photos";
import { cn } from "@/lib/utils";

/**
 * A photograph with its credit attached. CC BY requires the creator to be
 * named wherever the picture appears, so the credit is part of the figure
 * rather than something to remember separately.
 */
export function Figure({
  photo,
  className,
  imageClassName,
  priority = false,
  sizes = "100vw",
  showCredit = true,
}: {
  photo: Photo;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  showCredit?: boolean;
}) {
  return (
    <figure className={className}>
      <NextImage
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
      {showCredit && (
        <figcaption className="mt-3 text-meta text-ink-quiet">
          <a
            href={photo.page}
            target="_blank"
            rel="noreferrer noopener"
            className="underline decoration-1 underline-offset-2 hover:text-ink"
          >
            {photo.title}
          </a>{" "}
          <span aria-hidden>, </span>{photo.creator},{" "}
          <a
            href={photo.licenseUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="underline decoration-1 underline-offset-2 hover:text-ink"
          >
            {photo.license}
          </a>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * A full-bleed band between sections: large, and used sparingly.
 *
 * `priority` matters for the first band. It sits immediately below the first
 * screen, and left to lazy-load it is still blank when a visitor reaches it,
 * which reads as an empty screen rather than a photograph.
 */
export function PhotoBand({
  photo,
  className,
  priority = false,
}: {
  photo: Photo;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <NextImage
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        priority={priority}
        /* Capped at the source width: asking for 3840 from a 1920 original
           only makes the optimiser work harder for a softer picture. */
        sizes="(min-width: 1920px) 1920px, 100vw"
        className="h-[52vh] w-full object-cover sm:h-[68vh]"
      />
      <p className="mx-auto max-w-6xl px-4 pt-3 text-meta text-ink-quiet sm:px-8">
        {photo.title}, {photo.creator}, {photo.license}
      </p>
    </div>
  );
}
