from fastapi import APIRouter, Depends

from ..ai.digital_twin import simulate
from ..auth import require_role
from ..schemas import DigitalTwinRequest

router = APIRouter(tags=["digital-twin"])


@router.post("/digital-twin")
def digital_twin_endpoint(payload: DigitalTwinRequest, user: dict = Depends(require_role("farmer", "admin"))):
    return simulate(
        crop=payload.crop,
        area_acres=payload.area_acres,
        soil_moisture_pct=payload.soil_moisture_pct,
        temperature_c=payload.temperature_c,
        rainfall_forecast_mm=payload.rainfall_forecast_mm,
        groundwater_depth_m=payload.groundwater_depth_m,
    )
