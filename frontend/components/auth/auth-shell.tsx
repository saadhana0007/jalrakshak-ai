import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthShell({
  title,
  subtitle,
  children,
  side,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  side: ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16">
        <Link href="/" className="mb-10 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">JalRakshak AI</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="mt-1.5 mb-8 text-sm text-slate-500">{subtitle}</p>
        <div className="max-w-sm">{children}</div>
      </div>
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-accent-950 lg:flex">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative z-10 flex flex-1 flex-col justify-center p-16">{side}</div>
      </div>
    </div>
  );
}
