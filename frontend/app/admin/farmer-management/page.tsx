"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import KpiCard from "@/components/dashboard/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FARMS, DISTRICTS } from "@/lib/mock-data";
import { Users, UserCheck, Search, Download, Sprout } from "lucide-react";

export default function FarmerManagementPage() {
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("all");
  const [risk, setRisk] = useState("all");

  const filtered = FARMS.filter(
    (f) =>
      (district === "all" || f.district === district) &&
      (risk === "all" || f.riskLevel === risk) &&
      (f.farmerName.toLowerCase().includes(query.toLowerCase()) || f.id.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <DashboardShell role="admin" title="Farmer Management" subtitle="Search, filter and manage registered farmers">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Users} label="Total Farmers" value="12,480" accent="primary" />
        <KpiCard icon={UserCheck} label="Active Users (30d)" value="9,104" accent="accent" />
        <KpiCard icon={Sprout} label="Registered Farms" value={FARMS.length * 96} accent="primary" />
        <KpiCard icon={Users} label="High-Risk Farmers" value={FARMS.filter((f) => f.riskLevel === "high" || f.riskLevel === "critical").length * 96} accent="red" />
      </div>

      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search farmer or farm ID…" className="pl-9" />
              </div>
              <Select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-40">
                <option value="all">All Districts</option>
                {DISTRICTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
              </Select>
              <Select value={risk} onChange={(e) => setRisk(e.target.value)} className="w-36">
                <option value="all">All Risk</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  <th className="py-2.5 font-medium">Farm ID</th>
                  <th className="py-2.5 font-medium">Farmer</th>
                  <th className="py-2.5 font-medium">District</th>
                  <th className="py-2.5 font-medium">Crop</th>
                  <th className="py-2.5 font-medium">Area</th>
                  <th className="py-2.5 font-medium">Moisture</th>
                  <th className="py-2.5 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 30).map((f) => (
                  <tr key={f.id} className="border-b border-slate-50 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/60">
                    <td className="py-2.5 font-semibold text-slate-700 dark:text-slate-200">{f.id}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">{f.farmerName}</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{f.district}</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{f.cropType}</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{f.areaAcres} ac</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{f.soilMoisture}%</td>
                    <td className="py-2.5"><Badge variant={f.riskLevel}>{f.riskLevel}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">No farmers match these filters.</p>}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
