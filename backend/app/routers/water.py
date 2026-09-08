from fastapi import APIRouter, Depends

from ..ai.water_demand import predict_water_demand
from ..auth import require_role
from ..schemas import WaterDemandRequest

router = APIRouter(tags=["water"])


@router.post("/predict-water-demand")
def predict_water_demand_endpoint(payload: WaterDemandRequest, user: dict = Depends(require_role("farmer", "admin"))):
    return predict_water_demand(
        crop=payload.crop,
        area_acres=payload.area_acres,
        soil_moisture_pct=payload.soil_moisture_pct,
        temperature_c=payload.temperature_c,
        rainfall_forecast_mm=payload.rainfall_forecast_mm,
    )
