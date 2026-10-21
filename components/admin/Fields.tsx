"use client";

import type { FieldDef } from "@/lib/admin/fields";
import type { MediaItem } from "@/lib/admin/types";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/lib/locale";

import { CoverInput, GalleryInput } from "./Media";

/**
 * One field, rendered from its definition. Adding a field to lib/admin/fields.ts
 * is enough — nothing here has to change.
 *
 * `value` is `unknown` because it comes out of a JSON document; each branch
 * narrows it and sends a typed value back through onChange.
 */

interface FieldProps {
  def: FieldDef;
  value: unknown;
  locale: Locale;
  onChange: (value: unknown) => void;
  onError: (message: string) => void;
  /** Extra class on the wrapper — media and long text span the full width. */
  className?: string;
}

function asArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((one): one is string => typeof one === "string") : [];
}

function asMedia(value: unknown): MediaItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter((one): one is MediaItem => Boolean(one) && typeof one === "object" && "src" in one);
}

function StringList({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="list-field">
      {items.map((item, index) => (
        <div className="list-row" key={index}>
          <input
            className="input"
            type="text"
            value={item}
            placeholder={placeholder}
            onChange={(event) => onChange(items.map((one, at) => (at === index ? event.target.value : one)))}
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              if (index === 0) return;
              const next = [...items];
              [next[index - 1], next[index]] = [next[index], next[index - 1]];
              onChange(next);
            }}
            disabled={index === 0}
            aria-label="Naikkan baris"
          >
            ↑
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              if (index === items.length - 1) return;
              const next = [...items];
              [next[index + 1], next[index]] = [next[index], next[index + 1]];
              onChange(next);
            }}
            disabled={index === items.length - 1}
            aria-label="Turunkan baris"
          >
            ↓
          </button>
          <button
            type="button"
            className="icon-btn icon-btn-danger"
            onClick={() => onChange(items.filter((_, at) => at !== index))}
            aria-label="Buang baris"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost btn-small list-add" onClick={() => onChange([...items, ""])}>
        + Tambah baris
      </button>
    </div>
  );
}

export function Field({ def, value, locale, onChange, onError, className }: FieldProps) {
  const wrapper = className ? `field ${className}` : "field";

  if (def.kind === "toggle") {
    return (
      <label className={`${wrapper} field-toggle`}>
        <input type="checkbox" checked={value === true} onChange={(event) => onChange(event.target.checked)} />
        <span>
          {def.label}
          {def.hint ? <em className="hint">{def.hint}</em> : null}
        </span>
      </label>
    );
  }

  const label = (
    <span className="field-label">
      {def.label}
      {def.hint ? <em className="hint">{def.hint}</em> : null}
    </span>
  );

  const control = (() => {
    switch (def.kind) {
      case "text":
        return (
          <input
            className={def.mono ? "input input-mono" : "input"}
            type="text"
            value={typeof value === "string" ? value : ""}
            placeholder={def.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        );

      case "textarea":
        return (
          <textarea
            className="input textarea"
            rows={def.rows ?? 3}
            value={typeof value === "string" ? value : ""}
            placeholder={def.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        );

      case "money":
        return (
          <div className="input-group">
            <input
              className="input"
              type="number"
              min={0}
              step={1000}
              value={typeof value === "number" ? value : 0}
              onChange={(event) => onChange(Number(event.target.value))}
            />
            {Number(value) > 0 ? <span className="field-suffix">{formatMoney(Number(value), locale)}</span> : null}
          </div>
        );

      case "number":
        return (
          <input
            className="input"
            type="number"
            min={0}
            value={typeof value === "number" ? value : 0}
            onChange={(event) => onChange(Number(event.target.value))}
          />
        );

      case "list":
        return <StringList items={asArray(value)} onChange={onChange} placeholder={def.placeholder} />;

      case "select":
        return (
          <select
            className="input"
            value={typeof value === "string" ? value : def.options[0]?.value}
            onChange={(event) => onChange(event.target.value)}
          >
            {def.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "cover":
        return (
          <CoverInput
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
            onError={onError}
          />
        );

      case "gallery":
        return <GalleryInput value={asMedia(value)} onChange={onChange} onError={onError} />;

      default:
        return null;
    }
  })();

  return (
    <div className={wrapper}>
      {label}
      {control}
    </div>
  );
}
