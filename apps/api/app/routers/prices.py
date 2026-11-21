"""Market price routes. This module never labels unavailable data as live."""
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
    return {
        "status": "unavailable",
        "source": None,
        "prices": [],
        "filters": {"commodity": commodity, "state": state, "mandi": mandi},
        "message": "A verified live AGMARKNET/eNAM feed is not configured. No market prices are displayed.",
    }


@router.get("/prices")
async def get_prices_alias(
    commodity: Optional[str] = None,
    state: Optional[str] = None,
    mandi: Optional[str] = None,
):
    return await get_live_prices(commodity=commodity, state=state, mandi=mandi)


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
