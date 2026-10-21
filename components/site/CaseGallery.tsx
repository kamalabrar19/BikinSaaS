"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { MediaItem } from "@/lib/admin/types";
import { mediaKindOf } from "@/lib/admin/types";
import { optimiseMedia } from "@/lib/media-url";
import { useSite } from "./Providers";

/**
 * The case study gallery. Videos come first, each at its own ratio with
 * controls. Pictures follow as one swipeable slider (CSS scroll-snap, so it is
 * smooth by default on touch and trackpad) that takes a single row of space. A
 * click on a picture opens it whole on a dark full-screen layer with arrows, so
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
  const videos = items.filter((item) => mediaKindOf(item.src) === "video");
  const images = items.filter((item) => mediaKindOf(item.src) !== "video");
  const count = images.length;

  const [current, setCurrent] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLDivElement>(null);

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

  /* Which slide is at the left edge, for the counter. */
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    let best = 0;
    let distance = Infinity;
    slides.forEach((one, index) => {
      const gap = Math.abs(one.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (gap < distance) {
        distance = gap;
        best = index;
      }
    });
    setSlide(best);
  };

  const slideBy = (by: number) => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const target = slides[Math.min(count - 1, Math.max(0, slide + by))];
    if (target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  const shown = current === null ? null : images[current];

  return (
    <div className="case-media">
      {videos.length ? (
        <div className="case-videos">
          {videos.map((media, index) => (
            <figure className="case-video" key={`${media.src}-${index}`}>
              <video src={optimiseMedia(media.src)} controls playsInline preload="metadata" />
              {media.caption ? <figcaption>{media.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      ) : null}

      {count ? (
        <div className="case-slider">
          <div className="case-track" ref={track} onScroll={onScroll}>
            {images.map((media, index) => (
              <figure className="case-slide" key={`${media.src}-${index}`}>
                <button
                  type="button"
                  className="case-slide-button"
                  onClick={() => setCurrent(index)}
                  aria-label={`${labels.open}${media.alt || media.caption ? `: ${media.alt || media.caption}` : ""}`}
                >
                  <img
                    src={optimiseMedia(media.src)}
                    alt={media.alt || title}
                    loading={index < 2 ? "eager" : "lazy"}
                    draggable={false}
                  />
                  <span className="case-shot-zoom" aria-hidden="true">
                    <Expand size={16} />
                  </span>
                </button>
                {media.caption ? <figcaption>{media.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
          {count > 1 ? (
            <div className="case-slider-bar">
              <button type="button" className="slider-arrow" onClick={() => slideBy(-1)} disabled={slide <= 0} aria-label={labels.prev}>
                <ChevronLeft size={20} />
              </button>
              <p aria-live="polite">
                {slide + 1} / {count}
              </p>
              <button type="button" className="slider-arrow" onClick={() => slideBy(1)} disabled={slide >= count - 1} aria-label={labels.next}>
                <ChevronRight size={20} />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

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
                <img key={shown.src} src={optimiseMedia(shown.src)} alt={shown.alt || title} />
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
    </div>
  );
}
