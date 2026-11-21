"""
AgriSathi AI — Application Configuration
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    APP_ENV: str = "development"
    APP_NAME: str = "AgriSathi AI"
    APP_VERSION: str = "0.1.0"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://agrisathi:agrisathi_dev@localhost:5432/agrisathi_db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Google Gemini AI
    GEMINI_API_KEY: str = ""

    # OpenWeatherMap
    OPENWEATHER_API_KEY: str = ""

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # MSG91 SMS
    MSG91_API_KEY: str = ""
    MSG91_SENDER_ID: str = "AGRSAI"
    MSG91_TEMPLATE_ID: str = ""

    # Auth
    JWT_SECRET_KEY: str = "dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    model_config = {
        "env_file": "../../.env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


settings = Settings()
