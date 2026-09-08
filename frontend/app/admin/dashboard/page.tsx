"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import KpiCard from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommunityMapDynamic } from "@/components/map/dynamic";
import { AreaTrendCard, DonutCard } from "@/components/charts/chart-cards";
import { FARMS, ALERTS, DISTRICTS, generateWaterUsageTrend, districtRiskSummary } from "@/lib/mock-data";
import {
  Users, Sprout, MapPinned, Droplets, Waves, ShieldAlert, ArrowRight,
} from "lucide-react";
import { riskColor } from "@/lib/utils";

export default function AdminDashboardPage() {
  const water = generateWaterUsageTrend();
  const riskDist = [
    { name: "Low", value: FARMS.filter((f) => f.riskLevel === "low").length, color: "#10b981" },
    { name: "Medium", value: FARMS.filter((f) => f.riskLevel === "medium").length, color: "#f59e0b" },
    { name: "High", value: FARMS.filter((f) => f.riskLevel === "high").length, color: "#ef4444" },
    { name: "Critical", value: FARMS.filter((f) => f.riskLevel === "critical").length, color: "#b91c1c" },
  ];

  return (
    <DashboardShell role="admin" title="Executive Dashboard" subtitle="Statewide water intelligence command center">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Users} label="Total Farmers" value="12,480" trend={4.2} accent="primary" />
        <KpiCard icon={Sprout} label="Active Farms" value={FARMS.length * 96} trend={2.8} accent="primary" />
        <KpiCard icon={MapPinned} label="Districts Covered" value={DISTRICTS.length} sub="Across 6 states" accent="accent" />
        <KpiCard icon={Droplets} label="Water Saved (30d)" value="8.4" unit="Cr L" trend={8.1} accent="accent" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Waves} label="Groundwater Status" value="62%" sub="Districts stable" accent="primary" />
        <KpiCard icon={ShieldAlert} label="Active Climate Alerts" value={ALERTS.filter((a) => a.category === "climate" && !a.read).length} accent="red" />
        <KpiCard icon={ShieldAlert} label="Community Risk Clusters" value={districtRiskSummary.filter((d) => d.riskLevel === "high" || d.riskLevel === "critical").length} accent="red" />
        <KpiCard icon={Sprout} label="Avg Yield Uplift" value="+11.4%" accent="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Regional Risk Map</CardTitle>
            <CardDescription>Community water-stress clusters across monitored farms</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <CommunityMapDynamic height={420} />
          </CardContent>
        </Card>
        <DonutCard title="Farm Risk Distribution" description="Across all monitored farms" data={riskDist} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AreaTrendCard title="Statewide Water Usage" description="Used vs. recommended (litres, weekly)" data={water} xKey="week" dataKey="used" color="#3b82f6" height={260} />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Live Alert Feed</CardTitle>
              <a href="/admin/community-alerts" className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {ALERTS.slice(0, 5).map((a) => {
              const rc = riskColor(a.severity);
              return (
                <div key={a.id} className="flex items-start gap-2.5 rounded-xl border border-slate-100 p-2.5 dark:border-slate-800">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${rc.dot}`} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{a.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{a.district} · {a.timestamp}</p>
                  </div>
                  <Badge variant={a.severity} className="ml-auto shrink-0">{a.severity}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
