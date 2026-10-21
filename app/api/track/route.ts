import { NextResponse } from "next/server";

import { recordContact, recordView } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Receives a page view or a contact click from the public site. It answers 204
 * to everything, including bad input: a visitor's page must never notice that
 * counting failed, and the response must not help anyone probe it.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { type?: string; path?: string; channel?: string; ref?: string };
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const hit = {
      ip: forwarded || request.headers.get("x-real-ip") || "unknown",
      ua: request.headers.get("user-agent") ?? "",
      host: request.headers.get("host") ?? "",
    };

    if (body.type === "view") recordView(hit, body.path, body.ref);
    else if (body.type === "contact") recordContact(hit, body.channel);
  } catch {
    /* ignored on purpose */
  }
  return new NextResponse(null, { status: 204 });
}
