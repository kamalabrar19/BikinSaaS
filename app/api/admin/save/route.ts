import { NextResponse } from "next/server";

import { isAuthed } from "@/lib/admin/auth";
import { revalidateSite } from "@/lib/admin/revalidate";
import { sanitizeDoc } from "@/lib/admin/sanitize";
import { writeStore } from "@/lib/admin/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Sesi berakhir. Masuk lagi." }, { status: 401 });
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  /* Everything is validated and rebuilt server-side; the browser cannot put an
     unexpected key into the document. */
  const doc = sanitizeDoc(payload.doc);
  if (!doc) {
    return NextResponse.json({ error: "Data tidak dikenali." }, { status: 400 });
  }

  try {
    const saved = writeStore(doc);
    /* Every page renders out of this document, so every page is now stale. */
    revalidateSite();
    return NextResponse.json({ ok: true, doc: saved, savedAt: saved.updatedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
