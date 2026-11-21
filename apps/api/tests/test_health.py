"""
Tests for health endpoint.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test health endpoint returns OK."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "agrisathi-api"
    assert "version" in data
    assert "timestamp" in data


def test_otp_request():
    """Test OTP request with valid mobile."""
    response = client.post(
        "/api/v1/auth/otp/request",
        json={"mobile": "9876543210"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "OTP sent successfully"


def test_otp_request_invalid_mobile():
    """Test OTP request with invalid mobile number."""
    response = client.post(
        "/api/v1/auth/otp/request",
        json={"mobile": "1234567890"},
    )
    assert response.status_code == 422  # Validation error


def test_chat_message():
    """Test chat endpoint with mock response."""
    response = client.post(
        "/api/v1/chat/message",
        json={"message": "What crop should I plant in Kharif?"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "session_id" in data
