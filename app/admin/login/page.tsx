import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured, isAuthedPage, missingConfig } from "@/lib/admin/auth";

/* Reading the session cookie means this page can never be prerendered. */
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthedPage()) redirect("/admin");

  return <LoginForm configured={adminConfigured()} missing={missingConfig()} />;
}
