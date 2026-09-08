"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GaugeGraphic, LineTrendCard } from "@/components/charts/chart-cards";
import { getFarmById } from "@/lib/mock-data";
import { predictClimateRisk } from "@/lib/ai";
import { useAppStore } from "@/lib/store";
import { CloudRain, Thermometer, Droplets, AlertTriangle } from "lucide-react";
import { riskColor } from "@/lib/utils";

const HORIZONS = [7, 15, 30] as const;

export default function ClimateRiskPage() {
  const selectedFarmId = useAppStore((s) => s.selectedFarmId);
  const farm = getFarmById(selectedFarmId);
  const [horizon, setHorizon] = useState<typeof HORIZONS[number]>(7);

  const risk = useMemo(
    () =>
      predictClimateRisk({
        rainfallDeficitPct: 30 + horizon * 0.8,
        temperatureAnomalyC: 2.1 + horizon * 0.04,
        ndvi: farm.ndvi,
        ndwi: farm.ndwi,
      }),
    [horizon, farm]
  );

  const timeline = useMemo(() => {
    return Array.from({ length: horizon }).map((_, i) => ({
      day: `D${i + 1}`,
      drought: Math.min(100, Math.round(risk.droughtRisk * (0.6 + (i / horizon) * 0.5))),
      heatwave: Math.min(100, Math.round(risk.heatwaveRisk * (0.65 + (i / horizon) * 0.45))),
      waterStress: Math.min(100, Math.round(risk.waterStressRisk * (0.6 + (i / horizon) * 0.5))),
    }));
  }, [risk, horizon]);

  const cards = [
    { key: "drought", label: "Drought Risk", score: risk.droughtRisk, level: risk.droughtLevel, icon: CloudRain, color: "#f59e0b" },
    { key: "heatwave", label: "Heatwave Risk", score: risk.heatwaveRisk, level: risk.heatwaveLevel, icon: Thermometer, color: "#ef4444" },
    { key: "stress", label: "Water Stress Risk", score: risk.waterStressRisk, level: risk.waterStressLevel, icon: Droplets, color: "#3b82f6" },
  ];

  return (
    <DashboardShell role="farmer" title="Climate Risk Prediction" subtitle={`${farm.village}, ${farm.district} · Forecast horizon: ${horizon} days`}>
      <div className="mb-6 flex items-center gap-2">
        {HORIZONS.map((h) => (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              horizon === h
                ? "bg-primary-600 text-white shadow-soft"
                : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {h} Days
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((c) => {
          const rc = riskColor(c.level);
          return (
            <Card key={c.key}>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className={`mb-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${rc.bg} ${rc.text}`}>
                  <c.icon className="h-3.5 w-3.5" /> {c.label}
                </div>
                <GaugeGraphic value={c.score} label="Risk score" color={c.color} />
                <Badge variant={c.level} className="mt-3">{c.level} severity</Badge>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Confidence: {risk.confidencePct}%</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <LineTrendCard
          title="Risk Timeline"
          description={`Projected risk trajectory over the ${horizon}-day forecast horizon`}
          data={timeline}
          xKey="day"
          height={280}
          series={[
            { key: "drought", color: "#f59e0b", name: "Drought" },
            { key: "heatwave", color: "#ef4444", name: "Heatwave" },
            { key: "waterStress", color: "#3b82f6", name: "Water Stress" },
          ]}
        />
      </div>

      <Card className="mt-6 border-red-200 bg-red-50/40 dark:border-red-500/20 dark:bg-red-500/5">
        <CardContent className="flex items-start gap-3 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-300">
              {risk.droughtLevel === "high" || risk.droughtLevel === "critical"
                ? "Elevated drought risk detected"
                : "Conditions within manageable range"}
            </p>
            <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
              Based on rainfall deficit trends and vegetation indices, review irrigation scheduling and consider
              water-conserving practices over the next {horizon} days.
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
