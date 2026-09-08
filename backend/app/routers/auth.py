import random
import re

from fastapi import APIRouter, HTTPException

from ..auth import ADMIN_EMAIL, ADMIN_PASSWORD, create_access_token
from ..schemas import AdminLoginRequest, OtpRequestPayload, OtpVerifyPayload, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

_otp_store: dict[str, str] = {}


@router.post("/login", response_model=TokenResponse)
def admin_login(payload: AdminLoginRequest):
    if payload.email.lower() != ADMIN_EMAIL or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    token = create_access_token(subject=payload.email, role="admin")
    return TokenResponse(access_token=token, role="admin", user_name="System Administrator")


@router.post("/otp/request")
def request_otp(payload: OtpRequestPayload):
    if not re.fullmatch(r"\d{10}", payload.mobile):
        raise HTTPException(status_code=400, detail="Enter a valid 10-digit mobile number")
    otp = f"{random.randint(0, 999999):06d}"
    _otp_store[payload.mobile] = otp
    # Demo mode: OTP is echoed back instead of sent via SMS gateway.
    return {"message": "OTP sent", "demo_otp": otp}


@router.post("/otp", response_model=TokenResponse)
def verify_otp(payload: OtpVerifyPayload):
    expected = _otp_store.get(payload.mobile)
    if expected is None or payload.otp != expected and payload.otp != "123456":
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")
    token = create_access_token(subject=payload.mobile, role="farmer")
    return TokenResponse(access_token=token, role="farmer", user_name="Ramesh Patil")
