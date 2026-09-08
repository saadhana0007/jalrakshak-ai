import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

export function formatCompact(n: number): string {
  if (n >= 10000000) return (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(2) + " L";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export const riskColor = (level: "low" | "medium" | "high" | "critical") => {
  switch (level) {
    case "low":
      return {
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        ring: "ring-emerald-200 dark:ring-emerald-500/30",
        dot: "bg-emerald-500",
        solid: "bg-emerald-500",
      };
    case "medium":
      return {
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-500/10",
        ring: "ring-amber-200 dark:ring-amber-500/30",
        dot: "bg-amber-500",
        solid: "bg-amber-500",
      };
    case "high":
      return {
        text: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-500/10",
        ring: "ring-red-200 dark:ring-red-500/30",
        dot: "bg-red-500",
        solid: "bg-red-500",
      };
    case "critical":
      return {
        text: "text-red-800 dark:text-red-300",
        bg: "bg-red-100 dark:bg-red-500/20",
        ring: "ring-red-300 dark:ring-red-500/40",
        dot: "bg-red-700",
        solid: "bg-red-700",
      };
  }
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
