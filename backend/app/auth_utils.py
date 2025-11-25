from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt  # FIXED import
import os

# config
SECRET_KEY = os.environ.get("SECRET_KEY", "supersecret")
ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

auth_scheme = HTTPBearer()

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)

def create_jwt(data: dict, expires_minutes: int = 60):
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    payload["exp"] = expire
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    if not credentials or not credentials.scheme:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials
    data = decode_jwt(token)

    if "user_id" not in data:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return data["user_id"]   # FIXED (removed comma)
