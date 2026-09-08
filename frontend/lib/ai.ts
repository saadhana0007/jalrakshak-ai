// Client-side mirror of the FastAPI /predict-* heuristics — keeps the demo
// fully interactive even when the backend isn't running.
import type { RiskLevel } from "@/types";

export interface WaterDemandInput {
  crop: string;
  areaAcres: number;
  soilMoisturePct: number;
  temperatureC: number;
  rainfallForecastMm: number;
}

export interface WaterDemandOutput {
  decision: "Irrigate Now" | "Delay Irrigation";
  waterRequirementLitres: number;
  waterSavedLitres: number;
  irrigationDurationMin: number;
  confidencePct: number;
  reasoning: string;
}

const CROP_WATER_FACTOR: Record<string, number> = {
  "Rice (Paddy)": 1.6, Sugarcane: 1.5, Cotton: 1.1, Wheat: 0.9, Maize: 1.0,
  Groundnut: 0.85, Soybean: 0.9, "Tur Dal": 0.8, Onion: 1.0, Tomato: 1.05,
  Bajra: 0.7, Chickpea: 0.75,
};

export function predictWaterDemand(i: WaterDemandInput): WaterDemandOutput {
  const factor = CROP_WATER_FACTOR[i.crop] ?? 1.0;
  const baseLitresPerAcre = 2200 * factor;
  const moistureDeficit = Math.max(0, 55 - i.soilMoisturePct) / 55;
  const heatStress = Math.max(0, i.temperatureC - 28) * 25;
  const rainOffset = i.rainfallForecastMm * 90;

  const rawRequirement = baseLitresPerAcre * i.areaAcres * moistureDeficit + heatStress * i.areaAcres;
  const netRequirement = Math.max(0, rawRequirement - rainOffset);

  const shouldDelay = i.rainfallForecastMm >= 8 && i.soilMoisturePct >= 25;
  const decision: WaterDemandOutput["decision"] = shouldDelay ? "Delay Irrigation" : "Irrigate Now";

  const waterSaved = shouldDelay ? Math.round(rawRequirement * 0.65 + i.rainfallForecastMm * 210) : Math.round(rawRequirement * 0.12);
  const confidence = Math.min(97, Math.round(60 + i.rainfallForecastMm * 1.3 + moistureDeficit * 15));
  const duration = Math.round((netRequirement / (i.areaAcres * 380)) * 60);

  const reasoning = shouldDelay
    ? `Soil moisture (${i.soilMoisturePct}%) is above the critical threshold and ${i.rainfallForecastMm}mm of rain is forecast — irrigating now would waste water and increase runoff risk.`
    : `Soil moisture (${i.soilMoisturePct}%) is below optimal levels for ${i.crop} and rainfall forecast (${i.rainfallForecastMm}mm) is insufficient to meet crop water demand at ${i.temperatureC}°C.`;

  return {
    decision,
    waterRequirementLitres: Math.round(netRequirement),
    waterSavedLitres: Math.max(0, waterSaved),
    irrigationDurationMin: Math.max(0, duration),
    confidencePct: confidence,
    reasoning,
  };
}

export interface ClimateRiskInput {
  rainfallDeficitPct: number;
  temperatureAnomalyC: number;
  ndvi: number;
  ndwi: number;
}

export interface ClimateRiskOutput {
  droughtRisk: number;
  heatwaveRisk: number;
  waterStressRisk: number;
  droughtLevel: RiskLevel;
  heatwaveLevel: RiskLevel;
  waterStressLevel: RiskLevel;
  confidencePct: number;
}

function toLevel(score: number): RiskLevel {
  if (score < 30) return "low";
  if (score < 60) return "medium";
  if (score < 85) return "high";
  return "critical";
}

export function predictClimateRisk(i: ClimateRiskInput): ClimateRiskOutput {
  const droughtRisk = Math.min(100, Math.round(i.rainfallDeficitPct * 0.9 + (1 - i.ndwi) * 40));
  const heatwaveRisk = Math.min(100, Math.round(i.temperatureAnomalyC * 14 + (1 - i.ndvi) * 25));
  const waterStressRisk = Math.min(100, Math.round((droughtRisk * 0.5 + heatwaveRisk * 0.3 + (1 - i.ndwi) * 40) ));

  return {
    droughtRisk,
    heatwaveRisk,
    waterStressRisk,
    droughtLevel: toLevel(droughtRisk),
    heatwaveLevel: toLevel(heatwaveRisk),
    waterStressLevel: toLevel(waterStressRisk),
    confidencePct: Math.min(97, Math.round(78 + i.ndvi * 10 + i.ndwi * 8)),
  };
}

