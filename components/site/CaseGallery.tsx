"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { MediaItem } from "@/lib/admin/types";
import { mediaKindOf } from "@/lib/admin/types";
import { optimiseMedia } from "@/lib/media-url";
import { useSite } from "./Providers";
import { WorkCover } from "./WorkCard";

/**
 * The case study gallery. The tiles are cropped to a tidy grid; a click opens
 * the picture (or video) whole, on a dark full-screen layer with arrows, so
 * nothing is cut off. Esc, the ✕ button or a click outside closes it.
 */
export function CaseGallery({
  items,
  title,
  labels,
}: {
  items: MediaItem[];
  title: string;
  labels: { open: string; close: string; prev: string; next: string };
}) {
  const { lockScroll } = useSite();
  const [current, setCurrent] = useState<number | null>(null);
  const count = items.length;

  const close = useCallback(() => setCurrent(null), []);
  const step = useCallback(
    (by: number) => setCurrent((at) => (at === null ? at : (at + by + count) % count)),
    [count],
  );

  useEffect(() => {
    if (current === null) return;
    lockScroll(true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [current, close, step, lockScroll]);

  const shown = current === null ? null : items[current];

  return (
    <>
      <div className="case-gallery">
        {items.map((media, index) => (
          <figure className="case-shot" key={`${media.src}-${index}`}>
            <button
              type="button"
              className="case-shot-button"
              onClick={() => setCurrent(index)}
              aria-label={`${labels.open}${media.alt || media.caption ? `: ${media.alt || media.caption}` : ""}`}
            >
              <WorkCover src={media.src} className="case-shot-frame" alt={media.alt || title} />
              <span className="case-shot-zoom" aria-hidden="true">
                <Expand size={16} />
              </span>
            </button>
            {media.caption ? <figcaption>{media.caption}</figcaption> : null}
          </figure>
        ))}
      </div>

      {shown
        ? createPortal(
            <div className="lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={close}>
              <button type="button" className="lightbox-close" onClick={close} aria-label={labels.close}>
                <X size={20} />
              </button>
              {count > 1 ? (
                <button
                  type="button"
                  className="lightbox-nav lightbox-prev"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  aria-label={labels.prev}
                >
                  <ChevronLeft size={26} />
                </button>
              ) : null}
              <figure className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
                {mediaKindOf(shown.src) === "video" ? (
                  <video key={shown.src} src={optimiseMedia(shown.src)} controls autoPlay playsInline />
                ) : (
                  <img key={shown.src} src={optimiseMedia(shown.src)} alt={shown.alt || title} />
                )}
                {shown.caption ? <figcaption>{shown.caption}</figcaption> : null}
              </figure>
              {count > 1 ? (
                <button
                  type="button"
                  className="lightbox-nav lightbox-next"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  aria-label={labels.next}
                >
                  <ChevronRight size={26} />
                </button>
              ) : null}
              {count > 1 ? (
                <p className="lightbox-count" aria-live="polite">
                  {(current ?? 0) + 1} / {count}
                </p>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
