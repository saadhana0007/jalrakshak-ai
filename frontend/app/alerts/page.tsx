"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ALERTS } from "@/lib/mock-data";
import { riskColor } from "@/lib/utils";
import { Droplets, CloudRain, Waves, Users, Filter } from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All Alerts", icon: Filter },
  { key: "water", label: "Water Alerts", icon: Droplets },
  { key: "climate", label: "Climate Alerts", icon: CloudRain },
  { key: "groundwater", label: "Groundwater Alerts", icon: Waves },
  { key: "community", label: "Community Alerts", icon: Users },
] as const;

const SEVERITIES = ["low", "medium", "high", "critical"] as const;

export default function AlertsPage() {
  const [category, setCategory] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");

  const filtered = ALERTS.filter(
    (a) => (category === "all" || a.category === category) && (severity === "all" || a.severity === severity)
  );

  return (
    <DashboardShell role="farmer" title="Alert Center" subtitle="All water, climate, groundwater and community alerts">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              category === c.key ? "bg-primary-600 text-white" : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            <c.icon className="h-3.5 w-3.5" /> {c.label}
          </button>
        ))}
        <span className="mx-2 h-5 w-px bg-slate-200" />
        <button
          onClick={() => setSeverity("all")}
          className={`rounded-xl px-3 py-2 text-xs font-semibold ${severity === "all" ? "bg-slate-800 text-white" : "border border-slate-200 bg-white text-slate-500"}`}
        >
          All Severities
        </button>
        {SEVERITIES.map((s) => (
          <button
            key={s}
            onClick={() => setSeverity(s)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize ${
              severity === s ? "bg-slate-800 text-white" : "border border-slate-200 bg-white text-slate-500"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card><CardContent className="p-8 text-center text-sm text-slate-400">No alerts match these filters.</CardContent></Card>
        )}
        {filtered.map((a) => {
          const rc = riskColor(a.severity);
          return (
            <Card key={a.id} className={!a.read ? "border-l-4 border-l-primary-500" : ""}>
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${rc.dot}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">{a.title}</p>
                      {!a.read && <Badge variant="default">new</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{a.description}</p>
                    <p className="mt-2 text-[10px] font-medium text-slate-400">
                      {a.district} · {a.timestamp} · <span className="capitalize">{a.category}</span>
                    </p>
                  </div>
                </div>
                <Badge variant={a.severity}>{a.severity}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}
