"""Water Stress Detector — combines NDVI, NDWI and soil moisture into a
single 0-100 stress score and risk category."""


def _to_level(score: float) -> str:
    if score < 30:
        return "low"
    if score < 60:
        return "medium"
    if score < 85:
        return "high"
    return "critical"


def detect_water_stress(ndvi: float, ndwi: float, soil_moisture_pct: float) -> dict:
    score = min(100, max(0, round((1 - ndvi) * 45 + (1 - ndwi) * 35 + (55 - soil_moisture_pct) * 0.6)))
    return {"stress_score": score, "category": _to_level(score)}
