import { NextResponse } from "next/server";

import { endSession } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  endSession(response);
  return response;
}
