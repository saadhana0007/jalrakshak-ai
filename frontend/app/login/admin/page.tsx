"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Building2, BarChart3, MapPinned } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (email.toLowerCase() !== "admin@jalrakshak.ai" || password !== "Admin123") {
      setError("Invalid credentials. Use the demo admin login shown below.");
      return;
    }
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      login("admin", res.user_name, res.access_token);
    } catch {
      // Backend unreachable — fall back to a local demo session so the UI stays usable.
      login("admin", "System Administrator", "mock-jwt-admin-token");
    } finally {
      setLoading(false);
      router.push("/admin/dashboard");
    }
  }

  return (
    <AuthShell
      title="Admin Login"
      subtitle="Sign in to access the state-wide water intelligence command center."
      side={
        <div className="max-w-sm text-white">
          <h2 className="text-3xl font-bold leading-tight">
            A command center for climate-resilient agriculture.
          </h2>
          <p className="mt-4 text-sm text-primary-100">
            District-level water stress, groundwater trends, and farmer analytics —
            in one executive dashboard.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { icon: Building2, text: "Monitor 128+ districts in real time" },
              { icon: MapPinned, text: "Track community risk clusters on a live map" },
              { icon: BarChart3, text: "Export water, yield & climate risk reports" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <f.icon className="h-4 w-4 text-primary-200" />
                <span className="text-xs font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@jalrakshak.ai"
              className="pl-9"
            />
          </div>
        </div>
        <div>
          <Label>Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-500">
          Demo Credentials<br />
          Email: <strong className="text-slate-700">admin@jalrakshak.ai</strong><br />
          Password: <strong className="text-slate-700">Admin123</strong>
        </div>
      </form>
    </AuthShell>
  );
}
