import { mulberry32, seededPick, seededRange } from "./seeded-random";
import type { Farm, WeatherPoint, AlertItem, RiskLevel } from "@/types";

const rng = mulberry32(42);

export const DISTRICTS: { name: string; state: string; lat: number; lng: number }[] = [
  { name: "Nashik", state: "Maharashtra", lat: 20.0059, lng: 73.7897 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Solapur", state: "Maharashtra", lat: 17.6599, lng: 75.9064 },
  { name: "Ahmednagar", state: "Maharashtra", lat: 19.0952, lng: 74.7496 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lng: 78.1198 },
  { name: "Belagavi", state: "Karnataka", lat: 15.8497, lng: 74.4977 },
  { name: "Kalaburagi", state: "Karnataka", lat: 17.3297, lng: 76.8343 },
  { name: "Ludhiana", state: "Punjab", lat: 30.9010, lng: 75.8573 },
  { name: "Bathinda", state: "Punjab", lat: 30.2110, lng: 74.9455 },
  { name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243 },
  { name: "Anantapur", state: "Andhra Pradesh", lat: 14.6819, lng: 77.6006 },
];

export const CROPS = [
  "Wheat", "Rice (Paddy)", "Cotton", "Sugarcane", "Maize", "Groundnut",
  "Soybean", "Tur Dal", "Onion", "Tomato", "Bajra", "Chickpea",
];

export const SOIL_TYPES = ["Black Soil (Regur)", "Red Soil", "Alluvial Soil", "Sandy Loam", "Clay Loam", "Laterite Soil"];
export const IRRIGATION_METHODS = ["Drip Irrigation", "Sprinkler Irrigation", "Flood Irrigation", "Furrow Irrigation"];
const FARMER_NAMES = [
  "Ramesh Patil", "Suresh Deshmukh", "Anita Jadhav", "Vikram Chavan", "Lakshmi Reddy",
  "Manoj Kumar", "Sunita Yadav", "Rajesh Gowda", "Priya Nair", "Arjun Singh",
  "Kavita Sharma", "Deepak Rao", "Meena Kumari", "Santosh More", "Geeta Patel",
  "Ashok Naik", "Pooja Iyer", "Ravi Verma", "Sneha Kulkarni", "Mahesh Pawar",
];

function riskFromScore(score: number): RiskLevel {
  if (score < 30) return "low";
  if (score < 60) return "medium";
  if (score < 85) return "high";
  return "critical";
}

export const FARMS: Farm[] = Array.from({ length: 50 }).map((_, i) => {
  const district = seededPick(rng, DISTRICTS);
  const stressScore = seededRange(rng, 5, 95);
  const soilMoisture = Math.max(8, 55 - stressScore * 0.4 + seededRange(rng, -5, 5));
  return {
    id: `FARM-${String(i + 1).padStart(3, "0")}`,
    farmerName: seededPick(rng, FARMER_NAMES),
    village: `${district.name} Village ${((i % 7) + 1)}`,
    district: district.name,
    state: district.state,
    areaAcres: Math.round(seededRange(rng, 1, 18) * 10) / 10,
    cropType: seededPick(rng, CROPS),
    sowingDate: `2026-${String(seededPick(rng, [5, 6, 7, 8])).padStart(2, "0")}-${String(Math.ceil(rng() * 27)).padStart(2, "0")}`,
    soilType: seededPick(rng, SOIL_TYPES),
    irrigationMethod: seededPick(rng, IRRIGATION_METHODS),
    lat: district.lat + seededRange(rng, -0.35, 0.35),
    lng: district.lng + seededRange(rng, -0.35, 0.35),
    soilMoisture: Math.round(soilMoisture),
    riskLevel: riskFromScore(stressScore),
    ndvi: Math.round((0.75 - stressScore / 300) * 100) / 100,
    ndwi: Math.round((0.4 - stressScore / 400) * 100) / 100,
    groundwaterDepthM: Math.round(seededRange(rng, 8, 62) * 10) / 10,
    lastIrrigated: `${Math.ceil(seededRange(rng, 1, 96))}h ago`,
  };
});

export function getFarmById(id: string) {
  return FARMS.find((f) => f.id === id) ?? FARMS[0];
}

// ---------------- Weather ----------------
export function generateWeatherTrend(hours = 24): WeatherPoint[] {
  const r = mulberry32(7);
  return Array.from({ length: hours }).map((_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    tempC: Math.round((26 + Math.sin(i / 3) * 5 + seededRange(r, -1, 1)) * 10) / 10,
    humidity: Math.round(55 + Math.cos(i / 4) * 15 + seededRange(r, -3, 3)),
    rainfallMm: Math.max(0, Math.round(seededRange(r, -2, 6) * 10) / 10),
  }));
}

