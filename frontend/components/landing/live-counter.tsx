"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

export default function LiveCounter({
  icon: Icon,
  label,
  target,
  suffix = "",
  prefix = "",
  color,
}: {
  icon: LucideIcon;
  label: string;
  target: number;
  suffix?: string;
  prefix?: string;
  color: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => v + Math.round(target * 0.0006));
    }, 2200);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-white tabular-nums">
        {prefix}
        {value.toLocaleString("en-IN")}
        {suffix}
      </p>
      <p className="text-xs font-medium text-slate-300">{label}</p>
    </div>
  );
}
