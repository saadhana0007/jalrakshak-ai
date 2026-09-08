"""In-memory mock dataset for the JalRakshak AI backend.

Mirrors the structure of the PostgreSQL schema in database/schema.sql and the
frontend's lib/mock-data.ts, so the demo runs end-to-end without requiring a
live Postgres instance.
"""
import random
from datetime import datetime, timedelta

_rng = random.Random(42)

DISTRICTS = [
    {"name": "Nashik", "state": "Maharashtra", "lat": 20.0059, "lng": 73.7897},
    {"name": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567},
    {"name": "Solapur", "state": "Maharashtra", "lat": 17.6599, "lng": 75.9064},
    {"name": "Ahmednagar", "state": "Maharashtra", "lat": 19.0952, "lng": 74.7496},
    {"name": "Coimbatore", "state": "Tamil Nadu", "lat": 11.0168, "lng": 76.9558},
    {"name": "Madurai", "state": "Tamil Nadu", "lat": 9.9252, "lng": 78.1198},
    {"name": "Belagavi", "state": "Karnataka", "lat": 15.8497, "lng": 74.4977},
    {"name": "Kalaburagi", "state": "Karnataka", "lat": 17.3297, "lng": 76.8343},
    {"name": "Ludhiana", "state": "Punjab", "lat": 30.9010, "lng": 75.8573},
    {"name": "Bathinda", "state": "Punjab", "lat": 30.2110, "lng": 74.9455},
    {"name": "Jodhpur", "state": "Rajasthan", "lat": 26.2389, "lng": 73.0243},
    {"name": "Anantapur", "state": "Andhra Pradesh", "lat": 14.6819, "lng": 77.6006},
]

CROPS = [
    "Wheat", "Rice (Paddy)", "Cotton", "Sugarcane", "Maize", "Groundnut",
    "Soybean", "Tur Dal", "Onion", "Tomato", "Bajra", "Chickpea",
]
SOIL_TYPES = ["Black Soil (Regur)", "Red Soil", "Alluvial Soil", "Sandy Loam", "Clay Loam", "Laterite Soil"]
IRRIGATION_METHODS = ["Drip Irrigation", "Sprinkler Irrigation", "Flood Irrigation", "Furrow Irrigation"]
FARMER_NAMES = [
    "Ramesh Patil", "Suresh Deshmukh", "Anita Jadhav", "Vikram Chavan", "Lakshmi Reddy",
    "Manoj Kumar", "Sunita Yadav", "Rajesh Gowda", "Priya Nair", "Arjun Singh",
    "Kavita Sharma", "Deepak Rao", "Meena Kumari", "Santosh More", "Geeta Patel",
    "Ashok Naik", "Pooja Iyer", "Ravi Verma", "Sneha Kulkarni", "Mahesh Pawar",
]


def _risk_from_score(score: float) -> str:
    if score < 30:
        return "low"
    if score < 60:
        return "medium"
    if score < 85:
        return "high"
    return "critical"


def _generate_farms(n=50):
    farms = []
    for i in range(n):
        d = _rng.choice(DISTRICTS)
        stress_score = _rng.uniform(5, 95)
        soil_moisture = max(8, 55 - stress_score * 0.4 + _rng.uniform(-5, 5))
        farms.append({
            "id": f"FARM-{i + 1:03d}",
            "farmer_name": _rng.choice(FARMER_NAMES),
            "village": f"{d['name']} Village {(i % 7) + 1}",
            "district": d["name"],
            "state": d["state"],
            "area_acres": round(_rng.uniform(1, 18), 1),
            "crop_type": _rng.choice(CROPS),
            "sowing_date": f"2026-{_rng.choice([5, 6, 7, 8]):02d}-{_rng.randint(1, 27):02d}",
            "soil_type": _rng.choice(SOIL_TYPES),
            "irrigation_method": _rng.choice(IRRIGATION_METHODS),
            "lat": round(d["lat"] + _rng.uniform(-0.35, 0.35), 4),
            "lng": round(d["lng"] + _rng.uniform(-0.35, 0.35), 4),
            "soil_moisture": round(soil_moisture),
            "risk_level": _risk_from_score(stress_score),
            "ndvi": round(0.75 - stress_score / 300, 2),
            "ndwi": round(0.4 - stress_score / 400, 2),
            "groundwater_depth_m": round(_rng.uniform(8, 62), 1),
            "last_irrigated_hours_ago": round(_rng.uniform(1, 96)),
        })
    return farms


FARMS = _generate_farms(50)


def get_farm(farm_id: str):
    return next((f for f in FARMS if f["id"] == farm_id), FARMS[0])


