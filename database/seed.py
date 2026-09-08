"""Generates database/seed.sql — realistic sample data for JalRakshak AI:
50 farms, weather records, groundwater levels, satellite observations,
risk predictions, community alerts and digital-twin results — matching
schema.sql. Run with: python seed.py
"""
import os
import sys
import uuid

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app import mock_data  # noqa: E402
from app.ai.climate_risk import predict_climate_risk  # noqa: E402
from app.ai.digital_twin import simulate as simulate_twin  # noqa: E402


def esc(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"


def main():
    lines = ["-- Auto-generated sample data for JalRakshak AI. Run after schema.sql.\n"]

    farmer_ids = {}
    farm_ids = {}

    lines.append("-- Farmers\n")
    seen_farmers = set()
    for f in mock_data.FARMS:
        key = (f["farmer_name"], f["village"])
        if key in seen_farmers:
            continue
        seen_farmers.add(key)
        fid = str(uuid.uuid4())
        farmer_ids[key] = fid
        mobile = f"9{abs(hash(key)) % 900000000 + 100000000}"[:10]
        lines.append(
            f"INSERT INTO farmers (id, full_name, mobile_number, village, district, state) VALUES "
            f"({esc(fid)}, {esc(f['farmer_name'])}, {esc(mobile)}, {esc(f['village'])}, {esc(f['district'])}, {esc(f['state'])});\n"
        )

    lines.append("\n-- Farms\n")
    for f in mock_data.FARMS:
        key = (f["farmer_name"], f["village"])
        farm_uuid = str(uuid.uuid4())
        farm_ids[f["id"]] = farm_uuid
        lines.append(
            "INSERT INTO farms (id, farm_code, farmer_id, village, district, state, area_acres, crop_type, "
            "sowing_date, soil_type, irrigation_method, latitude, longitude) VALUES ("
            f"{esc(farm_uuid)}, {esc(f['id'])}, {esc(farmer_ids[key])}, {esc(f['village'])}, {esc(f['district'])}, "
            f"{esc(f['state'])}, {f['area_acres']}, {esc(f['crop_type'])}, {esc(f['sowing_date'])}, "
            f"{esc(f['soil_type'])}, {esc(f['irrigation_method'])}, {f['lat']}, {f['lng']});\n"
        )

    lines.append("\n-- Soil data (latest reading per farm)\n")
    for f in mock_data.FARMS:
        lines.append(
            "INSERT INTO soil_data (farm_id, soil_moisture_pct, soil_temperature_c, ph_level) VALUES ("
            f"{esc(farm_ids[f['id']])}, {f['soil_moisture']}, 27.5, 6.8);\n"
        )

    lines.append("\n-- Weather data (24h trend per district)\n")
    for d in mock_data.DISTRICTS:
        for w in mock_data.weather_trend(6):
            lines.append(
                "INSERT INTO weather_data (district, temperature_c, humidity_pct, rainfall_mm) VALUES ("
                f"{esc(d['name'])}, {w['temp_c']}, {w['humidity']}, {w['rainfall_mm']});\n"
            )

    lines.append("\n-- Groundwater data\n")
    for f in mock_data.FARMS:
        status = "critical" if f["groundwater_depth_m"] > 45 else ("declining" if f["groundwater_depth_m"] > 25 else "stable")
        lines.append(
            "INSERT INTO groundwater_data (district, farm_id, water_table_depth_m, recharge_status) VALUES ("
            f"{esc(f['district'])}, {esc(farm_ids[f['id']])}, {f['groundwater_depth_m']}, {esc(status)});\n"
        )

    lines.append("\n-- Satellite data\n")
    for f in mock_data.FARMS:
        lines.append(
            "INSERT INTO satellite_data (farm_id, ndvi, ndwi, vegetation_health_pct, cloud_cover_pct) VALUES ("
            f"{esc(farm_ids[f['id']])}, {f['ndvi']}, {f['ndwi']}, {round(f['ndvi'] * 100, 1)}, 12.0);\n"
        )

    lines.append("\n-- Risk predictions\n")
    for f in mock_data.FARMS:
        risk = predict_climate_risk(
            rainfall_deficit_pct=30, temperature_anomaly_c=2.5, ndvi=f["ndvi"], ndwi=f["ndwi"]
        )
        lines.append(
            "INSERT INTO risk_predictions (farm_id, forecast_horizon_days, drought_risk_score, heatwave_risk_score, "
            "water_stress_score, drought_level, heatwave_level, water_stress_level, confidence_pct) VALUES ("
            f"{esc(farm_ids[f['id']])}, 7, {risk['drought_risk']}, {risk['heatwave_risk']}, {risk['water_stress_risk']}, "
            f"{esc(risk['drought_level'])}, {esc(risk['heatwave_level'])}, {esc(risk['water_stress_level'])}, {risk['confidence_pct']});\n"
        )

    lines.append("\n-- Digital twin results (sample: first 10 farms)\n")
    for f in mock_data.FARMS[:10]:
        result = simulate_twin(
            crop=f["crop_type"], area_acres=f["area_acres"], soil_moisture_pct=f["soil_moisture"],
            temperature_c=31, rainfall_forecast_mm=21, groundwater_depth_m=f["groundwater_depth_m"],
        )
        for s in result["scenarios"]:
            lines.append(
                "INSERT INTO digital_twin_results (farm_id, scenario_name, water_litres, cost_inr, energy_kwh, "
                "groundwater_impact_pct, crop_health_score, yield_prediction_pct, carbon_kg_co2, sustainability_score, "
                "rank, is_recommended) VALUES ("
                f"{esc(farm_ids[f['id']])}, {esc(s['name'])}, {s['water_litres']}, {s['cost_inr']}, {s['energy_kwh']}, "
                f"{s['groundwater_impact_pct']}, {s['crop_health_score']}, {s['yield_prediction_pct']}, {s['carbon_kg_co2']}, "
                f"{s['sustainability']}, {s['rank']}, {'TRUE' if s['rank'] == 1 else 'FALSE'});\n"
            )

    lines.append("\n-- Community alerts\n")
    for a in mock_data.ALERTS:
        lines.append(
            "INSERT INTO community_alerts (category, severity, title, description, district, is_read) VALUES ("
            f"{esc(a['category'])}, {esc(a['severity'])}, {esc(a['title'])}, {esc(a['description'])}, "
            f"{esc(a['district'])}, {'TRUE' if a['read'] else 'FALSE'});\n"
        )

    out_path = os.path.join(os.path.dirname(__file__), "seed.sql")
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.writelines(lines)
    print(f"Wrote {out_path} ({len(lines)} statements)")


if __name__ == "__main__":
    main()
