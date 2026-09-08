"use client";

import { mulberry32, seededRange } from "@/lib/seeded-random";

function valueToColor(value: number, mode: "ndvi" | "ndwi") {
  // value in [-1, 1] roughly; map to a green (ndvi) or blue (ndwi) ramp
  const t = Math.min(1, Math.max(0, (value + 0.2) / 1.0));
  if (mode === "ndvi") {
    const r = Math.round(220 - t * 190);
    const g = Math.round(230 - t * 40);
    const b = Math.round(200 - t * 170);
    return `rgb(${r},${g},${b})`;
  }
  const r = Math.round(230 - t * 180);
  const g = Math.round(240 - t * 90);
  const b = Math.round(250 - t * 40);
  return `rgb(${r},${g},${b})`;
}

export default function NdviGrid({
  mode, seed = 5, cols = 24, rows = 14,
}: { mode: "ndvi" | "ndwi"; seed?: number; cols?: number; rows?: number }) {
  const rng = mulberry32(seed * 101);
  const cells = Array.from({ length: cols * rows }).map((_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cluster = Math.sin(col / 4 + seed) * Math.cos(row / 3 + seed) * 0.5;
    const noise = seededRange(rng, -0.15, 0.15);
    return Math.max(-0.3, Math.min(0.9, 0.35 + cluster + noise));
  });

  return (
    <div
      className="grid overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map((v, i) => (
        <div key={i} title={v.toFixed(2)} style={{ backgroundColor: valueToColor(v, mode), aspectRatio: "1 / 1" }} />
      ))}
    </div>
  );
}
