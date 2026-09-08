"""Farm Water Digital Twin — simulates four irrigation-decision scenarios and
ranks them by a composite sustainability index (groundwater impact, crop
health, yield prediction, carbon impact)."""
from .water_demand import CROP_WATER_FACTOR


def simulate(crop: str, area_acres: float, soil_moisture_pct: float, temperature_c: float,
             rainfall_forecast_mm: float, groundwater_depth_m: float) -> dict:
    factor = CROP_WATER_FACTOR.get(crop, 1.0)
    base_litres = 2200 * factor * area_acres
    cost_per_kl = 38
    energy_per_kl = 1.8
    carbon_per_kwh = 0.82

    def scenario(name: str, water_multiplier: float, delay_hours: float, waited: bool) -> dict:
        rain_reduction_factor = min(0.72, (rainfall_forecast_mm / 40) * (1.0 if waited else 0.35))
        water = max(base_litres * 0.08, base_litres * water_multiplier * (1 - rain_reduction_factor))
        kilolitres = water / 1000
        cost = round(kilolitres * cost_per_kl)
        energy = round(kilolitres * energy_per_kl, 1)
        carbon = round(energy * carbon_per_kwh, 1)
        groundwater_impact = max(0, round((water / (area_acres * 3000)) * 100 * (1 if delay_hours == 0 else 0.7)))
        moisture_after = min(70, soil_moisture_pct + (water / (area_acres * 60)) - delay_hours * 0.4)
        crop_health = max(35, min(98, 70 + (moisture_after - 40) * 0.9 - (8 if delay_hours > 24 else 0)))
        yield_prediction = max(50, min(102, 82 + (crop_health - 70) * 0.6))

        return {
            "id": name.lower().replace(" ", "-"),
            "name": name,
            "water_litres": round(water),
            "cost_inr": cost,
            "energy_kwh": energy,
            "groundwater_impact_pct": groundwater_impact,
            "crop_health_score": round(crop_health),
            "yield_prediction_pct": round(yield_prediction),
            "carbon_kg_co2": carbon,
        }

    scenarios = [
        scenario("Irrigate Now", 1.0, 0, False),
        scenario("Delay 12 Hours", 0.85, 12, True),
        scenario("Wait For Rain", 0.55, 24, True),
        scenario("Reduce Water By 30%", 0.7, 0, False),
    ]

    scored = []
    for s in scenarios:
        sustainability = (
            (100 - s["groundwater_impact_pct"]) * 0.3
            + s["crop_health_score"] * 0.3
            + s["yield_prediction_pct"] * 0.25
            + (100 - min(100, s["carbon_kg_co2"] * 3)) * 0.15
        )
        scored.append({**s, "sustainability": round(sustainability, 1)})

    ranked = sorted(scored, key=lambda s: s["sustainability"], reverse=True)
    for idx, s in enumerate(ranked):
        s["rank"] = idx + 1

    return {"scenarios": ranked, "best": ranked[0]}
