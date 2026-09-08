"""Water Demand Predictor.

A small RandomForestRegressor trained on synthetically generated agronomic
samples estimates baseline litres/acre demand from (crop factor, soil
moisture, temperature, rainfall forecast). The irrigate-now / delay decision
and reasoning summary are then derived with transparent rule-based logic on
top of the model's output, so the recommendation stays explainable — a
common pattern for decision-support tools like this one.
"""
import numpy as np
from sklearn.ensemble import RandomForestRegressor

CROP_WATER_FACTOR = {
    "Rice (Paddy)": 1.6, "Sugarcane": 1.5, "Cotton": 1.1, "Wheat": 0.9, "Maize": 1.0,
    "Groundnut": 0.85, "Soybean": 0.9, "Tur Dal": 0.8, "Onion": 1.0, "Tomato": 1.05,
    "Bajra": 0.7, "Chickpea": 0.75,
}


def _make_training_data(n=1200, seed=42):
    rng = np.random.default_rng(seed)
    crop_factor = rng.uniform(0.7, 1.6, n)
    soil_moisture = rng.uniform(5, 65, n)
    temperature = rng.uniform(15, 45, n)
    rainfall = rng.uniform(0, 50, n)

    moisture_deficit = np.clip(55 - soil_moisture, 0, None) / 55
    heat_stress = np.clip(temperature - 28, 0, None) * 25
    rain_offset = rainfall * 90
    base = 2200 * crop_factor
    demand = np.clip(base * moisture_deficit + heat_stress - rain_offset, 0, None)
    noise = rng.normal(0, 40, n)
    demand = np.clip(demand + noise, 0, None)

    X = np.column_stack([crop_factor, soil_moisture, temperature, rainfall])
    return X, demand


_X_train, _y_train = _make_training_data()
_model = RandomForestRegressor(n_estimators=80, max_depth=8, random_state=42)
_model.fit(_X_train, _y_train)


def predict_water_demand(crop: str, area_acres: float, soil_moisture_pct: float,
                          temperature_c: float, rainfall_forecast_mm: float) -> dict:
    factor = CROP_WATER_FACTOR.get(crop, 1.0)
    per_acre_demand = float(_model.predict([[factor, soil_moisture_pct, temperature_c, rainfall_forecast_mm]])[0])
    net_requirement = max(0.0, per_acre_demand * area_acres)

    should_delay = rainfall_forecast_mm >= 8 and soil_moisture_pct >= 25
    decision = "Delay Irrigation" if should_delay else "Irrigate Now"

    raw_requirement = 2200 * factor * area_acres * max(0, 55 - soil_moisture_pct) / 55
    water_saved = round(raw_requirement * 0.65 + rainfall_forecast_mm * 210) if should_delay else round(raw_requirement * 0.12)
    confidence = min(97, round(60 + rainfall_forecast_mm * 1.3 + (max(0, 55 - soil_moisture_pct) / 55) * 15))
    duration_min = round((net_requirement / max(1, area_acres * 380)) * 60)

    if should_delay:
        reasoning = (
            f"Soil moisture ({soil_moisture_pct}%) is above the critical threshold and "
            f"{rainfall_forecast_mm}mm of rain is forecast — irrigating now would waste water "
            f"and increase runoff risk."
        )
    else:
        reasoning = (
            f"Soil moisture ({soil_moisture_pct}%) is below optimal levels for {crop} and "
            f"rainfall forecast ({rainfall_forecast_mm}mm) is insufficient to meet crop water "
            f"demand at {temperature_c}°C."
        )

    return {
        "decision": decision,
        "water_requirement_litres": round(net_requirement),
        "water_saved_litres": max(0, water_saved),
        "irrigation_duration_min": max(0, duration_min),
        "confidence_pct": confidence,
        "reasoning": reasoning,
        "model": "RandomForestRegressor(n_estimators=80) trained on synthetic agronomic samples",
    }
