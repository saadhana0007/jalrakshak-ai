"""JWT authentication + role-based access control."""
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

SECRET_KEY = "jalrakshak-ai-demo-secret-key-do-not-use-in-production"
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60 * 12

bearer_scheme = HTTPBearer(auto_error=False)

ADMIN_EMAIL = "admin@jalrakshak.ai"
ADMIN_PASSWORD = "Admin123"


def create_access_token(subject: str, role: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "role": role, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    return decode_token(credentials.credentials)


def require_role(*roles: str):
    def dependency(user: dict = Depends(get_current_user)) -> dict:
        if user.get("role") not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions for this resource")
        return user
    return dependency
