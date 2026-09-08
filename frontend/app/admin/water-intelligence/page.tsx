"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import KpiCard from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DistrictMapDynamic } from "@/components/map/dynamic";
import { BarCompareCard } from "@/components/charts/chart-cards";
import { districtRiskSummary } from "@/lib/mock-data";
import { Droplets, Waves, AlertTriangle, TrendingDown } from "lucide-react";

const emergingZones = [...districtRiskSummary].sort((a, b) => b.stressPct - a.stressPct).slice(0, 4);
const groundwaterZones = [...districtRiskSummary].sort((a, b) => a.avgMoisture - b.avgMoisture).slice(0, 4);

export default function WaterIntelligencePage() {
  const barData = districtRiskSummary.map((d) => ({ name: d.name, "Avg Moisture %": d.avgMoisture }));

  return (
    <DashboardShell role="admin" title="Water Intelligence Center" subtitle="State-wide heatmaps, drought and groundwater risk zones">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Droplets} label="Statewide Avg Moisture" value={Math.round(districtRiskSummary.reduce((s, d) => s + d.avgMoisture, 0) / districtRiskSummary.length)} unit="%" accent="primary" />
        <KpiCard icon={Waves} label="Groundwater Risk Zones" value={groundwaterZones.length} accent="accent" />
        <KpiCard icon={AlertTriangle} label="Emerging Drought Zones" value={emergingZones.length} accent="red" />
        <KpiCard icon={TrendingDown} label="Districts Trending Down" value={districtRiskSummary.filter((d) => d.stressPct > 40).length} accent="red" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>State-wide Risk Heatmap</CardTitle>
            <CardDescription>Aggregated water-stress intensity by district</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <DistrictMapDynamic height={440} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emerging Drought Zones</CardTitle>
            <CardDescription>Districts with rising stress incidence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {emergingZones.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{d.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{d.state}</p>
                </div>
                <Badge variant={d.riskLevel}>{d.stressPct}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarCompareCard title="Regional Soil Moisture" description="Average moisture by district" data={barData} xKey="name" series={[{ key: "Avg Moisture %", color: "#3b82f6" }]} />
        <Card>
          <CardHeader>
            <CardTitle>Groundwater Risk Zones</CardTitle>
            <CardDescription>Districts with the lowest average moisture reserves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {groundwaterZones.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-accent-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{d.name}</span>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{d.avgMoisture}% moisture</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
