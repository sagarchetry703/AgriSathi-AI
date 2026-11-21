import base64
import json
from typing import Any

from app.config import settings


def _get_model(model_name: str = "gemini-3.1-flash-lite"):
    if not settings.GEMINI_API_KEY:
        return None
    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.GEMINI_API_KEY)
        return genai.GenerativeModel(model_name)
    except Exception:
        return None


def extract_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start >= 0 and end > start:
            try:
                return json.loads(cleaned[start : end + 1])
            except json.JSONDecodeError:
                pass
    return {"raw_response": text}


async def generate_text(prompt: str) -> str:
    model = _get_model()
    if model is None:
        raise RuntimeError("GEMINI_NOT_CONFIGURED")
    response = await model.generate_content_async(prompt)
    return response.text


async def analyze_image(image_bytes: bytes, mime_type: str, prompt: str) -> dict[str, Any]:
    model = _get_model()
    if model is None:
        raise RuntimeError("GEMINI_NOT_CONFIGURED")
    image_part = {"mime_type": mime_type, "data": base64.b64encode(image_bytes).decode("ascii")}
    response = await model.generate_content_async([prompt, image_part])
    return extract_json(response.text)
