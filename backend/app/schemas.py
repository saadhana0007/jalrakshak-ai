from typing import Optional
from pydantic import BaseModel, Field


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class OtpRequestPayload(BaseModel):
    mobile: str


class OtpVerifyPayload(BaseModel):
    mobile: str
    otp: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_name: str


class WaterDemandRequest(BaseModel):
    crop: str
    area_acres: float = Field(gt=0)
    soil_moisture_pct: float = Field(ge=0, le=100)
    temperature_c: float
    rainfall_forecast_mm: float = Field(ge=0)


class ClimateRiskRequest(BaseModel):
    rainfall_deficit_pct: float = Field(ge=0, le=100)
    temperature_anomaly_c: float
    ndvi: float = Field(ge=-1, le=1)
    ndwi: float = Field(ge=-1, le=1)


class DigitalTwinRequest(BaseModel):
    crop: str
    area_acres: float = Field(gt=0)
    soil_moisture_pct: float = Field(ge=0, le=100)
    temperature_c: float
    rainfall_forecast_mm: float = Field(ge=0)
    groundwater_depth_m: float = Field(ge=0)


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    farm_id: Optional[str] = None
