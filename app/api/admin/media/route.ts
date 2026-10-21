import { NextResponse } from "next/server";

import { isAuthed } from "@/lib/admin/auth";
import { deleteUpload, listUploads } from "@/lib/admin/store";
import { cloudinaryConfig, listAssets } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The library of everything uploaded so far, newest first. */
export async function GET(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Sesi berakhir. Masuk lagi." }, { status: 401 });
  }

  const config = cloudinaryConfig();
  if (!config) return NextResponse.json({ items: listUploads(), source: "local" });

  try {
    const assets = await listAssets(config);
    return NextResponse.json({
      source: "cloudinary",
      items: assets.map((one) => ({
        name: one.publicId,
        src: one.src,
        kind: one.kind,
        size: one.bytes,
        modified: one.createdAt,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pustaka tidak bisa dimuat.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
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
