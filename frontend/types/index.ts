export type RiskLevel = "low" | "medium" | "high" | "critical";
export type Role = "farmer" | "admin";

export interface Farm {
  id: string;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  areaAcres: number;
  cropType: string;
  sowingDate: string;
  soilType: string;
  irrigationMethod: string;
  lat: number;
  lng: number;
  soilMoisture: number;
  riskLevel: RiskLevel;
  ndvi: number;
  ndwi: number;
  groundwaterDepthM: number;
  lastIrrigated: string;
}

export interface WeatherPoint {
  time: string;
  tempC: number;
  humidity: number;
  rainfallMm: number;
}

export interface AlertItem {
  id: string;
  category: "water" | "climate" | "groundwater" | "community";
  severity: RiskLevel;
  title: string;
  description: string;
  district: string;
  timestamp: string;
  read: boolean;
}

export interface ScenarioResult {
  id: string;
  name: string;
  waterLitres: number;
  costInr: number;
  energyKwh: number;
  groundwaterImpactPct: number;
  cropHealthScore: number;
  yieldPredictionPct: number;
  carbonKgCo2: number;
  rank: number;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}
