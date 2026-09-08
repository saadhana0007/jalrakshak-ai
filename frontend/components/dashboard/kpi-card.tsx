import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function KpiCard({
  label,
  value,
  unit,
  sub,
  icon: Icon,
  trend,
  trendLabel,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  accent?: "primary" | "accent" | "amber" | "red";
}) {
  const accents: Record<string, string> = {
    primary: "bg-primary-50 text-primary-600",
    accent: "bg-accent-50 text-accent-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", accents[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {trend !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold",
              trend >= 0 ? "text-emerald-600" : "text-red-600"
            )}
          >
            {trend >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
        {(sub || trendLabel) && <span className="text-xs text-slate-400">{trendLabel ?? sub}</span>}
      </div>
    </div>
  );
}
