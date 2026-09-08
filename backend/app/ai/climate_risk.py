"""Climate Risk Predictor — drought, heatwave, and water-stress risk scores
from rainfall deficit, temperature anomaly, and satellite vegetation/water
indices (NDVI/NDWI). Transparent weighted-index model; swap in a trained
XGBoost/RandomForest classifier for production without changing the
interface.
"""


def _to_level(score: float) -> str:
    if score < 30:
        return "low"
    if score < 60:
        return "medium"
    if score < 85:
        return "high"
    return "critical"


def predict_climate_risk(rainfall_deficit_pct: float, temperature_anomaly_c: float,
                          ndvi: float, ndwi: float) -> dict:
    drought_risk = min(100, round(rainfall_deficit_pct * 0.9 + (1 - ndwi) * 40))
    heatwave_risk = min(100, round(temperature_anomaly_c * 14 + (1 - ndvi) * 25))
    water_stress_risk = min(100, round(drought_risk * 0.5 + heatwave_risk * 0.3 + (1 - ndwi) * 40))
    confidence = min(97, round(78 + ndvi * 10 + ndwi * 8))

    return {
        "drought_risk": drought_risk,
        "heatwave_risk": heatwave_risk,
        "water_stress_risk": water_stress_risk,
        "drought_level": _to_level(drought_risk),
        "heatwave_level": _to_level(heatwave_risk),
        "water_stress_level": _to_level(water_stress_risk),
        "confidence_pct": confidence,
    }
