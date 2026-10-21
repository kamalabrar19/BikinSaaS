import { buildBaseContent } from "@/content";
import { envContactSettings } from "@/lib/contact-target";
import { siteCopy } from "@/lib/site-copy";

import { COLLECTION_KEYS } from "./fields";
import { readStore } from "./store";
import { emptyDoc, type AdminDoc, type Row } from "./types";

/**
 * What the panel shows when it opens.
 *
 * The seed is read straight out of content/*.ts and lib/site-copy.ts, so the
 * day the panel goes live it already lists the real site instead of an empty
 * form. Anything already saved in data/site.json wins, collection by
 * collection: a document that only covers the portfolio still shows the seed
 * for prices.
 *
 * Server-only (imports the content modules and the store).
 */

function byId<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

/** Drops empty strings and empty lists so the saved JSON stays readable. */
function block(source: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "string") {
      out[key] = value;
    } else if (Array.isArray(value) && value.length) {
      out[key] = value;
    }
  }
  return out;
}

function seedDocument(): AdminDoc {
  const doc = emptyDoc();
  const id = buildBaseContent("id");
  const en = buildBaseContent("en");

  const settings = envContactSettings();
  doc.settings = {
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: id.ui.footer.place,
  };

  /* ------------------------------------------------------------ portfolio -- */

  doc.categories = id.workCategories.map((category, index) => ({
    id: category.id,
    copy: { id: { name: category.label }, en: { name: en.workCategories[index]?.label ?? category.label } },
  }));

  const enWork = byId(en.work);
  doc.work = id.work.map((item) => {
    const other = enWork.get(item.id);
    return {
      id: item.id,
      category: item.category,
      kind: item.kind,
      ...(item.cover ? { cover: item.cover } : {}),
      ...(item.gallery?.length ? { gallery: item.gallery } : {}),
      copy: {
        id: block({
          title: item.title,
          client: item.client,
          before: item.before,
          solution: item.solution,
          result: item.result,
          detail: item.detail,
          stack: item.stack,
        }),
        en: other
          ? block({
              title: other.title,
              client: other.client,
              before: other.before,
              solution: other.solution,
              result: other.result,
              detail: other.detail,
              stack: other.stack,
            })
          : {},
      },
    };
  });

  /* ----------------------------------------------------------------- team -- */

  const enTeam = byId(en.team);
  doc.team = id.team.map((member) => {
    const other = enTeam.get(member.id);
    const fields = (m: typeof member) =>
      block({ name: m.name, role: m.role, bio: m.bio, skills: m.skills });
    return { id: member.id, copy: { id: fields(member), en: other ? fields(other) : {} } };
  });

  /* --------------------------------------------------------------- prices -- */

  const enWebsite = byId(en.websitePlans);
  doc.websitePlans = id.websitePlans.map((plan) => {
    const other = enWebsite.get(plan.id);
    return {
      id: plan.id,
      price: plan.price,
      ...(plan.priceMax ? { priceMax: plan.priceMax } : {}),
      ...(plan.popular ? { popular: true } : {}),
      copy: {
        id: block({ name: plan.name, tagline: plan.tagline, features: plan.features }),
        en: other ? block({ name: other.name, tagline: other.tagline, features: other.features }) : {},
      },
    };
  });

  const enWebapp = byId(en.webappPlans);
  doc.webappPlans = id.webappPlans.map((plan) => {
    const other = enWebapp.get(plan.id);
    return {
      id: plan.id,
      price: plan.price,
      ...(plan.priceMax ? { priceMax: plan.priceMax } : {}),
      ...(plan.popular ? { popular: true } : {}),
      copy: {
        id: block({ name: plan.name, tagline: plan.tagline, features: plan.features }),
        en: other ? block({ name: other.name, tagline: other.tagline, features: other.features }) : {},
      },
    };
  });

  const enAddOns = byId(en.addOns);
  doc.addOns = id.addOns.map((addOn) => {
    const other = enAddOns.get(addOn.id);
    return {
      id: addOn.id,
      price: addOn.price,
      ...(addOn.from ? { from: true } : {}),
      copy: {
        id: block({ name: addOn.name, body: addOn.body, unit: addOn.unit ?? "" }),
        en: other ? block({ name: other.name, body: other.body, unit: other.unit ?? "" }) : {},
      },
    };
  });

  const enMaintenance = byId(en.maintenance);
  doc.maintenance = id.maintenance.map((plan) => {
    const other = enMaintenance.get(plan.id);
    return {
      id: plan.id,
      pricePerMonth: plan.pricePerMonth,
      copy: {
        id: block({ name: plan.name, features: plan.features }),
        en: other ? block({ name: other.name, features: other.features }) : {},
      },
    };
  });

  /* ------------------------------------------------------------- numbers -- */

  const enStats = siteCopy.en.stats.items;
  doc.stats = siteCopy.id.stats.items.map((item, index) => {
    const other = enStats[index];
    return {
      id: `stat-${index + 1}`,
      value: item.value,
      ...(item.prefix ? { prefix: item.prefix } : {}),
      copy: {
        id: block({ suffix: item.suffix ?? "", label: item.label }),
        en: other ? block({ suffix: other.suffix ?? "", label: other.label }) : {},
      },
    };
  });

  /* -------------------------------------------------------------- words --- */

  const enServices = byId(en.services);
  doc.services = id.services.map((item) => {
    const other = enServices.get(item.id);
    return {
      id: item.id,
      icon: item.icon,
      copy: {
        id: block({
          title: item.title,
          summary: item.summary,
          points: item.points,
          detail: item.detail,
          deliverables: item.deliverables,
        }),
        en: other
          ? block({
              title: other.title,
              summary: other.summary,
              points: other.points,
              detail: other.detail,
              deliverables: other.deliverables,
            })
          : {},
      },
    };
  });

  const enProcess = byId(en.process);
  doc.process = id.process.map((item) => {
    const other = enProcess.get(item.id);
    return {
      id: item.id,
      copy: {
        id: block({ title: item.title, subtitle: item.subtitle, body: item.body, points: item.points }),
        en: other
          ? block({ title: other.title, subtitle: other.subtitle, body: other.body, points: other.points })
          : {},
      },
    };
  });

  const enPolicies = byId(en.policies);
  doc.policies = id.policies.map((item) => {
    const other = enPolicies.get(item.id);
    return {
      id: item.id,
      icon: item.icon,
      copy: {
        id: block({ title: item.title, body: item.body }),
        en: other ? block({ title: other.title, body: other.body }) : {},
      },
    };
  });

  const enFaqs = byId(en.faqs);
  doc.faqs = id.faqs.map((item) => {
    const other = enFaqs.get(item.id);
    return {
      id: item.id,
      copy: {
        id: block({ question: item.question, answer: item.answer }),
        en: other ? block({ question: other.question, answer: other.answer }) : {},
      },
    };
  });

  return doc;
}

let cached: AdminDoc | null = null;

function seed(): AdminDoc {
  if (!cached) cached = seedDocument();
  return cached;
}

export function getAdminDoc(): AdminDoc {
  const saved = readStore();
  if (!saved) return seed();

  /* Fill in whatever the saved document does not cover yet, so a collection
     never looks empty in the panel merely because it was saved before it
     existed. Saving then writes the filled-in rows, which is what the operator
     sees anyway. */
  const base = seed();
  const out: AdminDoc = { ...base };
  for (const key of COLLECTION_KEYS) {
    const rows = saved[key] as Row[];
    if (rows.length) (out as unknown as Record<string, Row[]>)[key] = rows;
  }
  out.settings = {
    whatsapp: saved.settings.whatsapp || base.settings.whatsapp,
    email: saved.settings.email || base.settings.email,
    address: saved.settings.address || base.settings.address,
  };
  out.updatedAt = saved.updatedAt;
  return out;
}
