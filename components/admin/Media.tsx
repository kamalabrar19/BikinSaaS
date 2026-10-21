"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { mediaKindOf, type MediaItem, type MediaKind } from "@/lib/admin/types";

/**
 * Uploading and picking pictures, GIFs and videos.
 *
 * Files go straight from the browser to Cloudinary, signed by
 * /api/admin/upload-sign, and the panel keeps the https URL Cloudinary returns.
 * When Cloudinary is not configured the same button falls back to
 * /api/admin/upload, which saves under public/media/uploads. The library lists
 * whichever store is in use, so a cover used by two entries is uploaded once.
 */

interface UploadInfo {
  name: string;
  src: string;
  kind: MediaKind;
  size: number;
  modified: string;
}

interface Signature {
  configured: boolean;
  cloudName?: string;
  apiKey?: string;
  folder?: string;
  timestamp?: number;
  signature?: string;
  error?: string;
}

/** f_auto,q_auto: Cloudinary picks the best format and size for each visitor. */
function optimise(url: string): string {
  return url.includes("/upload/f_auto") ? url : url.replace("/upload/", "/upload/f_auto,q_auto/");
}

/** XHR rather than fetch: it is the one that reports upload progress. */
function postToCloudinary(sign: Signature, file: File, onProgress: (percent: number) => void): Promise<MediaItem> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", sign.apiKey ?? "");
    body.append("timestamp", String(sign.timestamp));
    body.append("signature", sign.signature ?? "");
    body.append("folder", sign.folder ?? "");

    const request = new XMLHttpRequest();
    request.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onerror = () => reject(new Error("Tidak bisa menghubungi Cloudinary. Periksa koneksi."));
    request.onload = () => {
      let data: { secure_url?: string; resource_type?: string; error?: { message?: string } } = {};
      try {
        data = JSON.parse(request.responseText);
      } catch {
        /* handled below */
      }
      if (request.status >= 200 && request.status < 300 && data.secure_url) {
        resolve({
          src: optimise(data.secure_url),
          kind: data.resource_type === "video" ? "video" : "image",
        });
      } else {
        reject(new Error(data.error?.message ?? "Cloudinary menolak berkas ini."));
      }
    };
    request.send(body);
  });
}

async function uploadLocal(file: File): Promise<MediaItem> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json().catch(() => ({}))) as { src?: string; error?: string };
  if (!response.ok || !data.src) throw new Error(data.error ?? "Gagal mengunggah berkas.");
  return { src: data.src, kind: mediaKindOf(data.src) };
}

async function uploadFile(file: File, onProgress: (percent: number) => void): Promise<MediaItem> {
  /* A fresh signature per file: each one is only valid for a short while. */
  const response = await fetch("/api/admin/upload-sign");
  if (response.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Sesi berakhir. Masuk lagi.");
  }
  const sign = (await response.json().catch(() => ({ configured: false }))) as Signature;
  if (!sign.configured) return uploadLocal(file);
  return postToCloudinary(sign, file, onProgress);
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
  /** Called once with everything that uploaded, so a batch is never overwritten by its own last file. */
  onDone: (items: MediaItem[]) => void;
  onError: (message: string) => void;
  compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  const pick = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const list = Array.from(files);
      const done: MediaItem[] = [];
      try {
        for (const [index, file] of list.entries()) {
          const prefix = list.length > 1 ? `${index + 1}/${list.length} · ` : "";
          setStatus(`${prefix}0%`);
          done.push(await uploadFile(file, (percent) => setStatus(`${prefix}${percent}%`)));
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : "Gagal mengunggah berkas.");
      } finally {
        if (done.length) onDone(done);
        setStatus("");
        if (input.current) input.current.value = "";
      }
    },
    [onDone, onError],
  );

  const busy = status !== "";

  return (
    <span className={compact ? "media-upload is-compact" : "media-upload"}>
      <button type="button" className="btn btn-ghost" onClick={() => input.current?.click()} disabled={busy}>
        {busy ? `Mengunggah ${status}` : label}
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
  const [local, setLocal] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/media")
      .then((response) => response.json())
      .then((data: { items?: UploadInfo[]; source?: string; error?: string }) => {
        if (!alive) return;
        if (data.error) setError(data.error);
        setLocal(data.source === "local");
        setItems(data.items ?? []);
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
      {local ? (
        <p className="hint hint-warn">
          Cloudinary belum diatur, jadi berkas disimpan di server ini. Isi CLOUDINARY_URL di .env.local.
        </p>
      ) : null}
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
        <UploadButton label="Unggah foto / video" onDone={(items) => onChange(items[0].src)} onError={onError} />
        <button type="button" className="btn btn-ghost" onClick={() => setShowLibrary((open) => !open)}>
          Pustaka
        </button>
        {value ? (
          <button
            type="button"
            className="icon-btn icon-btn-danger"
            onClick={() => onChange("")}
            aria-label="Hapus gambar"
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
            Belum ada gambar — situs memakai tampilan bawaan. Bisa juga menempel tautan gambar di
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
          onDone={(items) => onChange([...value, ...items])}
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
