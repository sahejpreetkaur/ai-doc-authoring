from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

# ----------------------------
# JWT CONFIG
# ----------------------------
SECRET_KEY = "supersecret"
ALGORITHM = "HS256"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Simple Bearer token scheme (Swagger will show "Bearer <token>" box)
auth_scheme = HTTPBearer()

# ----------------------------
# PASSWORD UTILITIES
# ----------------------------
def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


# ----------------------------
# JWT CREATION
# ----------------------------
def create_jwt(data: dict, expires_minutes: int = 60):
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    payload["exp"] = expire
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ----------------------------
# JWT DECODE
# ----------------------------
def decode_jwt(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ----------------------------
# GET CURRENT USER FROM TOKEN
# ----------------------------
def get_current_user(credentials: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    Extract user_id from the Bearer token provided in Authorization header.
    Note: using Security(...) instead of Depends(...) ensures OpenAPI/Swagger
    recognizes this as a security requirement and will send the Authorization header.
    """
    # Debug prints (uncomment while debugging, remove or comment in production)
    # print("RAW CREDENTIALS --->", credentials)

    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials  # <-- Extract ONLY the actual token string

    # Debug prints (optional)
    # print("EXTRACTED TOKEN --->", token)

    data = decode_jwt(token)

    # print("DECODED JWT --->", data)

    if "user_id" not in data:
        raise HTTPException(status_code=401, detail="Invalid token")

    return data["user_id"]
