import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { adminConfigured, isAuthedPage } from "@/lib/admin/auth";

/* The session lives in a cookie, so nothing under the panel can be prerendered. */
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!adminConfigured()) redirect("/admin/login");
  if (!(await isAuthedPage())) redirect("/admin/login");

  return <AdminShell>{children}</AdminShell>;
}
