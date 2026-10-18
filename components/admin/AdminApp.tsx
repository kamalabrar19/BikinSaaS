"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  PAGES,
  SETTINGS_FIELDS,
  collectionDef,
  duplicateIds,
  rowProblems,
  type CollectionDef,
  type PageKey,
} from "@/lib/admin/fields";
import {
  copyFor,
  type AdminDoc,
  type CollectionKey,
  type ContactSettings,
  type Row,
} from "@/lib/admin/types";
import type { Locale } from "@/lib/locale";

import { Field } from "./Fields";
import { MediaPreview } from "./Media";

/**
 * The panel. Four pages — Portofolio, Harga, Isi halaman, Kontak — and one save
 * button for everything.
 *
 * A row is a small object: `id` and the neutral fields (prices, media, chosen
 * icon) plus `copy[locale]` for the words. The language switch at the top picks
 * which `copy` block the form edits — the other language is never touched, so
 * filling in English cannot wipe the Indonesian text.
 */

interface Notice {
  kind: "ok" | "error";
  text: string;
}

const WIDE: Record<string, boolean> = {
  textarea: true,
  list: true,
  cover: true,
  gallery: true,
};

export function AdminApp({ initialDoc }: { initialDoc: AdminDoc }) {
  const [doc, setDoc] = useState<AdminDoc>(initialDoc);
  const [page, setPage] = useState<PageKey>("portfolio");
  const [locale, setLocale] = useState<Locale>("id");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const rowsOf = useCallback((key: CollectionKey) => (doc[key] ?? []) as Row[], [doc]);

  const updateRows = useCallback((key: CollectionKey, updater: (rows: Row[]) => Row[]) => {
    setDoc((current) => ({ ...current, [key]: updater((current[key] ?? []) as Row[]) }));
    setDirty(true);
  }, []);

  const patchRow = useCallback(
    (key: CollectionKey, index: number, patch: Record<string, unknown>) => {
      updateRows(key, (rows) => rows.map((row, at) => (at === index ? ({ ...row, ...patch } as Row) : row)));
    },
    [updateRows],
  );

  const patchCopy = useCallback(
    (key: CollectionKey, index: number, field: string, value: unknown) => {
      updateRows(key, (rows) =>
        rows.map((row, at) => {
          if (at !== index) return row;
          const block = { ...copyFor(row, locale), [field]: value };
          return { ...row, copy: { ...row.copy, [locale]: block } } as Row;
        }),
      );
    },
    [locale, updateRows],
  );

  const duplicates = useMemo(() => {
    const found: { label: string; id: string }[] = [];
    for (const def of PAGES.flatMap((one) => one.collections).map(collectionDef)) {
      for (const id of duplicateIds(doc, def.key)) found.push({ label: def.label, id });
    }
    return found;
  }, [doc]);

  const save = useCallback(async () => {
    if (duplicates.length) {
      setNotice({
        kind: "error",
        text: `Ada alamat halaman yang dipakai dua kali: ${duplicates
          .map((one) => `${one.label} → ${one.id}`)
          .join(", ")}. Samakan dulu sebelum menyimpan.`,
      });
      return;
    }

    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc }),
      });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { doc?: AdminDoc; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Gagal menyimpan.");
      if (data.doc) setDoc(data.doc);
      setDirty(false);
      setNotice({ kind: "ok", text: "Tersimpan. Situs sudah memakai versi terbaru." });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Gagal menyimpan." });
    } finally {
      setBusy(false);
    }
  }, [doc, duplicates]);

  /* Ctrl/Cmd + S saves, the way every editor does. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  /* A closed tab must not quietly throw away an hour of writing. */
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const logout = useCallback(async () => {
    if (dirty && !window.confirm("Ada perubahan yang belum disimpan. Keluar sekarang?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }, [dirty]);

  const addRow = (def: CollectionDef) => {
    const index = rowsOf(def.key).length;
    updateRows(def.key, (rows) => [...rows, def.newRow()]);
    setOpen((current) => ({ ...current, [`${def.key}:${index}`]: true }));
  };

  const moveRow = (def: CollectionDef, index: number, direction: -1 | 1) => {
    const target = index + direction;
    updateRows(def.key, (rows) => {
      if (target < 0 || target >= rows.length) return rows;
      const next = [...rows];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const pageDef = PAGES.find((one) => one.key === page) ?? PAGES[0];
  const writesCopy = pageDef.collections.some((key) => collectionDef(key).copy.length > 0);

  const renderCollection = (def: CollectionDef) => {
    const rows = rowsOf(def.key);
    return (
      <section className="block" key={def.key}>
        <header className="block-head">
          <div>
            <h2>{def.label}</h2>
            <p className="hint">{def.hint}</p>
          </div>
          <button type="button" className="btn btn-small" onClick={() => addRow(def)}>
            + Tambah {def.singular}
          </button>
        </header>

        {rows.length === 0 ? <p className="hint empty">Belum ada isi di bagian ini.</p> : null}

        {rows.map((row, index) => {
          const key = `${def.key}:${index}`;
          const isOpen = open[key] === true;
          const title = def.titleOf(row, locale);
          const issues = rowProblems(def, row);
          const cover = def.key === "work" ? (row as unknown as { cover?: string }).cover : "";
          return (
            <article className={isOpen ? "row is-open" : "row"} key={key}>
              <div className="row-head">
                <button
                  type="button"
                  className="row-toggle"
                  onClick={() => setOpen((current) => ({ ...current, [key]: !isOpen }))}
                  aria-expanded={isOpen}
                >
                  <span className="row-index">{index + 1}</span>
                  {cover ? <MediaPreview src={cover} className="row-thumb" animated /> : null}
                  <span className="row-title">{title}</span>
                  {issues.length ? (
                    <span className="row-flag" title={issues.join(" ")}>
                      belum lengkap
                    </span>
                  ) : null}
                  <span className="row-caret" aria-hidden="true">
                    {isOpen ? "▾" : "▸"}
                  </span>
                </button>

                <div className="row-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => moveRow(def, index, -1)}
                    disabled={index === 0}
                    aria-label="Naikkan urutan"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => moveRow(def, index, 1)}
                    disabled={index === rows.length - 1}
                    aria-label="Turunkan urutan"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger"
                    onClick={() => {
                      if (window.confirm(`Hapus “${title}”?`)) {
                        updateRows(def.key, (all) => all.filter((_, at) => at !== index));
                      }
                    }}
                    aria-label={`Hapus ${title}`}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {isOpen ? (
                <div className="row-body">
                  <div className="grid-fields">
                    {def.neutral.map((field) => (
                      <Field
                        key={field.key}
                        def={field}
                        locale={locale}
                        value={(row as unknown as Record<string, unknown>)[field.key]}
                        className={WIDE[field.kind] ? "field-wide" : undefined}
                        onChange={(value) => patchRow(def.key, index, { [field.key]: value })}
                        onError={(text) => setNotice({ kind: "error", text })}
                      />
                    ))}
                  </div>

                  {def.copy.length ? (
                    <div className="copy-block">
                      <p className="copy-label">
                        {locale === "id" ? "Teks Indonesia" : "Teks English"}
                        {locale === "en" ? <em> — kosong berarti memakai teks Indonesia</em> : null}
                      </p>
                      <div className="grid-fields">
                        {def.copy.map((field) => (
                          <Field
                            key={field.key}
                            def={field}
                            locale={locale}
                            value={copyFor(row, locale)[field.key]}
                            className={WIDE[field.kind] ? "field-wide" : undefined}
                            onChange={(value) => patchCopy(def.key, index, field.key, value)}
                            onError={(text) => setNotice({ kind: "error", text })}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    );
  };

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-brand">
          BikinSaaS <span>panel</span>
        </div>
        <div className="admin-top-actions">
          {writesCopy ? (
            <div className="lang-switch" role="group" aria-label="Bahasa teks yang disunting">
              <span className="lang-label">Bahasa teks</span>
              <button
                type="button"
                className={locale === "id" ? "is-active" : ""}
                onClick={() => setLocale("id")}
              >
                Indonesia
              </button>
              <button
                type="button"
                className={locale === "en" ? "is-active" : ""}
                onClick={() => setLocale("en")}
              >
                English
              </button>
            </div>
          ) : null}
          <a className="btn btn-ghost" href={`/${locale}`} target="_blank" rel="noreferrer">
            Lihat situs
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => void logout()}>
            Keluar
          </button>
        </div>
      </header>

      <div className="admin-columns">
        <nav className="admin-nav">
          {PAGES.map((one) => (
            <button
              key={one.key}
              type="button"
              className={page === one.key ? "is-active" : ""}
              onClick={() => setPage(one.key)}
            >
              {one.label}
            </button>
          ))}
        </nav>

        <main className="admin-main">
          {notice ? <p className={`banner banner-${notice.kind}`}>{notice.text}</p> : null}

          {duplicates.length ? (
            <p className="banner banner-error">
              Alamat halaman dipakai dua kali:{" "}
              {duplicates.map((one) => `${one.label} → ${one.id}`).join(", ")}. Samakan dulu sebelum
              menyimpan.
            </p>
          ) : null}

          <header className="page-head">
            <h1>{pageDef.label}</h1>
            <p className="hint">{pageDef.blurb}</p>
          </header>

          {page === "contact" ? (
            <SettingsPanel
              settings={doc.settings}
              onChange={(patch) => {
                setDoc((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
                setDirty(true);
              }}
            />
          ) : (
            pageDef.collections.map((key) => renderCollection(collectionDef(key)))
          )}
        </main>
      </div>

      <footer className="admin-save">
        <span className={dirty ? "save-state is-dirty" : "save-state"}>
          {busy ? "Menyimpan…" : dirty ? "Ada perubahan belum disimpan" : "Tersimpan"}
        </span>
        <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={busy}>
          Simpan
        </button>
      </footer>
    </div>
  );
}

function SettingsPanel({
  settings,
  onChange,
}: {
  settings: ContactSettings;
  onChange: (patch: Partial<ContactSettings>) => void;
}) {
  return (
    <section className="block">
      <header className="block-head">
        <div>
          <h2>Cara pengunjung menghubungi Anda</h2>
          <p className="hint">
            Dipakai di seluruh situs: setiap tombol pesan, tautan email, dan baris alamat.
          </p>
        </div>
      </header>

      <div className="row is-open">
        <div className="row-body">
          <div className="grid-fields">
            {SETTINGS_FIELDS.map((field) => (
              <div className={field.kind === "textarea" ? "field field-wide" : "field"} key={field.key}>
                <span className="field-label">
                  {field.label}
                  {field.hint ? <em className="hint">{field.hint}</em> : null}
                </span>
                <input
                  className="input"
                  type="text"
                  value={settings[field.key] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(event) => onChange({ [field.key]: event.target.value })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
