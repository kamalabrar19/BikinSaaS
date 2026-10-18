import { writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { isAuthed } from "@/lib/admin/auth";
import {
  ALLOWED_IMAGE_EXT,
  ALLOWED_VIDEO_EXT,
  MAX_UPLOAD_BYTES,
  newUploadPath,
} from "@/lib/admin/store";
import { mediaKindOf } from "@/lib/admin/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FORMATS = "JPG, PNG, WebP, AVIF, GIF, MP4, WebM, MOV, M4V, OGV";

export async function POST(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Sesi berakhir. Masuk lagi." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Unggahan tidak terbaca." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Belum ada berkas yang dipilih." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const limit = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024);
    return NextResponse.json({ error: `Ukuran berkas melebihi ${limit} MB.` }, { status: 413 });
  }

  const ext = path.extname(file.name).toLowerCase();
  const allowed = ALLOWED_IMAGE_EXT.includes(ext) || ALLOWED_VIDEO_EXT.includes(ext);
  if (!allowed) {
    return NextResponse.json({ error: `Format harus salah satu dari: ${FORMATS}.` }, { status: 415 });
  }

  /* The stored name is generated from the original, never taken from it: no
     path separators, no surprise extension. */
  const { file: destination, url } = newUploadPath(file.name);
  await writeFile(destination, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    ok: true,
    src: url,
    kind: mediaKindOf(url),
    name: path.basename(destination),
    size: file.size,
  });
}
