"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarCompareCard } from "@/components/charts/chart-cards";
import { getFarmById } from "@/lib/mock-data";
import { simulateDigitalTwin } from "@/lib/ai";
import { simulateDigitalTwinApi, getLiveWeather } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import {
  GitBranch, Trophy, Droplets, IndianRupee, Zap, Waves, HeartPulse, Sprout, Leaf, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SCENARIO_ICONS: Record<string, any> = {
  "irrigate-now": Droplets,
  "delay-12-hours": RefreshCw,
  "wait-for-rain": Waves,
  "reduce-water-by-30%": Leaf,
};

const SCENARIO_LETTER: Record<string, string> = {
  "irrigate-now": "A",
  "delay-12-hours": "B",
  "wait-for-rain": "C",
  "reduce-water-by-30%": "D",
};

function localSimulation(farm: ReturnType<typeof getFarmById>, temperatureC = 31, rainfallForecastMm = 21) {
  return simulateDigitalTwin({
    crop: farm.cropType,
    areaAcres: farm.areaAcres,
    soilMoisturePct: farm.soilMoisture,
    temperatureC,
    rainfallForecastMm,
    groundwaterDepthM: farm.groundwaterDepthM,
  });
}

function normalizeApiScenario(s: any) {
  return {
    id: s.id,
    name: s.name,
    waterLitres: s.water_litres,
    costInr: s.cost_inr,
    energyKwh: s.energy_kwh,
    groundwaterImpactPct: s.groundwater_impact_pct,
    cropHealthScore: s.crop_health_score,
    yieldPredictionPct: s.yield_prediction_pct,
    carbonKgCo2: s.carbon_kg_co2,
    sustainability: s.sustainability,
    rank: s.rank,
  };
}

export default function DigitalTwinPage() {
  const selectedFarmId = useAppStore((s) => s.selectedFarmId);
  const farm = getFarmById(selectedFarmId);
  const token = useAppStore((s) => s.token);
  const [run, setRun] = useState(0);
  const [source, setSource] = useState<"live" | "local">("local");
  const [weatherLoaded, setWeatherLoaded] = useState(false);

  const localResult = useMemo(() => localSimulation(farm), [farm.id]);
  const [twin, setTwin] = useState(localResult);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let temperatureC = 31;
      let rainfallForecastMm = 21;
      try {
        const w = await getLiveWeather(farm.id);
        if (!cancelled) {
          temperatureC = w.current.temp_c;
          rainfallForecastMm = w.next_14h_rainfall_mm;
          setWeatherLoaded(true);
        }
      } catch {
        // fall through with default assumptions
      }

      try {
        if (!token) throw new Error("no token");
        const res = await simulateDigitalTwinApi(token, {
          crop: farm.cropType,
          area_acres: farm.areaAcres,
          soil_moisture_pct: farm.soilMoisture,
          temperature_c: temperatureC,
          rainfall_forecast_mm: rainfallForecastMm,
          groundwater_depth_m: farm.groundwaterDepthM,
        });
        if (cancelled) return;
        setTwin({
          scenarios: res.scenarios.map(normalizeApiScenario),
          best: normalizeApiScenario(res.best),
        });
        setSource("live");
      } catch {
        if (cancelled) return;
        setTwin(localSimulation(farm, temperatureC, rainfallForecastMm));
        setSource("local");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farm.id, run, token]);

  const { scenarios, best } = twin;

  const barData = scenarios.map((s) => ({
    name: s.name.replace(" Irrigation", ""),
    "Water (kL)": Math.round(s.waterLitres / 100) / 10,
    "Cost (₹)": s.costInr,
  }));

  return (
    <DashboardShell role="farmer" title="Farm Digital Twin" subtitle="Simulate irrigation futures before you commit water">
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-accent-200 bg-gradient-to-r from-accent-50 to-primary-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-600 to-primary-600 text-white">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{farm.id} — {farm.village}, {farm.district}</p>
            <p className="text-xs text-slate-500">{farm.cropType} · {farm.areaAcres} acres · Soil moisture {farm.soilMoisture}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {weatherLoaded && <Badge variant="default">Live weather</Badge>}
          <Badge variant={source === "live" ? "default" : "neutral"}>
            {source === "live" ? "Live AI model" : "Local fallback"}
          </Badge>
          <Button variant="outline" className="gap-2" onClick={() => setRun((r) => r + 1)}>
            <RefreshCw className="h-3.5 w-3.5" /> Re-simulate
          </Button>
        </div>
      </div>

      {/* SCENARIO CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scenarios.map((s) => {
          const Icon = SCENARIO_ICONS[s.id] ?? Droplets;
          const isBest = s.rank === 1;
          return (
            <Card
              key={s.id}
              className={cn(
                "relative overflow-hidden transition-transform hover:-translate-y-0.5",
                isBest && "border-2 border-primary-400 shadow-lg"
              )}
            >
              {isBest && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary-600 px-2.5 py-1 text-[10px] font-bold text-white">
                  <Trophy className="h-3 w-3" /> BEST
                </div>
              )}
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase text-slate-400">Scenario {SCENARIO_LETTER[s.id] ?? "-"}</p>
                <h3 className="mb-3 text-base font-bold text-slate-800">{s.name}</h3>
                <div className="space-y-2 text-xs">
                  <Row icon={Droplets} label="Water" value={`${s.waterLitres.toLocaleString("en-IN")} L`} />
                  <Row icon={IndianRupee} label="Cost" value={`₹${s.costInr.toLocaleString("en-IN")}`} />
                  <Row icon={Zap} label="Energy" value={`${s.energyKwh} kWh`} />
                  <Row icon={Waves} label="Groundwater Impact" value={`${s.groundwaterImpactPct}%`} />
                  <Row icon={HeartPulse} label="Crop Health" value={`${s.cropHealthScore}/100`} />
                  <Row icon={Sprout} label="Yield Prediction" value={`${s.yieldPredictionPct}%`} />
                  <Row icon={Leaf} label="Carbon Impact" value={`${s.carbonKgCo2} kg CO₂`} />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-medium uppercase text-slate-400">Sustainability Rank</span>
                  <Badge variant={s.rank === 1 ? "low" : s.rank === 2 ? "medium" : "neutral"}>#{s.rank}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* BEST RECOMMENDATION */}
      <Card className="mt-6 border-primary-300 bg-gradient-to-br from-primary-600 to-accent-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-300" />
            <p className="text-xs font-bold uppercase tracking-wide text-primary-100">Best Recommended Scenario</p>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold">{best.name}</h2>
          <p className="mt-2 max-w-2xl text-sm text-primary-100">
            This scenario achieves the highest sustainability index ({best.sustainability}/100) by balancing
            water conservation, groundwater protection, crop health, and yield — using {best.waterLitres.toLocaleString("en-IN")} L
            of water while keeping predicted yield at {best.yieldPredictionPct}% and carbon impact to just {best.carbonKgCo2} kg CO₂.
          </p>
        </CardContent>
      </Card>

      {/* CHARTS */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BarCompareCard
          title="Water Consumption Comparison"
          description="Kilolitres per scenario"
          data={barData}
          xKey="name"
          series={[{ key: "Water (kL)", color: "#3b82f6" }]}
        />
        <BarCompareCard
          title="Cost Comparison"
          description="Estimated cost per scenario (₹)"
          data={barData}
          xKey="name"
          series={[{ key: "Cost (₹)", color: "#10b981" }]}
        />
      </div>
    </DashboardShell>
  );
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  );
}
