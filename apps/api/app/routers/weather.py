"""Open-Meteo weather routes."""
from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter()

DISTRICTS = {
    "Guwahati": {"lat": 26.1445, "lon": 91.7362},
    "Kamrup": {"lat": 26.1825, "lon": 91.7458},
    "Jorhat": {"lat": 26.7509, "lon": 94.2037},
    "Dibrugarh": {"lat": 27.4728, "lon": 94.9120},
    "Silchar": {"lat": 24.8333, "lon": 92.7789},
    "Tezpur": {"lat": 26.6338, "lon": 92.8000},
    "Nagaon": {"lat": 26.3500, "lon": 92.6920},
    "Barpeta": {"lat": 26.3223, "lon": 91.0064},
    "Sivasagar": {"lat": 26.9844, "lon": 94.6411},
    "Tinsukia": {"lat": 27.4917, "lon": 95.3599},
}


@router.get("/districts")
async def districts():
    return {"timezone": "Asia/Kolkata", "districts": [
        {"name": name, "latitude": coords["lat"], "longitude": coords["lon"]}
        for name, coords in DISTRICTS.items()
    ]}


@router.get("/district/{district}")
async def district_weather(district: str):
    coords = DISTRICTS.get(district)
    if not coords:
        raise HTTPException(status_code=404, detail="District not found.")
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": coords["lat"], "longitude": coords["lon"], "timezone": "Asia/Kolkata",
        "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
        "hourly": "temperature_2m,precipitation_probability,precipitation,relative_humidity_2m",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
        "forecast_days": 7,
    }
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Open-Meteo weather data is currently unavailable.")
    current = data.get("current", {})
    hourly = data.get("hourly", {})
    rain_probability = (hourly.get("precipitation_probability") or [0])[0]
    advisory = "Good conditions to inspect fields, with normal monsoon-season caution."
    if rain_probability >= 70:
        advisory = "High rain probability. Delay spraying and protect harvested produce."
    elif (current.get("wind_speed_10m") or 0) >= 30:
        advisory = "Strong wind forecast. Avoid tall-crop spraying and secure stored materials."
    return {"district": district, "coordinates": coords, "timezone": "Asia/Kolkata",
            "current": current, "hourly": hourly, "daily": data.get("daily", {}),
            "rain_probability": rain_probability, "farming_advisory": advisory,
            "source": "Open-Meteo", "status": "live"}


@router.get("/current")
async def get_current_weather(lat: float, lon: float):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {"latitude": lat, "longitude": lon, "timezone": "Asia/Kolkata",
              "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m"}
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Live weather data is unavailable.")
    return {"location": {"lat": lat, "lon": lon}, "weather": data["current"],
            "source": "Open-Meteo", "status": "live"}
