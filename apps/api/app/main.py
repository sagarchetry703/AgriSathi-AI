"""
AgriSathi AI — FastAPI Backend
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import health, chat, auth, crop, weather, prices


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    print(f"🌾 AgriSathi AI API starting — {settings.APP_ENV} mode")
    yield
    # Shutdown
    print("🌾 AgriSathi AI API shutting down")


app = FastAPI(
    title="AgriSathi AI API",
    description="AI-powered agricultural assistant backend for Indian farmers",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.APP_ENV == "development" else None,
    redoc_url="/redoc" if settings.APP_ENV == "development" else None,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(crop.router, prefix="/api/v1/crops", tags=["Crops"])
app.include_router(weather.router, prefix="/api/v1/weather", tags=["Weather"])
app.include_router(prices.router, prefix="/api/v1/prices", tags=["Prices"])