ALERTS = [
    {
        "id": "ALT-001", "category": "water", "severity": "high",
        "title": "Delay irrigation — rain expected",
        "description": "21mm rainfall expected within 14 hours. Delaying irrigation can save ~14,200 litres.",
        "district": "Nashik", "timestamp": "12 min ago", "read": False,
    },
    {
        "id": "ALT-002", "category": "community", "severity": "critical",
        "title": "Regional water-stress cluster detected",
        "description": "14 farms within 5km showing abnormal moisture decline. Rainfall deficit 37%, temperature anomaly +3.2°C.",
        "district": "Solapur", "timestamp": "38 min ago", "read": False,
    },
    {
        "id": "ALT-003", "category": "groundwater", "severity": "medium",
        "title": "Groundwater depletion trend",
        "description": "Water table dropped 2.1m over the last 30 days in Ahmednagar block.",
        "district": "Ahmednagar", "timestamp": "1h ago", "read": True,
    },
    {
        "id": "ALT-004", "category": "climate", "severity": "high",
        "title": "Heatwave risk rising",
        "description": "Temperature anomaly of +4.1°C predicted over the next 72 hours.",
        "district": "Jodhpur", "timestamp": "2h ago", "read": False,
    },
    {
        "id": "ALT-005", "category": "water", "severity": "low",
        "title": "Optimal soil moisture maintained",
        "description": "Farm FARM-014 is within optimal moisture range. No action needed.",
        "district": "Pune", "timestamp": "3h ago", "read": True,
    },
    {
        "id": "ALT-006", "category": "climate", "severity": "critical",
        "title": "Drought risk escalated to Critical",
        "description": "30-day forecast shows sustained rainfall deficit of 45% across Kalaburagi district.",
        "district": "Kalaburagi", "timestamp": "5h ago", "read": False,
    },
    {
        "id": "ALT-007", "category": "community", "severity": "medium",
        "title": "Cluster moisture anomaly — Coimbatore belt",
        "description": "9 farms reporting NDWI decline greater than 0.15 over 10 days.",
        "district": "Coimbatore", "timestamp": "7h ago", "read": True,
    },
]


def district_risk_summary():
    out = []
    for d in DISTRICTS:
        farms = [f for f in FARMS if f["district"] == d["name"]]
        avg_moisture = round(sum(f["soil_moisture"] for f in farms) / len(farms)) if farms else 0
        high_risk = len([f for f in farms if f["risk_level"] in ("high", "critical")])
        stress_pct = round((high_risk / len(farms)) * 100) if farms else 0
        out.append({
            **d,
            "farm_count": len(farms),
            "avg_moisture": avg_moisture,
            "high_risk": high_risk,
            "stress_pct": stress_pct,
            "risk_level": _risk_from_score(stress_pct + _rng.uniform(0, 20)),
        })
    return out


def community_alert_for(district: str):
    farms = [f for f in FARMS if f["district"] == district]
    high_risk = len([f for f in farms if f["risk_level"] in ("high", "critical")])
    seed_r = random.Random(len(district) * 31)
    seed_t = random.Random(len(district) * 53)
    return {
        "district": district,
        "farms_monitored": len(farms),
        "high_risk_farms": high_risk,
        "rainfall_deficit_pct": round(seed_r.uniform(5, 48)),
        "temp_anomaly_c": round(seed_t.uniform(5, 42) / 10, 1),
    }


def weather_trend(hours=24):
    r = random.Random(7)
    import math
    return [
        {
            "time": f"{h:02d}:00",
            "temp_c": round(26 + math.sin(h / 3) * 5 + r.uniform(-1, 1), 1),
            "humidity": round(55 + math.cos(h / 4) * 15 + r.uniform(-3, 3)),
            "rainfall_mm": max(0, round(r.uniform(-2, 6), 1)),
        }
        for h in range(hours)
    ]


def satellite_geojson(farm_id: str):
    farm = get_farm(farm_id)
    r = random.Random(hash(farm_id) % 10000)
    features = []
    for i in range(6):
        features.append({
            "type": "Feature",
            "properties": {
                "plot": f"{farm_id}-P{i + 1}",
                "ndvi": round(r.uniform(0.2, 0.85), 2),
                "ndwi": round(r.uniform(0.05, 0.55), 2),
            },
            "geometry": {
                "type": "Point",
                "coordinates": [farm["lng"] + r.uniform(-0.01, 0.01), farm["lat"] + r.uniform(-0.01, 0.01)],
            },
        })
    return {"type": "FeatureCollection", "features": features}


NOW = datetime.utcnow()
