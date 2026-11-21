"""
Mandi price routes — real-time agricultural market prices.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class PriceAlertRequest(BaseModel):
    """Create a price alert."""
    commodity: str
    mandi: str
    target_price: float
    alert_type: str = "above"  # "above" or "below"


@router.get("/live")
async def get_live_prices(
    commodity: Optional[str] = None,
    state: Optional[str] = None,
    mandi: Optional[str] = None,
):
    """
    Get live mandi prices.

    TODO: Integrate eNAM / Agmarknet API
    """
    return {
        "prices": [
            {
                "commodity": "Wheat (Gehun)",
                "mandi": "Azadpur, Delhi",
                "min_price": 2200,
                "max_price": 2500,
                "modal_price": 2350,
                "unit": "quintal",
                "date": "2026-11-21",
            },
            {
                "commodity": "Rice (Dhaan)",
                "mandi": "Azadpur, Delhi",
                "min_price": 2800,
                "max_price": 3200,
                "modal_price": 3000,
                "unit": "quintal",
                "date": "2026-11-21",
            },
        ],
        "message": "Live mandi price feed coming in Milestone 3.",
    }


@router.get("/history")
async def get_price_history(commodity: str, mandi: str, days: int = 30):
    """
    Get price history for a commodity at a mandi.

    TODO: Build from scraped/cached data
    """
    return {
        "commodity": commodity,
        "mandi": mandi,
        "history": [],
        "message": "Price history coming in Milestone 3.",
    }


@router.post("/alert")
async def create_price_alert(payload: PriceAlertRequest):
    """
    Create a price alert for a commodity.

    TODO: Store in DB, trigger via webhook/push
    """
    return {
        "message": "Price alert created successfully",
        "alert": payload.model_dump(),
        "note": "Alert notifications coming in Milestone 3.",
    }
