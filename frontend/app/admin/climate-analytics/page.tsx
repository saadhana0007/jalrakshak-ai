"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import KpiCard from "@/components/dashboard/kpi-card";
import { LineTrendCard, DonutCard, BarCompareCard } from "@/components/charts/chart-cards";
import { generateRainfallForecast, generateWeatherTrend, districtRiskSummary } from "@/lib/mock-data";
import { CloudRain, Thermometer, Wind, Gauge } from "lucide-react";

export default function ClimateAnalyticsPage() {
  const rainfall = generateRainfallForecast(14);
  const weather = generateWeatherTrend();

  const riskLevels = ["low", "medium", "high", "critical"] as const;
  const riskDonut = riskLevels.map((r, i) => ({
    name: r,
    value: districtRiskSummary.filter((d) => d.riskLevel === r).length,
    color: ["#10b981", "#f59e0b", "#ef4444", "#b91c1c"][i],
  }));

  const barData = districtRiskSummary.slice(0, 8).map((d) => ({ name: d.name, "Stress %": d.stressPct }));

  return (
    <DashboardShell role="admin" title="Climate Analytics" subtitle="Statewide drought, heatwave, and rainfall analytics">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={CloudRain} label="Avg Rainfall Deficit" value="31" unit="%" accent="accent" />
        <KpiCard icon={Thermometer} label="Avg Temp Anomaly" value="+2.4" unit="°C" accent="red" />
        <KpiCard icon={Wind} label="Districts w/ Heatwave Risk" value={districtRiskSummary.filter((d) => d.riskLevel !== "low").length} accent="red" />
        <KpiCard icon={Gauge} label="Model Confidence" value="87" unit="%" accent="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineTrendCard
            title="Temperature & Humidity Trend"
            description="24-hour statewide average"
            data={weather}
            xKey="time"
            height={280}
            series={[
              { key: "tempC", color: "#ef4444", name: "Temp (°C)" },
              { key: "humidity", color: "#3b82f6", name: "Humidity (%)" },
            ]}
          />
        </div>
        <DonutCard title="District Risk Distribution" description="By risk level" data={riskDonut} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarCompareCard title="14-Day Rainfall Forecast" description="mm, statewide average" data={rainfall} xKey="day" series={[{ key: "forecastMm", color: "#3b82f6", name: "Rainfall (mm)" }]} />
        <BarCompareCard title="Top Stress Districts" description="Water-stress incidence" data={barData} xKey="name" series={[{ key: "Stress %", color: "#ef4444" }]} />
      </div>
    </DashboardShell>
  );
}
