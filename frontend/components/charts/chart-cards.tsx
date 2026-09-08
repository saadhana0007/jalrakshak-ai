"use client";

import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

function useChartTheme() {
  const theme = useAppStore((s) => s.theme);
  const dark = theme === "dark";

  return {
    dark,
    grid: dark ? "#1e293b" : "#eef2f7",
    tick: dark ? "#64748b" : "#94a3b8",
    tooltipStyle: {
      borderRadius: 12,
      border: dark ? "1px solid #1e293b" : "1px solid #e2e8f0",
      background: dark ? "#0f172a" : "#ffffff",
      color: dark ? "#e2e8f0" : "#0f172a",
      fontSize: 12,
      boxShadow: "0 2px 8px rgba(16,24,40,0.08)",
    },
    legendStyle: { fontSize: 12, color: dark ? "#94a3b8" : "#475569" },
  };
}

export function LineTrendCard({
  title, description, data, xKey, series, height = 220,
}: {
  title: string;
  description?: string;
  data: any[];
  xKey: string;
  series: { key: string; color: string; name?: string }[];
  height?: number;
}) {
  const ct = useChartTheme();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: ct.tick }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: ct.tick }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={ct.tooltipStyle} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name ?? s.key}
                stroke={s.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AreaTrendCard({
  title, description, data, xKey, dataKey, color = "#10b981", height = 220,
}: {
  title: string;
  description?: string;
  data: any[];
  xKey: string;
  dataKey: string;
  color?: string;
  height?: number;
}) {
  const ct = useChartTheme();
  const gradId = `grad-${dataKey}`;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: ct.tick }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: ct.tick }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={ct.tooltipStyle} />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill={`url(#${gradId})`} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BarCompareCard({
  title, description, data, xKey, series, height = 260,
}: {
  title: string;
  description?: string;
  data: any[];
  xKey: string;
  series: { key: string; color: string; name?: string }[];
  height?: number;
}) {
  const ct = useChartTheme();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: ct.tick }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: ct.tick }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={ct.tooltipStyle} />
            <Legend wrapperStyle={ct.legendStyle} />
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.name ?? s.key} fill={s.color} radius={[6, 6, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DonutCard({
  title, description, data, height = 220,
}: {
  title: string;
  description?: string;
  data: { name: string; value: number; color: string }[];
  height?: number;
}) {
  const ct = useChartTheme();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={ct.tooltipStyle} />
            <Legend wrapperStyle={ct.legendStyle} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function GaugeGraphic({
  value, max = 100, label, color = "#10b981",
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
}) {
  const ct = useChartTheme();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke={ct.grid} strokeWidth="12" />
        <circle
          cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{Math.round(value)}</span>
        {label && <span className="text-[10px] font-medium uppercase text-slate-400 dark:text-slate-500">{label}</span>}
      </div>
    </div>
  );
}
