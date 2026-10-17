import type { Content } from "@/content";
import type { SiteCopy } from "@/lib/site-copy";
import type { ContactLabels } from "./ContactForm";
import type { OrderLabels } from "./OrderDialog";

/** Builds the order dialog's labels from the existing dictionary. */
export function buildOrderLabels(ui: Content["ui"], copy: SiteCopy): OrderLabels {
  return {
    title: ui.order.modalTitle,
    nameLabel: ui.order.nameLabel,
    namePlaceholder: ui.order.namePlaceholder,
    businessLabel: ui.order.businessLabel,
    businessPlaceholder: ui.order.businessPlaceholder,
    noteLabel: ui.order.noteLabel,
    notePlaceholder: ui.order.notePlaceholder,
    submit: ui.order.submit,
    footnote: ui.order.footnote,
    errName: ui.order.errName,
    estimate: ui.order.estimate,
    close: copy.common.close,
    doneTitle: ui.contact.doneTitle,
    doneBody: ui.contact.doneBody,
    fallbackTitle: ui.fallback.title,
    fallbackBody: ui.fallback.body,
    waName: ui.wa.labelName,
    waBusiness: ui.wa.labelBusiness,
    waNote: ui.wa.labelNote,
    waEstimate: ui.wa.labelEstimate,
  };
}

export function buildContactLabels(ui: Content["ui"], copy: SiteCopy): ContactLabels {
  const c = ui.contact;
  return {
    nameLabel: c.nameLabel,
    namePlaceholder: c.namePlaceholder,
    businessLabel: c.businessLabel,
    businessPlaceholder: c.businessPlaceholder,
    serviceLabel: c.serviceLabel,
    budgetLabel: c.budgetLabel,
    descriptionLabel: c.descriptionLabel,
    descriptionPlaceholder: c.descriptionPlaceholder,
    submit: c.submit,
    sending: c.sending,
    doneTitle: c.doneTitle,
    doneBody: c.doneBody,
    again: c.again,
    errName: c.errName,
    errService: c.errService,
    errDescription: c.errDescription,
    fallbackTitle: ui.fallback.title,
    fallbackBody: ui.fallback.body,
    optional: copy.common.optional,
    responseTime: ui.brand.responseTime,
    intro: ui.wa.consult,
    waName: ui.wa.labelName,
    waBusiness: ui.wa.labelBusiness,
    waService: ui.wa.labelService,
    waBudget: ui.wa.labelBudget,
    waNeed: ui.wa.labelNeed,
  };
}
