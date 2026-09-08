"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FARMS } from "@/lib/mock-data";
import { Plus, Search, MapPin, Droplets, Sprout } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function FarmsPage() {
  const [query, setQuery] = useState("");
  const setSelectedFarmId = useAppStore((s) => s.setSelectedFarmId);
  const myFarms = FARMS.slice(0, 12).filter(
    (f) =>
      f.village.toLowerCase().includes(query.toLowerCase()) ||
      f.cropType.toLowerCase().includes(query.toLowerCase()) ||
      f.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardShell role="farmer" title="My Farms" subtitle="Manage registered farms and their profiles">
      <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search farms…" className="pl-9" />
        </div>
        <Link href="/farms/register">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Register New Farm
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {myFarms.map((f) => (
          <Card key={f.id} className="transition-shadow hover:shadow-lg">
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">{f.id}</p>
                  <h3 className="text-sm font-bold text-slate-800">{f.village}</h3>
                </div>
                <Badge variant={f.riskLevel}>{f.riskLevel} risk</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-slate-500">
                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {f.district}, {f.state}</p>
                <p className="flex items-center gap-1.5"><Sprout className="h-3.5 w-3.5" /> {f.cropType} · {f.areaAcres} acres</p>
                <p className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5" /> Moisture {f.soilMoisture}% · {f.irrigationMethod}</p>
              </div>
              <button
                onClick={() => setSelectedFarmId(f.id)}
                className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-50"
              >
                Set as Active Farm
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
