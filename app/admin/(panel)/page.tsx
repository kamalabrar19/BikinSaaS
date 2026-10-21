import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Link from "next/link";

import { VisitorsChart } from "@/components/admin/VisitorsChart";
import { fmt } from "@/lib/admin/numbers";
import { RANGES, getStats, type RangeDays, type Ranked } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE_NAMES: Record<string, string> = {
  "/": "Beranda",
  "/pricing": "Harga",
  "/portfolio": "Portofolio",
  "/contact": "Kontak",
};

const CHANNEL_NAMES: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  phone: "Telepon",
  form: "Formulir pesan",
};

const DEVICE_NAMES: Record<string, string> = {
  mobile: "HP",
  desktop: "Komputer",
  tablet: "Tablet",
};

const LANG_NAMES: Record<string, string> = { id: "Bahasa Indonesia", en: "English" };

const pageName = (key: string) =>
  PAGE_NAMES[key] ?? (key.startsWith("/portfolio/") ? `Portofolio · ${key.slice(11)}` : key);

/** Percentage change against the period before, as words and an arrow. */
function Delta({ now, before }: { now: number; before: number }) {
  if (before === 0 && now === 0) return <span className="delta">Belum ada data</span>;
  if (before === 0) return <span className="delta is-up"><ArrowUpRight size={14} aria-hidden="true" />Baru</span>;
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return <span className="delta"><Minus size={14} aria-hidden="true" />Sama seperti sebelumnya</span>;
  const up = pct > 0;
  return (
    <span className={cn("delta", up ? "is-up" : "is-down")}>
      {up ? <ArrowUpRight size={14} aria-hidden="true" /> : <ArrowDownRight size={14} aria-hidden="true" />}
      {up ? "Naik" : "Turun"} {Math.abs(pct)}%
      <span className="delta-note"> dari periode sebelumnya</span>
    </span>
  );
}

function Stat({
  label,
  value,
  unit,
  children,
}: {
  label: string;
  value: string;
  unit?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="card stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value">
        {value}
        {unit ? <small>{unit}</small> : null}
      </p>
      {children}
    </article>
  );
}

function Bars({ items, name, empty }: { items: Ranked[]; name: (key: string) => string; empty: string }) {
  const rows = items.filter((one) => one.count > 0);
  const max = Math.max(...rows.map((one) => one.count), 1);
  const total = rows.reduce((n, one) => n + one.count, 0);
  if (!rows.length) return <p className="muted">{empty}</p>;
  return (
    <ul className="bars">
      {rows.map((one) => (
        <li key={one.key}>
          <div className="bars-line">
            <span className="bars-name">{name(one.key)}</span>
            <span className="bars-num">
              {fmt(one.count)} <em>{Math.round((one.count / total) * 100)}%</em>
            </span>
          </div>
          <div className="bars-track" aria-hidden="true">
            <div className="bars-fill" style={{ width: `${(one.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const days = (RANGES.find((one) => String(one) === range) ?? 30) as RangeDays;
  const stats = getStats(days);
  const { totals, previous } = stats;

  return (
    <>
      <header className="page-head">
        <div>
          <p className="kicker">
            <span className="dot" />/ 01 — Ringkasan
          </p>
          <h1>
            Ringkasan <em>situs</em>
          </h1>
          <p className="lead">
            Siapa saja yang membuka situs Anda, dan berapa yang akhirnya menghubungi.
          </p>
        </div>

        <div className="seg" role="group" aria-label="Rentang waktu">
          {RANGES.map((one) => (
            <Link key={one} href={one === 30 ? "/admin" : `/admin?range=${one}`} className={one === days ? "is-active" : ""} aria-current={one === days ? "true" : undefined}>
              {one} hari
            </Link>
          ))}
        </div>
      </header>

      {stats.empty ? (
        <section className="card notice">
          <div>
            <h2>Belum ada kunjungan tercatat</h2>
            <p>
              Angka akan muncul di sini begitu ada yang membuka situs Anda. Coba buka situsnya sekali untuk
              memastikan semuanya jalan.
            </p>
          </div>
          <a className="btn btn-primary" href="/id" target="_blank" rel="noreferrer">
            Buka situs <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </section>
      ) : null}

      <section className="stats" aria-label={`Angka utama, ${days} hari terakhir`}>
        <Stat label="Pengunjung" value={fmt(totals.visitors)}>
          <Delta now={totals.visitors} before={previous.visitors} />
        </Stat>
        <Stat label="Halaman dilihat" value={fmt(totals.views)}>
          <Delta now={totals.views} before={previous.views} />
        </Stat>
        <Stat label="Menghubungi Anda" value={fmt(totals.contacts)}>
          <Delta now={totals.contacts} before={previous.contacts} />
        </Stat>
        <Stat label="Yang menghubungi" value={totals.contactRate.toFixed(1).replace(".", ",")} unit="%">
          <span className="delta">dari semua pengunjung</span>
        </Stat>
      </section>

      <section className="card chart-card">
        <div className="card-head">
          <div>
            <p className="kicker">
              <span className="dot" />/ 02 — Per hari
            </p>
            <h2>Pergerakan {days} hari terakhir</h2>
          </div>
          <p className="today">
            Hari ini: <strong>{fmt(stats.today.visitors)}</strong> pengunjung ·{" "}
            <strong>{fmt(stats.today.contacts)}</strong> menghubungi
          </p>
        </div>
        <VisitorsChart points={stats.series} />
      </section>

      <div className="two">
        <section className="card">
          <p className="kicker">
            <span className="dot" />/ 03 — Kontak
          </p>
          <h2>Lewat mana mereka menghubungi</h2>
          <p className="muted">Setiap klik tombol WhatsApp, email, telepon, atau kirim formulir.</p>
          <Bars items={stats.channels} name={(key) => CHANNEL_NAMES[key] ?? key} empty="Belum ada yang menghubungi di periode ini." />
        </section>

        <section className="card">
          <p className="kicker">
            <span className="dot" />/ 04 — Halaman
          </p>
          <h2>Halaman yang paling sering dibuka</h2>
          <p className="muted">Jumlah kali halaman dibuka.</p>
          <Bars items={stats.pages.slice(0, 6)} name={pageName} empty="Belum ada halaman yang dibuka." />
        </section>
      </div>

      <div className="three">
        <section className="card">
          <p className="kicker">
            <span className="dot" />/ 05 — Asal
          </p>
          <h2>Dari mana pengunjung datang</h2>
          <Bars
            items={stats.refs.slice(0, 6)}
            name={(key) => key || "Langsung / tidak diketahui"}
            empty="Belum ada data."
          />
        </section>
        <section className="card">
          <p className="kicker">
            <span className="dot" />/ 06 — Perangkat
          </p>
          <h2>HP atau komputer</h2>
          <Bars items={stats.devices} name={(key) => DEVICE_NAMES[key] ?? key} empty="Belum ada data." />
        </section>
        <section className="card">
          <p className="kicker">
            <span className="dot" />/ 07 — Bahasa
          </p>
          <h2>Bahasa situs yang dibuka</h2>
          <Bars items={stats.langs} name={(key) => LANG_NAMES[key] ?? key} empty="Belum ada data." />
        </section>
      </div>

      <p className="foot-note">
        Pengunjung dihitung per hari tanpa cookie dan tanpa menyimpan alamat IP, jadi orang yang sama di hari
        berbeda terhitung dua kali.
      </p>
    </>
  );
}
