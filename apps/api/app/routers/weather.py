"""
Weather routes — hyper-local forecasts for farmers.
"""
from fastapi import APIRouter
from typing import Optional

router = APIRouter()


@router.get("/current")
async def get_current_weather(lat: float, lon: float):
    """
    Get current weather for a location.

    TODO: Integrate OpenWeatherMap / IMD API
    """
    return {
        "location": {"lat": lat, "lon": lon},
        "weather": {
            "temperature": 32,
            "humidity": 65,
            "description": "Partly cloudy",
            "wind_speed": 12,
            "rain_probability": 30,
        },
        "farming_advisory": "Good conditions for field work. No rain expected in next 6 hours.",
        "message": "Live weather data coming in Milestone 3.",
    }


@router.get("/forecast")
async def get_forecast(lat: float, lon: float, days: int = 7):
    """
    Get multi-day weather forecast.

    TODO: Integrate OpenWeatherMap 7-day forecast
    """
    return {
        "location": {"lat": lat, "lon": lon},
        "forecast_days": days,
        "forecast": [],
        "message": "Weather forecast integration coming in Milestone 3.",
    }
