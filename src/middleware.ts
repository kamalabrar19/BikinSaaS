// File lama (i18n) dinonaktifkan: project kini SPA satu halaman di app/page.tsx.
// Folder src/ ini aman dihapus.
import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = { matcher: ["/__disabled__"] };
