"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CROPS, getFarmById } from "@/lib/mock-data";
import { predictWaterDemand, type WaterDemandOutput } from "@/lib/ai";
import { predictWaterDemandApi, getLiveWeather } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { Droplets, Clock, Gauge, Sparkles, Zap, CheckCircle2, XCircle, Satellite } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function IrrigationAdvisorPage() {
  const selectedFarmId = useAppStore((s) => s.selectedFarmId);
  const farm = getFarmById(selectedFarmId);
  const token = useAppStore((s) => s.token);

  const [form, setForm] = useState({
    crop: farm.cropType,
    areaAcres: String(farm.areaAcres),
    soilMoisture: String(farm.soilMoisture),
    temperature: "31",
    rainfall: "21",
  });
  const [liveWeatherLoaded, setLiveWeatherLoaded] = useState(false);
  const [result, setResult] = useState<WaterDemandOutput | null>(null);
  const [source, setSource] = useState<"live" | "local">("local");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getLiveWeather(farm.id)
      .then((w) => {
        if (cancelled) return;
        setForm((f) => ({
          ...f,
          temperature: String(Math.round(w.current.temp_c)),
          rainfall: String(Math.round(w.next_14h_rainfall_mm)),
        }));
        setLiveWeatherLoaded(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farm.id]);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const input = {
      crop: form.crop,
      areaAcres: parseFloat(form.areaAcres) || 1,
      soilMoisturePct: parseFloat(form.soilMoisture) || 0,
      temperatureC: parseFloat(form.temperature) || 25,
      rainfallForecastMm: parseFloat(form.rainfall) || 0,
    };
    try {
      if (!token) throw new Error("no token");
      const res = await predictWaterDemandApi(token, {
        crop: input.crop,
        area_acres: input.areaAcres,
        soil_moisture_pct: input.soilMoisturePct,
        temperature_c: input.temperatureC,
        rainfall_forecast_mm: input.rainfallForecastMm,
      });
      setResult({
        decision: res.decision as WaterDemandOutput["decision"],
        waterRequirementLitres: res.water_requirement_litres,
        waterSavedLitres: res.water_saved_litres,
        irrigationDurationMin: res.irrigation_duration_min,
        confidencePct: res.confidence_pct,
        reasoning: res.reasoning,
      });
      setSource("live");
    } catch {
      setResult(predictWaterDemand(input));
      setSource("local");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell role="farmer" title="Smart Irrigation Advisor" subtitle="AI recommendation engine for irrigate-now vs. delay decisions">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inputs</CardTitle>
              {liveWeatherLoaded && (
                <Badge variant="default" className="gap-1">
                  <Satellite className="h-3 w-3" /> Live weather
                </Badge>
              )}
            </div>
            <CardDescription>
              {liveWeatherLoaded ? "Temperature & rainfall prefilled from live conditions — adjust freely" : "Adjust conditions to see a live recommendation"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={run} className="space-y-4">
              <div>
                <Label>Crop Type</Label>
                <Select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>
                  {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <Label>Farm Area (acres)</Label>
                <Input type="number" step="0.1" value={form.areaAcres} onChange={(e) => setForm({ ...form, areaAcres: e.target.value })} />
              </div>
              <div>
                <Label>Soil Moisture (%)</Label>
                <Input type="range" min={0} max={70} value={form.soilMoisture} onChange={(e) => setForm({ ...form, soilMoisture: e.target.value })} />
                <p className="mt-1 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">{form.soilMoisture}%</p>
              </div>
              <div>
                <Label>Temperature (°C)</Label>
                <Input type="range" min={15} max={45} value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} />
                <p className="mt-1 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">{form.temperature}°C</p>
              </div>
              <div>
                <Label>Rainfall Forecast (mm)</Label>
                <Input type="range" min={0} max={50} value={form.rainfall} onChange={(e) => setForm({ ...form, rainfall: e.target.value })} />
                <p className="mt-1 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">{form.rainfall}mm</p>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <Sparkles className="h-4 w-4" /> {loading ? "Analyzing…" : "Get Recommendation"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {!result ? (
            <Card className="flex h-full min-h-[420px] items-center justify-center">
              <div className="text-center text-slate-400 dark:text-slate-500">
                <Droplets className="mx-auto mb-3 h-10 w-10" />
                <p className="text-sm font-medium">Run the advisor to see your recommendation</p>
              </div>
            </Card>
          ) : (
            <Card
              className={cn(
                "overflow-hidden border-2",
                result.decision === "Delay Irrigation"
                  ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-500/5"
                  : "border-accent-200 bg-accent-50/40 dark:border-accent-500/20 dark:bg-accent-500/5"
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  {result.decision === "Delay Irrigation" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Zap className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                  )}
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recommendation</p>
                  <Badge variant={source === "live" ? "default" : "neutral"} className="ml-auto">
                    {source === "live" ? "Live AI model" : "Local fallback"}
                  </Badge>
                </div>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-800 dark:text-slate-100">{result.decision}</h2>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Metric icon={Droplets} label="Water Requirement" value={`${result.waterRequirementLitres.toLocaleString("en-IN")} L`} />
                  <Metric icon={Sparkles} label="Expected Savings" value={`${result.waterSavedLitres.toLocaleString("en-IN")} L`} highlight />
                  <Metric icon={Clock} label="Irrigation Duration" value={`${result.irrigationDurationMin} min`} />
                  <Metric icon={Gauge} label="Confidence" value={`${result.confidencePct}%`} />
                </div>

                <div className="mt-5">
                  <p className="mb-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">Confidence Score</p>
                  <Progress value={result.confidencePct} />
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
                  <p className="mb-1 text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Reasoning Summary</p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{result.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <Icon className={cn("mb-1.5 h-4 w-4", highlight ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500")} />
      <p className={cn("text-base font-bold", highlight ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-100")}>{value}</p>
      <p className="text-[10px] font-medium uppercase text-slate-400 dark:text-slate-500">{label}</p>
    </div>
  );
}
