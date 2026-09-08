"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import KpiCard from "@/components/dashboard/kpi-card";
import { LineTrendCard, AreaTrendCard, BarCompareCard } from "@/components/charts/chart-cards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplets, Thermometer, Waves, Gauge, CloudRain, ShieldAlert,
  Sparkles, CheckCircle2, ArrowRight, Bell,
} from "lucide-react";
import {
  getFarmById, generateSoilMoistureTrend, generateRainfallForecast,
  generateCropHealthTrend, generateWaterUsageTrend, ALERTS,
} from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { riskColor } from "@/lib/utils";

export default function FarmerDashboardPage() {
  const selectedFarmId = useAppStore((s) => s.selectedFarmId);
  const farm = getFarmById(selectedFarmId);
  const soilTrend = generateSoilMoistureTrend();
  const rainfall = generateRainfallForecast();
  const cropHealth = generateCropHealthTrend();
  const waterUsage = generateWaterUsageTrend();
  const rc = riskColor(farm.riskLevel);

  return (
    <DashboardShell role="farmer" title="Dashboard" subtitle={`${farm.village}, ${farm.district} · ${farm.cropType}`}>
      <div className="space-y-6">
        {/* KPI ROW */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard icon={Droplets} label="Soil Moisture" value={farm.soilMoisture} unit="%" trend={2.4} accent="primary" />
          <KpiCard icon={Thermometer} label="Current Weather" value="29" unit="°C" sub="Humidity 64% · Clear sky" accent="amber" />
          <KpiCard icon={Waves} label="Groundwater Status" value={farm.groundwaterDepthM} unit="m depth" trend={-1.2} accent="accent" />
          <KpiCard icon={Gauge} label="Water Requirement" value="1,850" unit="L/acre" sub="Next irrigation window" accent="primary" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={ShieldAlert}
            label="Climate Risk Score"
            value={farm.riskLevel === "low" ? 24 : farm.riskLevel === "medium" ? 52 : farm.riskLevel === "high" ? 74 : 91}
            unit="/100"
            sub={`${farm.riskLevel.toUpperCase()} risk`}
            accent={farm.riskLevel === "low" ? "primary" : farm.riskLevel === "medium" ? "amber" : "red"}
          />
          <KpiCard icon={CloudRain} label="Expected Rainfall" value="21" unit="mm" sub="Within next 14 hours" accent="accent" />
          <KpiCard icon={Sparkles} label="NDVI (Vegetation)" value={farm.ndvi.toFixed(2)} sub="Healthy canopy density" accent="primary" />
          <KpiCard icon={Bell} label="Active Alerts" value={ALERTS.filter((a) => !a.read).length} sub="Needs your attention" accent="red" />
        </div>

        {/* RECOMMENDATION + ALERTS */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden border-primary-200 bg-gradient-to-br from-primary-50 via-white to-accent-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Today's Recommendation</p>
              </div>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-800">Delay Irrigation</h2>
              <p className="mt-1 text-sm text-slate-500">
                Soil moisture is above the critical threshold and rainfall is imminent — irrigating now would waste water.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase text-slate-400">Expected Rain</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-800">21mm <span className="text-xs font-medium text-slate-400">in 14h</span></p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase text-slate-400">Water Saved</p>
                  <p className="mt-0.5 text-lg font-bold text-emerald-600">14,200 L</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase text-slate-400">Confidence</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-800">92%</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <a href="/irrigation-advisor" className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
                  Open Irrigation Advisor <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a href="/digital-twin" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Simulate in Digital Twin
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest signals across your farm network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {ALERTS.slice(0, 4).map((a) => {
                const c = riskColor(a.severity);
                return (
                  <div key={a.id} className="flex items-start gap-2.5 rounded-xl border border-slate-100 p-2.5 hover:bg-slate-50">
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-700">{a.title}</p>
                      <p className="text-[10px] text-slate-400">{a.district} · {a.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AreaTrendCard title="Soil Moisture Trend" description="Last 14 days" data={soilTrend} xKey="day" dataKey="moisture" color="#10b981" />
          <BarCompareCard
            title="Rainfall Forecast"
            description="Next 7 days"
            data={rainfall}
            xKey="day"
            series={[{ key: "forecastMm", color: "#3b82f6", name: "Rainfall (mm)" }]}
          />
          <LineTrendCard
            title="Crop Health Trend"
            description="Weekly NDVI-derived health score"
            data={cropHealth}
            xKey="week"
            series={[{ key: "health", color: "#059669", name: "Health Score" }]}
          />
          <LineTrendCard
            title="Water Usage Trend"
            description="Used vs. AI-recommended (litres)"
            data={waterUsage}
            xKey="week"
            series={[
              { key: "used", color: "#f59e0b", name: "Used" },
              { key: "recommended", color: "#3b82f6", name: "Recommended" },
            ]}
          />
        </div>

        {/* AI RECOMMENDATIONS PANEL */}
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Prioritized actions generated by JalRakshak's prediction engine</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 pt-0 md:grid-cols-3">
            {[
              { title: "Delay irrigation by 12–14 hours", detail: "Rain forecast makes this the optimal window.", badge: "high impact" },
              { title: "Switch to drip irrigation on Plot 2", detail: "Could reduce water use by up to 30%.", badge: "efficiency" },
              { title: "Monitor NDWI on the east block", detail: "Early signs of water stress detected.", badge: "watch" },
            ].map((r) => (
              <div key={r.title} className="rounded-xl border border-slate-100 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <Badge variant="default">{r.badge}</Badge>
                </div>
                <p className="text-sm font-semibold text-slate-700">{r.title}</p>
                <p className="mt-1 text-xs text-slate-400">{r.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
