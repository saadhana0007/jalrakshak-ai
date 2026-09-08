// Thin client for the FastAPI backend. Every call has a client-side mock
// fallback (see lib/ai.ts) so the UI keeps working even if the backend
// isn't running — but when it IS running, real requests go over the wire.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function apiFetch<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

export async function adminLogin(email: string, password: string) {
  return apiFetch<{ access_token: string; role: string; user_name: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function requestOtp(mobile: string) {
  return apiFetch<{ message: string; demo_otp: string }>("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ mobile }),
  });
}

export async function verifyOtp(mobile: string, otp: string) {
  return apiFetch<{ access_token: string; role: string; user_name: string }>("/auth/otp", {
    method: "POST",
    body: JSON.stringify({ mobile, otp }),
  });
}

export async function predictWaterDemandApi(
  token: string,
  payload: { crop: string; area_acres: number; soil_moisture_pct: number; temperature_c: number; rainfall_forecast_mm: number }
) {
  return apiFetch<{
    decision: string;
    water_requirement_litres: number;
    water_saved_litres: number;
    irrigation_duration_min: number;
    confidence_pct: number;
    reasoning: string;
    model: string;
  }>("/predict-water-demand", { method: "POST", body: JSON.stringify(payload) }, token);
}

export async function simulateDigitalTwinApi(
  token: string,
  payload: {
    crop: string; area_acres: number; soil_moisture_pct: number; temperature_c: number;
    rainfall_forecast_mm: number; groundwater_depth_m: number;
  }
) {
  return apiFetch<{ scenarios: any[]; best: any }>("/digital-twin", { method: "POST", body: JSON.stringify(payload) }, token);
}

export async function chatApi(token: string, message: string, language: string) {
  return apiFetch<{ reply: string; intent: string; language: string }>(
    "/chat",
    { method: "POST", body: JSON.stringify({ message, language }) },
    token
  );
}
