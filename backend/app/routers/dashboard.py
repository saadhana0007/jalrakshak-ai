from fastapi import APIRouter, Depends, Query

from ..auth import require_role
from ..mock_data import ALERTS, get_farm, weather_trend

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard")
def get_dashboard(farm_id: str = Query("FARM-001"), user: dict = Depends(require_role("farmer", "admin"))):
    farm = get_farm(farm_id)
    weather = weather_trend(6)
    return {
        "farm": farm,
        "current_weather": weather[-1],
        "recommendation": {
            "decision": "Delay Irrigation",
            "expected_rain_mm": 21,
            "expected_rain_hours": 14,
            "water_saved_litres": 14200,
            "confidence_pct": 92,
        },
        "climate_risk_score": {"low": 24, "medium": 52, "high": 74, "critical": 91}[farm["risk_level"]],
        "recent_alerts": ALERTS[:5],
    }
