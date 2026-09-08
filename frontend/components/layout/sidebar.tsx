"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Sprout, Droplets, GitBranch, CloudRain, Satellite, Users,
  Bell, FileText, Settings, Building2, Map as MapIcon, UserCog, Waves,
  BarChart3, ShieldAlert, LogOut, Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

const farmerNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/farms", label: "Farms", icon: Sprout },
  { href: "/irrigation-advisor", label: "Irrigation Advisor", icon: Droplets },
  { href: "/digital-twin", label: "Digital Twin", icon: GitBranch },
  { href: "/climate-risk", label: "Climate Risk", icon: CloudRain },
  { href: "/satellite-intelligence", label: "Satellite Intelligence", icon: Satellite },
  { href: "/community-network", label: "Community Network", icon: Users },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminNav = [
  { href: "/admin/dashboard", label: "Executive Dashboard", icon: Building2 },
  { href: "/admin/district-monitoring", label: "District Monitoring", icon: MapIcon },
  { href: "/admin/farmer-management", label: "Farmer Management", icon: UserCog },
  { href: "/admin/water-intelligence", label: "Water Intelligence Center", icon: Waves },
  { href: "/admin/climate-analytics", label: "Climate Analytics", icon: BarChart3 },
  { href: "/admin/community-alerts", label: "Community Alerts", icon: ShieldAlert },
  { href: "/admin/groundwater-monitoring", label: "Groundwater Monitoring", icon: Droplets },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
];

export default function Sidebar({ role }: { role: "farmer" | "admin" }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAppStore((s) => s.logout);
  const userName = useAppStore((s) => s.userName);
  const nav = role === "farmer" ? farmerNav : adminNav;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/70 bg-white/90 backdrop-blur lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-soft">
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-slate-800">JalRakshak AI</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {role === "farmer" ? "Farmer Console" : "Admin Console"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary-600" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/70 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
            {userName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-semibold text-slate-700">{userName || "User"}</p>
            <p className="text-[10px] text-slate-400 capitalize">{role}</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
