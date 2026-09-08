from fastapi import APIRouter, Depends, Query

from ..auth import require_role
from ..mock_data import get_farm, satellite_geojson

router = APIRouter(tags=["satellite"])


@router.get("/satellite-data")
def get_satellite_data(farm_id: str = Query("FARM-001"), user: dict = Depends(require_role("farmer", "admin"))):
    farm = get_farm(farm_id)
    return {
        "farm_id": farm_id,
        "ndvi": farm["ndvi"],
        "ndwi": farm["ndwi"],
        "vegetation_health": round(farm["ndvi"] * 100),
        "water_stress": farm["risk_level"],
        "geojson": satellite_geojson(farm_id),
    }
