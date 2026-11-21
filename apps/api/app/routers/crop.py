"""Crop recommendations and image diagnosis routes."""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
from PIL import Image
import io

from app.services.gemini import analyze_image

router = APIRouter()


class CropRecommendRequest(BaseModel):
    district: str
    soil_type: str
    season: str
    irrigation: str
    land_area: Optional[float] = None


@router.post("/recommend")
async def recommend_crops(payload: CropRecommendRequest):
    season = payload.season.lower()
    rainy = season in {"kharif", "monsoon", "summer"}
    crops = []
    if rainy:
        crops = [
            {"crop": "Rice", "suitability": "High", "reason": "Widely suited to Assam's monsoon rainfall and paddy-growing plains."},
            {"crop": "Maize", "suitability": "Medium", "reason": "Suitable where drainage is reliable and waterlogging can be avoided."},
            {"crop": "Jute", "suitability": "Medium", "reason": "Can suit alluvial soils and humid Kharif conditions."},
        ]
    else:
        crops = [
            {"crop": "Mustard", "suitability": "High", "reason": "A common Rabi oilseed crop in Assam and Northeast India."},
            {"crop": "Potato", "suitability": "Medium", "reason": "Suitable in cooler Rabi conditions with irrigation and disease monitoring."},
            {"crop": "Tomato", "suitability": "Medium", "reason": "Possible under managed irrigation and protection from extreme weather."},
        ]
    if payload.irrigation.lower() in {"none", "rainfed"}:
        for item in crops:
            item["reason"] += " Rainfed management is especially important."
    return {"district": payload.district, "soil_type": payload.soil_type, "season": payload.season,
            "recommendations": crops, "source": "documented regional crop suitability rules"}


@router.get("/recommend")
async def recommend_crops_compat(state: str = "Assam", district: str = "", season: str = "kharif"):
    return await recommend_crops(CropRecommendRequest(
        district=district or "Guwahati", soil_type="Alluvial", season=season, irrigation="Rainfed"
    ))


@router.post("/analyze")
@router.post("/vision")
async def analyze_crop_image(
    file: UploadFile = File(...),
    crop: str = Form("Unknown"),
):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Upload a JPEG, PNG or WebP image.")
    bytes_data = await file.read()
    if not 0 < len(bytes_data) <= 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be between 1 byte and 10 MB.")
    try:
        with Image.open(io.BytesIO(bytes_data)) as image:
            image.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")

    prompt = (
        "You are an agricultural image-review assistant. Inspect this photograph of a crop. "
        "Do not claim a laboratory diagnosis or guaranteed accuracy. "
        "If the photo is unclear or does not show an identifiable crop, say so. "
        f"The farmer selected crop: {crop}. "
        "Return strict JSON with keys: crop_identified, condition, possible_diseases "
        "(array), symptom_explanation, alternatives (array), risk, safe_recommendations "
        "(array), preventive_guidance (array), confidence (low/medium/high), and disclaimer."
    )
    try:
        result = await analyze_image(bytes_data, file.content_type, prompt)
    except RuntimeError as exc:
        if str(exc) == "GEMINI_NOT_CONFIGURED":
            raise HTTPException(status_code=503, detail="Gemini API is not configured on the server.")
        raise HTTPException(status_code=502, detail="The image could not be analyzed.")
    result["data_source"] = "Gemini analysis"
    return result
