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
      return { text: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200", dot: "bg-emerald-500", solid: "bg-emerald-500" };
    case "medium":
      return { text: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200", dot: "bg-amber-500", solid: "bg-amber-500" };
    case "high":
      return { text: "text-red-600", bg: "bg-red-50", ring: "ring-red-200", dot: "bg-red-500", solid: "bg-red-500" };
    case "critical":
      return { text: "text-red-800", bg: "bg-red-100", ring: "ring-red-300", dot: "bg-red-700", solid: "bg-red-700" };
  }
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
