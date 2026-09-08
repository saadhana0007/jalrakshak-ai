"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CROPS, SOIL_TYPES, IRRIGATION_METHODS, DISTRICTS } from "@/lib/mock-data";
import { Sprout } from "lucide-react";

export default function FarmRegisterPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    farmerName: "",
    village: "",
    district: DISTRICTS[0].name,
    state: DISTRICTS[0].state,
    areaAcres: "",
    cropType: CROPS[0],
    sowingDate: "",
    soilType: SOIL_TYPES[0],
    irrigationMethod: IRRIGATION_METHODS[0],
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => {
      if (key === "district") {
        const d = DISTRICTS.find((d) => d.name === value);
        return { ...f, district: value, state: d?.state ?? f.state };
      }
      return { ...f, [key]: value };
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => router.push("/farms"), 1400);
  }

  return (
    <DashboardShell role="farmer" title="Register Farm" subtitle="Add a new farm to your JalRakshak profile">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Farm Details</CardTitle>
          <CardDescription>All fields are used to personalize irrigation & climate recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {saved ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Sprout className="h-7 w-7" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Farm saved successfully</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Redirecting to your farms list…</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Farmer Name</Label>
                <Input required value={form.farmerName} onChange={(e) => update("farmerName", e.target.value)} placeholder="e.g. Ramesh Patil" />
              </div>
              <div>
                <Label>Village</Label>
                <Input required value={form.village} onChange={(e) => update("village", e.target.value)} placeholder="e.g. Yeola" />
              </div>
              <div>
                <Label>District</Label>
                <Select value={form.district} onChange={(e) => update("district", e.target.value)}>
                  {DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>State</Label>
                <Input value={form.state} disabled />
              </div>
              <div>
                <Label>Farm Area (acres)</Label>
                <Input required type="number" step="0.1" value={form.areaAcres} onChange={(e) => update("areaAcres", e.target.value)} placeholder="e.g. 4.5" />
              </div>
              <div>
                <Label>Crop Type</Label>
                <Select value={form.cropType} onChange={(e) => update("cropType", e.target.value)}>
                  {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <Label>Sowing Date</Label>
                <Input required type="date" value={form.sowingDate} onChange={(e) => update("sowingDate", e.target.value)} />
              </div>
              <div>
                <Label>Soil Type</Label>
                <Select value={form.soilType} onChange={(e) => update("soilType", e.target.value)}>
                  {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Irrigation Method</Label>
                <Select value={form.irrigationMethod} onChange={(e) => update("irrigationMethod", e.target.value)}>
                  {IRRIGATION_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
              <div className="sm:col-span-2 mt-2">
                <Button type="submit" className="w-full">Save Farm</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
