"""In-memory profile and history APIs. The frontend persists an export copy locally."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4

router = APIRouter()
profile = {"name": "", "district": "", "preferred_language": "en", "selected_crops": []}
history: dict[str, dict] = {}


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    district: Optional[str] = None
    preferred_language: Optional[str] = None
    selected_crops: Optional[list[str]] = None


class HistoryItem(BaseModel):
    type: str
    title: str
    summary: str
    data: dict = {}


@router.get("/profile")
async def get_profile():
    return profile


@router.put("/profile")
async def update_profile(payload: ProfileUpdate):
    profile.update({key: value for key, value in payload.model_dump(exclude_none=True).items()})
    return profile


@router.get("/history")
async def get_history():
    return {"items": sorted(history.values(), key=lambda item: item["created_at"], reverse=True)}


@router.post("/history")
async def add_history(payload: HistoryItem):
    item_id = str(uuid4())
    item = payload.model_dump()
    item.update({"id": item_id, "created_at": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()})
    history[item_id] = item
    return item


@router.delete("/history/{item_id}")
async def delete_history(item_id: str):
    if item_id not in history:
        raise HTTPException(status_code=404, detail="History item not found.")
    del history[item_id]
    return {"deleted": item_id}
