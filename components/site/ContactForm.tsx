"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Send } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

import { composeMessage, contactHref } from "@/lib/contact-target";
import { cn } from "@/lib/utils";
import { EASE } from "./Motion";
import { useContact } from "./Providers";

export interface ContactLabels {
  nameLabel: string;
  namePlaceholder: string;
  businessLabel: string;
  businessPlaceholder: string;
  serviceLabel: string;
  budgetLabel: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  submit: string;
  sending: string;
  doneTitle: string;
  doneBody: string;
  again: string;
  errName: string;
  errService: string;
  errDescription: string;
  fallbackTitle: string;
  fallbackBody: string;
  optional: string;
  responseTime: string;
  intro: string;
  waName: string;
  waBusiness: string;
  waService: string;
  waBudget: string;
  waNeed: string;
}

interface FormState {
  name: string;
  business: string;
  service: string;
  budget: string;
  description: string;
}

type Errors = Partial<Record<keyof FormState, string>>;
type Status = "form" | "sent" | "unconfigured";

const EMPTY: FormState = { name: "", business: "", service: "", budget: "", description: "" };

/**
 * The brief form. Service and budget are tap-to-pick chips rather than
 * dropdowns, so a visitor on a phone answers in two taps. Validation, the
 * optional lead webhook and the WhatsApp handoff follow the previous form.
 */
export function ContactForm({
  labels,
  services,
  budgets,
  subject,
}: {
  labels: ContactLabels;
  services: string[];
  budgets: string[];
  subject: string;
}) {
  const uid = useId();
  const contact = useContact();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>("form");

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found: Errors = {};
    if (form.name.trim().length < 2) found.name = labels.errName;
    if (!form.service) found.service = labels.errService;
    if (form.description.trim().length < 10) found.description = labels.errDescription;
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);

    /* Optional lead webhook. A failure never blocks the WhatsApp handoff. */
    const hook = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;
    if (hook) {
      try {
        await fetch(hook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
        });
      } catch {
        /* ignored on purpose */
      }
    }

    const message = composeMessage(labels.intro, [
      `${labels.waName}: ${form.name.trim()}`,
      form.business.trim() ? `${labels.waBusiness}: ${form.business.trim()}` : "",
      `${labels.waService}: ${form.service}`,
      form.budget ? `${labels.waBudget}: ${form.budget}` : "",
      "",
      `${labels.waNeed}: ${form.description.trim()}`,
    ]);

    const target = contactHref(message, subject, contact);
    setSending(false);
    if (target.href.startsWith("#")) {
      setStatus("unconfigured");
      return;
    }
    window.open(target.href, target.external ? "_blank" : "_self", "noopener,noreferrer");
    setStatus("sent");
    setForm(EMPTY);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "form" ? (
        <motion.form
          key="form"
          className="form spot"
          onSubmit={submit}
          noValidate
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="form-row">
            <TextField
              id={`${uid}-name`}
              label={labels.nameLabel}
              placeholder={labels.namePlaceholder}
              value={form.name}
              error={errors.name}
              autoComplete="name"
              onChange={(value) => update("name", value)}
            />
            <TextField
              id={`${uid}-business`}
              label={`${labels.businessLabel} (${labels.optional})`}
              placeholder={labels.businessPlaceholder}
              value={form.business}
              autoComplete="organization"
              onChange={(value) => update("business", value)}
            />
          </div>

          <ChipGroup
            name={`${uid}-service`}
            legend={labels.serviceLabel}
            options={services}
            value={form.service}
            error={errors.service}
            onChange={(value) => update("service", value)}
          />

          <ChipGroup
            name={`${uid}-budget`}
            legend={`${labels.budgetLabel} (${labels.optional})`}
            options={budgets}
            value={form.budget}
            onChange={(value) => update("budget", value)}
          />

          <TextField
            id={`${uid}-description`}
            label={labels.descriptionLabel}
            placeholder={labels.descriptionPlaceholder}
            value={form.description}
            error={errors.description}
            multiline
            onChange={(value) => update("description", value)}
          />

          <div className="form-foot">
            <button type="submit" className="button button-primary button-lg" disabled={sending}>
              {sending ? labels.sending : labels.submit}
              <Send size={15} />
            </button>
            <p className="form-note">{labels.responseTime}</p>
          </div>
        </motion.form>
      ) : (
        <motion.div
          key="done"
          className="form-done"
          role="status"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <motion.span
            className="done-icon"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
          >
            <Check size={24} />
          </motion.span>
          <h3>{status === "sent" ? labels.doneTitle : labels.fallbackTitle}</h3>
          <p>
            {status === "sent" ? labels.doneBody : labels.fallbackBody} {status === "sent" ? labels.responseTime : ""}
          </p>
          <button type="button" className="button button-ghost" onClick={() => setStatus("form")}>
            {labels.again}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TextField({
  id,
  label,
  placeholder,
  value,
  error,
  multiline = false,
  autoComplete,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  multiline?: boolean;
  autoComplete?: string;
  onChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    value,
    placeholder,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
  };
  return (
    <div className={cn("field", error && "has-error")}>
      <label htmlFor={id}>{label}</label>
      <div className="field-control">
        {multiline ? (
          <textarea {...shared} rows={4} onChange={(event) => onChange(event.target.value)} />
        ) : (
          <input {...shared} autoComplete={autoComplete} onChange={(event) => onChange(event.target.value)} />
        )}
        <span className="field-line" />
      </div>
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChipGroup({
  name,
  legend,
  options,
  value,
  error,
  onChange,
}: {
  name: string;
  legend: string;
  options: string[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className={cn("field", error && "has-error")}>
      <legend>{legend}</legend>
      <div className="chips">
        {options.map((option) => {
          const selected = option === value;
          return (
            <label key={option} className={cn("chip", selected && "is-on")}>
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
              />
              {selected ? <Check size={13} aria-hidden="true" /> : null}
              {option}
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
