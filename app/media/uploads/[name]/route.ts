import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { UPLOAD_DIR, uploadNameIsSafe } from "@/lib/admin/store";

export const runtime = "nodejs";

const MIME_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".m4v": "video/x-m4v",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".ogv": "video/ogg",
  ".png": "image/png",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

/** Serves locally uploaded media from persistent data/, not a disposable release. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!uploadNameIsSafe(name)) return new NextResponse(null, { status: 404 });

  try {
    const file = await readFile(path.join(UPLOAD_DIR, name));
    return new NextResponse(file, {
      headers: {
        "Content-Type": MIME_TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
