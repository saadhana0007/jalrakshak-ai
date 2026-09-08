"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import KpiCard from "@/components/dashboard/kpi-card";
import { AreaTrendCard, BarCompareCard } from "@/components/charts/chart-cards";
import { generateWaterUsageTrend, generateCropHealthTrend, FARMS } from "@/lib/mock-data";
import { Download, Droplets, Sprout, CloudRain, IndianRupee } from "lucide-react";

const REPORTS = [
  { title: "Water Usage Report", desc: "Litres used vs. AI-recommended, by farm and week.", icon: Droplets },
  { title: "Savings Report", desc: "Water and cost savings from delayed/optimized irrigation.", icon: IndianRupee },
  { title: "Yield Forecast Report", desc: "Predicted yield outcomes by crop and scenario.", icon: Sprout },
  { title: "Climate Risk Report", desc: "Drought, heatwave and water-stress risk history.", icon: CloudRain },
];

export default function ReportsPage() {
  const water = generateWaterUsageTrend();
  const health = generateCropHealthTrend();
  const table = FARMS.slice(0, 8);

  return (
    <DashboardShell role="farmer" title="Reports" subtitle="Download and review your farm performance reports">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Droplets} label="Water Saved (30d)" value="1.28" unit="L Cr" accent="primary" />
        <KpiCard icon={IndianRupee} label="Cost Saved (30d)" value="₹48,600" accent="accent" />
        <KpiCard icon={Sprout} label="Avg Yield Uplift" value="+11.4" unit="%" accent="primary" />
        <KpiCard icon={CloudRain} label="Risk Events Avoided" value="6" accent="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AreaTrendCard title="Water Usage" description="Used vs. recommended" data={water} xKey="week" dataKey="used" color="#f59e0b" />
        <BarCompareCard
          title="Crop Health Score"
          description="Weekly trend"
          data={health}
          xKey="week"
          series={[{ key: "health", color: "#10b981" }]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {REPORTS.map((r) => (
          <Card key={r.title}>
            <CardContent className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <r.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-slate-800">{r.title}</p>
              <p className="mt-1 text-xs text-slate-400">{r.desc}</p>
              <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5">
                <Download className="h-3.5 w-3.5" /> Download PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Farm-wise Summary</CardTitle>
          <CardDescription>Water usage and risk snapshot per farm</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-0">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="py-2 font-medium">Farm ID</th>
                <th className="py-2 font-medium">Village</th>
                <th className="py-2 font-medium">Crop</th>
                <th className="py-2 font-medium">Moisture</th>
                <th className="py-2 font-medium">Risk</th>
                <th className="py-2 font-medium">Groundwater (m)</th>
              </tr>
            </thead>
            <tbody>
              {table.map((f) => (
                <tr key={f.id} className="border-b border-slate-50">
                  <td className="py-2.5 font-semibold text-slate-700">{f.id}</td>
                  <td className="py-2.5 text-slate-500">{f.village}</td>
                  <td className="py-2.5 text-slate-500">{f.cropType}</td>
                  <td className="py-2.5 text-slate-500">{f.soilMoisture}%</td>
                  <td className="py-2.5 capitalize text-slate-500">{f.riskLevel}</td>
                  <td className="py-2.5 text-slate-500">{f.groundwaterDepthM}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
