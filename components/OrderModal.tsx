"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { formatRupiah } from "@/lib/utils";
import { openWhatsApp } from "@/lib/whatsapp";
import { Modal } from "./Modal";
import { PrimaryButton } from "./ui";

export interface OrderSelection {
  /** judul ringkas, mis. nama paket */
  title: string;
  /** baris rincian */
  lines: string[];
  /** total estimasi (opsional) */
  total?: string;
}

export function OrderModal({ selection, onClose }: { selection: OrderSelection | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (selection) setError("");
  }, [selection]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!selection) return;
    if (name.trim().length < 2) {
      setError("Mohon isi nama Anda.");
      return;
    }
    const msg = [
      "Halo BikinSaaS, saya ingin memesan:",
      `*${selection.title}*`,
      ...selection.lines.map((l) => `• ${l}`),
      selection.total ? `Estimasi: ${selection.total}` : "",
      "",
      `Nama: ${name.trim()}`,
      business.trim() ? `Bisnis: ${business.trim()}` : "",
      note.trim() ? `Catatan: ${note.trim()}` : "",
    ]
      .filter((l, i, arr) => l !== "" || (i > 0 && arr[i - 1] !== ""))
      .join("\n");
    openWhatsApp(msg);
    onClose();
  };

  const input =
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition placeholder:text-stone-400 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20";

  return (
    <Modal open={!!selection} onClose={onClose} title="Pesan via WhatsApp" titleId="order-modal-title">
      {selection && (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="rounded-2xl border border-primary-green/20 bg-soft-green p-4">
            <p className="text-sm font-bold text-charcoal">{selection.title}</p>
            <ul className="mt-2 space-y-1 text-sm text-stone-700">
              {selection.lines.map((l) => (
                <li key={l}>• {l}</li>
              ))}
            </ul>
            {selection.total && <p className="mt-3 text-sm font-semibold text-deep-green">Estimasi: {selection.total}</p>}
          </div>

          <div>
            <label htmlFor="ord-name" className="mb-1.5 block text-sm font-medium text-stone-800">
              Nama
            </label>
            <input id="ord-name" className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" autoComplete="name" />
            {error && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {error}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="ord-biz" className="mb-1.5 block text-sm font-medium text-stone-800">
              Nama bisnis <span className="text-stone-400">(opsional)</span>
            </label>
            <input id="ord-biz" className={input} value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Nama bisnis / usaha" autoComplete="organization" />
          </div>
          <div>
            <label htmlFor="ord-note" className="mb-1.5 block text-sm font-medium text-stone-800">
              Catatan <span className="text-stone-400">(opsional)</span>
            </label>
            <textarea id="ord-note" rows={3} className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ceritakan singkat kebutuhan Anda" />
          </div>

          <PrimaryButton type="submit" className="w-full">
            <MessageCircle className="h-4 w-4" /> Lanjut ke WhatsApp
          </PrimaryButton>
          <p className="text-center text-xs text-stone-500">
            Anda akan diarahkan ke WhatsApp dengan pesan yang sudah terisi. Harga belum termasuk domain &amp; hosting.
          </p>
        </form>
      )}
    </Modal>
  );
}

export { formatRupiah };
