"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ShieldCheck, Sprout, Droplets, CloudRain } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { requestOtp, verifyOtp as verifyOtpApi } from "@/lib/api";

export default function FarmerLoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mobile.replace(/\D/g, "").length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      await requestOtp(mobile);
    } catch {
      // Backend unreachable — demo OTP (123456) still works client-side.
    } finally {
      setLoading(false);
      setStep("otp");
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP sent to your phone.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtpApi(mobile, otp);
      login("farmer", res.user_name, res.access_token);
    } catch {
      login("farmer", "Ramesh Patil", "mock-jwt-farmer-token");
    } finally {
      setLoading(false);
      router.push("/dashboard");
    }
  }

  return (
    <AuthShell
      title="Farmer Login"
      subtitle="Sign in with your mobile number to access your farm dashboard."
      side={
        <div className="max-w-sm text-white">
          <h2 className="text-3xl font-bold leading-tight">
            Know exactly when — and how much — to irrigate.
          </h2>
          <p className="mt-4 text-sm text-primary-100">
            Real-time recommendations, digital-twin simulations, and community alerts,
            built for smallholder farms.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { icon: Droplets, text: "Save up to 22% water per season" },
              { icon: Sprout, text: "Protect yield with early stress detection" },
              { icon: CloudRain, text: "Get 7/15/30-day climate risk forecasts" },
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
      {step === "mobile" ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <Label>Mobile Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="98765 43210"
                maxLength={10}
                className="pl-9"
              />
            </div>
          </div>
          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending OTP…" : "Send OTP"}
          </Button>
          <p className="text-center text-[11px] text-slate-400">
            Demo: any 10-digit number works, e.g. 9876543210
          </p>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div>
            <Label>Enter OTP sent to +91 {mobile}</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="pl-9 tracking-[0.3em]"
              />
            </div>
          </div>
          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying…" : "Verify & Continue"}
          </Button>
          <button
            type="button"
            onClick={() => setStep("mobile")}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600"
          >
            Change mobile number
          </button>
          <p className="text-center text-[11px] text-slate-400">Demo: any 6-digit OTP works, e.g. 123456</p>
        </form>
      )}
    </AuthShell>
  );
}
