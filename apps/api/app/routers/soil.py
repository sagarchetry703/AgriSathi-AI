"""Soil report upload and field extraction."""
from fastapi import APIRouter, HTTPException, UploadFile, File
from PIL import Image
import io

from app.services.gemini import analyze_image

router = APIRouter()


@router.post("/analyze")
async def analyze_soil_report(file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp", "application/pdf"}:
        raise HTTPException(status_code=415, detail="Upload a JPEG, PNG, WebP or PDF soil report.")
    data = await file.read()
    if not 0 < len(data) <= 12 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Report must be no larger than 12 MB.")
    if file.content_type != "application/pdf":
        try:
            with Image.open(io.BytesIO(data)) as image:
                image.verify()
        except Exception:
            raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")
    prompt = (
        "Extract only values visibly stated in this soil report. "
        "Do not infer or guess missing values. Return strict JSON with keys pH, nitrogen, phosphorus, "
        "potassium, organic_carbon. Each value should contain value and unit where present; "
        "use null for missing values. Include extracted_text_status and verification_required=true."
    )
    if file.content_type == "application/pdf":
        raise HTTPException(status_code=501, detail="PDF extraction requires a configured document parser. Upload a clear report image.")
    try:
        result = await analyze_image(data, file.content_type, prompt)
    except RuntimeError as exc:
        if str(exc) == "GEMINI_NOT_CONFIGURED":
            raise HTTPException(status_code=503, detail="Gemini API is not configured on the server.")
        raise HTTPException(status_code=502, detail="The soil report could not be analyzed.")
    return result
