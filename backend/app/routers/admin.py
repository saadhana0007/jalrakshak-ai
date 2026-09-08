from fastapi import APIRouter, Depends

from ..auth import require_role
from ..mock_data import ALERTS, DISTRICTS, FARMS, district_risk_summary

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/analytics")
def get_admin_analytics(user: dict = Depends(require_role("admin"))):
    summary = district_risk_summary()
    risk_counts = {level: len([f for f in FARMS if f["risk_level"] == level]) for level in ("low", "medium", "high", "critical")}
    return {
        "total_farmers": 12480,
        "active_farms": len(FARMS) * 96,
        "districts_covered": len(DISTRICTS),
        "water_saved_30d_litres": 84000000,
        "groundwater_status_pct": 62,
        "active_climate_alerts": len([a for a in ALERTS if a["category"] == "climate" and not a["read"]]),
        "risk_distribution": risk_counts,
        "district_summary": summary,
        "alerts": ALERTS,
    }
