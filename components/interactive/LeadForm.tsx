"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Select } from "./Select";
import { composeMessage, contactHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  business: string;
  service: string;
  budget: string;
  description: string;
}

const EMPTY: FormState = { name: "", business: "", service: "", budget: "", description: "" };
type Errors = Partial<Record<keyof FormState, string>>;

/**
 * Validation, the optional lead webhook and the WhatsApp handoff are carried
 * over from the previous form unchanged — they worked. What changed is the
 * markup, the tokens, and that every string now comes from the dictionary, so
 * an English visitor no longer sends an Indonesian message.
 */
export function LeadForm({
  ui,
  serviceOptions,
  budgetOptions,
  responseTime,
  subject,
}: {
  ui: {
    nameLabel: string;
    namePlaceholder: string;
    businessLabel: string;
    businessPlaceholder: string;
    serviceLabel: string;
    servicePlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
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
    waIntro: string;
    labelName: string;
    labelBusiness: string;
    labelService: string;
    labelBudget: string;
    labelNeed: string;
  };
  serviceOptions: string[];
  budgetOptions: string[];
  responseTime: string;
  subject: string;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
      if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    };

  const validate = (): Errors => {
    const found: Errors = {};
    if (form.name.trim().length < 2) found.name = ui.errName;
    if (!form.service) found.service = ui.errService;
    if (form.description.trim().length < 10) found.description = ui.errDescription;
    return found;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);

    /* Optional lead webhook. A failure here never blocks the WhatsApp
       handoff, which is the real path. */
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

    const message = composeMessage(ui.waIntro, [
      `${ui.labelName}: ${form.name.trim()}`,
      form.business.trim() ? `${ui.labelBusiness}: ${form.business.trim()}` : "",
      `${ui.labelService}: ${form.service}`,
      form.budget ? `${ui.labelBudget}: ${form.budget}` : "",
      "",
      `${ui.labelNeed}: ${form.description.trim()}`,
    ]);

    const target = contactHref(message, subject);
    window.open(target.href, target.external ? "_blank" : "_self", "noopener,noreferrer");

    setSending(false);
    setDone(true);
    setForm(EMPTY);
  };

  const field =
    "w-full rounded-sm bg-surface px-4 py-3 text-body text-ink outline-none transition-colors duration-150 placeholder:text-ink-quiet hover:bg-field";

  const Err = ({ k }: { k: keyof FormState }) =>
    errors[k] ? (
      <p id={`err-${k}`} role="alert" className="mt-2 text-meta text-red-700">
        {errors[k]}
      </p>
    ) : null;

  if (done) {
    return (
      <div role="status" className="py-10">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-action text-paper">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-5 font-display text-lead leading-snug text-ink">{ui.doneTitle}</h3>
        <p className="mt-3 max-w-measure text-body text-ink">
          {ui.doneBody} {responseTime}
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="press mt-6 rounded-sm bg-surface px-5 py-3 text-meta font-semibold text-ink hover:bg-field"
        >
          {ui.again}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className="mb-2 block text-meta text-ink">
            {ui.nameLabel}
          </label>
          <input
            id="lead-name"
            data-ui
            className={cn(field, errors.name && "ring-2 ring-red-700")}
            value={form.name}
            onChange={set("name")}
            placeholder={ui.namePlaceholder}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "err-name" : undefined}
          />
          <Err k="name" />
        </div>

        <div>
          <label htmlFor="lead-business" className="mb-2 block text-meta text-ink">
            {ui.businessLabel}
          </label>
          <input
            id="lead-business"
            data-ui
            className={field}
            value={form.business}
            onChange={set("business")}
            placeholder={ui.businessPlaceholder}
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-service" className="mb-2 block text-meta text-ink">
            {ui.serviceLabel}
          </label>
          <Select
            id="lead-service"
            value={form.service}
            options={serviceOptions}
            placeholder={ui.servicePlaceholder}
            onChange={(value) => {
              setForm((current) => ({ ...current, service: value }));
              setErrors((current) => ({ ...current, service: undefined }));
            }}
            invalid={Boolean(errors.service)}
            describedBy={errors.service ? "err-service" : undefined}
          />
          <Err k="service" />
        </div>

        <div>
          <label htmlFor="lead-budget" className="mb-2 block text-meta text-ink">
            {ui.budgetLabel}
          </label>
          <Select
            id="lead-budget"
            value={form.budget}
            options={budgetOptions}
            placeholder={ui.budgetPlaceholder}
            onChange={(value) => setForm((current) => ({ ...current, budget: value }))}
          />
        </div>
      </div>

      <div>
        <label htmlFor="lead-description" className="mb-2 block text-meta text-ink">
          {ui.descriptionLabel}
        </label>
        <textarea
          id="lead-description"
          data-ui
          rows={5}
          className={cn(field, errors.description && "ring-2 ring-red-700")}
          value={form.description}
          onChange={set("description")}
          placeholder={ui.descriptionPlaceholder}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "err-description" : undefined}
        />
        <Err k="description" />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="press inline-flex rounded-sm bg-action px-7 py-4 text-meta font-semibold text-paper transition-colors duration-150 hover:bg-action-deep disabled:opacity-60"
      >
        {sending ? ui.sending : ui.submit}
      </button>

      <p className="text-meta text-ink-quiet">{responseTime}</p>
    </form>
  );
}
