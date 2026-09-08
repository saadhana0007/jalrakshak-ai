from fastapi import APIRouter, Depends

from ..auth import require_role
from ..mock_data import ALERTS, FARMS, community_alert_for, district_risk_summary

router = APIRouter(tags=["community"])


@router.get("/community-alerts")
def get_community_alerts(user: dict = Depends(require_role("farmer", "admin"))):
    summary = district_risk_summary()
    high_risk_districts = [d for d in summary if d["risk_level"] in ("high", "critical")]
    clusters = [community_alert_for(d["name"]) for d in high_risk_districts]
    return {
        "farms": FARMS,
        "district_summary": summary,
        "clusters": clusters,
        "alerts": [a for a in ALERTS if a["category"] == "community"],
    }
