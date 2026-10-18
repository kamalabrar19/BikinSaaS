import { NextResponse } from "next/server";

import { isAuthed } from "@/lib/admin/auth";
import { deleteUpload, listUploads } from "@/lib/admin/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The library of everything uploaded so far, newest first. */
export async function GET(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Sesi berakhir. Masuk lagi." }, { status: 401 });
  }
  return NextResponse.json({ items: listUploads() });
}

export async function DELETE(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Sesi berakhir. Masuk lagi." }, { status: 401 });
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const payload = (body ?? {}) as Record<string, unknown>;
  const name = typeof payload.name === "string" ? payload.name : "";

  if (!deleteUpload(name)) {
    return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
