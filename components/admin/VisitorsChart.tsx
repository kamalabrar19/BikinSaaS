"use client";

import { useMemo, useRef, useState } from "react";

import type { Point } from "@/lib/analytics";
import { fmt, shortDate } from "@/lib/admin/numbers";

type Metric = "visitors" | "views" | "contacts";

const METRICS: { key: Metric; label: string; noun: string }[] = [
  { key: "visitors", label: "Pengunjung", noun: "pengunjung" },
  { key: "views", label: "Halaman dilihat", noun: "halaman dilihat" },
  { key: "contacts", label: "Menghubungi", noun: "kontak" },
];

const W = 760;
const H = 260;
const PAD = { top: 16, right: 14, bottom: 30, left: 38 };

/** A round upper bound for the axis, so gridlines land on whole numbers. */
function niceMax(value: number): number {
  if (value <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= value) ?? 10;
  return step * pow;
}

/**
 * One series at a time (the buttons switch which), so there is a single y-axis
 * and the colour never has to carry meaning. Hover or touch shows the exact
 * value for a day; a hidden table below carries the same numbers for screen
 * readers.
 */
export function VisitorsChart({ points }: { points: Point[] }) {
  const [metric, setMetric] = useState<Metric>("visitors");
  const [hover, setHover] = useState<number | null>(null);
  const box = useRef<SVGSVGElement>(null);
  const info = METRICS.find((one) => one.key === metric) ?? METRICS[0];

  const geometry = useMemo(() => {
    const values = points.map((p) => p[metric]);
    const top = niceMax(Math.max(...values, 0));
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const x = (i: number) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = (v: number) => PAD.top + innerH - (v / top) * innerH;
    const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
    const area = `${line} L${x(values.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
    return { values, top, x, y, line, area, innerH };
  }, [points, metric]);

  const total = geometry.values.reduce((a, b) => a + b, 0);
  const every = points.length <= 7 ? 1 : points.length <= 31 ? 5 : 15;
  const ticks = [0, 0.5, 1].map((t) => t * geometry.top);

  const onMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect || !rect.width) return;
    const ratio = ((event.clientX - rect.left) / rect.width) * W;
    const index = Math.round(((ratio - PAD.left) / (W - PAD.left - PAD.right)) * (points.length - 1));
    setHover(Math.min(points.length - 1, Math.max(0, index)));
  };

  const active = hover === null ? null : points[hover];

  return (
    <div className="chart">
      <div className="chart-head">
        <div className="seg" role="group" aria-label="Yang ditampilkan di grafik">
          {METRICS.map((one) => (
            <button
              key={one.key}
              type="button"
              className={one.key === metric ? "is-active" : ""}
              aria-pressed={one.key === metric}
              onClick={() => setMetric(one.key)}
            >
              {one.label}
            </button>
          ))}
        </div>
        <p className="chart-total">
          <strong>{fmt(total)}</strong> {info.noun} dalam {points.length} hari
        </p>
      </div>

      <div className="chart-frame">
        <svg
          ref={box}
          viewBox={`0 0 ${W} ${H}`}
          className="chart-svg"
          role="img"
          aria-label={`Grafik ${info.noun} per hari, ${shortDate(points[0].date)} sampai ${shortDate(points[points.length - 1].date)}. Total ${fmt(total)}.`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--action)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--action)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={geometry.y(t)} y2={geometry.y(t)} className="chart-grid" />
              <text x={PAD.left - 8} y={geometry.y(t) + 4} textAnchor="end" className="chart-axis">
                {fmt(t)}
              </text>
            </g>
          ))}

          {points.map((p, i) =>
            i % every === 0 || i === points.length - 1 ? (
              <text key={p.date} x={geometry.x(i)} y={H - 8} textAnchor={i === points.length - 1 ? "end" : i === 0 ? "start" : "middle"} className="chart-axis">
                {shortDate(p.date)}
              </text>
            ) : null,
          )}

          <path d={geometry.area} fill="url(#area-fill)" />
          <path d={geometry.line} className="chart-line" />

          {active && hover !== null ? (
            <g>
              <line x1={geometry.x(hover)} x2={geometry.x(hover)} y1={PAD.top} y2={H - PAD.bottom} className="chart-cursor" />
              <circle cx={geometry.x(hover)} cy={geometry.y(active[metric])} r="5" className="chart-dot" />
            </g>
          ) : null}
        </svg>

        {active && hover !== null ? (
          <div
            className="chart-tip"
            style={{
              left: `${(geometry.x(hover) / W) * 100}%`,
              transform: `translateX(${hover > points.length * 0.7 ? "-100%" : hover < points.length * 0.3 ? "0%" : "-50%"})`,
            }}
            aria-hidden="true"
          >
            <span>{shortDate(active.date)}</span>
            <strong>
              {fmt(active[metric])} {info.noun}
            </strong>
          </div>
        ) : null}
      </div>

      <table className="sr-only">
        <caption>Data harian</caption>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Pengunjung</th>
            <th>Halaman dilihat</th>
            <th>Menghubungi</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.date}>
              <td>{p.date}</td>
              <td>{p.visitors}</td>
              <td>{p.views}</td>
              <td>{p.contacts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
