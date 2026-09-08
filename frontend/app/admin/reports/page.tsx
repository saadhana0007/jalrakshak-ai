"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import KpiCard from "@/components/dashboard/kpi-card";
import { BarCompareCard, DonutCard } from "@/components/charts/chart-cards";
import { districtRiskSummary, FARMS } from "@/lib/mock-data";
import { Download, Droplets, Users, Sprout, CloudRain } from "lucide-react";

const REPORTS = [
  { title: "Statewide Water Usage Report", desc: "District-wise consumption vs. AI-recommended targets." },
  { title: "Savings & ROI Report", desc: "Cumulative water, energy, and cost savings by program." },
  { title: "Yield Forecast Report", desc: "Predicted yield outcomes across monitored crops." },
  { title: "Climate Risk Report", desc: "Drought / heatwave / water-stress incidence trends." },
  { title: "Farmer Adoption Report", desc: "Active users, engagement, and advisory follow-through." },
  { title: "Groundwater Compliance Report", desc: "Districts exceeding safe extraction limits." },
];

export default function AdminReportsPage() {
  const barData = districtRiskSummary.slice(0, 8).map((d) => ({ name: d.name, "Stress %": d.stressPct }));
  const cropCount = Object.entries(
    FARMS.reduce<Record<string, number>>((acc, f) => {
      acc[f.cropType] = (acc[f.cropType] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value], i) => ({ name, value, color: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6"][i % 8] }));

  return (
    <DashboardShell role="admin" title="Reports" subtitle="Statewide performance and compliance reporting">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Droplets} label="Water Saved (YTD)" value="42.6" unit="Cr L" accent="primary" />
        <KpiCard icon={Users} label="Farmers Reached" value="12,480" accent="accent" />
        <KpiCard icon={Sprout} label="Avg Yield Uplift" value="+11.4%" accent="primary" />
        <KpiCard icon={CloudRain} label="Risk Events Avoided" value="184" accent="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarCompareCard title="Water Stress by District" data={barData} xKey="name" series={[{ key: "Stress %", color: "#ef4444" }]} />
        <DonutCard title="Crop Distribution" description="Statewide registered crops" data={cropCount} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => (
          <Card key={r.title}>
            <CardContent className="p-5">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{r.title}</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{r.desc}</p>
              <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5">
                <Download className="h-3.5 w-3.5" /> Download PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