export function generateSoilMoistureTrend(days = 14) {
  const r = mulberry32(11);
  let val = 42;
  return Array.from({ length: days }).map((_, i) => {
    val = Math.max(10, Math.min(70, val + seededRange(r, -4, 3)));
    return { day: `Day ${i + 1}`, moisture: Math.round(val) };
  });
}

export function generateRainfallForecast(days = 7) {
  const r = mulberry32(13);
  return Array.from({ length: days }).map((_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
    forecastMm: Math.round(seededRange(r, 0, 32)),
    probability: Math.round(seededRange(r, 10, 95)),
  }));
}

export function generateCropHealthTrend(weeks = 10) {
  const r = mulberry32(17);
  let val = 68;
  return Array.from({ length: weeks }).map((_, i) => {
    val = Math.max(40, Math.min(96, val + seededRange(r, -3, 4)));
    return { week: `W${i + 1}`, health: Math.round(val) };
  });
}

export function generateWaterUsageTrend(weeks = 10) {
  const r = mulberry32(19);
  return Array.from({ length: weeks }).map((_, i) => ({
    week: `W${i + 1}`,
    used: Math.round(seededRange(r, 1200, 4200)),
    recommended: Math.round(seededRange(r, 1000, 3400)),
  }));
}

// ---------------- Alerts ----------------
export const ALERTS: AlertItem[] = [
  {
    id: "ALT-001",
    category: "water",
    severity: "high",
    title: "Delay irrigation — rain expected",
    description: "21mm rainfall expected within 14 hours. Delaying irrigation can save ~14,200 litres.",
    district: "Nashik",
    timestamp: "12 min ago",
    read: false,
  },
  {
    id: "ALT-002",
    category: "community",
    severity: "critical",
    title: "Regional water-stress cluster detected",
    description: "14 farms within 5km showing abnormal moisture decline. Rainfall deficit 37%, temperature anomaly +3.2°C.",
    district: "Solapur",
    timestamp: "38 min ago",
    read: false,
  },
  {
    id: "ALT-003",
    category: "groundwater",
    severity: "medium",
    title: "Groundwater depletion trend",
    description: "Water table dropped 2.1m over the last 30 days in Ahmednagar block.",
    district: "Ahmednagar",
    timestamp: "1h ago",
    read: true,
  },
  {
    id: "ALT-004",
    category: "climate",
    severity: "high",
    title: "Heatwave risk rising",
    description: "Temperature anomaly of +4.1°C predicted over the next 72 hours.",
    district: "Jodhpur",
    timestamp: "2h ago",
    read: false,
  },
  {
    id: "ALT-005",
    category: "water",
    severity: "low",
    title: "Optimal soil moisture maintained",
    description: "Farm FARM-014 is within optimal moisture range. No action needed.",
    district: "Pune",
    timestamp: "3h ago",
    read: true,
  },
  {
    id: "ALT-006",
    category: "climate",
    severity: "critical",
    title: "Drought risk escalated to Critical",
    description: "30-day forecast shows sustained rainfall deficit of 45% across Kalaburagi district.",
    district: "Kalaburagi",
    timestamp: "5h ago",
    read: false,
  },
  {
    id: "ALT-007",
    category: "community",
    severity: "medium",
    title: "Cluster moisture anomaly — Coimbatore belt",
    description: "9 farms reporting NDWI decline greater than 0.15 over 10 days.",
    district: "Coimbatore",
    timestamp: "7h ago",
    read: true,
  },
];

export function communityAlertFor(district: string) {
  const farms = FARMS.filter((f) => f.district === district);
  const highRisk = farms.filter((f) => f.riskLevel === "high" || f.riskLevel === "critical").length;
  return {
    district,
    farmsMonitored: farms.length,
    highRiskFarms: highRisk,
    rainfallDeficitPct: Math.round(seededRange(mulberry32(district.length * 31), 5, 48)),
    tempAnomalyC: Math.round(seededRange(mulberry32(district.length * 53), 5, 42)) / 10,
  };
}

export const districtRiskSummary = DISTRICTS.map((d) => {
  const farms = FARMS.filter((f) => f.district === d.name);
  const avgMoisture = farms.length
    ? Math.round(farms.reduce((s, f) => s + f.soilMoisture, 0) / farms.length)
    : 0;
  const highRisk = farms.filter((f) => f.riskLevel === "high" || f.riskLevel === "critical").length;
  const stressPct = farms.length ? Math.round((highRisk / farms.length) * 100) : 0;
  return {
    ...d,
    farmCount: farms.length,
    avgMoisture,
    highRisk,
    stressPct,
    riskLevel: riskFromScore(stressPct + seededRange(mulberry32(d.name.length * 7), 0, 20)) as RiskLevel,
  };
});
