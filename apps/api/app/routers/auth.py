"""
Authentication routes — OTP-based mobile login.
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import re

router = APIRouter()


class OTPRequest(BaseModel):
    """Request OTP for mobile number."""
    mobile: str = Field(..., pattern=r"^[6-9]\d{9}$", description="10-digit Indian mobile number")


class OTPVerify(BaseModel):
    """Verify OTP and authenticate."""
    mobile: str = Field(..., pattern=r"^[6-9]\d{9}$")
    otp: str = Field(..., min_length=4, max_length=6)


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


@router.post("/otp/request", status_code=status.HTTP_200_OK)
async def request_otp(payload: OTPRequest):
    """
    Send OTP to the given mobile number.
    In development mode, returns a mock OTP.
    """
    # TODO: Integrate MSG91 / actual SMS provider
    return {
        "message": "OTP sent successfully",
        "mobile": payload.mobile,
        "dev_otp": "1234",  # Remove in production!
    }


@router.post("/otp/verify", response_model=TokenResponse)
async def verify_otp(payload: OTPVerify):
    """
    Verify OTP and return JWT tokens.
    """
    # TODO: Verify OTP from Redis/DB
    if payload.otp != "1234":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP",
        )

    # TODO: Generate real JWT tokens
    return TokenResponse(
        access_token="mock-access-token",
        refresh_token="mock-refresh-token",
        expires_in=1800,
    )
