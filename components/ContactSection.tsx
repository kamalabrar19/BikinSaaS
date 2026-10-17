"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { BRAND, BUDGET_BRACKETS, CONTACT_SERVICES } from "@/constants/site-data";
import { openWhatsApp } from "@/lib/whatsapp";
import { Select } from "./Select";
import { Reveal, SectionHeading } from "./ui";

interface FormState {
  name: string;
  business: string;
  service: string;
  budget: string;
  description: string;
}

const EMPTY: FormState = { name: "", business: "", service: "", budget: "", description: "" };
type Errors = Partial<Record<keyof FormState, string>>;

export function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = (): Errors => {
    const er: Errors = {};
    if (form.name.trim().length < 2) er.name = "Mohon isi nama Anda.";
    if (!form.service) er.service = "Pilih layanan yang Anda butuhkan.";
    if (form.description.trim().length < 10) er.description = "Ceritakan kebutuhan Anda minimal 10 karakter.";
    return er;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setSending(true);
    const payload = { ...form, submittedAt: new Date().toISOString() };

    // Opsional: kirim ke webhook jika NEXT_PUBLIC_LEAD_WEBHOOK_URL diisi. Kegagalan tidak menghalangi WhatsApp.
    const hook = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;
    if (hook) {
      try {
        await fetch(hook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        /* diabaikan: WhatsApp tetap jalur utama */
      }
    }

    const msg = [
      "Halo BikinSaaS, saya ingin konsultasi.",
      "",
      `Nama: ${form.name.trim()}`,
      form.business.trim() ? `Bisnis: ${form.business.trim()}` : "",
      `Layanan: ${form.service}`,
      form.budget ? `Budget: ${form.budget}` : "",
      "",
      `Kebutuhan: ${form.description.trim()}`,
    ]
      .filter((l, i, arr) => l !== "" || (i > 0 && arr[i - 1] !== ""))
      .join("\n");

    openWhatsApp(msg);
    setSending(false);
    setDone(true);
    setForm(EMPTY);
  };

  const base =
    "w-full rounded-xl border bg-stone-50 px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-stone-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,211,102,0.12)]";
  const cls = (k: keyof FormState) =>
    `${base} ${errors[k] ? "border-red-400 focus:border-red-500" : "border-stone-200 hover:border-stone-300 focus:border-primary-green"}`;

  const Err = ({ k }: { k: keyof FormState }) =>
    errors[k] ? (
      <p id={`err-${k}`} role="alert" className="mt-1 text-xs text-red-600">
        {errors[k]}
      </p>
    ) : null;

  return (
    <section id="kontak" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Ceritakan kebutuhan Anda"
          description="Isi form singkat ini. Pesan akan terbuka di WhatsApp dengan format yang rapi, tinggal Anda kirim."
        />

        <Reveal>
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-soft sm:p-8">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 text-center"
                  role="status"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.span>
                  <h3 className="mt-5 text-xl font-bold text-charcoal">WhatsApp sudah dibuka</h3>
                  <p className="mt-2 text-stone-600">
                    Kirim pesan yang sudah terisi tersebut agar kami bisa memprosesnya. {BRAND.responseTime}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDone(false)}
                    className="mt-6 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green"
                  >
                    Isi form lagi
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-stone-800">
                        Nama
                      </label>
                      <input id="c-name" className={cls("name")} value={form.name} onChange={set("name")} placeholder="Nama Anda" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} />
                      <Err k="name" />
                    </div>
                    <div>
                      <label htmlFor="c-biz" className="mb-1.5 block text-sm font-medium text-stone-800">
                        Nama bisnis
                      </label>
                      <input id="c-biz" className={cls("business")} value={form.business} onChange={set("business")} placeholder="Nama usaha / organisasi" autoComplete="organization" />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-service" className="mb-1.5 block text-sm font-medium text-stone-800">
                        Pilih layanan
                      </label>
                      <Select id="c-service" value={form.service} options={CONTACT_SERVICES} placeholder="Pilih layanan" onChange={(v) => { setForm((f) => ({ ...f, service: v })); setErrors((er) => ({ ...er, service: undefined })); }} invalid={!!errors.service} describedBy={errors.service ? "err-service" : undefined} />
                      <Err k="service" />
                    </div>
                    <div>
                      <label htmlFor="c-budget" className="mb-1.5 block text-sm font-medium text-stone-800">
                        Kisaran budget
                      </label>
                      <Select id="c-budget" value={form.budget} options={BUDGET_BRACKETS} placeholder="Pilih kisaran budget" onChange={(v) => setForm((f) => ({ ...f, budget: v }))} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="c-desc" className="mb-1.5 block text-sm font-medium text-stone-800">
                      Deskripsi kebutuhan
                    </label>
                    <textarea id="c-desc" rows={5} className={cls("description")} value={form.description} onChange={set("description")} placeholder="Ceritakan bisnis Anda dan apa yang ingin dibuat…" aria-invalid={!!errors.description} aria-describedby={errors.description ? "err-description" : undefined} />
                    <Err k="description" />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-green px-6 py-3.5 text-sm font-semibold text-charcoal shadow-lg shadow-primary-green/25 transition hover:bg-deep-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" /> {sending ? "Memproses…" : "Kirim via WhatsApp"}
                  </button>

                  <p className="flex items-center justify-center gap-2 text-center text-sm text-stone-500">
                    <Clock className="h-4 w-4" /> {BRAND.responseTime}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
