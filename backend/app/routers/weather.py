from fastapi import APIRouter, HTTPException, Query

from ..mock_data import get_farm
from ..weather import fetch_weather

router = APIRouter(tags=["weather"])


@router.get("/weather")
async def get_weather(
    lat: float | None = Query(None),
    lng: float | None = Query(None),
    farm_id: str | None = Query(None),
):
    if farm_id:
        farm = get_farm(farm_id)
        lat, lng = farm["lat"], farm["lng"]
    if lat is None or lng is None:
        raise HTTPException(status_code=400, detail="Provide either farm_id or lat & lng")
    try:
        return await fetch_weather(lat, lng)
    except Exception as exc:  # network/upstream failure — surface as 502 so the frontend falls back cleanly
        raise HTTPException(status_code=502, detail=f"Weather provider unavailable: {exc}")
