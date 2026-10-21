import { NextResponse } from "next/server";

import { isAuthed } from "@/lib/admin/auth";
import { cloudinaryConfig, uploadSignature } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hands the browser what it needs to upload straight to Cloudinary. When
 * Cloudinary is not configured it says so, and the panel falls back to saving
 * the file on this server.
 */
export async function GET(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Sesi berakhir. Masuk lagi." }, { status: 401 });
  }
  const config = cloudinaryConfig();
  if (!config) return NextResponse.json({ configured: false });
  return NextResponse.json({ configured: true, ...uploadSignature(config) });
}
