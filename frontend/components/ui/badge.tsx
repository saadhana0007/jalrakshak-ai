import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200",
        accent: "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200",
        low: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
        medium: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
        high: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
        critical: "bg-red-100 text-red-800 ring-1 ring-inset ring-red-300",
        neutral: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
