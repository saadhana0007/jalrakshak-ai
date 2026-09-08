"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import KpiCard from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineTrendCard, BarCompareCard } from "@/components/charts/chart-cards";
import { FARMS, districtRiskSummary } from "@/lib/mock-data";
import { mulberry32, seededRange } from "@/lib/seeded-random";
import { Waves, TrendingDown, AlertTriangle, Droplets } from "lucide-react";

function generateGroundwaterTrend() {
  const r = mulberry32(29);
  let val = 28;
  return Array.from({ length: 12 }).map((_, i) => {
    val = Math.max(6, val + seededRange(r, -1.2, 0.6));
    return { month: `M${i + 1}`, depth: Math.round(val * 10) / 10 };
  });
}

export default function GroundwaterMonitoringPage() {
  const trend = generateGroundwaterTrend();
  const avgDepth = Math.round((FARMS.reduce((s, f) => s + f.groundwaterDepthM, 0) / FARMS.length) * 10) / 10;
  const critical = FARMS.filter((f) => f.groundwaterDepthM > 45);
  const barData = districtRiskSummary
    .map((d) => ({ name: d.name, depth: Math.round(FARMS.filter((f) => f.district === d.name).reduce((s, f) => s + f.groundwaterDepthM, 0) / Math.max(1, FARMS.filter((f) => f.district === d.name).length)) }))
    .map((d) => ({ ...d, "Depth (m)": d.depth }));

  return (
    <DashboardShell role="admin" title="Groundwater Monitoring" subtitle="Aquifer depletion trends and early-warning zones">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Waves} label="Avg Water Table Depth" value={avgDepth} unit="m" trend={-3.1} accent="accent" />
        <KpiCard icon={AlertTriangle} label="Critical Depletion Zones" value={critical.length} accent="red" />
        <KpiCard icon={TrendingDown} label="YoY Depletion Rate" value="4.8" unit="%" accent="red" />
        <KpiCard icon={Droplets} label="Recharge Potential" value="Moderate" accent="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineTrendCard title="Statewide Water Table Trend" description="Average depth (m) over 12 months" data={trend} xKey="month" series={[{ key: "depth", color: "#0ea5e9", name: "Depth (m)" }]} />
        <BarCompareCard title="Avg Depth by District" description="Deeper bars indicate more depleted aquifers" data={barData} xKey="name" series={[{ key: "Depth (m)", color: "#3b82f6" }]} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Critical Depletion Farms</CardTitle>
          <CardDescription>Water table depth exceeding 45m — priority for intervention</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {critical.slice(0, 9).map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{f.id}</p>
                  <p className="text-[10px] text-slate-400">{f.district}</p>
                </div>
                <Badge variant="high">{f.groundwaterDepthM}m</Badge>
              </div>
            ))}
            {critical.length === 0 && <p className="text-sm text-slate-400">No farms currently in critical range.</p>}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
