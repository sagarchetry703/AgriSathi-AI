"""
Health check endpoint.
"""
from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/health")
async def health_check():
    """Service health check."""
    return {
        "status": "healthy",
        "service": "agrisathi-api",
        "version": "0.1.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
