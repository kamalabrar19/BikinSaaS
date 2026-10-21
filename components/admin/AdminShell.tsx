"use client";

import { ArrowUpRight, BarChart3, Briefcase, LogOut, Moon, Sun, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { THEME_STORAGE_KEY } from "@/lib/theme";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: BarChart3 },
  { href: "/admin/portofolio", label: "Portofolio", icon: Briefcase },
  { href: "/admin/harga", label: "Harga", icon: Tag },
] as const;

/**
 * The frame around every panel page: the same header the public site has (logo
 * mark, pill navigation, theme switch) so the two feel like one product.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode: the choice just isn't remembered */
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="shell">
      <div className="shell-bg" aria-hidden="true" />

      <header className="topbar">
        <Link href="/admin" className="brand" aria-label="BikinSaaS — ringkasan">
          <span className="brand-mark">B</span>
          <span className="brand-name">BikinSaaS</span>
          <span className="brand-tag">Admin</span>
        </Link>

        <nav className="topnav" aria-label="Menu utama">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={active ? "navlink is-active" : "navlink"} aria-current={active ? "page" : undefined}>
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="topbar-end">
          <a className="textlink" href="/id" target="_blank" rel="noreferrer">
            Lihat situs <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="round-btn"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Pakai tema gelap" : "Pakai tema terang"}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => void logout()}>
            <LogOut size={15} aria-hidden="true" />
            <span className="hide-sm">Keluar</span>
          </button>
        </div>
      </header>

      <main className="page">{children}</main>
    </div>
  );
}
