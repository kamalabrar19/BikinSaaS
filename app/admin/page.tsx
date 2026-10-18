import { redirect } from "next/navigation";

import { AdminApp } from "@/components/admin/AdminApp";
import { adminConfigured, isAuthedPage } from "@/lib/admin/auth";
import { getAdminDoc } from "@/lib/admin/defaults";

/* The document is read from disk per request and the session lives in a
   cookie, so this page is rendered on demand rather than at build time. */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured()) redirect("/admin/login");
  if (!(await isAuthedPage())) redirect("/admin/login");

  return <AdminApp initialDoc={getAdminDoc()} />;
}
