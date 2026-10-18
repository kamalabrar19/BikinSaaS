import { NextResponse } from "next/server";

import {
  adminConfigured,
  clearFailures,
  clientIp,
  lockoutSeconds,
  missingConfig,
  recordFailure,
  startSession,
  verifyCredentials,
} from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: `Panel belum dikonfigurasi. Yang kurang: ${missingConfig().join(", ")}.` },
      { status: 500 },
    );
  }

  const ip = clientIp(request);
  const locked = lockoutSeconds(ip);
  if (locked > 0) {
    return NextResponse.json(
      { error: `Terlalu banyak percobaan salah. Coba lagi dalam ${Math.max(1, Math.ceil(locked / 60))} menit.` },
      { status: 429 },
    );
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const payload = (body ?? {}) as Record<string, unknown>;
  const username = typeof payload.username === "string" ? payload.username : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!verifyCredentials(username, password)) {
    recordFailure(ip);
    /* Deliberately vague: never say which of the two was wrong. */
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  clearFailures(ip);
  const response = NextResponse.json({ ok: true });
  startSession(response, request);
  return response;
}
