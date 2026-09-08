from fastapi import APIRouter, Depends

from ..ai.climate_risk import predict_climate_risk
from ..ai.water_stress import detect_water_stress
from ..auth import require_role
from ..schemas import ClimateRiskRequest

router = APIRouter(tags=["climate"])


@router.post("/predict-climate-risk")
def predict_climate_risk_endpoint(payload: ClimateRiskRequest, user: dict = Depends(require_role("farmer", "admin"))):
    risk = predict_climate_risk(
        rainfall_deficit_pct=payload.rainfall_deficit_pct,
        temperature_anomaly_c=payload.temperature_anomaly_c,
        ndvi=payload.ndvi,
        ndwi=payload.ndwi,
    )
    stress = detect_water_stress(ndvi=payload.ndvi, ndwi=payload.ndwi, soil_moisture_pct=50)
    return {**risk, "water_stress_detector": stress}
