"""
AI Chat routes — Gemini-powered crop advisory chat.
"""
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import json

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
async def send_message(payload: ChatMessage):
    """
    Send a message to the AI crop advisor.
    Returns AI-generated response.

    TODO: Integrate with Gemini 2.0 Flash + LangChain RAG
    """
    # Mock response for initial scaffold
    mock_response = (
        f"🌾 Namaste! I received your message: '{payload.message}'. "
        "I'm AgriSathi AI, your farming companion. "
        "Once the Gemini API is connected, I'll provide personalized crop advice, "
        "disease diagnosis, and agricultural guidance in your language. "
        "Stay tuned!"
    )

    return ChatResponse(
        response=mock_response,
        session_id=payload.session_id or "mock-session-001",
        sources=[],
    )


@router.post("/message/stream")
async def send_message_stream(payload: ChatMessage):
    """
    Send a message and receive a streaming SSE response.

    TODO: Implement with Gemini streaming API
    """
    async def event_generator():
        words = "🌾 Hello! I am AgriSathi AI, your smart farming companion. I will help you with crop advice, disease detection, and market prices.".split()
        for word in words:
            chunk = json.dumps({"token": word + " "})
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
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
