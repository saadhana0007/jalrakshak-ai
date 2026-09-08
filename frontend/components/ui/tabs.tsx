"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext, useState, type ReactNode } from "react";

const TabsCtx = createContext<{ value: string; setValue: (v: string) => void } | null>(null);

export function Tabs({
  defaultValue,
  className,
  children,
}: {
  defaultValue: string;
  className?: string;
  children: ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsCtx.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={cn(
        "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-white text-primary-700 shadow-soft" : "text-slate-500 hover:text-slate-700"
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div className={cn("animate-fade-up", className)}>{children}</div>;
}
