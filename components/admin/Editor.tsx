"use client";

import { ArrowDown, ArrowUp, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { collectionDef, duplicateIds, rowProblems, suggestId, type CollectionDef } from "@/lib/admin/fields";
import { copyFor, rowText, type AdminDoc, type CollectionKey, type Row } from "@/lib/admin/types";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { Field } from "./Fields";
import { MediaPreview } from "./Media";

/**
 * One editor for both pages (portfolio, pricing). Each section is a list; a
 * click opens the row in a side panel with a single Save button, and saving
 * writes the whole document at once and updates the public site.
 *
 * There is no page-wide "unsaved changes" state to keep track of: nothing is
 * kept until the panel's own Save is pressed, and it is pressed once per row.
 */

type Variant = "cards" | "list" | "people";

export interface SectionSpec {
  key: CollectionKey;
  variant: Variant;
}

interface Toast {
  kind: "ok" | "error";
  text: string;
}

interface Editing {
  key: CollectionKey;
  /** null for a row that does not exist yet. */
  index: number | null;
  draft: Row;
}

const WIDE: Record<string, boolean> = { textarea: true, list: true, cover: true, gallery: true };

const CATEGORY_LABEL: Record<string, string> = {
  takeover: "Takeover",
  company: "Company profile",
  saas: "SaaS",
  ssb: "Sekolah sepak bola",
};

const asRecord = (row: Row) => row as unknown as Record<string, unknown>;

/** The price line a row shows in its list, in words an owner would use. */
function priceOf(key: CollectionKey, row: Row): string {
  const r = asRecord(row);
  const num = (k: string) => (typeof r[k] === "number" ? (r[k] as number) : 0);
  if (key === "maintenance") return `${formatMoney(num("pricePerMonth"), "id")} / bulan`;
  const base = formatMoney(num("price"), "id");
  if (num("priceMax") > num("price")) return `${base} – ${formatMoney(num("priceMax"), "id")}`;
  if (key === "addOns" && r.from === true) return `Mulai ${base}`;
  return base;
}

function uniqueId(base: string, taken: string[]): string {
  const root = base || "item";
  let id = root;
  for (let n = 2; taken.includes(id); n++) id = `${root}-${n}`;
  return id;
}

export function Editor({
  initialDoc,
  sections,
}: {
  initialDoc: AdminDoc;
  sections: SectionSpec[];
}) {
  const [doc, setDoc] = useState<AdminDoc>(initialDoc);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const rowsOf = useCallback((key: CollectionKey) => (doc[key] ?? []) as Row[], [doc]);

  useEffect(() => {
    if (toast?.kind !== "ok") return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  /** Sends a whole document and adopts what the server kept. */
  const persist = useCallback(async (next: AdminDoc, success: string): Promise<boolean> => {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: next }),
      });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return false;
      }
      const data = (await response.json().catch(() => ({}))) as { doc?: AdminDoc; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Gagal menyimpan.");
      setDoc(data.doc ?? next);
      setToast({ kind: "ok", text: success });
      return true;
    } catch (error) {
      setToast({ kind: "error", text: error instanceof Error ? error.message : "Gagal menyimpan." });
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const openNew = (def: CollectionDef) => setEditing({ key: def.key, index: null, draft: def.newRow() });
  const openRow = (key: CollectionKey, index: number) =>
    setEditing({ key, index, draft: structuredClone(rowsOf(key)[index]) });

  const saveEditing = async (): Promise<string | null> => {
    if (!editing) return null;
    const def = collectionDef(editing.key);
    let draft = editing.draft;

    /* The address a row lives at is made from its title; owners never type it. */
    const rows = rowsOf(editing.key);
    if (editing.index === null) {
      const taken = rows.map((one) => one.id);
      draft = { ...draft, id: uniqueId(suggestId(def, draft), taken) };
    }

    const problems = rowProblems(def, draft).filter((text) => !text.startsWith("Kode"));
    const r = asRecord(draft);
    const price = def.key === "maintenance" ? r.pricePerMonth : r.price;
    if (def.neutral.some((f) => f.key === "price" || f.key === "pricePerMonth") && !(Number(price) > 0)) {
      problems.push("Harga belum diisi.");
    }
    if (typeof r.priceMax === "number" && r.priceMax > 0 && r.priceMax <= Number(r.price)) {
      problems.push("Harga maksimum harus lebih besar dari harga.");
    }
    if (problems.length) return problems.join(" ");

    const next: AdminDoc = {
      ...doc,
      [editing.key]:
        editing.index === null
          ? [...rows, draft]
          : rows.map((one, at) => (at === editing.index ? draft : one)),
    };
    if (duplicateIds(next, editing.key).length) return "Sudah ada yang bernama sama. Ubah judulnya sedikit.";

    const ok = await persist(next, editing.index === null ? "Ditambahkan dan sudah tampil di situs." : "Tersimpan. Situs sudah memakai versi terbaru.");
    if (ok) setEditing(null);
    return null;
  };

  const remove = async (key: CollectionKey, index: number) => {
    await persist({ ...doc, [key]: rowsOf(key).filter((_, at) => at !== index) }, "Sudah dihapus dari situs.");
  };

  const move = async (key: CollectionKey, index: number, by: -1 | 1) => {
    const rows = [...rowsOf(key)];
    const to = index + by;
    if (to < 0 || to >= rows.length) return;
    [rows[index], rows[to]] = [rows[to], rows[index]];
    await persist({ ...doc, [key]: rows }, "Urutan diubah.");
  };

  return (
    <>
      {sections.map(({ key, variant }, sectionIndex) => {
        const def = collectionDef(key);
        const rows = rowsOf(key);
        return (
          <section className="card section" key={key}>
            <div className="card-head">
              <div>
                <p className="kicker">
                  <span className="dot" />/ {String(sectionIndex + 1).padStart(2, "0")} — {def.label}
                </p>
                <h2>{def.label}</h2>
                <p className="muted">{def.hint}</p>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => openNew(def)}>
                <Plus size={16} aria-hidden="true" />
                Tambah {def.singular}
              </button>
            </div>

            {rows.length === 0 ? (
              <div className="empty">
                <p>Belum ada {def.singular}.</p>
                <button type="button" className="btn btn-ghost" onClick={() => openNew(def)}>
                  <Plus size={15} aria-hidden="true" />
                  Tambah {def.singular} pertama
                </button>
              </div>
            ) : variant === "people" ? (
              <ul className="price-list">
                {rows.map((row, index) => (
                  <PersonRow
                    key={row.id}
                    row={row}
                    index={index}
                    last={index === rows.length - 1}
                    busy={busy}
                    onOpen={() => openRow(key, index)}
                    onMove={(by) => void move(key, index, by)}
                    onDelete={() => void remove(key, index)}
                  />
                ))}
              </ul>
            ) : variant === "cards" ? (
              <ul className="work-grid">
                {rows.map((row, index) => (
                  <WorkCard
                    key={row.id}
                    row={row}
                    index={index}
                    last={index === rows.length - 1}
                    busy={busy}
                    onOpen={() => openRow(key, index)}
                    onMove={(by) => void move(key, index, by)}
                    onDelete={() => void remove(key, index)}
                  />
                ))}
              </ul>
            ) : (
              <ul className="price-list">
                {rows.map((row, index) => (
                  <PriceRow
                    key={row.id}
                    def={def}
                    row={row}
                    index={index}
                    last={index === rows.length - 1}
                    busy={busy}
                    onOpen={() => openRow(key, index)}
                    onMove={(by) => void move(key, index, by)}
                    onDelete={() => void remove(key, index)}
                  />
                ))}
              </ul>
            )}
          </section>
        );
      })}

      {editing ? (
        <Panel
          editing={editing}
          busy={busy}
          onChange={(draft) => setEditing({ ...editing, draft })}
          onClose={() => setEditing(null)}
          onSave={saveEditing}
          onError={(text) => setToast({ kind: "error", text })}
        />
      ) : null}

      {toast ? (
        <p className={cn("toast", toast.kind === "error" && "is-error")} role={toast.kind === "ok" ? "status" : "alert"}>
          {toast.kind === "ok" ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
          {toast.text}
        </p>
      ) : null}
    </>
  );
}

/* ---------------------------------------------------------------- rows --- */

interface RowProps {
  row: Row;
  index: number;
  last: boolean;
  busy: boolean;
  onOpen: () => void;
  onMove: (by: -1 | 1) => void;
  onDelete: () => void;
}

/** Up, down, delete — delete asks once, right where it was clicked. */
function RowActions({ index, last, busy, onMove, onDelete, onOpen }: Omit<RowProps, "row">) {
  const [asking, setAsking] = useState(false);

  if (asking) {
    return (
      <div className="row-actions is-asking">
        <span>Hapus dari situs?</span>
        <button type="button" className="btn btn-danger btn-small" disabled={busy} onClick={onDelete}>
          Ya, hapus
        </button>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => setAsking(false)}>
          Batal
        </button>
      </div>
    );
  }

  return (
    <div className="row-actions">
      <button type="button" className="icon-btn" onClick={() => onMove(-1)} disabled={busy || index === 0} aria-label="Naikkan urutan">
        <ArrowUp size={16} />
      </button>
      <button type="button" className="icon-btn" onClick={() => onMove(1)} disabled={busy || last} aria-label="Turunkan urutan">
        <ArrowDown size={16} />
      </button>
      <button type="button" className="btn btn-ghost btn-small" onClick={onOpen}>
        <Pencil size={14} aria-hidden="true" />
        Ubah
      </button>
      <button type="button" className="icon-btn icon-btn-danger" onClick={() => setAsking(true)} disabled={busy} aria-label="Hapus">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function WorkCard(props: RowProps) {
  const { row, index } = props;
  const r = asRecord(row);
  const cover = typeof r.cover === "string" ? r.cover : "";
  const title = rowText(row, "id", "title") || "(tanpa judul)";
  const client = r.kind === "takeover";

  return (
    <li className="work-card">
      <button type="button" className="work-thumb" onClick={props.onOpen} aria-label={`Ubah ${title}`}>
        {cover ? (
          <MediaPreview src={cover} className="work-thumb-media" animated />
        ) : (
          <span className="work-thumb-empty" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {client ? <span className="chip chip-solid">Proyek klien</span> : null}
      </button>
      <div className="work-body">
        <p className="work-meta">{CATEGORY_LABEL[String(r.category)] ?? String(r.category)}</p>
        <h3>{title}</h3>
        {!cover ? <p className="hint">Belum ada foto sampul — situs memakai motif bawaan.</p> : null}
      </div>
      <RowActions {...props} />
    </li>
  );
}

function PersonRow(props: RowProps) {
  const { row } = props;
  const photo = typeof asRecord(row).photo === "string" ? (asRecord(row).photo as string) : "";
  const name = rowText(row, "id", "name") || "(tanpa nama)";
  const role = rowText(row, "id", "role");
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <li className="price-row person-row">
      <button type="button" className="person-avatar" onClick={props.onOpen} aria-label={`Ubah ${name}`}>
        {photo ? <MediaPreview src={photo} className="person-photo" /> : <span aria-hidden="true">{initials}</span>}
      </button>
      <button type="button" className="price-main" onClick={props.onOpen}>
        <strong>{name}</strong>
        <span className="muted">{role || "Belum ada peran"}</span>
      </button>
      <RowActions {...props} />
    </li>
  );
}

function PriceRow(props: RowProps & { def: CollectionDef }) {
  const { row, def, index } = props;
  const r = asRecord(row);
  const name = rowText(row, "id", "name") || "(tanpa nama)";
  const features = Array.isArray(copyFor(row, "id").features) ? (copyFor(row, "id").features as unknown[]).length : 0;
  const tagline = rowText(row, "id", "tagline") || rowText(row, "id", "body");

  return (
    <li className="price-row">
      <span className="price-index">{String(index + 1).padStart(2, "0")}</span>
      <button type="button" className="price-main" onClick={props.onOpen}>
        <strong>
          {name}
          {r.popular === true ? <span className="chip">Paling sering dipilih</span> : null}
        </strong>
        <span className="muted">{tagline || (features ? `${features} poin isi paket` : "Belum ada keterangan")}</span>
      </button>
      <p className="price-amount">{priceOf(def.key, row)}</p>
      <RowActions {...props} />
    </li>
  );
}

/* --------------------------------------------------------------- panel --- */

function Panel({
  editing,
  busy,
  onChange,
  onClose,
  onSave,
  onError,
}: {
  editing: Editing;
  busy: boolean;
  onChange: (row: Row) => void;
  onClose: () => void;
  onSave: () => Promise<string | null>;
  onError: (text: string) => void;
}) {
  const def = collectionDef(editing.key);
  const [locale, setLocale] = useState<Locale>("id");
  const [problem, setProblem] = useState<string | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const draft = editing.draft;
  const isNew = editing.index === null;
  /* A person reads photo, name, role, bio — the links come last. */
  const isPerson = def.key === "team";

  /* Held in a ref so a new onClose each render does not re-run the effect below
     and steal focus from whatever is being typed in. */
  const close = useRef(onClose);
  close.current = onClose;

  /* Escape closes, the page behind does not scroll, focus lands in the form. */
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    body.current?.querySelector<HTMLElement>("input, textarea, select")?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close.current();
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("panel-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("panel-open");
      previous?.focus();
    };
  }, []);

  const patch = (field: string, value: unknown) => onChange({ ...draft, [field]: value } as Row);
  const patchCopy = (field: string, value: unknown) =>
    onChange({ ...draft, copy: { ...draft.copy, [locale]: { ...copyFor(draft, locale), [field]: value } } } as Row);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProblem(await onSave());
  };

  /* The address of a row is derived from its title, so it is never asked for. */
  const neutral = def.neutral.filter((field) => field.key !== "id");
  const media = neutral.filter((field) => field.kind === "cover" || field.kind === "gallery");
  const settings = neutral.filter((field) => field.kind !== "cover" && field.kind !== "gallery");

  const render = (field: (typeof neutral)[number], value: unknown, set: (v: unknown) => void, wide = false): ReactNode => (
    <Field
      key={field.key}
      def={field}
      locale="id"
      value={value}
      className={wide || WIDE[field.kind] ? "field-wide" : undefined}
      onChange={set}
      onError={onError}
    />
  );

  /* Portalled to <body>: inside the page it would sit beneath the sticky header. */
  return createPortal(
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="drawer" onSubmit={submit} role="dialog" aria-modal="true" aria-label={`${isNew ? "Tambah" : "Ubah"} ${def.singular}`}>
        <div className="drawer-top">
          <div>
            <p className="kicker">
              <span className="dot" />/ {def.label}
            </p>
            <h2>{isNew ? `Tambah ${def.singular}` : `Ubah ${def.singular}`}</h2>
          </div>
          <button type="button" className="round-btn" onClick={onClose} aria-label="Tutup">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body" ref={body}>
          {!isPerson && settings.length ? <div className="fields">{settings.map((f) => render(f, asRecord(draft)[f.key], (v) => patch(f.key, v)))}</div> : null}

          {media.length ? <div className="fields">{media.map((f) => render(f, asRecord(draft)[f.key], (v) => patch(f.key, v)))}</div> : null}

          <div className="lang">
            <div className="seg" role="tablist" aria-label="Bahasa teks">
              <button type="button" role="tab" aria-selected={locale === "id"} className={locale === "id" ? "is-active" : ""} onClick={() => setLocale("id")}>
                Indonesia
              </button>
              <button type="button" role="tab" aria-selected={locale === "en"} className={locale === "en" ? "is-active" : ""} onClick={() => setLocale("en")}>
                English <small>opsional</small>
              </button>
            </div>
            {locale === "en" ? <p className="hint">Kolom yang kosong otomatis memakai teks Indonesia.</p> : null}
          </div>

          <div className="fields">
            {def.copy.map((field) =>
              render(field, copyFor(draft, locale)[field.key], (v) => patchCopy(field.key, v), true),
            )}
          </div>

          {isPerson && settings.length ? (
            <div className="lang">
              <p className="kicker">Tautan (opsional)</p>
              <div className="fields">{settings.map((f) => render(f, asRecord(draft)[f.key], (v) => patch(f.key, v)))}</div>
            </div>
          ) : null}
        </div>

        <div className="drawer-foot">
          {problem ? (
            <p className="form-error" role="alert">
              {problem}
            </p>
          ) : null}
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Menyimpan…" : isNew ? "Tambahkan" : "Simpan"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
