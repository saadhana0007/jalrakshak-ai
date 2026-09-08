"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommunityMapDynamic } from "@/components/map/dynamic";
import { FARMS, communityAlertFor, districtRiskSummary } from "@/lib/mock-data";
import { AlertTriangle, Users, TrendingDown, Thermometer } from "lucide-react";
import { riskColor } from "@/lib/utils";

const highRiskDistricts = districtRiskSummary.filter((d) => d.riskLevel === "high" || d.riskLevel === "critical").slice(0, 3);

export default function CommunityNetworkPage() {
  const lowCount = FARMS.filter((f) => f.riskLevel === "low").length;
  const medCount = FARMS.filter((f) => f.riskLevel === "medium").length;
  const highCount = FARMS.filter((f) => f.riskLevel === "high" || f.riskLevel === "critical").length;

  return (
    <DashboardShell role="farmer" title="Community Water-Stress Network" subtitle="Cluster detection across neighbouring farms">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <LegendCard color="bg-emerald-500" label="Low Risk Farms" count={lowCount} />
        <LegendCard color="bg-amber-500" label="Medium Risk Farms" count={medCount} />
        <LegendCard color="bg-red-500" label="High / Critical Risk Farms" count={highCount} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Regional Farm Risk Map</CardTitle>
            <CardDescription>Live cluster detection · heatmap overlay for high-risk zones</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <CommunityMapDynamic height={480} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Alert Feed</CardTitle>
            <CardDescription>Auto-detected multi-farm anomalies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {highRiskDistricts.map((d) => {
              const alert = communityAlertFor(d.name);
              return (
                <div key={d.name} className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-xs font-bold uppercase">High Risk Alert</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {alert.highRiskFarms} farms within 5 km showing abnormal moisture decline.
                  </p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white/70 p-2">
                      <p className="flex items-center gap-1 text-slate-400"><TrendingDown className="h-3 w-3" /> Rainfall Deficit</p>
                      <p className="font-bold text-slate-700">{alert.rainfallDeficitPct}%</p>
                    </div>
                    <div className="rounded-lg bg-white/70 p-2">
                      <p className="flex items-center gap-1 text-slate-400"><Thermometer className="h-3 w-3" /> Temp Anomaly</p>
                      <p className="font-bold text-slate-700">+{alert.tempAnomalyC}°C</p>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] font-medium text-red-600">
                    Recommended Action: Reduce irrigation intervals in {d.name} block.
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>District Risk Zones</CardTitle>
          <CardDescription>Aggregated stress signal by district</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 pt-0 sm:grid-cols-2 lg:grid-cols-4">
          {districtRiskSummary.map((d) => {
            const rc = riskColor(d.riskLevel);
            return (
              <div key={d.name} className="rounded-xl border border-slate-100 p-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-700">{d.name}</p>
                  <Badge variant={d.riskLevel}>{d.riskLevel}</Badge>
                </div>
                <p className="flex items-center gap-1 text-xs text-slate-400"><Users className="h-3 w-3" /> {d.farmCount} farms monitored</p>
                <p className="mt-1 text-xs text-slate-400">Stress incidence: <strong className="text-slate-600">{d.stressPct}%</strong></p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

function LegendCard({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <div>
        <p className="text-lg font-bold text-slate-800">{count}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}
