"""Assam flood guidance and official-resource status."""
from fastapi import APIRouter

router = APIRouter()

GUIDANCE = {
    "before": [
        "Keep identity papers, medicines, dry food and essential livestock supplies in a waterproof kit.",
        "Move vulnerable machinery and stored feed to a safe raised area.",
        "Monitor ASDMA and district administration notices and follow evacuation orders.",
    ],
    "during": [
        "Move to a safe raised location; do not walk or drive through moving flood water.",
        "Switch off electrical connections if safe to do so.",
        "Avoid contaminated water and keep animals away from flood currents.",
    ],
    "after": [
        "Wait for official clearance before returning.",
        "Dry and disinfect flood-affected areas; do not consume exposed food or unsafe water.",
        "Document crop damage with photographs and report it through official state/district channels.",
    ],
}


@router.get("/alerts")
async def flood_alerts():
    return {
        "status": "unavailable",
        "source": "Official live feed not connected",
        "alerts": [],
        "message": "Live flood warnings are unavailable here. Check ASDMA and district administration notices.",
    }


@router.get("/guidance")
async def flood_guidance():
    return {
        "guidance": GUIDANCE,
        "official_resources": [
            {"name": "ASDMA", "url": "https://asdma.assam.gov.in/", "scope": "Assam emergency information"},
            {"name": "NDMA", "url": "https://ndma.gov.in/", "scope": "National disaster safety guidance"},
        ],
    }
