"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineTrendCard } from "@/components/charts/chart-cards";
import KpiCard from "@/components/dashboard/kpi-card";
import NdviGrid from "@/components/satellite/ndvi-grid";
import { FarmMapDynamic } from "@/components/map/dynamic";
import { getFarmById } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { Leaf, Droplets, HeartPulse, AlertOctagon, Satellite, Calendar } from "lucide-react";
import { mulberry32, seededRange } from "@/lib/seeded-random";

const TIMELINE = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export default function SatelliteIntelligencePage() {
  const selectedFarmId = useAppStore((s) => s.selectedFarmId);
  const farm = getFarmById(selectedFarmId);
  const [layer, setLayer] = useState<"ndvi" | "ndwi">("ndvi");
  const [timeIdx, setTimeIdx] = useState(TIMELINE.length - 1);

  const r = mulberry32(farm.id.length * 3);
  const trend = TIMELINE.map((m, i) => ({
    month: m,
    ndvi: Math.round((0.4 + Math.sin(i / 2) * 0.15 + seededRange(r, -0.03, 0.03)) * 100) / 100,
    ndwi: Math.round((0.25 + Math.cos(i / 2) * 0.1 + seededRange(r, -0.03, 0.03)) * 100) / 100,
  }));

  return (
    <DashboardShell role="farmer" title="Satellite Intelligence" subtitle={`Remote-sensing insights for ${farm.id} · ${farm.village}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Leaf} label="NDVI" value={farm.ndvi.toFixed(2)} sub="Vegetation vigor index" accent="primary" />
        <KpiCard icon={Droplets} label="NDWI" value={farm.ndwi.toFixed(2)} sub="Canopy water content" accent="accent" />
        <KpiCard icon={HeartPulse} label="Vegetation Health" value={Math.round(farm.ndvi * 100)} unit="/100" accent="primary" />
        <KpiCard icon={AlertOctagon} label="Water Stress" value={farm.riskLevel} accent={farm.riskLevel === "low" ? "primary" : "red"} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Satellite Layer View</CardTitle>
                <CardDescription>Simulated {layer.toUpperCase()} raster for the {timeIdx + 1 === TIMELINE.length ? "current" : TIMELINE[timeIdx]} pass</CardDescription>
              </div>
              <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                {(["ndvi", "ndwi"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLayer(l)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${layer === l ? "bg-white text-primary-700 shadow-soft dark:bg-slate-700 dark:text-primary-300" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <NdviGrid mode={layer} seed={timeIdx + 1} />
            <div className="mt-4 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="range"
                min={0}
                max={TIMELINE.length - 1}
                value={timeIdx}
                onChange={(e) => setTimeIdx(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-10 text-xs font-semibold text-slate-500 dark:text-slate-400">{TIMELINE[timeIdx]}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>Low</span>
              <span className="flex items-center gap-1"><Satellite className="h-3 w-3" /> Sentinel-2 simulated composite</span>
              <span>High</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Farm Location</CardTitle>
            <CardDescription>{farm.village}, {farm.district}, {farm.state}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <FarmMapDynamic farm={farm} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <LineTrendCard
          title="NDVI / NDWI Trend"
          description="8-month satellite-derived index history"
          data={trend}
          xKey="month"
          height={260}
          series={[
            { key: "ndvi", color: "#059669", name: "NDVI" },
            { key: "ndwi", color: "#3b82f6", name: "NDWI" },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
