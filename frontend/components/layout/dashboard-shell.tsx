"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { useAppStore } from "@/lib/store";
import { Leaf } from "lucide-react";

export default function DashboardShell({
  role,
  title,
  subtitle,
  children,
}: {
  role: "farmer" | "admin";
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const userRole = useAppStore((s) => s.role);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!isAuthenticated || userRole !== role) {
        router.replace(role === "farmer" ? "/login/farmer" : "/login/admin");
      } else {
        setChecked(true);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [isAuthenticated, userRole, role, router]);

  if (!checked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 animate-pulse-slow items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-slate-400">Loading JalRakshak AI…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role={role} />
      <div className="lg:pl-64">
        <Topbar title={title} subtitle={subtitle} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
