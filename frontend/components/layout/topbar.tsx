"use client";

import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { FARMS } from "@/lib/mock-data";
import { useState } from "react";
import { ALERTS } from "@/lib/mock-data";

export default function Topbar({
  title,
  subtitle,
  onMenuClick,
}: {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}) {
  const role = useAppStore((s) => s.role);
  const selectedFarmId = useAppStore((s) => s.selectedFarmId);
  const setSelectedFarmId = useAppStore((s) => s.setSelectedFarmId);
  const [showAlerts, setShowAlerts] = useState(false);
  const unread = ALERTS.filter((a) => !a.read).length;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-4 py-3.5 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="hidden flex-1 max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          placeholder="Search farms, districts, alerts..."
          className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
        />
        <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘K</kbd>
      </div>

      <div className="flex items-center gap-2">
        {role === "farmer" && (
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 sm:flex">
            <span className="text-xs text-slate-400">Farm</span>
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              {FARMS.slice(0, 12).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.id} — {f.village}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowAlerts((s) => !s)}
            className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {showAlerts && (
            <div className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
              <p className="px-2 py-1.5 text-xs font-semibold text-slate-400">RECENT ALERTS</p>
              <div className="max-h-80 space-y-1 overflow-y-auto">
                {ALERTS.slice(0, 5).map((a) => (
                  <div key={a.id} className="rounded-xl px-2 py-2 hover:bg-slate-50">
                    <p className="text-xs font-semibold text-slate-700">{a.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-400">{a.description}</p>
                    <p className="mt-1 text-[10px] text-slate-300">{a.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
