"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { mediaKindOf, type MediaItem, type MediaKind } from "@/lib/admin/types";

/**
 * Uploading and picking pictures, GIFs and videos.
 *
 * Everything goes through /api/admin/upload, which stores the file under
 * public/media/uploads with a generated name and returns its public path. The
 * same panel can pick something that was uploaded earlier, so a cover used by
 * two portfolio entries is uploaded once.
 */

interface UploadInfo {
  name: string;
  src: string;
  kind: MediaKind;
  size: number;
  modified: string;
}

async function uploadFile(file: File): Promise<MediaItem> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json().catch(() => ({}))) as { src?: string; error?: string };
  if (!response.ok || !data.src) throw new Error(data.error ?? "Gagal mengunggah berkas.");
  return { src: data.src, kind: mediaKindOf(data.src) };
}

function readableSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaPreview({
  src,
  alt,
  className,
  animated = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  /** Videos play silently on loop. Off in the library, where there are many. */
  animated?: boolean;
}) {
  if (!src) return null;
  if (mediaKindOf(src) === "video") {
    return (
      <video
        className={className}
        src={src}
        muted={animated}
        loop={animated}
        autoPlay={animated}
        controls={!animated}
        playsInline
        preload="metadata"
      />
    );
  }
  return <img className={className} src={src} alt={alt ?? ""} />;
}

function UploadButton({
  label,
  onDone,
  onError,
  compact = false,
}: {
  label: string;
  onDone: (item: MediaItem) => void;
  onError: (message: string) => void;
  compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setBusy(true);
      try {
        for (const file of Array.from(files)) {
          onDone(await uploadFile(file));
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : "Gagal mengunggah berkas.");
      } finally {
        setBusy(false);
        if (input.current) input.current.value = "";
      }
    },
    [onDone, onError],
  );

  return (
    <span className={compact ? "media-upload is-compact" : "media-upload"}>
      <button type="button" className="btn btn-ghost" onClick={() => input.current?.click()} disabled={busy}>
        {busy ? "Mengunggah…" : label}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime"
        multiple={compact}
        hidden
        onChange={(event) => void pick(event.target.files)}
      />
    </span>
  );
}

function Library({
  onPick,
  onClose,
}: {
  onPick: (item: UploadInfo) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<UploadInfo[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/media")
      .then((response) => response.json())
      .then((data: { items?: UploadInfo[] }) => {
        if (alive) setItems(data.items ?? []);
      })
      .catch(() => {
        if (alive) setError("Pustaka tidak bisa dimuat.");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="library">
      <div className="library-head">
        <strong>Pustaka media</strong>
        <button type="button" className="btn btn-ghost btn-small" onClick={onClose}>
          Tutup
        </button>
      </div>
      {error ? <p className="hint hint-warn">{error}</p> : null}
      {items === null && !error ? <p className="hint">Memuat…</p> : null}
      {items && items.length === 0 ? (
        <p className="hint">Belum ada berkas. Unggah dulu dari tombol di atas.</p>
      ) : null}
      <div className="library-grid">
        {(items ?? []).map((item) => (
          <button
            key={item.name}
            type="button"
            className="library-item"
            onClick={() => onPick(item)}
            title={item.name}
          >
            <MediaPreview src={item.src} className="library-thumb" />
            <span className="library-meta">{readableSize(item.size)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** One cover: a single file, uploaded or picked, plus the asset list. */
export function CoverInput({
  value,
  onChange,
  alt = "",
  onError,
}: {
  value: string;
  onChange: (src: string) => void;
  alt?: string;
  onError: (message: string) => void;
}) {
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <div className="media-field">
      <div className="media-row">
        <UploadButton label="Unggah foto / video" onDone={(item) => onChange(item.src)} onError={onError} />
        <button type="button" className="btn btn-ghost" onClick={() => setShowLibrary((open) => !open)}>
          Pustaka
        </button>
        {value ? (
          <button
            type="button"
            className="icon-btn icon-btn-danger"
            onClick={() => onChange("")}
            aria-label="Hapus sampul"
          >
            ✕
          </button>
        ) : null}
      </div>

      {value ? (
        <div className="media-preview">
          <MediaPreview src={value} alt={alt} className="media-thumb" animated />
          <code className="media-path">{value}</code>
        </div>
      ) : (
        <>
          <p className="hint">
            Belum ada sampul — kartu memakai motif grafis bawaan. Bisa juga menempel tautan gambar di
            bawah.
          </p>
          <input
            className="input input-mono"
            type="text"
            value={value}
            placeholder="https://… atau /media/uploads/…"
            onChange={(event) => onChange(event.target.value)}
          />
        </>
      )}

      {showLibrary ? <Library onPick={(item) => onChange(item.src)} onClose={() => setShowLibrary(false)} /> : null}
    </div>
  );
}

/** A gallery: any number of pictures and videos, each with alt text. */
export function GalleryInput({
  value,
  onChange,
  onError,
}: {
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  onError: (message: string) => void;
}) {
  const [showLibrary, setShowLibrary] = useState(false);

  const replace = (index: number, patch: Partial<MediaItem>) => {
    onChange(value.map((item, at) => (at === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="media-field">
      <div className="media-row">
        <UploadButton
          compact
          label="Unggah"
          onDone={(item) => onChange([...value, item])}
          onError={onError}
        />
        <button type="button" className="btn btn-ghost" onClick={() => setShowLibrary((open) => !open)}>
          Pustaka
        </button>
      </div>

      {showLibrary ? (
        <Library
          onPick={(item) => onChange([...value, { src: item.src, kind: mediaKindOf(item.src) }])}
          onClose={() => setShowLibrary(false)}
        />
      ) : null}

      {value.length === 0 ? <p className="hint">Galeri kosong. Halaman studi kasus menampilkan cerita saja.</p> : null}

      <div className="gallery-list">
        {value.map((item, index) => (
          <div className="gallery-item" key={`${item.src}-${index}`}>
            <MediaPreview src={item.src} alt={item.alt} className="gallery-thumb" />
            <div className="gallery-fields">
              <input
                className="input"
                type="text"
                value={item.alt ?? ""}
                placeholder="Teks alternatif (untuk pembaca layar)"
                onChange={(event) => replace(index, { alt: event.target.value })}
              />
              <input
                className="input"
                type="text"
                value={item.caption ?? ""}
                placeholder="Keterangan di bawah gambar (opsional)"
                onChange={(event) => replace(index, { caption: event.target.value })}
              />
              <div className="gallery-actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => {
                    if (index === 0) return;
                    const next = [...value];
                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                    onChange(next);
                  }}
                  disabled={index === 0}
                  aria-label="Naikkan"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => {
                    if (index === value.length - 1) return;
                    const next = [...value];
                    [next[index + 1], next[index]] = [next[index], next[index + 1]];
                    onChange(next);
                  }}
                  disabled={index === value.length - 1}
                  aria-label="Turunkan"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="icon-btn icon-btn-danger"
                  onClick={() => onChange(value.filter((_, at) => at !== index))}
                  aria-label="Buang gambar"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
