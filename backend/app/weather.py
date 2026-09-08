"""Live weather via Open-Meteo (free, no API key required).
https://open-meteo.com/en/docs
"""
import httpx

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# WMO weather codes -> short label (subset covering Open-Meteo's common codes)
_WEATHER_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    66: "Freezing rain", 67: "Heavy freezing rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
}


async def fetch_weather(lat: float, lng: float) -> dict:
    params = {
        "latitude": lat,
        "longitude": lng,
        "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
        "daily": "precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min",
        "hourly": "precipitation,precipitation_probability,temperature_2m",
        "timezone": "auto",
        "forecast_days": 7,
    }
    async with httpx.AsyncClient(timeout=8.0) as client:
        resp = await client.get(OPEN_METEO_URL, params=params)
        resp.raise_for_status()
        data = resp.json()

    current = data["current"]
    hourly = data["hourly"]
    daily = data["daily"]

    # Next 14 hours of rainfall, for the "expected rain in the next N hours" recommendation.
    next_14h_precip = sum(hourly["precipitation"][:14])

    return {
        "source": "open-meteo.com (live)",
        "current": {
            "temp_c": current["temperature_2m"],
            "humidity_pct": current["relative_humidity_2m"],
            "precipitation_mm": current["precipitation"],
            "wind_speed_kmph": current["wind_speed_10m"],
            "condition": _WEATHER_CODES.get(current["weather_code"], "Unknown"),
        },
        "next_14h_rainfall_mm": round(next_14h_precip, 1),
        "hourly": [
            {"time": t, "precipitation_mm": p, "precipitation_probability_pct": pp, "temp_c": tc}
            for t, p, pp, tc in zip(
                hourly["time"][:24], hourly["precipitation"][:24],
                hourly["precipitation_probability"][:24], hourly["temperature_2m"][:24],
            )
        ],
        "daily": [
            {
                "date": d,
                "precipitation_mm": ps,
                "precipitation_probability_pct": pp,
                "temp_max_c": tmax,
                "temp_min_c": tmin,
            }
            for d, ps, pp, tmax, tmin in zip(
                daily["time"], daily["precipitation_sum"], daily["precipitation_probability_max"],
                daily["temperature_2m_max"], daily["temperature_2m_min"],
            )
        ],
    }
