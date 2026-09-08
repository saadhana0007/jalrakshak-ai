"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DistrictMapDynamic } from "@/components/map/dynamic";
import { BarCompareCard, DonutCard } from "@/components/charts/chart-cards";
import { districtRiskSummary, FARMS } from "@/lib/mock-data";
import { riskColor } from "@/lib/utils";

export default function DistrictMonitoringPage() {
  const [selected, setSelected] = useState(districtRiskSummary[0].name);
  const district = districtRiskSummary.find((d) => d.name === selected)!;
  const farms = FARMS.filter((f) => f.district === selected);

  const cropDist = Object.entries(
    farms.reduce<Record<string, number>>((acc, f) => {
      acc[f.cropType] = (acc[f.cropType] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value], i) => ({ name, value, color: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"][i % 6] }));

  const barData = districtRiskSummary.map((d) => ({ name: d.name, "Stress %": d.stressPct }));

  return (
    <DashboardShell role="admin" title="District Monitoring" subtitle="Water stress, groundwater and crop health by district">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Interactive District Map</CardTitle>
            <CardDescription>Circle size &amp; color reflect water-stress incidence</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <DistrictMapDynamic height={440} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select District</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[440px] space-y-1.5 overflow-y-auto pt-0">
            {districtRiskSummary.map((d) => (
              <button
                key={d.name}
                onClick={() => setSelected(d.name)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${
                  selected === d.name ? "border-primary-300 bg-primary-50" : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">{d.name}</p>
                  <p className="text-[10px] text-slate-400">{d.farmCount} farms · avg moisture {d.avgMoisture}%</p>
                </div>
                <Badge variant={d.riskLevel}>{d.riskLevel}</Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatBox label="Water Stress" value={`${district.stressPct}%`} />
        <StatBox label="Avg Soil Moisture" value={`${district.avgMoisture}%`} />
        <StatBox label="High-Risk Farms" value={district.highRisk} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarCompareCard title="Water Stress by District" description="Percentage of farms flagged high/critical" data={barData} xKey="name" series={[{ key: "Stress %", color: "#ef4444" }]} />
        <DonutCard title={`Crop Distribution — ${selected}`} description="Registered crop types" data={cropDist.length ? cropDist : [{ name: "No data", value: 1, color: "#e2e8f0" }]} />
      </div>
    </DashboardShell>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
