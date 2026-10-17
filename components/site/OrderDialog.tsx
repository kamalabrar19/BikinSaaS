"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Send, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

import { composeMessage, contactHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { EASE } from "./Motion";
import { useSite } from "./Providers";

export interface OrderLine {
  name: string;
  priceLabel: string;
}

export interface OrderLabels {
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  businessLabel: string;
  businessPlaceholder: string;
  noteLabel: string;
  notePlaceholder: string;
  submit: string;
  footnote: string;
  errName: string;
  estimate: string;
  close: string;
  doneTitle: string;
  doneBody: string;
  fallbackTitle: string;
  fallbackBody: string;
  waName: string;
  waBusiness: string;
  waNote: string;
  waEstimate: string;
}

type Status = "form" | "sent" | "unconfigured";

/**
 * Collects a name (and optionally a business and a note), then opens WhatsApp
 * with the chosen package already written out. Rendered in a portal: the
 * order buttons sit inside animated, transformed cards, and a fixed overlay
 * inside a transformed parent would be positioned relative to the card.
 */
export function OrderDialog({
  open,
  onClose,
  intro,
  lines,
  estimate,
  labels,
  subject,
}: {
  open: boolean;
  onClose: () => void;
  intro: string;
  lines: OrderLine[];
  estimate?: string;
  labels: OrderLabels;
  subject: string;
}) {
  const { lockScroll } = useSite();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("form");

  /* Callers pass an inline arrow; keeping it in a ref stops the effect below
     from re-running (and resetting the dialog) on every parent render. */
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setStatus("form");
    setError("");
    lockScroll(true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open, lockScroll]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError(labels.errName);
      return;
    }

    const message = composeMessage(intro, [
      ...lines.map((line) => `- ${line.name}: ${line.priceLabel}`),
      estimate ? `${labels.waEstimate}: ${estimate}` : "",
      "",
      `${labels.waName}: ${name.trim()}`,
      business.trim() ? `${labels.waBusiness}: ${business.trim()}` : "",
      note.trim() ? `${labels.waNote}: ${note.trim()}` : "",
    ]);

    const target = contactHref(message, subject);
    if (target.href.startsWith("#")) {
      setStatus("unconfigured");
      return;
    }
    window.open(target.href, target.external ? "_blank" : "_self", "noopener,noreferrer");
    setStatus("sent");
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="dialog"
            data-lenis-prevent
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="dialog-close" onClick={onClose} aria-label={labels.close}>
              <X size={16} />
            </button>

            {status === "form" ? (
              <>
                <p className="eyebrow">/ BikinSaaS</p>
                <h2 id={titleId}>{labels.title}</h2>

                <div className="order-summary">
                  {lines.map((line) => (
                    <div key={line.name}>
                      <span>{line.name}</span>
                      <b>{line.priceLabel}</b>
                    </div>
                  ))}
                  {estimate ? (
                    <div className="total">
                      <span>{labels.estimate}</span>
                      <b>{estimate}</b>
                    </div>
                  ) : null}
                </div>

                <form className="dialog-form" onSubmit={submit} noValidate>
                  <div className={cn("field", error && "has-error")}>
                    <label htmlFor={`${titleId}-name`}>{labels.nameLabel}</label>
                    <div className="field-control">
                      <input
                        id={`${titleId}-name`}
                        value={name}
                        autoFocus
                        autoComplete="name"
                        placeholder={labels.namePlaceholder}
                        aria-invalid={Boolean(error)}
                        onChange={(event) => {
                          setName(event.target.value);
                          if (error) setError("");
                        }}
                      />
                      <span className="field-line" />
                    </div>
                    {error ? (
                      <p className="field-error" role="alert">
                        {error}
                      </p>
                    ) : null}
                  </div>
                  <div className="field">
                    <label htmlFor={`${titleId}-business`}>{labels.businessLabel}</label>
                    <div className="field-control">
                      <input
                        id={`${titleId}-business`}
                        value={business}
                        autoComplete="organization"
                        placeholder={labels.businessPlaceholder}
                        onChange={(event) => setBusiness(event.target.value)}
                      />
                      <span className="field-line" />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor={`${titleId}-note`}>{labels.noteLabel}</label>
                    <div className="field-control">
                      <textarea
                        id={`${titleId}-note`}
                        rows={3}
                        value={note}
                        placeholder={labels.notePlaceholder}
                        onChange={(event) => setNote(event.target.value)}
                      />
                      <span className="field-line" />
                    </div>
                  </div>
                  <button type="submit" className="button button-primary button-lg">
                    {labels.submit}
                    <Send size={15} />
                  </button>
                  <p className="dialog-foot">{labels.footnote}</p>
                </form>
              </>
            ) : (
              <div className="dialog-done" role="status">
                <span className="done-icon">
                  <Check size={22} />
                </span>
                <h2 id={titleId}>{status === "sent" ? labels.doneTitle : labels.fallbackTitle}</h2>
                <p>{status === "sent" ? labels.doneBody : labels.fallbackBody}</p>
                <button type="button" className="button button-ghost" onClick={onClose}>
                  {labels.close}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

/** A button that opens the order dialog for one package. */
export function OrderButton({
  label,
  className = "button button-primary",
  intro,
  lines,
  labels,
  subject,
}: {
  label: string;
  className?: string;
  intro: string;
  lines: OrderLine[];
  labels: OrderLabels;
  subject: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
        <Send size={14} />
      </button>
      <OrderDialog
        open={open}
        onClose={() => setOpen(false)}
        intro={intro}
        lines={lines}
        labels={labels}
        subject={subject}
      />
    </>
  );
}