export interface WaterStressInput {
  ndvi: number;
  ndwi: number;
  soilMoisturePct: number;
}
export interface WaterStressOutput {
  stressScore: number;
  category: RiskLevel;
}
export function detectWaterStress(i: WaterStressInput): WaterStressOutput {
  const score = Math.min(
    100,
    Math.max(0, Math.round((1 - i.ndvi) * 45 + (1 - i.ndwi) * 35 + (55 - i.soilMoisturePct) * 0.6))
  );
  return { stressScore: score, category: toLevel(score) };
}

// --------- Digital Twin scenario simulator ---------
export interface TwinInput {
  crop: string;
  areaAcres: number;
  soilMoisturePct: number;
  temperatureC: number;
  rainfallForecastMm: number;
  groundwaterDepthM: number;
}

export function simulateDigitalTwin(i: TwinInput) {
  const factor = CROP_WATER_FACTOR[i.crop] ?? 1.0;
  const baseLitres = 2200 * factor * i.areaAcres;
  const costPerKl = 38; // INR
  const energyPerKl = 1.8; // kWh (pumping)
  const carbonPerKwh = 0.82; // kg CO2

  function scenario(name: string, waterMultiplier: number, delayHours: number, waited: boolean) {
    // Rainfall offsets a fraction of demand rather than a flat litre amount,
    // so scenarios stay differentiated instead of collapsing to zero.
    const rainReductionFactor = Math.min(0.72, (i.rainfallForecastMm / 40) * (waited ? 1 : 0.35));
    const water = Math.max(baseLitres * 0.08, baseLitres * waterMultiplier * (1 - rainReductionFactor));
    const kilolitres = water / 1000;
    const cost = Math.round(kilolitres * costPerKl);
    const energy = Math.round(kilolitres * energyPerKl * 10) / 10;
    const carbon = Math.round(energy * carbonPerKwh * 10) / 10;
    const groundwaterImpact = Math.round((water / (i.areaAcres * 3000)) * 100 * (delayHours === 0 ? 1 : 0.7));
    const moistureAfter = Math.min(70, i.soilMoisturePct + (water / (i.areaAcres * 60)) - delayHours * 0.4);
    const cropHealth = Math.max(35, Math.min(98, 70 + (moistureAfter - 40) * 0.9 - (delayHours > 24 ? 8 : 0)));
    const yieldPrediction = Math.max(50, Math.min(102, 82 + (cropHealth - 70) * 0.6));

    return {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      waterLitres: Math.round(water),
      costInr: cost,
      energyKwh: energy,
      groundwaterImpactPct: Math.max(0, groundwaterImpact),
      cropHealthScore: Math.round(cropHealth),
      yieldPredictionPct: Math.round(yieldPrediction),
      carbonKgCo2: carbon,
    };
  }

  const scenarios = [
    scenario("Irrigate Now", 1.0, 0, false),
    scenario("Delay 12 Hours", 0.85, 12, true),
    scenario("Wait For Rain", 0.55, 24, true),
    scenario("Reduce Water By 30%", 0.7, 0, false),
  ];

  // Score = weighted sustainability index (lower water/cost/energy/carbon + higher health/yield is better)
  const scored = scenarios.map((s) => {
    const sustainability =
      (100 - s.groundwaterImpactPct) * 0.3 +
      s.cropHealthScore * 0.3 +
      s.yieldPredictionPct * 0.25 +
      (100 - Math.min(100, s.carbonKgCo2 * 3)) * 0.15;
    return { ...s, sustainability: Math.round(sustainability * 10) / 10 };
  });

  const ranked = [...scored].sort((a, b) => b.sustainability - a.sustainability).map((s, idx) => ({ ...s, rank: idx + 1 }));
  const best = ranked[0];

  return { scenarios: ranked, best };
}
