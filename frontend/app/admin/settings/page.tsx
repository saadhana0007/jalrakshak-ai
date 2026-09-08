"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Database, Bell, Users2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [thresholds, setThresholds] = useState({ droughtAlert: 60, heatwaveAlert: 55, groundwaterAlert: 40 });

  return (
    <DashboardShell role="admin" title="System Settings" subtitle="Platform-wide configuration and access control">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Alert Thresholds</CardTitle>
            <CardDescription>Risk scores above these values trigger automated alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {Object.entries(thresholds).map(([key, value]) => (
              <div key={key}>
                <Label className="capitalize">{key.replace("Alert", " Alert Threshold")}</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={(e) => setThresholds((t) => ({ ...t, [key]: Number(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="w-10 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">{value}</span>
                </div>
              </div>
            ))}
            <Button className="w-full">Save Thresholds</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users2 className="h-4 w-4" /> Role-Based Access</CardTitle>
            <CardDescription>Manage admin and farmer role permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {[
              { role: "Farmer", access: "Dashboard, Farms, Advisor, Digital Twin, Climate Risk, Satellite, Community, Alerts, Reports, Settings" },
              { role: "Admin", access: "All Farmer modules + Executive Dashboard, District Monitoring, Farmer Management, Analytics" },
            ].map((r) => (
              <div key={r.role} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{r.role}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{r.access}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-4 w-4" /> Data Sources</CardTitle>
            <CardDescription>Connected sensor, weather and satellite feeds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {["IMD Weather API", "Sentinel-2 Satellite Feed", "IoT Soil Moisture Network", "CGWB Groundwater Database"].map((s) => (
              <div key={s} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {s}
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Connected</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Platform Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <Label>Default Forecast Horizon</Label>
              <Select defaultValue="7">
                <option value="7">7 Days</option>
                <option value="15">15 Days</option>
                <option value="30">30 Days</option>
              </Select>
            </div>
            <div>
              <Label>Community Cluster Radius (km)</Label>
              <Input type="number" defaultValue={5} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
