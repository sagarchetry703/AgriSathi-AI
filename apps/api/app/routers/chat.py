"""
AI Chat routes — Gemini-powered crop advisory chat.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.gemini import generate_text

router = APIRouter()


class ChatMessage(BaseModel):
    """Incoming chat message."""
    message: str
    session_id: Optional[str] = None
    language: str = "en"


class ChatResponse(BaseModel):
    """Chat response from AI."""
    response: str
    session_id: str
    sources: list = []


@router.post("/message", response_model=ChatResponse)
@router.post("/chat", response_model=ChatResponse)
async def send_message(payload: ChatMessage):
    language_names = {"en": "English", "as": "Assamese", "hi": "Hindi", "bn": "Bengali"}
    language = language_names.get(payload.language, "English")
    prompt = (
        "You are AgriSathi AI, an agricultural adviser for Assam and Northeast India. "
        f"Answer only in {language}. Use simple farmer-friendly language. "
        "Do not invent statistics or guarantee outcomes. "
        "Include a brief warning to consult a local KVK or agricultural officer for severe issues.\n\n"
        f"Farmer question: {payload.message}"
    )
    try:
        response = await generate_text(prompt)
    except RuntimeError as exc:
        if str(exc) == "GEMINI_NOT_CONFIGURED":
            raise HTTPException(status_code=503, detail="Gemini API is not configured on the server.")
        raise HTTPException(status_code=502, detail="The AI provider could not process the request.")
    return ChatResponse(
        response=response,
        session_id=payload.session_id or "session-local",
        sources=[],
    )


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """
    Get chat history for a session.

    TODO: Fetch from database
    """
    return {
        "session_id": session_id,
        "messages": [],
        "message": "Chat history will be available after database integration.",
    }
