"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { useAppStore } from "@/lib/store";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const theme = useAppStore((s) => s.theme);
  const [checked, setChecked] = useState(false);

  // Tailwind's dark: variant matches any descendant of an element carrying
  // the `dark` class — applying it here (not on <html>) scopes the theme
  // toggle to the dashboard shell only, so login/landing pages (which have
  // their own fixed dark design) are never affected by it.
  const themeClass = theme === "dark" ? "dark" : "";

  // Also mirror the class onto <body> — purely so the page-level scrollbar
  // gutter (outside our own div) shows a dark background instead of the
  // fixed light body gradient. Cleaned up on unmount so it never lingers
  // onto the login/landing pages when the user navigates away.
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    return () => {
      document.body.classList.remove("dark");
    };
  }, [theme]);

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
      <div className={cn(themeClass, "flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950")}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 animate-pulse-slow items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Loading JalRakshak AI…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(themeClass, "min-h-screen bg-slate-50 dark:bg-slate-950")}>
      <Sidebar role={role} />
      <div className="lg:pl-64">
        <Topbar title={title} subtitle={subtitle} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
