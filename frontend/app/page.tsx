"use client";

import Link from "next/link";
import {
  Droplets, Leaf, GitBranch, CloudRain, Satellite, Users, Gauge,
  ArrowRight, Zap, MapPinned, TrendingDown, ShieldCheck, PlayCircle,
} from "lucide-react";
import LiveCounter from "@/components/landing/live-counter";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Droplets,
    title: "Smart Irrigation Advisor",
    desc: "AI-driven irrigate-now vs. delay recommendations based on soil moisture, weather, and crop stage.",
    color: "from-primary-500 to-primary-600",
  },
  {
    icon: GitBranch,
    title: "Farm Digital Twin",
    desc: "Simulate multiple irrigation futures side-by-side and get the most sustainable path forward.",
    color: "from-accent-500 to-accent-600",
  },
  {
    icon: CloudRain,
    title: "Climate Risk Prediction",
    desc: "Forecast drought, heatwave, and water-stress risk across 7, 15, and 30-day horizons.",
    color: "from-sky-500 to-sky-600",
  },
  {
    icon: Satellite,
    title: "Satellite Intelligence",
    desc: "NDVI, NDWI and vegetation-health monitoring powered by remote-sensing time series.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Users,
    title: "Community Water-Stress Network",
    desc: "Cluster detection across neighbouring farms to catch regional droughts before they spread.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Gauge,
    title: "Groundwater Monitoring",
    desc: "Track aquifer depletion trends and get early warnings before wells run dry.",
    color: "from-blue-500 to-blue-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-soft">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-white">JalRakshak AI</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#impact" className="hover:text-white">Impact</a>
            <a href="#demo" className="hover:text-white">Demo</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login/farmer">
              <Button variant="outline" size="sm" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Farmer Login
              </Button>
            </Link>
            <Link href="/login/admin">
              <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary-600/30 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-accent-600/30 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-20 text-center md:pt-28">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-primary-300 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
            </span>
            Built for Smart India Hackathon 2026
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            AI-Powered Water Intelligence for{" "}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Climate-Resilient Agriculture
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
            Predict irrigation needs, climate risks, and water stress before they impact crops.
            One platform for farmers and administrators to save water, energy, and yield.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login/farmer">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary-900/30">
                <Leaf className="h-4 w-4" /> Farmer Login <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login/admin">
              <Button size="lg" variant="outline" className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10">
                <ShieldCheck className="h-4 w-4" /> Admin Login
              </Button>
            </Link>
            <a href="#demo">
              <Button size="lg" variant="ghost" className="gap-2 text-slate-300 hover:bg-white/10 hover:text-white">
                <PlayCircle className="h-4 w-4" /> View Demo
              </Button>
            </a>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Tagline: <span className="text-slate-300">Predict. Preserve. Prosper.</span>
          </p>
        </div>
      </section>

      {/* LIVE IMPACT */}
      <section id="impact" className="relative border-t border-white/10 bg-slate-900/60 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white">Live Platform Impact</h2>
            <p className="mt-2 text-sm text-slate-400">Updated in real time across every monitored district</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <LiveCounter icon={Droplets} label="Water Saved Today (L)" target={842600} color="bg-primary-600" />
            <LiveCounter icon={Leaf} label="Farms Protected" target={12480} color="bg-emerald-600" />
            <LiveCounter icon={Zap} label="Energy Saved (kWh)" target={38250} color="bg-amber-600" />
            <LiveCounter icon={MapPinned} label="Districts Monitored" target={128} color="bg-accent-600" />
            <LiveCounter icon={TrendingDown} label="Groundwater Preserved (kL)" target={261900} color="bg-sky-600" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Everything a modern farm needs</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
              From hyperlocal irrigation guidance to state-wide climate intelligence — one connected system.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-soft`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-white">{f.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO / CTA */}
      <section id="demo" className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-accent-900 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">See JalRakshak AI in action</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-100">
            Log in as a farmer to explore irrigation guidance and the Digital Twin, or as an admin to see
            state-wide water intelligence.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login/farmer">
              <Button size="lg" className="bg-white text-primary-800 hover:bg-slate-100">
                Try Farmer Dashboard
              </Button>
            </Link>
            <Link href="/login/admin">
              <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                Try Admin Console
              </Button>
            </Link>
          </div>
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-primary-50 backdrop-blur">
            Demo Admin — email <strong>admin@jalrakshak.ai</strong> · password <strong>Admin123</strong>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-slate-500 md:flex-row">
          <p>© 2026 JalRakshak AI. Predict. Preserve. Prosper.</p>
          <p>Hyperlocal Water Intelligence &amp; Climate-Risk Prediction for Agriculture</p>
        </div>
      </footer>
    </div>
  );
}
