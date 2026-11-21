"""
Crop advisory routes — recommendations, calendar, and diagnosis.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class CropRecommendRequest(BaseModel):
    """Request crop recommendation."""
    state: str
    district: str
    season: str  # kharif, rabi, zaid
    soil_type: Optional[str] = None
    irrigation: bool = True


@router.get("/recommend")
async def recommend_crops(state: str, district: str, season: str):
    """
    Get crop recommendations based on location and season.

    TODO: Integrate with Gemini + ICAR data
    """
    return {
        "state": state,
        "district": district,
        "season": season,
        "recommendations": [
            {
                "crop": "Rice (Dhaan)",
                "suitability": "High",
                "expected_yield": "45-50 quintal/hectare",
                "advice": "Ensure proper water management. Use SRI method for better yield.",
            },
            {
                "crop": "Maize (Makka)",
                "suitability": "Medium",
                "expected_yield": "30-35 quintal/hectare",
                "advice": "Good for intercropping. Requires well-drained soil.",
            },
        ],
        "message": "Full AI-powered recommendations coming in Milestone 2.",
    }


@router.get("/calendar")
async def crop_calendar(crop: str, state: str):
    """
    Get crop calendar with sowing, irrigation, and harvest windows.

    TODO: Build from ICAR + regional agricultural data
    """
    return {
        "crop": crop,
        "state": state,
        "calendar": {
            "sowing_window": "June 15 - July 15",
            "transplanting": "July 1 - July 30",
            "first_irrigation": "After transplanting",
            "fertilizer_schedule": [
                {"stage": "Basal", "timing": "At transplanting", "npk": "60:30:30"},
                {"stage": "Top dressing 1", "timing": "21 DAT", "npk": "30:0:0"},
                {"stage": "Top dressing 2", "timing": "42 DAT", "npk": "30:0:0"},
            ],
            "harvest_window": "October 15 - November 15",
        },
        "message": "Detailed crop calendar coming in Milestone 2.",
    }
