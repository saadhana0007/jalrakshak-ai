"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommunityMapDynamic } from "@/components/map/dynamic";
import { ALERTS, districtRiskSummary, communityAlertFor } from "@/lib/mock-data";
import { riskColor } from "@/lib/utils";
import { AlertTriangle, TrendingDown, Thermometer, Users } from "lucide-react";

const clusters = [...districtRiskSummary].sort((a, b) => b.stressPct - a.stressPct).slice(0, 4);

export default function AdminCommunityAlertsPage() {
  return (
    <DashboardShell role="admin" title="Community Alerts" subtitle="Multi-farm anomaly clusters detected across the state">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Community Risk Clusters</CardTitle>
            <CardDescription>Farms colored by risk level, high-risk zones highlighted</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <CommunityMapDynamic height={460} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Cluster Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {clusters.map((d) => {
              const alert = communityAlertFor(d.name);
              return (
                <div key={d.name} className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-xs font-bold uppercase">{d.name}</p>
                  </div>
                  <p className="text-xs text-slate-600">
                    {alert.highRiskFarms} of {alert.farmsMonitored} farms flagged for abnormal moisture decline.
                  </p>
                  <div className="mt-2 flex gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><TrendingDown className="h-3 w-3" /> {alert.rainfallDeficitPct}% deficit</span>
                    <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> +{alert.tempAnomalyC}°C</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Alerts</CardTitle>
          <CardDescription>System-wide feed across every category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-0">
          {ALERTS.map((a) => {
            const rc = riskColor(a.severity);
            return (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${rc.dot}`} />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{a.title}</p>
                    <p className="text-[10px] text-slate-400">{a.district} · {a.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" className="capitalize">{a.category}</Badge>
                  <Badge variant={a.severity}>{a.severity}</Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
