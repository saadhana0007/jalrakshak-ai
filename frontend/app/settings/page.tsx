"use client";

import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { Bell, Globe, User, Smartphone } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const userName = useAppStore((s) => s.userName);
  const [notifs, setNotifs] = useState({ water: true, climate: true, groundwater: false, community: true });

  return (
    <DashboardShell role="farmer" title="Settings" subtitle="Manage your profile, language, and notification preferences">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <Label>Full Name</Label>
              <Input defaultValue={userName || "Ramesh Patil"} />
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input defaultValue="9876543210" />
            </div>
            <div>
              <Label>Preferred Language</Label>
              <Select defaultValue="en">
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </Select>
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notification Preferences</CardTitle>
            <CardDescription>Choose which alerts you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {Object.entries(notifs).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <span className="text-sm capitalize text-slate-600 dark:text-slate-300">{key} alerts</span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                  className="h-4 w-4 accent-primary-600"
                />
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> Connected Devices</CardTitle>
            <CardDescription>Soil sensors and IoT devices linked to your farm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {["Soil Moisture Sensor — Plot 1", "Weather Station — Farmhouse"].map((d) => (
              <div key={d} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300">
                {d}
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Online</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" /> Region Settings</CardTitle>
            <CardDescription>Used to localize weather and climate models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <Label>Units</Label>
              <Select defaultValue="metric">
                <option value="metric">Metric (mm, °C, litres)</option>
                <option value="imperial">Imperial (in, °F, gallons)</option>
              </Select>
            </div>
            <div>
              <Label>Timezone</Label>
              <Select defaultValue="ist">
                <option value="ist">Asia/Kolkata (IST)</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
